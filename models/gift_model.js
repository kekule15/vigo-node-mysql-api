require("dotenv").config();
const sql = require("../config/db-config");

// User constructor
const GiftModel = function (gift) {
  this.receiverId = gift.receiverId;
  this.name = gift.name;
  this.image = gift.image;
  this.price = gift.price;
  this.senderName = gift.senderName;
  this.senderImage = gift.senderImage;
  this.senderEmail = gift.senderEmail;
  this.quantity = gift.quantity;
  this.createdAt = gift.createdAt;
};
const tableName = "gift".toString();
GiftModel.create = async(newgiftmodel, result) => {
  // check if TABLE_NAME gifts exist. if it exist, do not create it again
  console.log(tableName);
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
            newgiftmodel,
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }

              console.log(`created ${tableName}: `, {
                id: res.insertId,
                ...newgiftmodel,
              });
              result(null, { id: res.insertId, ...newgiftmodel });
            }
          );
        } else {
        
            var myquery = "CREATE TABLE gift (id INT AUTO_INCREMENT PRIMARY KEY, receiverId INT(11), name VARCHAR(255), image VARCHAR(200), price INT(20), senderName VARCHAR(20), senderImage VARCHAR(255), senderEmail VARCHAR(255), quantity INT(20), createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, )";
            console.log('my data');
            sql.query(myquery, function (err, result) {
                if (err) throw err;
                console.log("Table created");
                // insert into the created table
                sql.query(
                  `INSERT INTO ${tableName} SET ?`,
                  newgiftmodel,
                  (err, res) => {
                    if (err) {
                      console.log("error: ", err);
                      result(err, null);
                      return;
                    }
    
                    console.log("created blogpost: ", {
                      id: res.insertId,
                      ...newgiftmodel,
                    });
                    result(null, { id: res.insertId, ...newgiftmodel });
                  }
                );
              });
           
        }
      }
    }
  );
};
// Find a single gift by Id
GiftModel.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found giftmodel: ", res[0]);
      result(null, res[0]);

      return;
    }

    // not found giftmodel with the id
    result({ kind: "not_found" }, null);
  });
};

GiftModel.findAllByUserId = (id, result) => {
  sql.query(
    `SELECT * FROM ${tableName} WHERE receiverId = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found giftmodel: ", res);
        result(null, res);

        return;
      }

      // not found gift with the id
      result({ kind: "not_found" }, null);
    }
  );
};

GiftModel.getAll = (result) => {
  let query = `SELECT * FROM ${tableName}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("giftmodel: ", res);
    result(null, res);
  });
};

GiftModel.updateById = (id, giftmodel, result) => {
  sql.query(
    `UPDATE ${tableName} SET ? WHERE id = ?`,
    [giftmodel, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found gift with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(`updated ${tableName}: `, { id: id, ...giftmodel });
      result(null, { id: id, ...giftmodel });
    }
  );
};

GiftModel.remove = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found gift with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted giftmodel with id: ", id);
    result(null, res);
  });
};

GiftModel.removeAll = (result) => {
  sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} giftmodel`);
    result(null, res);
  });
};

module.exports = GiftModel;
