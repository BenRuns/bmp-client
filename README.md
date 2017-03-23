
BrowserMob Proxy Client

A library built to interact with  [browsermob-proxy][1]'s  REST Api

### Setup

1. Ensure that you've downloaded  [browsermob-proxy][1] and have it running
2. `npm install browsermob-proxy-client`


#### Quick Start With Selenium


    const webdriver = require('selenium-webdriver');
    const By = webdriver.By;
    const until = webdriver.until;
    const selProxy = require('selenium-webdriver/proxy');
    const bmpClient = require('browsermob-proxy-client').createClient();

    bmpClient.start()
    .then( () =>  bmpClient.createHar())
    .then( () =>  {
      let driver = new webdriver.Builder()
      .forBrowser('phantomjs')
      .setProxy(selProxy.manual({ http: 'localhost:' + bmpClient.proxy.port}))
      .build();

      return driver.get("http://search.yahoo.com")
      .then( () => bmpClient.getHar() )
      .then( harData => {
        //do something
        console.log(harData);
      });
    })
    .then( () => bmpClient.end() );



#### API

##### BrowserMobClient.createClient(config)
Synchronous function that instantiates a new client
- config

      {
        browserMob:{ // *optional* details on where browsermob is running
           host:'localhost',
           port: 8080,
           protocol:http
         },
         proxy:{ // *optional*
           port:8081,
           bindAddress: `192.168.1.222`.
         }
      }

##### client.createHar(options)
Returns a promise. Creates a har file on browsermob

- options

      {
        captureHeaders: - Boolean, capture headers or not.
                             Optional, default to "false".

        captureContent: - Boolean, capture content bodies or not.
                      Optional, default to "false".

        captureBinaryContent:  Boolean, capture binary content or not.
                         Optional, default to "false".

        initialPageRef: - The string name of The first page ref
                     that should be used in the HAR. Optional,
                     default to "Page 1".

        initialPageTitle: - The title of first HAR page. Optional,
                        default to initialPageRef.
      }


##### client.getHar()
Returns a promise that resolves to a har in JSON format


##### client.closeProxies()
Returns a promise that closes all proxies running

##### client.start(options)
starts a port to use
- options

      {
        port: 'specify a port to start the proxy on',
        bindAddress=192.168.1.222    * if working in a multi-home env *
      }

##### client.end()
Returns a promise that stops the proxy port




##### client.listProxies()

Resolves to { proxyList: [ { port: 8081 }, { port: 8082 }, { port: 8083 } ]


### Development

### Testing
1. Install dependencies `npm install`

2. Install and run [browsermob-proxt][1]

       npm run install-browsermob
       npm run start-browsermob

2. Run the tests

       npm test



[1]:  https://github.com/lightbody/browsermob-proxy


