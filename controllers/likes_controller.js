const LikePost = require("../models/like_model");
const sql = require("../config/db-config");
const blogPost = require("../controllers/blog_controller");

// Add, Save and delete  a new like
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // add a like
  const model = new LikePost({
    userName: req.body.userName,
    userImage: req.body.userImage,
    userId: req.body.userId,
    postId: req.body.postId,
  });

  //check if user has liked a post.
  LikePost.findByPostId(req.body.postId, (err, data) => {
    if (err) {
      // if like database is empty : meaning no one has liked this post
      if (err.kind === "not_found") {
        // Add like to the database

        LikePost.create(model, (err, data) => {
          if (err) {
            res.status(500).send({
              message:
                err.message || "Some error occurred while liking this post.",
            });
          } else {
            var sqlString = `SELECT * FROM blogpost WHERE id =  ${req.body.postId}`;

            sql.query(sqlString, function (err, result) {
              if (err) throw err;
              console.log(result);
              var comment = parseInt(result[0].totalLikes.toString());
              console.log(comment);
              var counter = comment + 1;
              console.log(`my counter ${counter}`);
              // update a post comment counter
              let myquery = `UPDATE blogpost
           SET totalLikes = ?
           WHERE id = ?`;

              sql.query(
                myquery,
                [counter, req.body.postId],
                function (err, result) {
                  if (err) throw err;
                  //console.log(result);
                }
              );
            });

            res.send({
              message: "You liked this Post",
              data: data,
            });
          }
        });
      } else {
        console.log(" second error occured");
      }
    }
    //  like database is not empty.
    else {
      // now loop through the returned list and get user id.

      for (let index = 0; index < data.length; index++) {
        if (data[index].userId === req.body.userId) {
          console.log(data[index].userId);
          console.log("user id exists", req.body.userId);
          //console.log(data);
          // delete the existing like using the user Id

          LikePost.remove(req.body.userId, (err, data) => {
            if (err) {
              console.log(err);
              if (err.kind === "not_found") {
                console.log(`Not found Like with userId ${req.body.userId}.`);
              } else {
                res.status(405).send({
                  message:
                    err.message ||
                    "Could not delete like with userId ${req.body.userId}",
                });
              }
            } else {
              var sqlString = `SELECT * FROM blogpost WHERE id =  ${req.body.postId}`;

              sql.query(sqlString, function (err, result) {
                if (err) throw err;
                console.log(result);
                var comment = parseInt(result[0].totalLikes.toString());
                console.log(comment);
                var counter = comment - 1;
                console.log(`my counter ${counter}`);
                // update a post comment counter
                let myquery = `UPDATE blogpost
                     SET totalLikes = ?
                     WHERE id = ?`;

                sql.query(
                  myquery,
                  [counter, req.body.postId],
                  function (err, result) {
                    if (err) throw err;
                    //console.log(result);
                  }
                );
              });
              //console.log(data);

              res.status(200).send({ message: `Like removed successfully!` });
            }
          });
        } else {
          console.log("user id not existing", req.body.userId);
          console.log(data);
          LikePost.create(model, (err, newLike) => {
            if (err) {
              res.status(405).send({
                message:
                  err.message || "Some error occurred while liking this post.",
              });
            } else {
              var sqlString = `SELECT * FROM blogpost WHERE id =  ${req.body.postId}`;

              sql.query(sqlString, function (err, result) {
                if (err) throw err;
                console.log(result);
                var comment = parseInt(result[0].totalLikes.toString());
                console.log(comment);
                var counter = comment + 1;
                console.log(`my counter ${counter}`);
                // update a post comment counter
                let myquery = `UPDATE blogpost
                 SET totalLikes = ?
                 WHERE id = ?`;

                sql.query(
                  myquery,
                  [counter, req.body.postId],
                  function (err, result) {
                    if (err) throw err;
                    //console.log(result);
                  }
                );
              });

              res.send({
                message: "You liked this Post",
                data: newLike,
              });
            }
          });
        }
      }
      return data;
    }
  });
};

// Retrieve all likes from the database.
exports.findAll = (req, res) => {
  LikePost.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving BlogPost.",
      });
    else res.send(data);
  });
};

// will not be used
// Retrieve all likes from the database using the post id
exports.findByPostId = (req, res) => {
  LikePost.findByPostId(req.params.id, (err, data) => {
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

// Find a single like by Id
exports.findOne = (req, res) => {
  LikePost.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found like with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving like with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a like with the specified id in the request
exports.delete = (req, res) => {
  LikePost.remove(req.params.id, (err, data) => {
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

// Delete all likes from the database.
exports.deleteAll = (req, res) => {
  LikePost.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Likes.",
      });
    else res.send({ message: `All Likes were deleted successfully!` });
  });
};
