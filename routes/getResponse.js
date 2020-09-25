let user = require("../models/user.model");
// let answer = require("../models/answer.model");

const db = require("../db");

function getResponse(body)
{
  return new Promise(function (resolve, reject) {

    const block = body.action.clientExtra.nextBlock;
    const id = body.userRequest.user.id;

    // First entrance (right after the welcome block)
    if(block === "" || block === undefined || block === "-"){
      (async function(){
        // Find user ID in user DB
        obj = await user.findOne({id: id});

        if(obj === null){
          //Add user (id, lastLoginDate, lastBlock, emotionStatus, age, sex, region)
          const User = new user({ id: id, lastLoginDate: Date.now(), lastBlock: "-", emotionStatus: 0, age:"-", sex:"-", region:"-"});
          User.save()
            .then(() => console.log("New User: " + id))
            .catch((err) => console.log(err));

          let text = [{ simpleText: { text: "먼저 정확한 진단을 위해 주인님의 정보가 필요해요!" }},
                      { simpleText: { text: "간단한 질문에 대해 답변 부탁드려요!" }} ];
          let message = ["응!"];
          let label = ["응!"];
          let nextBlock = ["SET"];
          let question = [""];
          resolve(getResponseBody(text, message, label, nextBlock, question));
        }
        //If the user was exist, check whether the entries are filled
        else{
          console.log("Exist user; but error case");
          console.log("block === undefined only came after welcome block ");

          obj = await user.findOne({id: id});
          if(obj.sex!=="-" && obj.age!=="-" && obj.region!=="-"){
            let text = [{ simpleText: { text: "먼저 정확한 진단을 위해 주인님의 정보가 필요해요!" }},
                        { simpleText: { text: "간단한 질문에 대해 답변 부탁드려요!" }} ];
            // let text = [{ simpleText: { text: "앗 어디까지 했었죠? 음... 마지막 기억나는 곳부터 다시 해봐요!" }}];
            let message = ["응!"];
            let label = ["응!"];
            let nextBlock = ["SET"];
            // let nextBlock = [obj.lastBlock];
            let question = [""];
            resolve(getResponseBody(text, message, label, nextBlock, question));
          }
          else{
            let text = [{ simpleText: { text: "먼저 정확한 진단을 위해 주인님의 정보가 필요해요!" }},
                        { simpleText: { text: "간단한 질문에 대해 답변 부탁드려요!" }} ];
            let message = ["응!"];
            let label = ["응!"];
            let nextBlock = ["SET"];
            let question = [""];
            resolve(getResponseBody(text, message, label, nextBlock, question));
          }
        }
      })()
    }


    else if(block === "SET"){
      (async function (){
        response = body.userRequest.utterance;
        question = body.action.clientExtra.question;

        if((question!==null || question!==undefined) && question.length>0)
        if(question[0] === "sex")
          await user.findOneAndUpdate({id: id}, {sex: response});
        if(question[0] === "age")
          await user.findOneAndUpdate({id: id}, {age: response});
        if(question[0] === "region")
          await user.findOneAndUpdate({id: id}, {region: response});

        obj = await user.findOne({id: id});

        if(obj.sex!=="-" && obj.age!=="-" && obj.region!=="-"){
          let text = [{ simpleText: { text: "수고하셨어요! 이제 시작해볼까요? ^___^" }}];
          let message = ["응!"];
          let label = ["응!"];
          let nextBlock = ["PHQ2_0"];
          let question = [""];
          resolve(getResponseBody(text, message, label, nextBlock, question));
        }

        else if(obj.sex === "-"){
          let text = [{ simpleText: { text: "주인님의 성별을 알려주세요!😁" }}];
          let message = ["남", "여", "기타"];
          let label = ["남", "여", "기타"];
          let nextBlock = ["SET", "SET", "SET"];
          let question = ["sex"];
          resolve(getResponseBody(text, message, label, nextBlock, question));
        }

        else if(obj.age === "-"){
          let text = [{ simpleText: { text: "나이는 어떻게 되시나요..?" }}];
          let message = ["19세이하 ", "20대", "30,40대", "50,60대", "70대이상"];
          let label = ["19세이하", "20대", "30,40대", "50,60대", "70대이상"];
          let nextBlock = ["SET", "SET", "SET", "SET", "SET"];
          let question = ["age"];
          resolve(getResponseBody(text, message, label, nextBlock, question));
        }

        else if(obj.region === "-"){
          let text = [{ simpleText: { text: "사는 지역은 어디신가요? 🤔" }}];
          console.log(text);
          let message = ["수도권", "강원", "충청", "경상", "전라", "제주"];
          let label = ["수도권", "강원", "충청", "경상", "전라", "제주"];
          let nextBlock = ["SET", "SET", "SET", "SET", "SET", "SET"];
          let question = ["region"];
          resolve(getResponseBody(text, message, label, nextBlock, question));
        }
      })()
    }
    // daily block
    else if(block === "PHQ2_0"){



    }


    else if(block === "PHQ9_0"){
      let text = "Q. 최근 일 또는 여가 활동을 하는 데 흥미나 즐거움을 느끼지 못했다.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let nextBlock = ["PHQ9_1", "PHQ9_1", "PHQ9_1", "PHQ9_1"];
      resolve(getResponseBody(text, message, label, nextBlock));
    }
    else if(block === "PHQ9_1"){
      let text = "Q. 기분이 가라앉거나, 우울하거나, 희망이 없다.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let nextBlock = ["PHQ9_2", "PHQ9_2", "PHQ9_2", "PHQ9_2"];
      resolve(getResponseBody(text, message, label, nextBlock));
    }
    else if(block === "PHQ9_2"){
      let text = "잠들기 어렵거나 자꾸 깨어난다. 혹은 너무 많이 잔다.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let nextBlock = ["PHQ9_3", "PHQ9_3", "PHQ9_3", "PHQ9_3"];
      resolve(getResponseBody(text, message, label, nextBlock));
    }
    else if(block === "PHQ9_3"){
      let text = "피곤함, 기력이 저하됨.\n\n0. 없음\n1. 2-6일\n2. 7-12일\n3. 거의 매일";
      let message = ["괜찮았어~", "조금 그랬어", "일주일 이상 그랬어", "거의 매일 그래"];
      let label = ["0", "1", "2", "3"];
      let nextBlock = ["PHQ9_4", "PHQ9_4", "PHQ9_4", "PHQ9_4"];
      resolve(getResponseBody(text, message, label, nextBlock));
    }
    else if(block === "PHQ9_4"){
      let text = "테스트 끝";
      let message = ["고마워"];
      let label = ["고마워"];
      let nextBlock = [""];
      resolve(getResponseBody(text, message, label, nextBlock));
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

// content: e.g., [{ "simpleText": { text: "" }, ["simpleImage": { "imageUrl": "link", "altText": "description" }]
// replies: message, label, extra(nextBlock, question)
function getResponseBody(contents, message, label, nextBlock, question)
{
  let responseBody="";

  // outputs = [];
  // for(let i = 0; i < message.length; i++){
  //   outputs.push(contents[i])
  // }

  quickReplies = [];
  for(let i = 0; i < message.length; i++){
    let tmp = {
      messageText: message[i],
      action: "block",
      blockId: '5f28dcacb223cc0001ba60bb',
      label: label[i],
      extra: {"nextBlock":nextBlock[i], "question":question}
    }
    quickReplies.push(tmp)
  }

  responseBody = {
    version: "2.0",
    template: {
      outputs: contents,//[ { simpleText: { text: text } } ],
      quickReplies: quickReplies
    }
  };

  return responseBody;
}
module.exports = getResponse;
