require("dotenv").config();
const sql = require("../config/db-config");

// User constructor
const Comment = function (model) {
  this.comment = model.comment;
  this.userId = model.userId;
  this.postId = model.postId;
  this.userImage = model.userImage;
  this.createdAt = model.createdAt;
};
const tableName = "comments".toString();

Comment.create = (comment, result) => {
  // check if TABLE_NAME comments exist. if it exist, do not create it again
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
          sql.query(`INSERT INTO ${tableName} SET ?`, comment, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }

            console.log(`added ${tableName}: `, {
              id: res.insertId,
              ...comment,
            });
            result(null, { id: res.insertId, ...comment });
          });
        } else {
          var myquery = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, comment VARCHAR(255), userId INT(11), postId INT(11), userImage VARCHAR(20), createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )`;
          sql.query(myquery, function (err, result) {
            if (err) throw err;
            console.log("Table created");
            // insert into the created table
            sql.query(`INSERT INTO ${tableName} SET ?`, comment, (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }
              console.log(`created ${tableName}: `, {
                id: res.insertId,
                ...comment,
              });
              result(null, { id: res.insertId, ...comment });
            });
          });
        }
      }
    }
  );
};
Comment.findByPostId = (id, result) => {
    sql.query(`SELECT * FROM ${tableName} WHERE postId = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found comment: ", res);
        result(null, res);
        return;
      }

      // not found comment with the id
      result({ kind: "not_found" }, null);
    });
  };


Comment.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found comment: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found comment with the id
    result({ kind: "not_found" }, null);
  });
};

Comment.getAll = (result) => {
  let query = `SELECT * FROM ${tableName}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("comment: ", res);
    result(null, res);
  });
};

Comment.updateById = (id, comment, result) => {
  sql.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [comment, id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found comment with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated comment: ", { id: id, ...comment });
    result(null, { id: id, ...comment });
  });
};

Comment.remove = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, [id], (err, res) => {
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

    console.log("deleted comment with id: ", id);
    result(null, res);
  });
};

Comment.removeAll = (result) => {
  sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} comments`);
    result(null, res);
  });
};

module.exports = Comment;
