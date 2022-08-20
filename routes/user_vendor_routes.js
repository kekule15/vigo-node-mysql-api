module.exports = app => {
    const users = require("../controllers/user_controller");
    const upload = require("../middleware/multer");
    var router = require("express").Router();
    
  
    // Create a new User
    router.post("/register", upload.single("image"),users.create);

     // login a new User
    router.post("/login", users.login);
  
    // Retrieve all users
    router.get("/getUsers", users.findAll);
  
    // Retrieve a single User with id
    router.get("/:id", users.findOne);
  
    // Update a User with id
    router.put("/:id", users.update);
  
    // Delete a User with id
    router.delete("/:id", users.delete);
  
    // Delete all users
    router.delete("/", users.deleteAll);
  
    app.use('/api/users', router);
  };