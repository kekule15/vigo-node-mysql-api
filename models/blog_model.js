require("dotenv").config();
const sql = require("../config/db-config");

// User constructor
const BlogPost = function (blogPost) {
  this.userId = blogPost.userId;
  this.title = blogPost.title;
  this.image = blogPost.image;
  this.authorName = blogPost.authorName;
  this.authorImage = blogPost.authorImage;
  this.isCommentActive = blogPost.isCommentActive;
  this.isLikeActive = blogPost.isLikeActive;
  this.isGiftBagActive = blogPost.isGiftBagActive;
  this.totalComments = blogPost.totalComments;
  this.totalLikes = blogPost.totalLikes;
  this.createdAt = blogPost.createdAt;
};
const tableName = 'blogpost'.toString();
const vendorTable = 'vendors'.toString();


BlogPost.create = (newBlogPost, result) => {
  // check if TABLE_NAME blogpost exist. if it exist, do not create it again
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
          sql.query(`INSERT INTO ${tableName} SET ?`, newBlogPost, (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }

            console.log(`created ${tableName}: `, {
              id: res.insertId,
              ...newBlogPost,
            });
            result(null, { id: res.insertId, ...newBlogPost });
          });
        } else {
          var myquery =
            `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, userId INT, title VARCHAR(255), image VARCHAR(200), authorName VARCHAR(20), authorImage VARCHAR(255), isCommentActive BOOLEAN, isLikeActive BOOLEAN, isGiftBagActive BOOLEAN, totalComments INT, totalLikes INT, createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, )`;
          sql.query(myquery, function (err, result) {
            if (err) throw err;
            console.log("Table created");
            // insert into the created table
            sql.query(`INSERT INTO ${tableName} SET ?`, newBlogPost, (err, res) => {
              if (err) {
                
                console.log("error: ", err);
                result(err, null);
                return;
              }

              console.log("created blogpost: ", {
                id: res.insertId,
                ...newBlogPost,
              });
              result(null, { id: res.insertId, ...newBlogPost });
            });
          });
        }
      }
    }
  );
};

BlogPost.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found blogpost: ", res[0]);
      result(null, res[0]);

      return;
    }

    // not found blogPost with the id
    result({ kind: "not_found" }, null);
  });
};

BlogPost.findAllByUserId = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE userId = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found blogpost: ", res);
      result(null, res);
      
      return;
    }

    // not found blogPost with the id
    result({ kind: "not_found" }, null);
  });
};

BlogPost.getAll = (result) => {
  let query = `SELECT * FROM ${tableName}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("BlogPost: ", res);
    result(null, res);
  });
};

BlogPost.updateById = (id, blogPost, result) => {
  sql.query(
    `UPDATE ${tableName} SET ? WHERE id = ?`,
    [blogPost, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found blogPost with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(`updated ${tableName}: `, { id: id, ...blogPost });
      result(null, { id: id, ...blogPost });
    }
  );
};

BlogPost.remove = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found blogPost with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted blogPost with id: ", id);
    result(null, res);
  });
};

BlogPost.removeAll = (result) => {
  sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} BlogPost`);
    result(null, res);
  });
};

module.exports = BlogPost;
