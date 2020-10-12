const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const isiSchema = new Schema(
  {
    // kakao id
    id: {
      type: String,
      required: true
    },
    isi_0: {
      type: String,
      required: true,
      default: "-"
    },
    isi_1: {
      type: String,
      required: true,
      default: "-"
    },
    isi_2: {
      type: String,
      required: true,
      default: "-"
    },
    isi_3: {
      type: String,
      required: true,
      default: "-"
    },
    isi_4: {
      type: String,
      required: true,
      default: "-"
    },
    isi_5: {
      type: String,
      required: true,
      default: "-"
    },
    isi_6: {
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

const isi = mongoose.model("isi", isiSchema);
module.exports = isi;
