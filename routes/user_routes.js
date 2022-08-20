const express = require("express");
require("dotenv").config();
// var bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");

const db = require("../config/db-config");

const router = express.Router();


// register api
router.post("/register", (req, res, next) => {
  const password = CryptoJS.AES.encrypt(
    req.body.password,
    "secrete"
  ).toString();
  //   console.log(new Date().toISOString().slice(0, 19).replace('T', ' '));
  //   console.log(`my hashed password ${password}`);
  var createdAT = new Date().toISOString().slice(0, 19).replace("T", " ");
  const user_wallet = 0;
  const { name, address, user_email, user_image } = req.body;

  var sql =
    "INSERT INTO riders (name, password, address, user_email, user_image, user_wallet, createdAT) VALUES ?";
  var data = [
    [name, password, address, user_email, user_image, user_wallet, createdAT],
  ];
  db.query(sql, [data], function (err, result) {
    if (err) throw err;
    console.log("1 User registered");

    res.json({
      message: "User created Succesfully",
      data: {
        name: name,
        password: password,
        address: address,
        image: user_image,
        email: user_email,
        wallet: user_wallet,
        createdAT: createdAT,
      },
    });
  });
});

// login Api
router.post("/login", async (req, res, next) => {
  var password = req.body.password;
  var email = req.body.email;
  var sql = `SELECT * FROM riders WHERE password = ? OR  user_email = ?`;
  db.query(sql, [password, email], async function (err, result) {
    if (err) throw err;
    //console.log(result[0]);
    if (result[0] === undefined) {
      // user not found
      res.json({
        message: "User not found",
      });
    } else {
      //assign users response to data variable;
      var data = result[0];
      console.log(`my stored password ${data["password"]}`);
      const hashedPassword = CryptoJS.AES.decrypt(
        data["password"],
        "secrete"
      ).toString(CryptoJS.enc.Utf8);
      console.log(`my hashed password ${hashedPassword}`);
      if (password !== hashedPassword) {
        res.json({
          message: "User Credentials not Correct",
        });
      } else {
        res.json({
          message: "Log in succesful",
          data: result[0],
        });
      }
    }
  });
});

// get all users
router.get("/getAllUsers", (req, res, next) => {
  var sql = "SELECT * FROM riders";
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.json({
      message: "Success",
      data: result,
    });
  });
});

// get one user by ID
router.get("/getOneUser/:id", (req, res, next) => {
  var postId = req.params.id;
  var sql = `SELECT * FROM riders WHERE id =  ${postId}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json({
      message: "Success",
      data: result[0],
    });
  });
});

// update user
router.put("/updateUser/", (req, res, next) => {
  var postId = req.body.id;
  var name = req.body.name;
  var address = req.body.address;
  var sql = `UPDATE riders SET address = ?, name = ? WHERE id = ${postId}`;
  let data = [address, name];
  db.query(sql, data, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.json({
      message: "Fields Updated Successfully",
      data: result,
    });
  });
});

module.exports = router;
