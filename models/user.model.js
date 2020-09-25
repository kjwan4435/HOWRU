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
      // required: "ID REQUIRED"
    },
    // Check last log-in -> if long time no see, greet the user
    lastLoginDate: {
      type: String,
      required: true
    },
    // Last block the user were in -> When there was error, start from this block
    lastBlock: {
      type: String,
      required: true
    },
    // emotion_status -> for weekly feedback; updated at every daily screening
    emotionStatus: {
      type: Number,
      required: true
    },
    // age; 20살이하, 20대, 30/40대 50/60대 60살이상
    age: {
      type: String,
      required: true
    },
    // sex; 남, 여, 기타
    sex: {
      type: String,
      required: true
    },
    // region; 수도권, 강원, 충청, 영남, 호남, 제주
    region: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
