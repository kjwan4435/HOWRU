let userDB = require("../models/user.model");
let responseDB  = require("../models/response.model");
let dailyDB  = require("../models/daily.model");
let phq9DB  = require("../models/phq9.model");
let gad7DB  = require("../models/gad7.model");
let isiDB  = require("../models/isi-k.model");
let rsesDB  = require("../models/rses.model");
let ptsdDB  = require("../models/ptsd.model");

// let answer = require("../models/answer.model");

// TODO:
// 웰컴블록에서 phq9로 바로 가는경우 구현
// 사용자별 트랜드 그래프
// 사용자별 phq9 그래프, or 그려놓고 값에 따라 불러올까?
// Daily push, Daily push할때 진행중이던 블록이 있으면 (특히 daily나 phq9, gad7, isi-k등의 테스트일때 그 블락 무효화 -> db에 저장중이던거 제거?)
// demo 어떻게 보여줄지 생각?
// {problems} 자연스럽게 바꾸기


const db = require("../db");

// 이 시스템에서 어려운 점:
// 1. 답변마다 다른 블록으로 이동이 가능
// 2. 답변을 다음 블록에서 알 수 있음
// 3. 또한 SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST 블록들에서는 데이터 저장이 수반
// 4. SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST 등에서 사용자가 끝까지 답변을 하지 않은채 다음날이 됐다면 난감
//
// 해결방법:
// 1. User 데이터베이스에 lastBlock, lastBlockItem, nextBlock, nextBlockItem 필드를 설정
// 2. 각 유저의 현재 상황에 맞춰 이 값들을 update
// 3. 데이터 저장은 lastBlock, lastBlockItem를 확인하여 진행 (lastBlock이 SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST 중 하나일 때)
// 4. nextBlock은 답변 데이터를 통해 설정
// 5. nextBlockItem은 nextBlock이 SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST중 하나일 때 각 데이터베이스에서 비어있는 필드를 확인하여 그 아이템으로 설정
// 6. 혹은 nextBlock이 테스트 feedback일 때, user 정보나, 테스트 결과 (최신 테스트 정보를 받아)를 통해 설정
//
// 로직:
// 상세1: 웰컴블록 이후 getResponse함수로 들어오게 됨, 유저 존재하는지 검색
// 상세2: 먼저 아이디를 검색해보고 없으면 새로 생성. 새로 생성시 nextBlock을 SET_START로 설정
// 상세3: 들어온 답변 데이터에 다음 블록 관련 데이터가 있다면, 유저정보의 nextBlock을 그 정보로 업데이트
// 상세4: 만일 lastBlock이 SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST중 하나라면 각각의 데이터베이스에 저장.
// 상세4-0: 이때 어려운점 -> 각 데이터베이스가 하루에 한번만 생성되어야 하고, 각 답변마다 이 데이터베이스가 업데이트 되어야 한다. 만약 답변이 끝나지 않은 상태에서 다음날이 되면 난감하다. -> 이를 해결하기 위해 각 데이터베이스들에는 completed 필드가 존재.
// 상세4-1: completed 필드는 각 도큐먼트 생성시 false로 설정되고, 도큐먼트의 모든 항목이 찼을 때 true로 업데이트됨.
// 상세4-2: 매일 daily루틴이 push됐을 때 completed 필드가 false인 모든 데이터를 제거.
// 상세4-3: 따라서 가장 최신 도큐먼트를 가져왔을 때, completed 필드가 true면 아직 그날의 새 도큐먼트가 생성되지 않은 것이고, false면 이 도큐먼트를 업데이트하면 됨
// 상세4-4: 어차피 daily루틴은 하루에 한 번만 들어올 수 있으므로 그날 도큐먼트가 완료되면, 그 날의 도큐먼드가 추가로 생성되지 않음.
// 상세5: 데일리 루틴이 끝나면 대기 블록으로 이동. 이 대기블록상태일때는 잡담만 진행? 감정일기쓰기?
// 상세6: 만일 nextBlock이 SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST/Feedback 중 하나라면 nextBlockItem을 각 데이터베이스를 확인하여 설정해줌. (아직 설정되어 있지 않은 아이템으로 update)
// 상세7: 유저의 lastBlock, lastBlockItem, nextBlock, nextBlockItem에 맞춰 responseDB에서 응답 내용 뽑고, 사용자에게 전달, 이때 사용자별로 다른 응답 가능 (emotionStatus, age, region, sex 등의 사용자 정보 활용)

function getResponse(body) {
  return new Promise(function (resolve, reject) {

    const block = body.action.clientExtra.nextBlock;
    const id = body.userRequest.user.id;
    const answer = body.userRequest.utterance;
    let responseReplaceDict = {};

    (async function() {
        // 상세1: 웰컴블록 이후 getResponse함수로 들어오게 됨, 먼저 유저 존재하는지 검색
        let userObj = await userDB.findOne({id: id});

        // 상세2: 먼저 아이디를 검색해보고 없으면 새로 생성. 새로 생성시 nextBlock을 SET_START로 설정
        if(userObj === null){
          //Add user
          try{
            const user = new userDB({ id: id, lastUseDate: Date.now(), nextBlock: "SET_START"});
            userObj = await user.save();
            console.log("New User: " + id)
          }
          // When we fail to generate the user
          catch(err){
            console.log("User generation fail: "+err);
          }
        }

        // Make sure userObj is not null -> TODO: check whether this is needed or not
        if(userObj === null){
          responseBody = {
            version: "2.0",
            template: {
              outputs: [{ simpleText: { text: ("유저를 찾을 수 없습니다."+err) }}]
            }
          };
          resolve(responseBody);
        }

        // 상세3: 들어온 답변 데이터에 다음 블록 관련 데이터가 있다면, 유저정보의 nextBlock을 그 정보로 업데이트
        // 각 답변이 다른 nextBlock을 가질 수 있음. (e.g., 응 / 답변안할래 -> phq9 block / solution block)
        // 따라서 답변(body.action)의 extra에 nextBlock이 포함되어 있다면 유저정보에 포함된 nextBlock을 업데이트.
        if( block !== undefined && block !== null) {
          userObj.nextBlock = block;
        }

        if( block === "-" ){
          userObj.lastBlock = "-";
          userObj.lastBlockItem = "-";
          userObj.nextBlock = "SET";
          userObj.nextBlockItem = "-";
        }
        if(userObj.nextBlock === "SET_START"){
          userObj.lastBlock = "-";
          userObj.lastBlockItem = "-";
          userObj.nextBlock = "SET_START";
          userObj.nextBlockItem = "-";
        }
        else if( answer === "감정 모니터링 다시 시작" ){
          userObj.lastBlock = "-";
          userObj.lastBlockItem = "-";
          userObj.nextBlock = "WEEKLY_DOCTOR_MEET";
          userObj.nextBlockItem = "-";
        }

        // 상세4: 만일 lastBlock이 SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST중 하나라면 각각의 데이터베이스에 저장.
        if(userObj.nextBlock==="SET_START") {
          userObj.sex = "-";
          userObj.region = "-";
          userObj.age = "-";
        }
        else if(userObj.lastBlock==="SET") {
          if(userObj.lastBlockItem==="SEX"){ userObj.sex = answer; }
          else if(userObj.lastBlockItem==="REGION"){ userObj.region = answer; }
          else if(userObj.lastBlockItem==="AGE"){ userObj.age = answer; }
        }
        else if(userObj.lastBlock==="DAILY_START"){
          let rateVal = 1;
          if(answer==="우울해") { rateVal = -1; }
          else if(answer==="평범해") { rateVal = 0; }

          const daily = new dailyDB({ id: id, rate:rateVal});
          dailyObj = await daily.save();

          //update user's emotionStatus
          let dailyObjList = await dailyDB.find({id: id}, {}, { sort: { 'createdAt' : -1 } }).limit(7);
          let emotionStatusTmp = 0;
          for(let i = 0; i<dailyObjList.length; i++){ emotionStatusTmp += parseInt(dailyObjList[i].rate);}
          userObj.emotionStatus = emotionStatusTmp;

        }
        else if(userObj.lastBlock==="DAILY_DETAIL"){
          let dailyObj = await dailyDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 }});
          if(userObj.lastBlockItem==="SLEEP")  { dailyObj.sleep = answer; }
          else if(userObj.lastBlockItem==="EAT") { dailyObj.eat = answer; }
          else if(userObj.lastBlockItem==="MOOD") { dailyObj.mood = answer; }
          else if(userObj.lastBlockItem==="SOCIAL") { dailyObj.social = answer; }
          else if(userObj.lastBlockItem==="ACTIVITY") { dailyObj.activity = answer; }
          await dailyObj.save();
        }
        else if(userObj.lastBlock==="DAILY_END"){
          let dailyObj = await dailyDB.find({id: id, phq9Tested: false, completed: true});

          if(dailyObj.length > 6){
            userObj.nextBlock = "WEEKLY_START";
            userObj.nextBlockItem = "-";
          }
        }
        else if(userObj.lastBlock==="PHQ9_START"){
          const phq9 = new phq9DB({ id: id });
          phq9Obj = await phq9.save();
        }
        else if(userObj.lastBlock==="PHQ9"){
          let phq9Obj = await phq9DB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 }});
          if(userObj.lastBlockItem==="PHQ9_0")  { phq9Obj.phq9_0 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_1") { phq9Obj.phq9_1 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_2") { phq9Obj.phq9_2 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_3") { phq9Obj.phq9_3 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_4") { phq9Obj.phq9_4 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_5") { phq9Obj.phq9_5 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_6") { phq9Obj.phq9_6 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_7") { phq9Obj.phq9_7 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_8") { phq9Obj.phq9_8 = answer; }
          else if(userObj.lastBlockItem==="PHQ9_9") { phq9Obj.phq9_9 = answer; }
          await phq9Obj.save();
        }
        else if(userObj.lastBlock==="GAD7_START"){
          const gad7 = new gad7DB({ id: id });
          gad7Obj = await gad7.save();
        }
        else if(userObj.lastBlock==="GAD7"){
          let gad7Obj = await gad7DB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 }});
          if(userObj.lastBlockItem==="GAD7_0")  { gad7Obj.gad7_0 = answer; }
          else if(userObj.lastBlockItem==="GAD7_1") { gad7Obj.gad7_1 = answer; }
          else if(userObj.lastBlockItem==="GAD7_2") { gad7Obj.gad7_2 = answer; }
          else if(userObj.lastBlockItem==="GAD7_3") { gad7Obj.gad7_3 = answer; }
          else if(userObj.lastBlockItem==="GAD7_4") { gad7Obj.gad7_4 = answer; }
          else if(userObj.lastBlockItem==="GAD7_5") { gad7Obj.gad7_5 = answer; }
          else if(userObj.lastBlockItem==="GAD7_6") { gad7Obj.gad7_6 = answer; }
          await gad7Obj.save();
        }
        else if(userObj.lastBlock==="ISI-K_START"){
          const isi = new isiDB({ id: id });
          isiObj = await isi.save();
        }
        else if(userObj.lastBlock==="ISI-K"){
          let isiObj = await isiDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 }});
          if(userObj.lastBlockItem==="ISIK_0")  { isiObj.isi_0 = answer; }
          else if(userObj.lastBlockItem==="ISIK_1") { isiObj.isi_1 = answer; }
          else if(userObj.lastBlockItem==="ISIK_2") { isiObj.isi_2 = answer; }
          else if(userObj.lastBlockItem==="ISIK_3") { isiObj.isi_3 = answer; }
          else if(userObj.lastBlockItem==="ISIK_4") { isiObj.isi_4 = answer; }
          else if(userObj.lastBlockItem==="ISIK_5") { isiObj.isi_5 = answer; }
          else if(userObj.lastBlockItem==="ISIK_6") { isiObj.isi_6 = answer; }
          await isiObj.save();
        }

        else if(userObj.lastBlock==="RSES_START"){
          const rses = new rsesDB({ id: id });
          rsesObj = await rses.save();
        }
        else if(userObj.lastBlock==="RSES"){
          let rsesObj = await rsesDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 }});
          if(userObj.lastBlockItem==="RSES_0")  { rsesObj.rses_0 = answer; }
          else if(userObj.lastBlockItem==="RSES_1") { rsesObj.rses_1 = answer; }
          else if(userObj.lastBlockItem==="RSES_2") { rsesObj.rses_2 = answer; }
          else if(userObj.lastBlockItem==="RSES_3") { rsesObj.rses_3 = answer; }
          else if(userObj.lastBlockItem==="RSES_4") { rsesObj.rses_4 = answer; }
          else if(userObj.lastBlockItem==="RSES_5") { rsesObj.rses_5 = answer; }
          else if(userObj.lastBlockItem==="RSES_6") { rsesObj.rses_6 = answer; }
          else if(userObj.lastBlockItem==="RSES_7") { rsesObj.rses_7 = answer; }
          else if(userObj.lastBlockItem==="RSES_8") { rsesObj.rses_8 = answer; }
          else if(userObj.lastBlockItem==="RSES_9") { rsesObj.rses_9 = answer; }
          await rsesObj.save();
        }
        else if(userObj.lastBlock==="PTSD_START"){
          const ptsd = new ptsdDB({ id: id });
          ptsdObj = await ptsd.save();
        }
        else if(userObj.lastBlock==="PTSD"){
          let ptsdObj = await ptsdDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 }});
          if(userObj.lastBlockItem==="PTSD_0")  { ptsdObj.ptsd_0 = answer; }
          else if(userObj.lastBlockItem==="PTSD_1") { ptsdObj.ptsd_1 = answer; }
          else if(userObj.lastBlockItem==="PTSD_2") { ptsdObj.ptsd_2 = answer; }
          else if(userObj.lastBlockItem==="PTSD_3") { ptsdObj.ptsd_3 = answer; }
          else if(userObj.lastBlockItem==="PTSD_4") { ptsdObj.ptsd_4 = answer; }
          await ptsdObj.save();
        }





        // 상세6: 만일 nextBlock이 SET/DAILY/DAILY_DETAIL/PHQ9/INDEPTH_TEST 중 하나라면 nextBlockItem을 각 데이터베이스를 확인하여 설정해줌. (아직 설정되어 있지 않은 아이템으로 update)
        if(userObj.nextBlock==="SET") {
          if(userObj.sex !== "-" && userObj.region !== "-" && userObj.age !== "-"){
            userObj.nextBlock = "DAILY_START";
            userObj.nextBlockItem = "-";
          }
          else if(userObj.sex === "-"){ userObj.nextBlockItem = "SEX"; }
          else if(userObj.region === "-"){ userObj.nextBlockItem = "REGION"; }
          else if(userObj.age === "-"){ userObj.nextBlockItem = "AGE"; }
        }
        else if(userObj.nextBlock==="SET_END"){
          //주인님의 성별은 ${SEX}이고 사는 지역은 ${REGION}이며, 나이는 ${AGE}이군요!
          responseReplaceDict['{SEX}'] = userObj.sex;
          responseReplaceDict['{REGION}'] = userObj.region;
          responseReplaceDict['{AGE}'] = userObj.age;
          userObj.nextBlockItem = "-";
        }
        else if(userObj.nextBlock==="DAILY_DETAIL"){
          // get most recent one
          let dailyObj = await dailyDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 } });
          // 데이터가 없으면 문제임..

          // 가장 최신데이터가 없거나, 가장 최신데이터의 completed가 true이면 새 데이터를 생성.
          // 매 daily push시 completed가 false인 데이터는 삭제, 따라서 이 단계에서 completed가 false라는 말은 사용자가 그날의 답변을 아직 끝마지치 않았다는 뜻.
          if(dailyObj === undefined | dailyObj === null | dailyObj.completed === true){
            //error case. why no data?
            userObj.lastBlock = "-";
            userObj.lastBlockItem = "-";
            userObj.nextBlock = "DAILY_START";
            userObj.nextBlockItem = "-";
            // const daily = new dailyDB({ id: id });
            // dailyObj = await daily.save();
          }

          if(dailyObj.sleep !== "-" && dailyObj.eat !== "-" && dailyObj.mood !== "-" && dailyObj.social !== "-" && dailyObj.activity !== "-") {
            userObj.nextBlock = "DAILY_DETAIL_END";
            userObj.nextBlockItem = "-";
            dailyObj.completed = true;
            dailyObj.graphReady = true;
          }
          else if(dailyObj.sleep === "-") { userObj.nextBlockItem = "SLEEP"; }
          else if(dailyObj.eat === "-") { userObj.nextBlockItem = "EAT"; }
          else if(dailyObj.mood === "-") { userObj.nextBlockItem = "MOOD"; }
          else if(dailyObj.social === "-") { userObj.nextBlockItem = "SOCIAL"; }
          else if(dailyObj.activity === "-") { userObj.nextBlockItem = "ACTIVITY"; }

          await dailyObj.save();
        }
        else if(userObj.nextBlock==="DAILY_ANS_GOOD" | userObj.nextBlock==="DAILY_NO_DETAIL"){
          await dailyDB.findOneAndUpdate({id: id}, {completed: true}, { sort: { 'createdAt' : -1 }});
        }
        else if(userObj.nextBlock==="DAILY_GARDEN"){
          if(userObj.emotionStatus < -4){ userObj.nextBlockItem = "0"; }
          else if(userObj.emotionStatus < -2){ userObj.nextBlockItem = "1"; }
          else if(userObj.emotionStatus < -0){ userObj.nextBlockItem = "2"; }
          else if(userObj.emotionStatus < 2){ userObj.nextBlockItem = "3"; }
          else if(userObj.emotionStatus < 4){ userObj.nextBlockItem = "4"; }
          else if(userObj.emotionStatus < 6){ userObj.nextBlockItem = "5"; }
          else { userObj.nextBlockItem = "6"; }
        }
        else if(userObj.nextBlock==="WEEKLY_CHECK"){
          if(userObj.emotionStatus < -2){
            userObj.nextBlock = "WEEKLY_NOT_FINE";
            userObj.nextBlockItem = "0";
          }
          else if(userObj.emotionStatus < 1){
            userObj.nextBlock = "WEEKLY_NOT_FINE";
            userObj.nextBlockItem = "1";
          }
          else{
            userObj.nextBlock = "WEEKLY_FINE";
          }
        }
        else if(userObj.nextBlock==="WEEKLY_DOCTOR_ANALYSIS"){
          if(userObj.emotionStatus > -2){ userObj.nextBlockItem = "0"; }
          else if(userObj.emotionStatus > -4){ userObj.nextBlockItem = "1"; }
          else if(userObj.emotionStatus > -6){ userObj.nextBlockItem = "2"; }
          else if(userObj.emotionStatus > -8){ userObj.nextBlockItem = "3"; }

          let dailyObj = await dailyDB.find({id: id, phq9Tested: false, completed: true});

          // userObj.nextBlock = "WEEKLY_START";
          // userObj.nextBlockItem = "-";

          for(let i = 0; i<dailyObj.length; i++){
            // dailyObj[i].phq9Tested = true; //TODO
            // await dailyObj[i].save();
          }

          let problems = [];
          let problemVal = [0,0,0,0,0];
          const problemName = ["수면","식사","기분","사회활동","신체움직임"];
          let dailyObjGraphReady = await dailyDB.find({id: id, phq9Tested: false, completed: true, graphReady: true});
          if(dailyObjGraphReady.length != 0){
            for(let i = 0; i<dailyObjGraphReady.length; i++){
              problemVal[0] += parseInt(dailyObjGraphReady[i].sleep);
              problemVal[1] += parseInt(dailyObjGraphReady[i].eat);
              problemVal[2] += parseInt(dailyObjGraphReady[i].mood);
              problemVal[3] += parseInt(dailyObjGraphReady[i].social);
              problemVal[4] += parseInt(dailyObjGraphReady[i].activity);
            }
            for(let i = 0; i<5; i++){
              problemVal[i] /= dailyObjGraphReady.length;
              problemVal[i] = problemVal[i].toFixed(1); //Round to at most 1 decimal place
              if(problemVal[i] < 2.5){
                problems.push(problemName[i]);
              }
            }
            if(problems.length === 0){
              let sorted = problemVal.slice().sort(function(a,b){return b-a})
              let ranks = problemVal.map(function(v){ return sorted.indexOf(v)+1 });
              let pushCnt = 0;
              //rank starts from 1
              for(let i = 0; i<5; i++){
                if(ranks.indexOf(5-i) !== -1){
                  problems.push(problemName[ranks.indexOf(5-i)]);
                  pushCnt++;
                  if(pushCnt > 1) { break; }
                }
              }
            }

            responseReplaceDict['{problems}'] = "";
            //TODO: 자연스럽게 말하기, ~~와 ~~, 그리고 ~~이 문제군요~
            for(let i = 0; i<problems.length; i++){
              responseReplaceDict['{problems}'] += problems[i];
              if(i < problems.length-1){
                responseReplaceDict['{problems}'] += ",";
              }
            }
          }
          else{
            responseReplaceDict['{problems}'] = "noGraph";
          }
          //TODO: make image, replace image name


        }
        else if(userObj.nextBlock==="PHQ9"){
          let phq9Obj = await phq9DB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 } });

          // 가장 최신데이터가 없거나, 가장 최신데이터의 completed가 true이면 새 데이터를 생성.
          // 매 daily push시 completed가 false인 데이터는 삭제, 따라서 이 단계에서 completed가 false라는 말은 사용자가 그날의 답변을 아직 끝마지치 않았다는 뜻.
          if(phq9Obj === undefined | phq9Obj === null | phq9Obj.completed === true){
            const phq9 = new phq9DB({ id: id });
            phq9Obj = await phq9.save();
          }

          if(phq9Obj.phq9_0 !== "-" && phq9Obj.phq9_1 !== "-" && phq9Obj.phq9_2 !== "-" && phq9Obj.phq9_3 !== "-" && phq9Obj.phq9_4 !== "-" && phq9Obj.phq9_5 !== "-" && phq9Obj.phq9_6 !== "-" && phq9Obj.phq9_7 !== "-" && phq9Obj.phq9_8 !== "-" && phq9Obj.phq9_9 !== "-") {
            userObj.nextBlock = "PHQ9_RESULT";
            let sum = parseInt(phq9Obj.phq9_0) + parseInt(phq9Obj.phq9_1) + parseInt(phq9Obj.phq9_2) + parseInt(phq9Obj.phq9_3) + parseInt(phq9Obj.phq9_4) + parseInt(phq9Obj.phq9_5) + parseInt(phq9Obj.phq9_6) + parseInt(phq9Obj.phq9_7) + parseInt(phq9Obj.phq9_8) - 9;

            if(sum < 5){ userObj.nextBlockItem = "0"; }
            else if(sum < 10){ userObj.nextBlockItem = "1"; }
            else if(sum < 20){ userObj.nextBlockItem = "2"; }
            else{ userObj.nextBlockItem = "3";}

            phq9Obj.completed = true;
          }
          else if(phq9Obj.phq9_0 === "-") { userObj.nextBlockItem = "PHQ9_0"; }
          else if(phq9Obj.phq9_1 === "-") { userObj.nextBlockItem = "PHQ9_1"; }
          else if(phq9Obj.phq9_2 === "-") { userObj.nextBlockItem = "PHQ9_2"; }
          else if(phq9Obj.phq9_3 === "-") { userObj.nextBlockItem = "PHQ9_3"; }
          else if(phq9Obj.phq9_4 === "-") { userObj.nextBlockItem = "PHQ9_4"; }
          else if(phq9Obj.phq9_5 === "-") { userObj.nextBlockItem = "PHQ9_5"; }
          else if(phq9Obj.phq9_6 === "-") { userObj.nextBlockItem = "PHQ9_6"; }
          else if(phq9Obj.phq9_7 === "-") { userObj.nextBlockItem = "PHQ9_7"; }
          else if(phq9Obj.phq9_8 === "-") { userObj.nextBlockItem = "PHQ9_8"; }
          else if(phq9Obj.phq9_9 === "-") { userObj.nextBlockItem = "PHQ9_9"; }

          await phq9Obj.save();
        }
        else if(userObj.nextBlock==="GAD7"){
          let gad7Obj = await gad7DB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 } });

          // 가장 최신데이터가 없거나, 가장 최신데이터의 completed가 true이면 새 데이터를 생성.
          // 매 daily push시 completed가 false인 데이터는 삭제, 따라서 이 단계에서 completed가 false라는 말은 사용자가 그날의 답변을 아직 끝마지치 않았다는 뜻.
          if(gad7Obj === undefined | gad7Obj === null | gad7Obj.completed === true){
            const gad7 = new gad7DB({ id: id });
            gad7Obj = await gad7.save();
          }

          if(gad7Obj.gad7_0 !== "-" && gad7Obj.gad7_1 !== "-" && gad7Obj.gad7_2 !== "-" && gad7Obj.gad7_3 !== "-" && gad7Obj.gad7_4 !== "-" && gad7Obj.gad7_5 !== "-" && gad7Obj.gad7_6 !== "-") {
            userObj.nextBlock = "GAD7_RESULT";
            let sum = parseInt(gad7Obj.gad7_0) + parseInt(gad7Obj.gad7_1) + parseInt(gad7Obj.gad7_2) + parseInt(gad7Obj.gad7_3) + parseInt(gad7Obj.gad7_4) + parseInt(gad7Obj.gad7_5) + parseInt(gad7Obj.gad7_6) - 7;

            if(sum < 6){ userObj.nextBlockItem = "0";}
            else{ userObj.nextBlockItem = "1"; }

            gad7Obj.completed = true;
          }
          else if(gad7Obj.gad7_0 === "-") { userObj.nextBlockItem = "GAD7_0"; }
          else if(gad7Obj.gad7_1 === "-") { userObj.nextBlockItem = "GAD7_1"; }
          else if(gad7Obj.gad7_2 === "-") { userObj.nextBlockItem = "GAD7_2"; }
          else if(gad7Obj.gad7_3 === "-") { userObj.nextBlockItem = "GAD7_3"; }
          else if(gad7Obj.gad7_4 === "-") { userObj.nextBlockItem = "GAD7_4"; }
          else if(gad7Obj.gad7_5 === "-") { userObj.nextBlockItem = "GAD7_5"; }
          else if(gad7Obj.gad7_6 === "-") { userObj.nextBlockItem = "GAD7_6"; }

          await gad7Obj.save();
        }
        else if(userObj.nextBlock==="ISI-K"){
          let isiObj = await isiDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 } });

          // 가장 최신데이터가 없거나, 가장 최신데이터의 completed가 true이면 새 데이터를 생성.
          // 매 daily push시 completed가 false인 데이터는 삭제, 따라서 이 단계에서 completed가 false라는 말은 사용자가 그날의 답변을 아직 끝마지치 않았다는 뜻.
          if(isiObj === undefined | isiObj === null | isiObj.completed === true){
            const isi = new isiDB({ id: id });
            isiObj = await isi.save();
          }

          if(isiObj.isi_0 !== "-" && isiObj.isi_1 !== "-" && isiObj.isi_2 !== "-" && isiObj.isi_3 !== "-" && isiObj.isi_4 !== "-" && isiObj.isi_5 !== "-" && isiObj.isi_6 !== "-") {
            userObj.nextBlock = "ISI-K_RESULT";
            let sum = parseInt(isiObj.isi_0) + parseInt(isiObj.isi_1) + parseInt(isiObj.isi_2) + parseInt(isiObj.isi_3) + parseInt(isiObj.isi_4) + parseInt(isiObj.isi_5) + parseInt(isiObj.isi_6) - 7;

            if(sum < 8){ userObj.nextBlockItem = "0"; }
            else if(sum < 15){ userObj.nextBlockItem = "1"; }
            else if(sum < 22){ userObj.nextBlockItem = "2"; }
            else{ userObj.nextBlockItem = "3"; }

            isiObj.completed = true;
          }
          else if(isiObj.isi_0 === "-") { userObj.nextBlockItem = "ISIK_0"; }
          else if(isiObj.isi_1 === "-") { userObj.nextBlockItem = "ISIK_1"; }
          else if(isiObj.isi_2 === "-") { userObj.nextBlockItem = "ISIK_2"; }
          else if(isiObj.isi_3 === "-") { userObj.nextBlockItem = "ISIK_3"; }
          else if(isiObj.isi_4 === "-") { userObj.nextBlockItem = "ISIK_4"; }
          else if(isiObj.isi_5 === "-") { userObj.nextBlockItem = "ISIK_5"; }
          else if(isiObj.isi_6 === "-") { userObj.nextBlockItem = "ISIK_6"; }

          await isiObj.save();
        }
        else if(userObj.nextBlock==="RSES"){
          let rsesObj = await rsesDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 } });

          // 가장 최신데이터가 없거나, 가장 최신데이터의 completed가 true이면 새 데이터를 생성.
          // 매 daily push시 completed가 false인 데이터는 삭제, 따라서 이 단계에서 completed가 false라는 말은 사용자가 그날의 답변을 아직 끝마지치 않았다는 뜻.
          if(rsesObj === undefined | rsesObj === null | rsesObj.completed === true){
            const rses = new rsesDB({ id: id });
            rsesObj = await rses.save();
          }

          if(rsesObj.rses_0 !== "-" && rsesObj.rses_1 !== "-" && rsesObj.rses_2 !== "-" && rsesObj.rses_3 !== "-" && rsesObj.rses_4 !== "-" && rsesObj.rses_5 !== "-" && rsesObj.rses_6 !== "-" && rsesObj.rses_7 !== "-" && rsesObj.rses_8 !== "-" && rsesObj.rses_9 !== "-") {
            userObj.nextBlock = "RSES_RESULT";
            let sum = parseInt(rsesObj.rses_0) + parseInt(rsesObj.rses_1) + parseInt(rsesObj.rses_2) + parseInt(rsesObj.rses_3) + parseInt(rsesObj.rses_4) + parseInt(rsesObj.rses_5) + parseInt(rsesObj.rses_6) + parseInt(rsesObj.rses_7) + parseInt(rsesObj.rses_8) + parseInt(rsesObj.rses_9) - 10;

            if(sum < 9){ userObj.nextBlockItem = "4"; }
            else if(sum < 15){ userObj.nextBlockItem = "3"; }
            else if(sum < 29){ userObj.nextBlockItem = "2"; }
            else if(sum < 35){ userObj.nextBlockItem = "1"; }
            else{ userObj.nextBlockItem = "0"; }

            rsesObj.completed = true;
          }
          else if(rsesObj.rses_0 === "-") { userObj.nextBlockItem = "RSES_0"; }
          else if(rsesObj.rses_1 === "-") { userObj.nextBlockItem = "RSES_1"; }
          else if(rsesObj.rses_2 === "-") { userObj.nextBlockItem = "RSES_2"; }
          else if(rsesObj.rses_3 === "-") { userObj.nextBlockItem = "RSES_3"; }
          else if(rsesObj.rses_4 === "-") { userObj.nextBlockItem = "RSES_4"; }
          else if(rsesObj.rses_5 === "-") { userObj.nextBlockItem = "RSES_5"; }
          else if(rsesObj.rses_6 === "-") { userObj.nextBlockItem = "RSES_6"; }
          else if(rsesObj.rses_7 === "-") { userObj.nextBlockItem = "RSES_7"; }
          else if(rsesObj.rses_8 === "-") { userObj.nextBlockItem = "RSES_8"; }
          else if(rsesObj.rses_9 === "-") { userObj.nextBlockItem = "RSES_9"; }

          await rsesObj.save();
        }
        else if(userObj.nextBlock==="PTSD"){
          let ptsdObj = await ptsdDB.findOne({id: id}, {}, { sort: { 'createdAt' : -1 } });

          // 가장 최신데이터가 없거나, 가장 최신데이터의 completed가 true이면 새 데이터를 생성.
          // 매 daily push시 completed가 false인 데이터는 삭제, 따라서 이 단계에서 completed가 false라는 말은 사용자가 그날의 답변을 아직 끝마지치 않았다는 뜻.
          if(ptsdObj === undefined | ptsdObj === null | ptsdObj.completed === true){
            const ptsd = new ptsdDB({ id: id });
            ptsdObj = await ptsd.save();
          }

          if(ptsdObj.ptsd_0 !== "-" && ptsdObj.ptsd_1 !== "-" && ptsdObj.ptsd_2 !== "-" && ptsdObj.ptsd_3 !== "-" && ptsdObj.ptsd_4 !== "-") {
            userObj.nextBlock = "PTSD_RESULT";
            let sum = parseInt(ptsdObj.ptsd_0) + parseInt(ptsdObj.ptsd_1) + parseInt(ptsdObj.ptsd_2) + parseInt(ptsdObj.ptsd_3) + parseInt(ptsdObj.ptsd_4) - 5;

            if(sum < 3){ userObj.nextBlockItem = "2"; }
            else if(sum < 4){ userObj.nextBlockItem = "1"; }
            else{ userObj.nextBlockItem = "0"; }

            ptsdObj.completed = true;
          }
          else if(ptsdObj.ptsd_0 === "-") { userObj.nextBlockItem = "PTSD_0"; }
          else if(ptsdObj.ptsd_1 === "-") { userObj.nextBlockItem = "PTSD_1"; }
          else if(ptsdObj.ptsd_2 === "-") { userObj.nextBlockItem = "PTSD_2"; }
          else if(ptsdObj.ptsd_3 === "-") { userObj.nextBlockItem = "PTSD_3"; }
          else if(ptsdObj.ptsd_4 === "-") { userObj.nextBlockItem = "PTSD_4"; }

          await ptsdObj.save();
        }
        else{
          userObj.nextBlockItem = "-";
        }

        //check 24hour
        // console.log((Date.now() - userObj.lastUseDate)/1000/60/60);  // <- hour
        // if((Date.now() - Date.parse(userObj.lastUseDate))/1000/60/60 > 24 ){
        //  userObj.nextBlock = "GREET";
        // }


        // 상세7: 유저의 lastBlock, lastBlockItem, nextBlock, nextBlockItem에 맞춰 responseDB에서 응답 내용 뽑고, 사용자에게 전달, 이때 사용자별로 다른 응답 가능 (emotionStatus, age, region, sex 등의 사용자 정보 활용)
        resolve(await getResponseBodyByUser(body, userObj, responseReplaceDict));
    })()

  });
}



function getResponseBodyByUser(body, userObj, responseReplaceDict) {
  return new Promise(function (resolve, reject) {
    (async function() {
      // userObj.nextBlock;
      // userObj.emotionStatus;
      // userObj.age;
      // userObj.sex;
      // userObj.region;

      console.log(userObj);

      //여러개면 랜덤선택
      let cnt = await responseDB.countDocuments({block: userObj.nextBlock, blockItem: userObj.nextBlockItem});
      let rand = Math.floor(Math.random() * cnt);
      let responseObj = await responseDB.findOne({block: userObj.nextBlock, blockItem: userObj.nextBlockItem}).skip(rand);


      let responseBody = await getResponseBody(responseObj, responseReplaceDict);

      // console.log(userObj.emotionStatus);
      // console.log(rand);

      //update current block by last block
      userObj.lastBlock = userObj.nextBlock;
      userObj.lastBlockItem = userObj.nextBlockItem;
      await userObj.save();
      resolve(responseBody);

    })()
  });
}


function getResponseBody(responseObj, responseReplaceDict){
  return new Promise(function (resolve, reject) {
    let botText = responseObj.botText.split("+");

    //TODO: image, noGraph
    const imgCh = "{image}" in responseReplaceDict;
    let strCh = (Object.keys(responseReplaceDict).length != 0);
    // if(imgCh){
    //   strCh = false;
    // }

    //Generate contents (bot text part); form of
    //[{ simpleText: { text: "오늘도 반가워요, 주인님!! 🧡 \n날씨가 제법 쌀쌀하던데 잘 보내셨나요 ☺️" }},
    // { simpleText: { text: "오늘 하루 기분은 어떠셨나요?" } } ];
    contents = [];
    for(let i = 0; i<botText.length; i++){
      if(botText[i].split(":")[0] === "text"){
        contents.push({simpleText: { text: (strCh?replaceAll(botText[i].split(":")[1],responseReplaceDict):botText[i].split(":")[1]) } });
      }
      else if(botText[i].split(":")[0] === "image"){
        contents.push({
          simpleImage: {
            imageUrl: "http://3.135.208.163/"+ (imgCh?replaceAll(botText[i].split(":")[1],responseReplaceDict):botText[i].split(":")[1]),
            altText: botText[i].split(":")[1]
          }
        });
      }
      else if(botText[i].split(":")[0] === "card"){
        console.log(botText[i].split(":")[3]);
        console.log(replaceAll(botText[i].split(":")[3],responseReplaceDict));
        contents.push({
          basicCard: {
            title: botText[i].split(":")[2],
            description: botText[i].split(":")[3], //botText[i].split(":")[3],
            thumbnail: {
              imageUrl: "http://3.135.208.163/"+(imgCh?replaceAll(botText[i].split(":")[1],responseReplaceDict):botText[i].split(":")[1]),//(botText[i].split(":")[1]), //TODO: image
              fixedRatio: true
            }
          }
        });
      }
    }
    // console.log(contents);

    // Generate replies
    quickReplies = [];
    for(let i = 0; i < responseObj.buttonLabel.split("\n").length; i++){
      let tmp = {
        messageText: responseObj.buttonMessage.split("\n")[i],
        action: "block",
        blockId: '5f28dcacb223cc0001ba60bb',
        label: responseObj.buttonLabel.split("\n")[i],
        extra: {"nextBlock":responseObj.nextBlock.split("\n")[i]}
      }
      quickReplies.push(tmp)
    }
    // console.log(quickReplies);

    let responseBody = {
      version: "2.0",
      template: {
        outputs: contents,
        quickReplies: quickReplies
      }
    };

    // console.log(responseBody);
    resolve(responseBody);
  });

}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAll(str, map){
    for(key in map){
        str = str.replaceAll(key, map[key]);
    }
    return str;
}

module.exports = getResponse;
