#!/usr/bin/env node
'use strict';

const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const selProxy = require('selenium-webdriver/proxy');
//const bmpClient = require('browsermob-proxy-client').createClient();
const bmpClient = require('../index').createClient();

function main(){
  return bmpClient.start()
  .then( () =>  bmpClient.createHar())
  .then( () =>  {
    let driver = new webdriver.Builder()
     .forBrowser('phantomjs')
     .setProxy(selProxy.manual({http: 'localhost:' + bmpClient.proxy.port}))
     .build();

     return driver.get("http://search.yahoo.com")
     .then( () => bmpClient.getHar() )
     .then( harData => {
        //do something
          console.log(harData);
      });
  })
  .then( () => bmpClient.end() );
}


if (require.main === module) {
  return main()
  .then(function(){
    console.log("Finished Successfully");
    process.exit([0]);
  })
  .catch(function(err){
    console.error(err.message);
    process.exit([1]);
 });
}
