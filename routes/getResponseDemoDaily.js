function getResponseDemoDaily(body)
{
  return new Promise(function (resolve, reject) {

    const block = body.action.clientExtra.nextBlock;
    const id = body.userRequest.user.id;
    // daily block
    if(block === "" || block === undefined || block === "-"){

      // 날씨정보, 뉴스 등으로 대화 시작하면 좋으려나
      let text = [{ simpleText: { text: "오늘도 반가워요, 주인님!! 🧡 \n날씨가 제법 쌀쌀하던데 잘 보내셨나요 ☺️" }},
                  { simpleText: { text: "오늘 하루 기분은 어떠셨나요?" }} ];
      let message = ["우울해", "평범해", "좋아!"];
      let label = ["우울해", "평범해", "좋아!"];
      let nextBlock = ["CHECK","CHECK","CHECK"];
      let question = ["-"];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "CHECK"){
      response = body.userRequest.utterance;
      if(response === "우울해"){
        let text = [{ simpleText: { text: "이런, 오늘 하루가 많이 힘드셨군요..😥" }},
                    { simpleText: { text: "그럴 수도 있어요!! 제가 주인님께 힘이 되어드리고 싶은데..!!" }},
                    { simpleText: { text: "오늘 주인님의 하루를 조금만 더 자세하게 알려주신다면, 해피가 주인님을 이해하는데 도움이 될 것 같아요! 🤗" }}];
        let message = ["그래", "오늘은 말 안할래"];
        let label = ["그래", "오늘은 말 안할래"];
        let nextBlock = ["DETAIL0", "NOTALK"];
        let question = [""];
        resolve (getResponseBody(text, message, label, nextBlock, question));
      }
      else if(response === "평범해"){
        let text = [{ simpleText: { text: "오늘은 평범한 날이었군요! 저도 별일 없었어요." }},
                    { simpleText: { text: "다만 깃털을 다듬고, 구름을 바라보고, 새소리를 듣고있다보면 특별한일 없는 오늘같은 날도 참 소중하게 느껴지더라구요." }},
                    { simpleText: { text: "오늘 활동을 조금 더 자세하게 알려주시면 저 해피가 주인님을 이해하는데 도움이 될 것 같아요." }}];
        let message = ["그래", "오늘은 말 안할래"];
        let label = ["그래", "오늘은 말 안할래"];
        let nextBlock = ["DETAIL0", "NOTALK"];
        let question = [""];
        resolve (getResponseBody(text, message, label, nextBlock, question));
      }
      else{
        let text = [{ simpleText: { text: "오늘 즐거운 일이 있었나봐요." }},
                    { simpleText: { text: "헤헤, 저도 오늘 맛있는 음식을 먹어서 기분이 좋답니다." }},
                    { simpleText: { text: "주인님의 정원이 잘 크고 있어요, 함께봐요!" }}];
        let message = ["그래"];
        let label = ["그래"];
        let nextBlock = ["GARDEN"];
        let question = [""];
        resolve (getResponseBody(text, message, label, nextBlock, question));
      }

    }
    else if(block === "NOTALK"){
      let text = [{ simpleText: { text: "앗! 주인님 저녁이라 피곤하시죠! " }},
                  { simpleText: { text: "오늘도 답변주셔서 감사해요" }},
                  { simpleText: { text: "주인님의 마음정원이 잘 크는 것 같아서 좋아요!" }}];
      let message = ["보여줘!"];
      let label = ["보여줘!"];
      let nextBlock = ["GARDEN"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }

    else if(block === "DETAIL0"){

      let text = [{ simpleText: { text: "Q. 잠자리는 어떠셨나요? \n\n1. 최악이었어\n2. 별로였어\n3. 평범했어\n4. 좋은편이야 \n5. 완전 좋았어" }}];
      let message = ["1","2","3","4","5"];
      let label = ["1","2","3","4","5"];
      let nextBlock = ["DETAIL1","DETAIL1","DETAIL1","DETAIL1","DETAIL1"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "DETAIL1"){

      let text = [{ simpleText: { text: "Q. 식사는 괜찮게 하셨나요..?🤔 \n\n1. 최악이었어\n2. 별로였어\n3. 평범했어\n4. 좋은편이야 \n5. 완전 좋았어" }}];
      let message = ["1","2","3","4","5"];
      let label = ["1","2","3","4","5"];
      let nextBlock = ["DETAIL2","DETAIL2","DETAIL2","DETAIL2","DETAIL2"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "DETAIL2"){

      let text = [{ simpleText: { text: "Q. 오늘 하루 기분은 어떠셨나요?😌 \n\n1. 최악이었어\n2. 별로였어\n3. 평범했어\n4. 좋은편이야 \n5. 완전 좋았어" }}];
      let message = ["1","2","3","4","5"];
      let label = ["1","2","3","4","5"];
      let nextBlock = ["DETAIL3","DETAIL3","DETAIL3","DETAIL3","DETAIL3"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "DETAIL3"){

      let text = [{ simpleText: { text: "Q. 오늘 주변 사람들 간의 관계는 어떠셨어요?👬 \n\n1. 최악이었어\n2. 별로였어\n3. 평범했어\n4. 좋은편이야 \n5. 완전 좋았어" }}];
      let message = ["1","2","3","4","5"];
      let label = ["1","2","3","4","5"];
      let nextBlock = ["DETAIL4","DETAIL4","DETAIL4","DETAIL4","DETAIL4"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "DETAIL4"){

      let text = [{ simpleText: { text: "Q. 마지막 질문! 오늘 운동이나 신체활동은 좀 어떠셨어요?💪 \n\n1. 최악이었어\n2. 별로였어\n3. 평범했어\n4. 좋은편이야 \n5. 완전 좋았어" }}];
      let message = ["1","2","3","4","5"];
      let label = ["1","2","3","4","5"];
      let nextBlock = ["BEFOREGARDEN","BEFOREGARDEN","BEFOREGARDEN","BEFOREGARDEN","BEFOREGARDEN"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "BEFOREGARDEN"){
      let text = [{ simpleText: { text: "짝짝짝👏👏 고마워요 주인님! 이제 해피가 주인님을 좀 더 이해할 수 있을 것 같아요☺️" }},
                  { simpleText: { text: "주인님의 감정들이 모여 내면에 마음정원이 만들어졌네요! 같이 보실까요?🙌" }} ];
      let message = ["보여줘!"];
      let label = ["보여줘!"];
      let nextBlock = ["GARDEN"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "GARDEN"){
      let text = [
        {
          basicCard: {
            title: "주인님의 마음정원",
            description: "주인님의 마음정원에 구름이가 찾아왔네요..!💨 아무래도 최근 기분이 좋지 않으신가봐요. \n\n하지만 비온 뒤 맑음이라는 말이 있잖아요.🌤 더 큰 행복이 주인님을 기다리고 있는 게 아닐까요?!",
            thumbnail: {
              imageUrl: "http://3.135.208.163/garden0.png",
              fixedRatio: true,
              width : 528,
              height : 522
            }
          }
        }
        // ,{ simpleText: { text: "주인님 혹시 최근 계속 우울하셨다면.. 한 번 제가 아는 마음박사님께 상담을 받아보는 건 어떨까요?!🤗 \n\n간단한 질문을 바탕으로 주인님의 우울의 원인을 찾고 극복해보아요!🙌" }}
      ];
      let message = ["고마워 해피야"];
      let label = ["고마워 해피야"];
      let nextBlock = ["TARO"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "TARO"){
      let text = [{ simpleText: { text: "아참!!! 제가 요즘 🃏타로 공부를 하고 있는데, 내일의 운세🔮를 좀 봐드릴까요?" }},
                  {
                      simpleImage: {
                          imageUrl: "http://3.135.208.163/happy.png",
                          altText: "해피! ^____^"
                      }
                  }];
      let message = ["응 보여줘!"];
      let label = ["응 보여줘!"];
      let nextBlock = ["RESULT"];
      let question = [""];

      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "RESULT"){
      let text = [{ simpleText: { text: "보자보자, 타로랏!🃏🃏🃏" }},
                  {
                      simpleImage: {
                          imageUrl: "http://3.135.208.163/taro.png",
                          altText: "해피! ^____^"
                      }
                  },
                  { simpleText: { text: "이 카드들은 이미 어려운 상황들이 모두 끝나고, 이제 희망만이 남아 있음을 의미해요. 이제껏 열심히 노력한 결과을 얻게 될 것이니 더욱 증진하는 것이 좋을 것을 의미하기도 해요! \n\n^__^ 😙 좋은일이🤞 찾아올건가봐요! 내일도 해피가 찾아올테니 내일 또 봐요!👋" }} ];

      let message = ["응 내일봐!"];
      let label = ["응 내일봐!"];
      let nextBlock = ["END"];
      let question = [""];

      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "END"){
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
      blockId: '5f6c5919012ad8229a2bc33c',
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
module.exports = getResponseDemoDaily;
