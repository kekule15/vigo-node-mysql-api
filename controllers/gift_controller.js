const GiftModel = require("../models/gift_model");
const cloudinary = require("../middleware/cloudinary");
const Transaction = require("../models/transaction_model");

// Create and Save a new gift
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a gift
  const gift = new GiftModel({
    receiverId: req.body.receiverId,
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    senderName: req.body.senderName,
    senderImage: req.body.senderImage,
    senderEmail: req.body.senderEmail,
    quantity: req.body.quantity,
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    userId: req.body.userId,
  });
  console.log(gift);

  GiftModel.create(gift, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the gift.",
      });
    else {
      //Transaction model
      // Data for user sending
      const model = new Transaction({
        debit: "True",
        credit: "False",
        userId: req.body.userId,
        recieverId: req.body.receiverId,
        descritpion: req.body.name,
        amount: req.body.price,
        transactionFee: 0,
        transactionId: "transact0123",
        createdAt: new Date().toISOString().slice(0, -1).replace("T", " "),
      });

      // Save Transaction in the database
      Transaction.create(model, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Transaction.",
          });
        else {
          // do nothing.
        }
      });

      // Data for user recieving
      const recieverModel = new Transaction({
        debit: "False",
        credit: "true",
        userId:req.body.receiverId,
        recieverId: req.body.userId,
        descritpion: req.body.name,
        amount: req.body.price,
        transactionFee: 0,
        transactionId: "transact0123",
        createdAt: new Date().toISOString().slice(0, -1).replace("T", " "),
      });

      // Save Transaction in the database
      Transaction.create(recieverModel, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the Transaction.",
          });
        else {
          // do nothing.
        }
      });
      res.send({
        message: "Success",
        data: data,
      });
    }
  });
};

// Retrieve all gift from the database.
exports.findAll = (req, res) => {
  GiftModel.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving gifts.",
      });
    else res.send(data);
  });
};

// Find all transactions by user Id
exports.findAllByUserId = (req, res) => {
  GiftModel.findAllByUserId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found gifts with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving gifts with id " + req.params.id,
        });
      }
    } else {
      //loop through the list and add all price
      var totalAmount = 0;
      data.forEach((price) => (totalAmount += price.price));
      res.send({
        data: data,
        totalAmount: totalAmount,
        totalGifts: data.length,
      });
    }
  });
};

// Find a single gift by Id
exports.findOne = (req, res) => {
  GiftModel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found gift with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving gift with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a gift identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  GiftModel.updateById(req.params.id, new giftmodel(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found gift with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating gift with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a gift with the specified id in the request
exports.delete = (req, res) => {
  GiftModel.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found gift with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete gif with id " + req.params.id,
        });
      }
    } else res.send({ message: `gift was deleted successfully!` });
  });
};

// Delete all gifts from the database.
exports.deleteAll = (req, res) => {
  GiftModel.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all gifts.",
      });
    else res.send({ message: `All gifts were deleted successfully!` });
  });
};
