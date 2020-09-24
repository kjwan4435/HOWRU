let user = require("../models/user.model");
let answer = require("../models/answer.model");

const db = require("../db");

function getResponse(body)
{
  return new Promise(function (resolve, reject) {

    const stage = body.action.clientExtra.stage;
    const id = body.userRequest.user.id;

    // First entrance (right after the welcome block)
    if(stage === ""){
      // Find user ID in user DB
      user.findOne({id: id}, function(err,obj) {
        // If no user were found, add that user id on DB
        if(obj === null){
          //Add user
          //id, lastLogInDate, lastDailyTestDate, lastBlock, age, sex, region
          const User = new user({ id: id, lastLogInDate: Date.now()});

          User.save()
            .then(() => console.log("New User: " + id))
            .catch((err) => console.log('Error: ${err}'));

          let text = "먼저 정확한 진단을 위해 주인님의 정보가 필요해요! 간단한 질문에 대해 답변 부탁드려요!";
          let message = ["응!"];
          let label = ["응!"];
          let next = ["SET"];
          resolve(getResponseBody(text, message, label, next));
        }
        //If the user was exist, check whether the entries are filled
        else{
          console.log("Exist user; but error case; next==\"\" only came after welcome block ");

          user.findOne({id: id}, function(err,obj) {
            if(obj.sex!==undefined && obj.age!==undefined && obj.region!==undefined){
              let text = "앗 어디까지 했었죠? 음... 마지막 기억나는 곳부터 다시 해봐요!";
              let message = ["응!"];
              let label = ["응!"];
              let next = ["PHQ2_0"];
              resolve(getResponseBody(text, message, label, next));
            }

            else{
              let text = "먼저 정확한 진단을 위해 주인님의 정보가 필요해요! 간단한 질문에 대해 답변 부탁드려요!";
              let message = ["응!"];
              let label = ["응!"];
              let next = ["SET"];
              resolve(getResponseBody(text, message, label, next));
            }
          });
        }
      });
    }

    else if(stage === "SET"){
      (async function set(){
        response = body.userRequest.utterance;
        if(response === "남" || response === "여" || response === "기타"){
          await user.findOneAndUpdate({id: id}, {sex: response});
        }
        if(response === "9세이하" || response === "10~20대" || response === "30~40대" || response === "50~60대" || response === "70대이상"){
          await user.findOneAndUpdate({id: id}, {age: response});
        }
        if(response === "수도권" || response === "강원" || response === "충청" || response === "영남" || response === "호남" || response === "제주"){
          await user.findOneAndUpdate({id: id}, {region: response});
        }

        await user.findOne({id: id}, function(err,obj) {
          if(obj.sex!==undefined && obj.age!==undefined && obj.region!==undefined){
            let text = "수고하셨어요! 이제 시작해볼까요? ^___^";
            console.log(text);
            let message = ["응!"];
            let label = ["응!"];
            let next = ["PHQ2_0"];
            resolve(getResponseBody(text, message, label, next));
          }

          else if(obj.sex === undefined){
            let text = "성별을 알려주세요";
            console.log(text);
            let message = ["남", "여", "기타"];
            let label = ["남", "여", "기타"];
            let next = ["SET", "SET", "SET"];
            resolve(getResponseBody(text, message, label, next));
          }

          else if(obj.age === undefined){
            let text = "나이를 알려주세요";
            console.log(text);
            let message = ["9세이하", "10~20대", "30~40대", "50~60대", "70대이상"];
            let label = ["9세이하", "10~20대", "30~40대", "50~60대", "70대이상"];
            let next = ["SET", "SET", "SET", "SET", "SET"];
            resolve(getResponseBody(text, message, label, next));
          }

          else if(obj.region === undefined){
            let text = "지역을 알려주세요";
            console.log(text);
            let message = ["수도권", "강원", "충청", "영남", "호남", "제주"];
            let label = ["수도권", "강원", "충청", "영남", "호남", "제주"];
            let next = ["SET", "SET", "SET", "SET", "SET", "SET"];
            resolve(getResponseBody(text, message, label, next));
          }
        });
      })()
    }

    else if(stage === "PHQ2_0"){



    }


    else if(stage === "PHQ9_0"){
      let text = "Q. 최근 일 또는 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못했다.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let next = ["PHQ9_1", "PHQ9_1", "PHQ9_1", "PHQ9_1"];
      resolve(getResponseBody(text, message, label, next));
    }
    else if(stage === "PHQ9_1"){
      let text = "Q. 기분이 가라앉거나, 우울하거나, 희망이 없다.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let next = ["PHQ9_2", "PHQ9_2", "PHQ9_2", "PHQ9_2"];
      resolve(getResponseBody(text, message, label, next));
    }
    else if(stage === "PHQ9_2"){
      let text = "잠들기 어렵거나 자꾸 깨어난다. 혹은 너무 많이 잔다.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let next = ["PHQ9_3", "PHQ9_3", "PHQ9_3", "PHQ9_3"];
      resolve(getResponseBody(text, message, label, next));
    }
    else if(stage === "PHQ9_3"){
      let text = "피곤함, 기력이 저하됨.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let next = ["PHQ9_4", "PHQ9_4", "PHQ9_4", "PHQ9_4"];
      resolve(getResponseBody(text, message, label, next));
    }
    else if(stage === "PHQ9_4"){
      let text = "테스트 끝";
      let message = ["고마워"];
      let label = ["고마워"];
      let next = [""];
      resolve(getResponseBody(text, message, label, next));
    }
    // Default
    else{
      let text = "Q. PHQ9 테스트 해볼래요?";
      let message = ["그래", "아니 안할래"];
      let label = ["그래", "아니"];
      let next = ["PHQ9_0", ""];
      resolve(getResponseBody(text, message, label, next));
    }
  });
}


function getResponseBody(text, message, label, next)
{
  quickReplies = [];
  let responseBody="";

  for(let i = 0; i < message.length; i++){
    let tmp = {
      messageText: message[i],
      action: "block",
      blockId: '5f28dcacb223cc0001ba60bb',
      label: label[i],
      extra: {"stage":next[i]}
    }
    quickReplies.push(tmp)
  }

  responseBody = {
    version: "2.0",
    template: {
      outputs: [ { simpleText: { text: text } } ],
      quickReplies: quickReplies
    }
  };

  return responseBody;
}


module.exports = getResponse;
