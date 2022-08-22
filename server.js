const express = require("express");
require("dotenv").config();
const db = require("./config/db-config");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// port
const PORT = process.env.PORT || 5000;

//connect to mysql database
db.connect(function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Connected!");
});



// routes

require("./routes/user_vendor_routes")(app);
require("./routes/blogpost_routes")(app);
require("./routes/gift_routes")(app);
require("./routes/comment_routes")(app);
require("./routes/transaction_routes")(app);
require("./routes/likes_routes")(app);

//server
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log("server started");
  }
});
