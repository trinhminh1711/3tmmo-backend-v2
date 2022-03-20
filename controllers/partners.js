const sql = require("../model/db");
exports.getPartners = async (req, res) => {
    await sql.query(`SELECT * FROM partners`, function (error, results, fields) {
        if (error) res.send(error);
        else {
            res.send(results);
        }
    });

}

exports.addPartner = async (req, res) => {
    await sql.query(`INSERT INTO partners (name, link, unit_price,  sign) VALUES ("${req.body.data.name}","${req.body.data.link}", ${req.body.data.unit_price},"${req.body.data.sign}");`, function (error, results, fields) {
        if (error) res.send({
            add: false,
            message: error
        });
        else {
            res.send(
                {
                    add: true,
                    data: results
                }
            );
        }
    });

}

exports.updatePartner = async (req, res) => {
    await sql.query(`UPDATE partners SET link = "${req.body.link}", unit_price= "${req.body.unit_price}" , sign = "${req.body.sign}" WHERE name = "${req.body.name}";`, function (error, results, fields) {
        if (error) res.send(error);
        else {
            console.log(results);
            res.send(results);
        }
    });

}


exports.deletePartner = async (req, res) => {
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

}
