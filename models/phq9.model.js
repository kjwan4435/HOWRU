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
    phq9_0: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_1: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_2: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_3: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_4: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_5: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_6: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_7: {
      type: String,
      required: true,
      default: "-"
    },
    phq9_8: {
      type: String,
      required: true,
      default: "-"
    },
    //코로나19 감염 경험 여부
    phq9_9: {
      type: String,
      required: true,
      default: "-"
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
);

const phq9 = mongoose.model("phq9", phq9Schema);
module.exports = phq9;
