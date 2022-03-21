const sql = require("../model/db");
const axios = require("axios");
var fs = require("fs");
async function crawlData() {
  var date = new Date();
  date.setHours(date.getHours() + 7);
  date.setMinutes(date.getMinutes() - 30);
  var isodate = date.toISOString().split(".")[0];
  console.log(isodate);
  const res = await axios.get("https://api.accesstrade.vn/v1/orders", {
    headers: {
      Authorization: "Token DxZxkflwgRUEFgZITNSp_048ust4yP0b",
    },
    params: {
      since: isodate, //2022-03-21T00:00:00
    },
  });
  return res.data;
}
async function insertDataBase(order) {
  await sql.query(
    `INSERT INTO orders ( merchant, utm_source,  is_confirmed, pub_commission , reality_commission ,sales_time,order_status ,confirmed_time ,click_time  ,device) VALUES ("${
      order.merchant
    }", "${order.utm_source}","${order.is_confirmed}","${
      order.pub_commission
    }", "${order.pub_commission + 200}","${order.sales_time}","${
      order.order_status
    }","${order.confirmed_time}","${order.click_time}","${order.device}");`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log("add row recods");
      }
    }
  );
}
function filterDataByTime(dataOrders) {
  dataOrders.forEach((element) => {
    insertDataBase(element);
  });
}
//2021-01-01T00:00:00 > 2021-01-01T00:00:10
(async () => {
  const dataRes = await crawlData();
  const dataFilter = new Array();
  dataRes.data.forEach((element) => {
    const value = {};
    value.order_id = element.order_id;
    value.merchant = element.merchant;
    value.utm_source = element.utm_source;
    value.is_confirmed = element.is_confirmed;
    value.sales_time = element.sales_time;
    value.pub_commission = element.pub_commission;
    value.order_status = element.products[0].status;
    value.confirmed_time = element.click_time;
    value.click_time = element.click_time;
    value.device = element.client_platform;
    dataFilter.push(value);
  });
  if (dataFilter.length > 0) {
    filterDataByTime(dataFilter);
  } else {
    var date = new Date();
    date.setHours(date.getHours() + 7);
    date.setMinutes(date.getMinutes() - 10);
    var isodate = date.toISOString().split(".")[0];
    fs.appendFileSync("/home/rb005/Desktop/3tmmo/3tmmo-backend-v2/crawl/out.txt", isodate + "  not data" + "\n");
  }
})();
