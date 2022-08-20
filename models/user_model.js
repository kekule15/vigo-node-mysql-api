require("dotenv").config();
const sql = require("../config/db-config");

// User constructor
const Users = function (user) {
  this.name = user.name;
  this.email = user.email;
  this.phone = user.phone;
  this.image = user.image;
  this.address = user.address;
  this.password = user.password;
  this.wallet = user.wallet;
  this.createdAt = user.createdAt;
};

Users.create = (newUsers, result) => {
  // check if TABLE_NAME vendors exist. if it exist, do not create it again
  sql.query(
    `SELECT count(*)
      FROM information_schema.TABLES
      WHERE TABLE_NAME = 'vendors';
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
          sql.query("INSERT INTO vendors SET ?", newUsers, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }

            console.log("created vendors: ", { id: res.insertId, ...newUsers });
            result(null, { id: res.insertId, ...newUsers });
          });
        } else {
          var myquery =
            "CREATE TABLE vendors (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(200) NOT NULL UNIQUE, phone VARCHAR(20), image VARCHAR(255), address VARCHAR(255), password VARCHAR(255),  wallet INT(10), createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )";
          sql.query(myquery, function (err, result) {
            if (err) throw err;
            console.log("Table created");
            // insert into the created table
            sql.query("INSERT INTO vendors SET ?", newUsers, (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }

              console.log("created vendors: ", {
                id: res.insertId,
                ...newUsers,
              });
              result(null, { id: res.insertId, ...newUsers });
            });
          });
        }
      }
    }
  );
};

// // login
Users.login = (password, email, result) => {
  sql.query(
    `SELECT * FROM vendors WHERE password = ? OR  email = ?`,
    [password, email],
    async function (err, data) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
    else{
        result(null, data[0]);

      }
    }
  );
};

Users.findById = (id, result) => {
  sql.query(`SELECT * FROM vendors WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found vendors: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found user with the id
    result({ kind: "not_found" }, null);
  });
};

Users.getAll = (result) => {
  let query = "SELECT * FROM vendors";

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

Users.updateById = (id, user, result) => {
  sql.query("UPDATE vendors SET ? WHERE id = ?", [user, id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated user: ", { id: id, ...user });
    result(null, { id: id, ...user });
  });
};

Users.remove = (id, result) => {
  sql.query("DELETE FROM vendors WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

Users.removeAll = (result) => {
  sql.query("DELETE FROM vendors", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

module.exports = Users;
