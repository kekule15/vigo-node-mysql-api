require("dotenv").config();
const sql = require("../config/db-config");

// Transaction constructor
const Transaction = function (model) {
  this.debit = model.debit;
  this.credit = model.credit;
  this.userId = model.userId;
  this.recieverId = model.recieverId;
  this.descritpion = model.descritpion;
  this.amount = model.amount;
  this.transactionFee = model.transactionFee;
  this.transactionId = model.transactionId;
  this.createdAt = model.createdAt;
};

const tableName = "transaction".toString();

Transaction.create = (newTransaction, result) => {
  // check if TABLE_NAME transaction exist. if it exist, do not create it again
  sql.query(
    `SELECT count(*)
      FROM information_schema.TABLES
      WHERE TABLE_NAME = '${tableName}';
      `,
    (error, results) => {
      if (error) console.log(error);
      console.log(results[0]);
      const myMap = new Map(Object.entries(results[0]));
      if (myMap instanceof Map) {
        //check if table exits
        let tableExist = myMap.get("count(*)");
        //console.log(myMap.get("count(*)"));
        if (tableExist === 1) {
          // do not create the table again
          // insert into the created table
          
          sql.query(
            `INSERT INTO ${tableName} SET ?`,
            newTransaction,
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }

              console.log(`created ${tableName}: `, {
                id: res.insertId,
                ...newTransaction,
              });
              result(null, { id: res.insertId, ...newTransaction });
            }
          );
        } else {
          var myquery = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, debit VARCHAR(255), credit VARCHAR(200), userId INT(255), recieverId INT(255), descritpion VARCHAR(200), amount INT(255), transactionFee INT(255), transactionId VARCHAR(255), createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )`;
          sql.query(myquery, function (err, result) {
            if (err) throw err;
            console.log("Table created");
            // insert into the created table
            sql.query(
              `INSERT INTO ${tableName} SET ?`,
              newTransaction,
              (err, res) => {
                if (err) {
                  console.log("error: ", err);
                  result(err, null);
                  return;
                }

                console.log(`created ${tableName}: `, {
                  id: res.insertId,
                  ...newTransaction,
                });
                result(null, { id: res.insertId, ...newTransaction });
              }
            );
          });
        }
      }
    }
  );
};
 // get one transaction
Transaction.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log(`found ${tableName}: `, res[0]);
      result(null, res[0]);
      return;
    }

    // not found transaction data with the id
    result({ kind: "not_found" }, null);
  });
};

 // get all user transactions using the Id
 Transaction.findByUserId = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE userId = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log(`found ${tableName}: `, res[0]);
      result(null, res[0]);
      return;
    }

    // not found transaction data with the id
    result({ kind: "not_found" }, null);
  });
};

// get all transactions
Transaction.getAll = (result) => {
  let query = `SELECT * FROM ${tableName}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("transactions: ", res);
    result(null, res);
  });
};

Transaction.updateById = (id, transaction, result) => {
  sql.query(
    `UPDATE ${tableName} SET ? WHERE id = ?`,
    [transaction, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found transaction with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated transaction data: ", { id: id, ...transaction });
      result(null, { id: id, ...transaction });
    }
  );
};

Transaction.remove = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found transaction with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

Transaction.removeAll = (result) => {
  sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} transactions`);
    result(null, res);
  });
};

module.exports = Transaction;
