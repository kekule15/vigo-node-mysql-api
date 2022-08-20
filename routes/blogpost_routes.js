module.exports = (app) => {
  const blogPost = require("../controllers/blog_controller");

  const upload = require("../middleware/multer");

  var router = require("express").Router();

  // Create a new User
  router.post("/create", upload.single("image"), blogPost.create);

  // Retrieve all blogPost
  router.get("/getAllPost", blogPost.findAll);

   // Retrieve a single User with id
   router.get("/userpost/:id", blogPost.findAllByUserId);

  // Retrieve a single User with id
  router.get("/getPost/:id", blogPost.findOne);

  // Update a User with id
  router.put("/:id", blogPost.update);

  // Delete a User with id

  router.delete("/:id", blogPost.delete);

  // Delete all blogPost
  router.delete("/", blogPost.deleteAll);

  app.use("/api/blog", router);
};
