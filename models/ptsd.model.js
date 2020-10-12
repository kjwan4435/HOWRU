const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ptsdSchema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      required: true
    },
    ptsd_0: {
      type: String,
      required: true,
      default: "-"
    },
    ptsd_1: {
      type: String,
      required: true,
      default: "-"
    },
    ptsd_2: {
      type: String,
      required: true,
      default: "-"
    },
    ptsd_3: {
      type: String,
      required: true,
      default: "-"
    },
    ptsd_4: {
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

const ptsd = mongoose.model("ptsd", ptsdSchema);
module.exports = ptsd;
