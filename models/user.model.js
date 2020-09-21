const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: "ID REQUIRED"
    },
    status: {
      type: String,
      required: false
    },
    age: {
      type: Number,
      required: false
    },
    sex: {
      type: String,
      required: false
    },
    region: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
