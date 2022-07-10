#!/usr/bin/env node
'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const selProxy = require('selenium-webdriver/proxy');
const bmpClient = require('../index').createClient();
//need to require this or it looks for a globally installed chromedriver
const chromedriver = require('chromedriver');

async function runBmp() {
  await bmpClient.start();
  await bmpClient.createHar();
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setProxy(selProxy.manual({ http: 'localhost:' + bmpClient.proxy.port }))
    .build();


  await driver.get("https://search.yahoo.com");
  const harData = await bmpClient.getHar();
  //do something
  console.log(harData);
  await bmpClient.end();
}

runBmp()
  .then(function () {
    console.log("Finished Successfully");
    process.exit([0]);
  })
  .catch(function (err) {
    console.error(err.message);
    console.error(err.stack)
    process.exit([1]);
  });

