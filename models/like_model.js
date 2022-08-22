require("dotenv").config();
const sql = require("../config/db-config");

// User constructor
const LikePost = function (model) {
  this.userName = model.userName;
  this.userImage = model.userImage;
  this.userId = model.userId;
  this.postId = model.postId;
};
const tableName = "likes".toString();

LikePost.create = (likes, result) => {
  // check if TABLE_NAME likes exist. if it exist, do not create it again
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
          sql.query(`INSERT INTO ${tableName} SET ?`, likes, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }

            console.log(`added ${tableName}: `, {
              id: res.insertId,
              ...likes,
            });
            result(null, { id: res.insertId, ...likes });
          });
        } else {
          var myquery = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, userName VARCHAR(255), userImage VARCHAR(255), userId INT(11), postId INT(11),)`;
          sql.query(myquery, function (err, result) {
            if (err) throw err;
            console.log("Table created");
            // insert into the created table
            sql.query(`INSERT INTO ${tableName} SET ?`, likes, (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }
              console.log(`created ${tableName}: `, {
                id: res.insertId,
                ...likes,
              });
              result(null, { id: res.insertId, ...likes });
            });
          });
        }
      }
    }
  );
};

// get all likes for a post using the post Id
LikePost.findByPostId = (id, result) => {
    sql.query(`SELECT * FROM ${tableName} WHERE postId = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found Likes: ", res);
        result(null, res);
        
        return;
      }

      // not found likes with the id
      result({ kind: "not_found" }, null);
    });
  };

 // get a like for a particular post using the like id
  LikePost.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found likes: ", res);
      result(null, res[0]);
      return;
    }

    // not found likes with the id
    result({ kind: "not_found" }, null);
  });
};

// retrieve all likes of different posts from database
LikePost.getAll = (result) => {
  let query = `SELECT * FROM ${tableName}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("likes: ", res);
    result(null, res);
  });
};


LikePost.remove = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE userId = ?`, [id], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found like with the user Id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted like with UserId: ", id);
    result(null, res);
  });
};

LikePost.removeAll = (result) => {
  sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} likes`);
    result(null, res);
  });
};

module.exports = LikePost;
