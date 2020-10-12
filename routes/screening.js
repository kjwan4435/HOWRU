const screeningRouter = require("express").Router();

const getResponse = require('./getResponse.js');
const getResponseDemoDaily = require('./getResponseDemoDaily.js');
const getResponseDemoFeedback = require('./getResponseDemoFeedback.js');

screeningRouter.post("/0", function (req, res) {
  // Immediately-invoked function: -> getResponse 함수로부터 값을 받은 뒤 res.status(200).send 실행하는 것을 보장하기 위해 async - await 사용
  (async function(){
    try{
      const response = await getResponse(req.body);
      await res.status(200).send(response); //Does res.send() provide promise? it seems not.. (no need await)
    } catch(err) {
        console.log('post/0 error, ', err); // 에러처리 로직
    }
  })()

});


// Test block: daily block
// block id is:
screeningRouter.post("/demoDaily", function (req, res) {
  (async function(){
    const response = await getResponseDemoDaily(req.body);
    await res.status(200).send(response);
  })()
});

// Test block: daily block
// block id is:
screeningRouter.post("/demoFeedback", function (req, res) {
  (async function(){
    const response = await getResponseDemoFeedback(req.body);
    await res.status(200).send(response);
  })()
});

module.exports = screeningRouter;
