const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const db = require("./db");

const userRouter = require("./routes/user");
const screeningRouter = require("./routes/screening");

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/user", userRouter);
app.use("/screening", screeningRouter);

app.listen(PORT, function () {
  console.log(`💛 KAKAO CHATBOT SERVER IS RUNNING ON ${PORT}`);
});
