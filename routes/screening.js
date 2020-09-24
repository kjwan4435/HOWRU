const screeningRouter = require("express").Router();

const getResponse = require('./getResponse.js');

// let result = require("../models/answer.model");

screeningRouter.post("/0", function (req, res) {
  // const question = req.body.userRequest.block.name;
  // const blockid = req.body.userRequest.block.id;
  // const answer = req.body.userRequest.utterance;
  // const category = "mood";
  // const id = req.body.userRequest.user.id;
  // const date = new Date().toLocaleDateString("en-US");
  //
  // // console.log(req.body);
  //
  // const Answer = new result({
  //   question,
  //   blockid,
  //   answer,
  //   category,
  //   id,
  //   date
  // });
  //
  // Answer.save()
  //   .then(() => console.log("Answer was saved"))
  //   .catch((err) => console.log(`Error: ${err}`));

  getResponse(req.body).then(function(result){
    res.status(200).send(result);
  }).catch(function(err){
    console.log(err);
  })

});

module.exports = screeningRouter;
