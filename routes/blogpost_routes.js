module.exports = (app) => {
  const blogPost = require("../controllers/blog_controller");

  const upload = require("../middleware/multer");

  var router = require("express").Router();

  // Create a new blog
  router.post("/create", upload.single("image"), blogPost.create);

  // Retrieve all blogs
  router.get("/getAllPost", blogPost.findAll);

   // Retrieve all blogs for a user with user id
   router.get("/userpost/:id", blogPost.findAllByUserId);

  // Retrieve a single blog with id
  router.get("/getPost/:id", blogPost.findOne);

  // Update a blog with id
  router.put("/:id", blogPost.update);

  // Delete a blog with id

  router.delete("/:id", blogPost.delete);

  // Delete all blog
  router.delete("/", blogPost.deleteAll);

  app.use("/api/blog", router);
};
