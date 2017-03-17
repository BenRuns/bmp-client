BrowserMob  Proxyy Client
===========================

A library built to interact with browsermob's REST Api

### Setup

1. Ensure that you've downloaded  [browsermob-proxy][1] and have it running
2. `npm install browsermob-proxy-client`


#### Quick Start With Selenium


    const webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until,
        proxy = require('selenium-webdriver/proxy');
    const bmpClient = require('browsermob-proxy-client');
    const client = bmpClient.createClient();

    client.start()
    .then( () =>  proxy.createHar())
    .then( () =>  {
      let driver = new webdriver.Builder()
       .forBrowser('phantomjs')
       .setProxy(sproxy.manual({http: 'localhost:' +client.proxy.port}))
       .build();

       return  driver.get("http://search.yahoo.com")
       .then( () => proxy.getHar() )
       .then( harData => {
          //do something
            console.log(harData);
        });
    })
    .then( ()=> client.end() );


### Development

### Testing
1. Install dependencies `npm install`

2. Install and run [browserMob][1]

       npm run install-browsermob
       npm run browsermob

2. Run the tests

       npm test


#### Docs
Create the docs `npm run jsdoc`



-----

[1]:  https://github.com/lightbody/browsermob-proxy

