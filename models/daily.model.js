const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//id, lastLogin, lastBlock, emotionStatus, age, sex, region
const daily_Schema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true,
      default: 0
    },
    sleep: {
      type: String,
      required: true,
      default: "-"
    },
    eat: {
      type: String,
      required: true,
      default: "-"
    },
    mood: {
      type: String,
      required: true,
      default: "-"
    },
    social: {
      type: String,
      required: true,
      default: "-"
    },
    activity: {
      type: String,
      required: true,
      default: "-"
    },
    // 위 5개 항목이 다 차면 true. 그래프 그릴때 사용될 것임
    graphReady: {
      type: Boolean,
      required: true,
      default: false
    },
    // 데이터 작성이 완료되면 true로 업데이트, DAILY_NO_DETAIL이나 DAILY_ANS_GOOD의 경우에는 값이 안채워져도 true.
    completed: {
      type: Boolean,
      required: true,
      default: false
    },
    // PHQ9 테스트 조건인 7개 일상 질문에 포함됐다면 true로 변경. PHQ9 test 조건: 이게 false인 애들 7개 존재.
    phq9Tested: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  { timestamps: true }
);

const daily = mongoose.model("daily", daily_Schema);
module.exports = daily;
