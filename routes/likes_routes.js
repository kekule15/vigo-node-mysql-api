module.exports = (app) => {
    const likePost = require("../controllers/likes_controller");
    var router = require("express").Router();
  
    // Create a new comment
    router.post("/add",  likePost.create);
  
    // Retrieve all Likes of a post using the post id
    router.get("/getAllLikes/:id", likePost.findByPostId);

    // Retrieve a single comment with id
    router.get("/getSingle/:id", likePost.findOne);

    // Delete a comment with id
  
    router.delete("/delete/:id", likePost.delete);
  
    // Delete all comments
    router.delete("/deleteAll", likePost.deleteAll);
  
    app.use("/api/like", router);
  };
  