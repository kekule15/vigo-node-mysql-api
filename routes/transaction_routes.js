module.exports = (app) => {
    const transactions = require("../controllers/transaction_controller");
    var router = require("express").Router();
  
    // Retrieve all transactions
    router.get("/getAllTransactions", transactions.findAll);
  
     // Retrieve all transactions for user using the user id
     router.get("/UsersTransactions/:id", transactions.findByUserId);
     
    // Retrieve a single transaction with id
    router.get("/getOne/:id", transactions.findOne);
  
    // Update a transaction with id
    router.put("/update/:id", transactions.update);
  
    // Delete a transaction with id
  
    router.delete("/delete/:id", transactions.delete);
  
    // Delete all transactions
    router.delete("/deleteAll", transactions.deleteAll);
  
    app.use("/api/transactions", router);
  };
  