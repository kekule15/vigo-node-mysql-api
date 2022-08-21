const Comment = require("../models/comment_model");
const sql = require("../config/db-config");
const blogPost = require("../controllers/blog_controller");

// Create and Save a new comment
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a comment
  const comment = new Comment({
    comment: req.body.comment,
    userId: req.body.userId,
    postId: req.body.postId,
    userImage: req.body.userImage,
    createdAt: new Date().toISOString().slice(0, -1).replace("T", " "),
  });

  // Save comment in the database
  Comment.create(comment, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    } else {
      var sqlString = `SELECT * FROM blogpost WHERE id =  ${req.body.postId}`;

      sql.query(sqlString, function (err, result) {
        if (err) throw err;
        console.log(result);
        var comment = parseInt(result[0].totalComments.toString());
        console.log(comment);
        var counter = comment + 1;
        console.log(`my counter ${counter}`);
        // update a post comment counter
        let myquery = `UPDATE blogpost
           SET totalComments = ?
           WHERE id = ?`;

        sql.query(myquery, [counter, req.body.postId], function (err, result) {
          if (err) throw err;
          //console.log(result);
        });
      });

      res.send({
        message: "Comment added Successfully",
        data: data,
      });
    }
  });
};

// Retrieve all comments from the database.
exports.findAll = (req, res) => {
  Comment.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving BlogPost.",
      });
    else res.send(data);
  });
};
// Retrieve all comments from the database using the post id
exports.findByPostId = (req, res) => {
  Comment.findByPostId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Comment with post id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Comment with post id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Find a single comment by Id
exports.findOne = (req, res) => {
  Comment.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Comment with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Comment with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a comment identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  Comment.updateById(req.params.id, new Comment(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Comment with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Comment with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a comment with the specified id in the request
exports.delete = (req, res) => {
  Comment.remove(req.params.id, (err, data) => {
    if (err) {
      console.log(err);
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Comment with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Comment with id " + req.params.id,
        });
      }
    } else {

      var sqlString = `SELECT * FROM blogpost WHERE id =  ${req.body.postId}`;

      sql.query(sqlString, function (err, result) {
        if (err) throw err;
        console.log(result);
        var comment = parseInt(result[0].totalComments.toString());
        console.log(comment);
        var counter = comment - 1;
        console.log(`my counter ${counter}`);
        // update a post comment counter
        let myquery = `UPDATE blogpost
           SET totalComments = ?
           WHERE id = ?`;

        sql.query(myquery, [counter, req.body.postId], function (err, result) {
          if (err) throw err;
          //console.log(result);
        });
      });
      console.log(data);

      res.send({ message: `Comment was deleted successfully!` });
    }
  });
};

// Delete all Comments from the database.
exports.deleteAll = (req, res) => {
  Comment.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Comments.",
      });
    else res.send({ message: `All Comments were deleted successfully!` });
  });
};
