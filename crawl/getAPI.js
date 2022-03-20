const sql = require("../model/db");
const axios = require("axios");
async function crawlData() {
  const res = await axios.get("https://api.accesstrade.vn/v1/orders", {
    headers: {
      Authorization: "Token 2VF0SzupbirF99M0p2q1f6gDARixFme3",
    },
  });
  return res.data.data;
}
async function filterDataByTime(dataOrders) {
  await sql.query(
    `INSERT INTO orders (name, link, unit_price,  sign) VALUES ("${req.body.data.name}","${req.body.data.link}", ${req.body.data.unit_price},"${req.body.data.sign}");`,
    function (error, results, fields) {
      if (error)
        res.send({
          add: false,
          message: error,
        });
      else {
        res.send({
          add: true,
          data: results,
        });
      }
    }
  );
}
(async () => {
  const dataRes = await crawlData();
  const dataFilter = new Array();
  var date = new Date();
  date.setHours(date.getHours() + 7);
  var isodate = date.toISOString();
  dataRes.forEach((element) => {
    if (isodate) {
      const value = {};
      value.order_id = element.order_id;
      value.merchant = element.merchant;
      value.utm_source = element.utm_source;
      value.is_confirmed = element.is_confirmed;
      value.sales_time = element.sales_time;
      value.order_status = element.products[0].status;
      value.confirmed_time = element.click_time;
      value.click_time = element.click_time;
      value.device = element.client_platform;
      dataFilter.push(value);
    }
  });
  await filterDataByTime(dataFilter);
  console.log("crawl successfully");
})();
