module.exports = (app) => {
  const customers = require("../controllers/controller");
  const login = require("../controllers/login");
  const partner = require("../controllers/partners");
  const notifications = require("../controllers/notifications");
  const password = require("../controllers/password");
  const posterity = require("../controllers/posterity");
  const updateUserInfo = require("../controllers/updateUserInfo");
  const userFunc = require("../controllers/userFunction");
  const auth = require("../middleware/auth");
  //login
  app.post("/login", login.create);

  app.get("/permission/:userId", auth, userFunc.permission);

  app.get("/userid", auth, userFunc.getId);

  app.get("/listuser", auth, userFunc.getAllUser);

  app.delete("/delete/user/:userId", auth, userFunc.deleteUser);

  app.post("/password/:userId", auth, password.getPassword);

  app.post("/update/password/:userId/:password", auth, password.updatePassword);

  app.post("/customers", auth, customers.create);

  //partner

  app.get("/partner", auth, partner.getPartners);

  // notification
  app.post("/add/notifications", auth, notifications.add);

  app.get("/get/notifications", notifications.get);

  app.get("/getlastest/notifications", auth, notifications.getLastUpdate);

  app.delete("/delete/notifications", auth, notifications.delete);

  app.get("/posterity/:id", auth, posterity.getPosterity);

  // Retrieve all Customers
  app.get("/customers", auth, customers.findAll);

  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", auth, customers.findOne);

  // Update a Customer with customerId
  app.post("/update/info/customers/:customerId", auth, updateUserInfo.update);

  // Delete a Customer with customerId
  app.delete("/customers/:customerId", auth, customers.delete);

  // Create a new Customer
  app.delete("/customers", auth, customers.deleteAll);
};
