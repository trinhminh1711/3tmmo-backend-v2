const sql = require("../model/db");
const axios = require("axios");
var fs = require("fs");
async function crawlData() {
  var date = new Date();
  date.setHours(7, 0, 0, 0);
  var isodate = date.toISOString().split(".")[0];
  const res = await axios.get("https://api.accesstrade.vn/v1/orders", {
    headers: {
      Authorization: "Token DxZxkflwgRUEFgZITNSp_048ust4yP0b",
    },
    params: {
      since: '2022-03-22T00:00:00', //2022-03-21T00:00:00
    },
  });
  return res.data;
}

async function getOrdersOnePage(page) {
  var date = new Date();
  date.setHours(7, 0, 0, 0);
  var isodate = date.toISOString().split(".")[0];
  const res = await axios.get("https://api.accesstrade.vn/v1/orders", {
    headers: {
      Authorization: "Token DxZxkflwgRUEFgZITNSp_048ust4yP0b",
    },
    params: {
      since: '2022-03-22T00:00:00', //2022-03-21T00:00:00
      page: page,
    },
  });
  return res.data.data;
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
async function filterDataByTime(dataOrders) {
  dataOrders.forEach(async function (element) {
    await insertDataBase(element);
  });
}
function filterData(arr) {
  let currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2);
  currentDate.setMinutes(currentDate.getMinutes() - 30);
  let isodate = currentDate.toISOString().split(".")[0];
  console.log(isodate);
  let currentDate2 = new Date();
  currentDate2.setHours(currentDate2.getHours() + 2);
  let isodate2 = currentDate2.toISOString().split(".")[0];
  console.log(isodate2);
  let dataFilter = [];
  arr.forEach((order) => {
    if (order.sales_time > isodate && order.sales_time < isodate2) {
      const value = {};
      value.merchant = order.merchant;
      value.utm_source = order.utm_source;
      value.is_confirmed = order.is_confirmed;
      value.sales_time = order.sales_time;
      value.pub_commission = order.pub_commission;
      value.order_status = order.products[0].status;
      value.confirmed_time = order.confirmed_time;
      value.click_time = order.click_time;
      value.device = order.client_platform;
      dataFilter.push(value);
    }
  });
  console.log(dataFilter.length);
  filterDataByTime(dataFilter);
}
(async () => {
  const dataRes = await crawlData();
  var total_page = dataRes.total_page;
  if (total_page > 1) {
    var getAll = [];
    for (let i = 1; i <= total_page; i = i + 2) {
      let j = i + 1;
      const page = await getOrdersOnePage(i);
      const page_next = await getOrdersOnePage(j);
      getAll = getAll.concat(page.concat(page_next));
    }
    filterData(getAll);
  } else {
    filterData(dataRes.data);
  }
})();
