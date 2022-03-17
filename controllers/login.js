const sql = require("../model/db");
var md5 = require('md5');
var jwt = require('jsonwebtoken');
require('dotenv').config()
exports.create = async (req, res) => {
 const passwodHash =  md5(req.body.data.password);
    const userName = req.body.data.username;
    await sql.query(`SELECT user_id FROM users WHERE username= BINARY "${userName}" AND password= "${passwodHash}" `, function (error, results, fields) {
        if (error) res.send(error);
        else {
            if (results.length === 0) {
                return res.send({
                    success: false,
                    message: "Tên đăng nhập hoặc mật khẩu không đúng"
                });
            }
            else {
                const token =
                    jwt.sign({
                    data: userName
                    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                return res.send({
                    login: true ,
                    idUser : results,
                    token
                });
            }
        }
    });

}
