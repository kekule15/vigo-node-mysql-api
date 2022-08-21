module.exports = (app) => {
    const comment = require("../controllers/comment_controller");
    var router = require("express").Router();
  
    // Create a new comment
    router.post("/create",  comment.create);
  
    // Retrieve all comments of a post using the post id
    router.get("/getAllComments/:id", comment.findByPostId);

    // Retrieve a single comment with id
    router.get("/getComment/:id", comment.findOne);
  
    // Update a comment with id
    router.put("/:id", comment.update);
  
    // Delete a comment with id
  
    router.delete("/delete/:id", comment.delete);
  
    // Delete all comments
    router.delete("/", comment.deleteAll);
  
    app.use("/api/comment", router);
  };
  