function getResponseDemoFeedback(body)
{
  return new Promise(function (resolve, reject) {

    const block = body.action.clientExtra.nextBlock;
    const id = body.userRequest.user.id;

    console.log(body);

    // weekly block
    if(block === "" || block === undefined || block === "-"){

      let text = [{ simpleText: { text: "와 벌써 일주일이 지났네요! 이번주도 많은 일들이 있었죠!" }},
                  { simpleText: { text: "그동안 주인님의 마음에도 많은 변화가 있었네요." }},
                  { simpleText: { text: "마음정원을 함께 볼까요?" }} ];
      let message = ["그래!"];
      let label = ["그래!"];
      let nextBlock = ["GARDEN"];
      let question = ["-"];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "GARDEN"){
      let text = [
        {
          basicCard: {
            title: "주인님의 마음정원",
            description: "그간 주인님의 마음정원에 구름이가 찾아왔어요..! 아무래도 최근 기분이 좋지 않으셨나봐요.\n\n하지만 비온 뒤 맑음이라는 말이 있잖아요. 더 큰 행복이 주인님을 기다리고 있는 게 아닐까요?!",
            thumbnail: {
              imageUrl: "http://3.135.208.163/garden0.png",
              fixedRatio: true,
              width : 528,
              height : 522
            }
          }
        },
        { simpleText: { text: "주인님 혹시 최근 계속 우울하셨다면.. 한 번 제가 아는 마음박사님께 상담을 받아보는 건 어떨까요?!🤗 \n\n간단한 질문을 바탕으로 주인님의 우울의 원인을 찾고 극복해보아요!🙌" }}];
      let message = ["응"];
      let label = ["응"];
      let nextBlock = ["DR"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "DR"){
      let text = [
                  {
                      simpleImage: {
                          imageUrl: "http://3.135.208.163/DrJoy.png",
                          altText: "마음박사"
                      }
                  },
                  { simpleText: { text: "짝짝짝👏👏👏~~ 좋아요!! 오랜 시간 기분의 우울이 지속된다고 했을 때 주변에 털어놓고 이렇게 상담을 받는다는 건 무척 용기있는 행동이라구요 🙂 \n\n 반가워요, 저는 마음박사 조이입니다." }},
                  { simpleText: { text: "해피에게 이야기 많이 들었답니다. 요즘 기분이 계속 우울하셔서 상담받으러 오셨군요?!" }}];
      let message = ["안녕하세요"];
      let label = ["안녕하세요"];
      let nextBlock = ["WEEKLYFEEDBACK"];
      let question = [""];

      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "WEEKLYFEEDBACK"){
      let text = [{ simpleText: { text: "일주일 동안 당신의 마음상태을 통해서 우울했던 원인을 분석해 보았어요." }},
                  {
                      simpleImage: {
                          imageUrl: "http://3.135.208.163/weeklyFeedback.png",
                          altText: "weeklyFeedback"
                      }
                  },
                  { simpleText: { text: "전반적으로 ‘운동’과 ‘대인관계’가 부족했네요, 기분도 계속 좋지 않았군요.. \n\n 확실히 요즘 코로나로 인해 밖에 나가기도 어렵고, 사람들 보기도 어렵죠? 괜찮아요, 충분히 잘 해내고 있어요. 다만 이게 지속될경우 마음이 점점 더 힘들어질 수 있으니 좀 더 정밀한 검사를 받아보면 좋을 것 같아요. PHQ-9이라는 전 세계적으로 이용되는 검사를 활용해서 당신의 우울증상 및 요인을 분석해보도록 할게요. 시간이 2분 정도 소요될텐데 괜찮으시겠어요?" }}];
      let message = ["네 받아볼게요", "다음에 받아볼게요"];
      let label = ["네 받아볼게요", "다음에 받아볼게요"];
      let nextBlock = ["PHQ9_0", "PHQ9_0"];
      let question = [""];

      resolve (getResponseBody(text, message, label, nextBlock, question));
    }

    else if(block === "PHQ9_0"){

      let text = [{ simpleText: { text: "지금부터 당신의 지난 2주간을 기준으로 질문에 응답해주시면 된답니다." }},
        { simpleText: { text: "Q. 최근 2주간 기분이 가라앉거나, 우울하거나, 희망이 없다고 느낀적이 얼마나 있었나요? \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_1","PHQ9_1","PHQ9_1","PHQ9_1"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_1"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 평소 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못한적이 얼마나 있었나요? \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_2","PHQ9_2","PHQ9_2","PHQ9_2"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_2"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 잠들기가 어렵거나 자주 깼거나, 혹은 너무 많이 잔 경우가 얼마나 있었나요?  \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_3","PHQ9_3","PHQ9_3","PHQ9_3"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_3"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 평소보다 식욕이 줄었거나, 혹은 평소보다 많이 먹은 경우가 얼마나 있었나요? \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_4","PHQ9_4","PHQ9_4","PHQ9_4"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_4"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 다른 사람들이 눈치 챌 정도로 평소보다 말과 행동이 느려졌거나, 혹은 너무 안절부절 못해서 가만히 앉아 있을 수 없었던 적이 얼마나 있었나요? \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_5","PHQ9_5","PHQ9_5","PHQ9_5"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_5"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 피곤하고 기운이 없었던 적이 얼마나 있었나요? \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_6","PHQ9_6","PHQ9_6","PHQ9_6"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_6"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 내가 잘못 했거나, 실패했다는 생각이 들었거나, 혹은 자신과 가족을 실망시켰다고 생각이 든 적이 얼마나 있었나요? \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_7","PHQ9_7","PHQ9_7","PHQ9_7"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_7"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 신문을 읽거나 TV를 보는 것과 같은 일상적인 일에도 집중을 할 수 없었던 경우가 얼마나 있었나요? \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_8","PHQ9_8","PHQ9_8","PHQ9_8"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_8"){

      let text = [{ simpleText: { text: "Q. 최근 2주간 차라리 죽는 것이 더 낫겠다고 생각했거나, 혹은 자해할 생각이 든 적이 얼마나 있었나요?  \n\n1. 없음\n2. 가끔 (2-6일)\n3. 자주 (7-12일)\n4. 거의 매일" }}];
      let message = ["1","2","3","4"];
      let label = ["1","2","3","4"];
      let nextBlock = ["PHQ9_9","PHQ9_9","PHQ9_9","PHQ9_9"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9_9"){

      let text = [{ simpleText: { text: "Q. 코로나(Covid19)에 감염 경험이 있었나요? \n\n1. 그렇다\n2. 아니다" }}];
      let message = ["1","2"];
      let label = ["1","2"];
      let nextBlock = ["WAIT","WAIT"];
      let question = [""];
      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "WAIT"){
      let text = [{ simpleText: { text: "짝짝짝👏👏👏 긴 질문에 답하느라 너무너무 수고하셨어요 ☺️ 잠시만 기다려주시면 당신의 응답에 대한 결과분석 결과를 안내드립니다!" }}];
      let message = ["네"];
      let label = ["네"];
      let nextBlock = ["PHQ9FEEDBACK"];
      let question = [""];

      resolve (getResponseBody(text, message, label, nextBlock, question));
    }
    else if(block === "PHQ9FEEDBACK"){
      let text = [{
                    simpleImage: {
                      imageUrl: "http://3.135.208.163/phq9Feedback.png",
                      altText: "PHQ9FEEDBACK"
                    }
                  },
                  { simpleText: { text: "당신으로부터 약간의 우울감이 느껴지네요.. 하지만 이 정도는 일상생활에 영향을 줄 정도는 아니랍니다.\n\n다만, 이러한 기분상태가 지속된다면 신체적이나 심리적으로 힘듦을 느끼실 수도 있으세요 😔" }},
                 { simpleText: { text: "가벼운 우울감이 지속된다면, 충분한 잠, 건강하고 맛있는 식사, 적당한 운동, 그리고 사회활동과 같은 개인의 노력을 통해 극복하실 수도 있으시겠지만, 우울로 인해 꽤나 힘듦을 겪고 계신다면 가까운 지역센터나 전문 기관을 방문해 보시는 건 어떨까요? 실제로 우울증의 경우에는 80%가량이 약물치료로 극복하실 수 있다구요! 😊\n\n☎️1577-0199(정신건강복지센터)에서 여러분의 우울감에 대해 무료상담을 진행하고 있으니 이용해보실 수 있어요."}}];
      let message = ["네 고마워요", "더 자세히 알고싶어요"];
      let label = ["네 고마워요", "더 자세히 알고싶어요"];
      let nextBlock = ["END", "END"];
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
      blockId: '5f6c592fe842c7724277e7a2',
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
module.exports = getResponseDemoFeedback;
