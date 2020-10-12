const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//block	blockItem	emotionStatus	age	sex	botText	buttonLabel	buttonMessage	nextBlock	comment
const responseSchema = new Schema(
  {
    block: {
      type: String,
      required: true
    },
    blockItem: {
      type: String,
      required: true
    },
    emotionStatus: {
      type: String,
      required: true,
      default: "WELCOME"
    },
    age: {
      type: String,
      required: true,
      default: "-"
    },
    sex: {
      type: String,
      required: true,
      default: "SET_START"
    },
    botText: {
      type: String,
      required: true,
      default: "-"
    },
    buttonLabel: {
      type: String,
      required: true,
      default: 0
    },
    buttonMessage: {
      type: String,
      required: true,
      default: "-"
    },
    nextBlock: {
      type: String,
      required: true,
      default: "-"
    },
    comment: {
      type: String,
      required: true,
      default: "-"
    }
  },
  { timestamps: true }
);

const response = mongoose.model("response", responseSchema);
module.exports = response;
