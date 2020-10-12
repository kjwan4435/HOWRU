const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gad7Schema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      required: true
    },
    gad7_0: {
      type: String,
      required: true,
      default: "-"
    },
    gad7_1: {
      type: String,
      required: true,
      default: "-"
    },
    gad7_2: {
      type: String,
      required: true,
      default: "-"
    },
    gad7_3: {
      type: String,
      required: true,
      default: "-"
    },
    gad7_4: {
      type: String,
      required: true,
      default: "-"
    },
    gad7_5: {
      type: String,
      required: true,
      default: "-"
    },
    gad7_6: {
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

const gad7 = mongoose.model("gad7", gad7Schema);
module.exports = gad7;
