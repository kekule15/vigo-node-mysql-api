const BlogPost = require("../models/user_model");
const CryptoJS = require("crypto-js");
const { use } = require("../routes/user_routes");
const cloudinary = require("../middleware/cloudinary");

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const result = await cloudinary.uploader.upload(req.file.path);
  const url = result.url;

  // Create a User
  const user = new BlogPost({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: url,
    address: req.body.address,
    password: CryptoJS.AES.encrypt(req.body.password, "secrete").toString(),
    wallet: 0,
    createdAt: new Date().toISOString().slice(0, -1).replace("T", " "),
  });

  // Save user in the database
  BlogPost.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    else
      res.send({
        message: "User registered Successfully",
        data: data,
      });
  });
};

//user login

exports.login = (req, res) => {
  //user credentials

  (email = req.body.email),
    (password = req.body.password),
    BlogPost.login(password, email, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      else {
        
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
              data: data,
            });
          }
      }
    });
};

// Retrieve all BlogPost from the database.
exports.findAll = (req, res) => {
  BlogPost.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving BlogPost.",
      });
    else res.send(data);
  });
};

// Find a single User by Id
exports.findOne = (req, res) => {
  BlogPost.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  BlogPost.updateById(req.params.id, new BlogPost(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating User with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  BlogPost.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.id,
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all BlogPost from the database.
exports.deleteAll = (req, res) => {
  BlogPost.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all BlogPost.",
      });
    else res.send({ message: `All BlogPost were deleted successfully!` });
  });
};
