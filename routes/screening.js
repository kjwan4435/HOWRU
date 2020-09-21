const screeningRouter = require("express").Router();

screeningRouter.post("/0", function (req, res) {
  const question = req.body.userRequest.block.name;
  const blockid = req.body.userRequest.block.id;
  const answer = req.body.userRequest.utterance;
  const id = req.body.userRequest.user.id;
  const date = new Date().toLocaleDateString("en-US");

  const Answer = new result({
    question,
    blockid,
    answer,
    id,
    date
  });

  Answer.save()
    .then(() => console.log(Answer))
    .catch((err) => console.log(`Error: ${err}`));

  const number = Math.floor(Math.random() * 3) + 1;
  let sentence =
    "안녕하세요! 주인님 :)\n오늘 왠지 좋은 일이 생길 것만 같은걸요?";
  if (number === 1) {
    sentence = "안녕하세요! 주인님 :)\n너무너무 기분좋은 하루입니다!! 헤헤";
  } else if (number === 2) {
    sentence = "안녕하세요 주인님?\n오늘 하루도 아자아자!! ❤️";
  }

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: `${sentence}`
          }
        },
        {
          simpleText: {
            text:
              "Q. 주인님은 오늘 기분이 어떠신가요?\n\n1. 우울해\n2. 평범해\n3. 좋아!"
          }
        }
      ],
      quickReplies: [
        {
          messageText: "오늘 기분 우울해..",
          action: "block",
          blockId: `${sleepBlock}`,
          label: "1"
        },
        {
          messageText: "오늘은 평범했어!",
          action: "block",
          blockId: `${activityBlock}`,
          label: "2"
        },
        {
          messageText: "오늘 기분 좋아!",
          action: "block",
          blockId: `${moodBlock}`,
          label: "3"
        }
      ]
    }
  };

  res.status(200).send(responseBody);
});

module.exports = screeningRouter;
