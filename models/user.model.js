const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      // unique: true,
      required: "ID REQUIRED"
    },
    lastLogInDate: {
      type: String,
      required: false
    },
    lastDailyTestDate: {
      type: Date,
      required: false
    },
    // Last block the user were in
    lastBlock: {
      type: String,
      required: false
    },
    // age; 9세이상 10~20대 30~40대 50~60대 70대이상
    age: {
      type: String,
      required: false
    },
    // sex; 남 여 기타
    sex: {
      type: String,
      required: false
    },
    // region; 수도권 강원 충청 영남 호남 제주
    region: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
