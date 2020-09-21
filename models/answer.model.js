const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    id: {
      type: String,
      required: "ID REQUIRED"
    },
    question: {
      type: String,
      required: true
    },
    blockid: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

const answer = mongoose.model("answer", answerSchema);
module.exports = answer;
