const express = require("express");
require("dotenv").config();
const cloudinary = require("./middleware/cloudinary");
const upload = require("./middleware/multer");
const cors = require("cors");

const db = require("./config/db-config");
const userRouter = require('./routes/user_routes')

const app = express();
app.use(express.json());

var corOptions = {
  origin: "https://localhost:8081",
};

app.use(cors(corOptions));
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

app.post("/uploadImage", upload.single("image"), async(req, res) => {
  try{
      const result = await cloudinary.uploader.upload(req.file.path);
     const url = result.url;
     console.log(url);
      res.json({
        data: {
          status: "done",
          name: req.body.name
        },
        result : result
      })
  }catch(err){
      console.log(err);
  }
})

// app.use('/api/auth', userRouter)
require("./routes/user_vendor_routes")(app);
require("./routes/blogpost_routes")(app);

//testing api

//server
app.listen(PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log("server started");
  }
});
