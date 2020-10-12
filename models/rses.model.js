const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rsesSchema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      required: true
    },
    rses_0: {
      type: String,
      required: true,
      default: "-"
    },
    rses_1: {
      type: String,
      required: true,
      default: "-"
    },
    rses_2: {
      type: String,
      required: true,
      default: "-"
    },
    rses_3: {
      type: String,
      required: true,
      default: "-"
    },
    rses_4: {
      type: String,
      required: true,
      default: "-"
    },
    rses_5: {
      type: String,
      required: true,
      default: "-"
    },
    rses_6: {
      type: String,
      required: true,
      default: "-"
    },
    rses_7: {
      type: String,
      required: true,
      default: "-"
    },
    rses_8: {
      type: String,
      required: true,
      default: "-"
    },
    //코로나19 감염 경험 여부
    rses_9: {
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

const rses = mongoose.model("rses", rsesSchema);
module.exports = rses;
