module.exports = (app) => {
    const gifts = require("../controllers/gift_controller");
    const upload = require("../middleware/multer");
    var router = require("express").Router();
  
    // Create a new gift
    router.post("/create",  gifts.create);
  
    // Retrieve all gifts
    router.get("/getAllGifts", gifts.findAll);
  
     // Retrieve all gifts for user using the user id
     router.get("/usersGift/:id", gifts.findAllByUserId);
     
    // Retrieve a single gift with id
    router.get("/getOneGift/:id", gifts.findOne);
  
    // Update a gift with id
    router.put("/:id", gifts.update);
  
    // Delete a gift with id
  
    router.delete("/:id", gifts.delete);
  
    // Delete all gifts
    router.delete("/", gifts.deleteAll);
  
    app.use("/api/gift", router);
  };
  