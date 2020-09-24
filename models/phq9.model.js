const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phq9Schema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      // unique: true,
      required: "ID REQUIRED"
    },
    phq_0: {
      type: String,
      required: false
    },
    phq_1: {
      type: String,
      required: false
    },
    phq_2: {
      type: String,
      required: false
    },
    phq_3: {
      type: String,
      required: false
    },
    phq_4: {
      type: String,
      required: false
    },
    phq_5: {
      type: String,
      required: false
    },
    phq_6: {
      type: String,
      required: false
    },
    phq_7: {
      type: String,
      required: false
    },
    phq_8: {
      type: String,
      required: false
    },
    phq_9: {
      type: String,
      required: false
    },
    //코로나19 감염 경험 여부
    covid19Exp: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

const phq9 = mongoose.model("phq9", phq9Schema);
module.exports = phq9;
