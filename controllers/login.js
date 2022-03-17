const sql = require("../model/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
var md5 = require("md5");
require("dotenv").config();
exports.create = async (req, res) => {
  const passwodHash = md5(req.body.password);
  const userName = req.body.username;
  const data = req.body.username;
  const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  {
    await sql.query(
      `SELECT user_id FROM users WHERE username= BINARY "${userName}" AND password= "${passwodHash}" `,
      function (error, results, fields) {
        if (error) res.send(error);
        else {
          if (results.length === 0) {
            return res.send({
              success: false,
              message: "Tên đăng nhập hoặc mật khẩu không đúng",
            });
          } else {
            return res.send({
              login: true,
              idUser: results,
              token: accessToken,
            });
          }
        }
      }
    );
  }
};
