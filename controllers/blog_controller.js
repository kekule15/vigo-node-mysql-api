const BlogPost = require("../models/blog_model");
const cloudinary = require("../middleware/cloudinary");


// Create and Save a new blogpost
exports.create = async(req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const result = await cloudinary.uploader.upload(req.file.path);
  const url = result.url;

  // Create a blogpost
 
  const blogpost = new BlogPost({
    userId: req.body.userId,
    title: req.body.title,
    image: url,
    authorName: req.body.authorName,
    authorImage: req.body.authorImage,
    isCommentActive: req.body.isCommentActive,
    isLikeActive: req.body.isLikeActive,
    isGiftBagActive: req.body.isGiftBagActive,
    totalComments: 0,
    totalLikes: 0,
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
  });
  console.log(blogpost);

  // Save blogpost in the database
  // await cloudinary.uploader.upload(req.file.filename);

  BlogPost.create(blogpost, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the blogpost.",
      });
    else
      res.send({
        message: "blogpost added Successfully",
        data: data,
      });
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

// Find all blogpost by user Id
exports.findAllByUserId = (req, res) => {
  BlogPost.findAllByUserId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found blogpost with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving blogpost with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Find a single blogpost by Id
exports.findOne = (req, res) => {
  BlogPost.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found blogpost with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving blogpost with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a blogpost identified by the id in the request
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
          message: `Not found blogpost with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating blogpost with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a blogpost with the specified id in the request
exports.delete = (req, res) => {
  BlogPost.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found blogpost with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete blogpost with id " + req.params.id,
        });
      }
    } else res.send({ message: `blogpost was deleted successfully!` });
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
