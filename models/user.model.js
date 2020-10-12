const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//id, lastLogin, lastBlock, emotionStatus, age, sex, region
const userSchema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      // unique: true,
      required: true
    },
    // Check last use -> if long time no see, greet the user; reset the process
    lastUseDate: {
      type: String,
      required: true
    },
    // last block
    lastBlock: {
      type: String,
      required: true,
      default: "WELCOME"
    },
    // last block item
    lastBlockItem: {
      type: String,
      required: true,
      default: "-"
    },
    // next block
    nextBlock: {
      type: String,
      required: true,
      default: "SET_START"
    },
    // next block item
    nextBlockItem: {
      type: String,
      required: true,
      default: "-"
    },
    // emotion_status -> for weekly feedback; updated at every daily screening
    emotionStatus: {
      type: Number,
      required: true,
      default: 0
    },
    // age; 20살이하, 20대, 30/40대 50/60대 60살이상
    age: {
      type: String,
      required: true,
      default: "-"
    },
    // sex; 남, 여, 기타
    sex: {
      type: String,
      required: true,
      default: "-"
    },
    // region; 수도권, 강원, 충청, 경상, 전라, 제주
    region: {
      type: String,
      required: true,
      default: "-"
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
