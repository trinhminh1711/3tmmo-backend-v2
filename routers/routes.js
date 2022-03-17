module.exports = app => {
  const customers = require("../controllers/controller");
  const login = require("../controllers/login");
  const partner = require("../controllers/partners");
  const notifications = require("../controllers/notifications");
  const password = require("../controllers/password");
  const posterity = require("../controllers/posterity");
  const updateUserInfo = require("../controllers/updateUserInfo");
  const userFunc = require("../controllers/userFunction");
  const rateLimit = require('express-rate-limit');
  require('dotenv').config();
  const sql = require("../model/db");
  //short link
  var mysql = require('mysql');
  const dbConfig = require("../config/db.config");

  async function db() {
    const connection = mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB
    });

    connection.connect(async function (err) {
      if (err) throw err;
      await connection.query("Select * from partners", function (err, result, fields) {
	 renderAPI(result);
      });
    });
  }
  db();
  function renderAPI(arr) {
    for (let i = 0; i < arr.length; i++) {
      app.get('/redirect/' + arr[i].parent_id + '/user:id', rateLimit({
        windowMs:60*120* 1000,
        max: 1,
        message: 'Trùng IP ! Thử lại sau 2h',
      }), (req, res) => {
        var replaceWith = 'user' + req.params.id;
        var result = (arr[i].link).replace(/user001/g, replaceWith)
        res.redirect(result);

      })
    }
  }
  //login
  app.post("/login", login.create);

  app.get("/permission/:userId", userFunc.permission);

  app.get("/userid", userFunc.getId);

  app.get("/listuser", userFunc.getAllUser);

  app.delete("/delete/user/:userId", userFunc.deleteUser);

  app.post("/password/:userId", password.getPassword);

  app.post("/update/password/:userId/:password", password.updatePassword);

  app.post("/customers", customers.create);

	//partner

   app.get("/partner",partner.getPartners)

  app.post("/update/partner", async (req, res) => {
    await sql.query(`UPDATE partners SET link = "${req.body.link}", unit_price= "${req.body.unit_price}" , sign = "${req.body.sign}" WHERE name = "${req.body.name}";`, function (error, results, fields) {
        if (error) res.send(error);
        else {
            console.log(results);
            res.send(results);
        }
    });
 setTimeout(function(){ db(); }, 3000);
});

  app.post("/add/partner", async (req, res) => {
    await sql.query(`INSERT INTO partners (name, link, unit_price,  sign) VALUES ("${req.body.data.name}","${req.body.data.link}", ${req.body.data.unit_price},"${req.body.data.sign}");`, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.send({
          add: false,
          message: error
        });
      }
      else {
        res.send(
          {
            add: true,
            data: results
          }
        );
      }
    });
    db();
  });

  // notification
  app.post("/add/notifications", notifications.add);

  app.get("/get/notifications", notifications.get);

  app.get("/getlastest/notifications", notifications.getLastUpdate);

  app.delete("/delete/notifications", notifications.delete);

  app.delete("/delete/partner",async (req, res) => {
    await sql.query(`DELETE FROM partners WHERE name="${req.body.name}";`, function (error, results, fields) {
        if (error) res.send({
            delete: false,
            message: error
        });
        else {
            console.log(results);
            res.send(
                {
                    delete: true,
                    data: results
                }
            );
        }
    });
    setTimeout(function(){ db(); }, 3000);
    });

  app.get("/posterity/:id", posterity.getPosterity)

  // Retrieve all Customers
  app.get("/customers", customers.findAll);

  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", customers.findOne);

  // Update a Customer with customerId
  app.post("/update/info/customers/:customerId", updateUserInfo.update);

  // Delete a Customer with customerId
  app.delete("/customers/:customerId", customers.delete);

  // Create a new Customer
  app.delete("/customers", customers.deleteAll);

};
