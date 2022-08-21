const Transaction = require("../models/transaction_model");

// Retrieve all Transactions from the database.
exports.findAll = (req, res) => {
    Transaction.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Transaction.",
      });
    else res.send(data);
  });
};

// Find a single Transaction by Id
exports.findByUserId = (req, res) => {
  Transaction.findByUserId(req.params.id, (err, data) => {
  if (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Transactions with  User id ${req.params.id}.`,
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Transactions with User id " + req.params.id,
      });
    }
  } else res.send(data);
});
};

// Find a single Transaction by Id
exports.findOne = (req, res) => {
    Transaction.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Transaction with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Transaction with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a Transaction identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  console.log(req.body);

  BlogPost.updateById(req.params.id, new BlogPost(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating User with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  BlogPost.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.id,
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all BlogPost from the database.
exports.deleteAll = (req, res) => {
  BlogPost.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all BlogPost.",
      });
    else res.send({ message: `All BlogPost were deleted successfully!` });
  });
};
