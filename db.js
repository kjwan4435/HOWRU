const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const db = mongoose.connection;

function handleOpen() {
  console.log("✅ connect to DB");
}
function handleError(error) {
  console.log(`❌ connection DB ERROR: ${error}`);
}

db.once("open", handleOpen);
db.on("error", handleError);
