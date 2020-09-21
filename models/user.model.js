const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: "ID REQUIRED"
    },
    resDateArray: {
      type: Array,
      required: true
    },
    sleepCounter: {
      type: Number,
      required: true
    },
    activityCounter: {
      type: Number,
      required: true
    },
    moodCounter: {
      type: Number,
      required: true
    },
    foodCounter: {
      type: Number,
      required: true
    },
    socialCounter: {
      type: Number,
      required: true
    },
    sleepScore: {
      type: Number,
      required: true
    },
    activityScore: {
      type: Number,
      required: true
    },
    moodScore: {
      type: Number,
      required: true
    },
    foodScore: {
      type: Number,
      required: true
    },
    socialScore: {
      type: Number,
      required: true
    },
    totalScore: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
