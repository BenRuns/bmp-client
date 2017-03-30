
# BrowserMob Proxy Client

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
           protocol:'http'
         },
         proxy:{ // *optional*
           port:8081,
           bindAddress: `192.168.1.222`
         }
      }

##### client.callRest(url, method, data)
Method to make direct calls to browsermob-proxy's REST API
see [browsermob-proxy][1] for availabel urls. Returns a promise.

- url

  String - 'proxy/8089/har'
- method

  String - 'GET, POST, DELETE, PUT'

- data

  Object - { enable: true }


##### client.closeProxies()
Returns a promise that closes all proxies running


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



##### client.end()
Returns a promise that stops the proxy port


##### client.getHar()
Returns a promise that resolves to a har in JSON format

##### client.listProxies()
Resolves to { proxyList: [ { port: 8081 }, { port: 8082 }, { port: 8083 } ]


##### client.setLimits(options)
sets limits on the proxy
- options

      {
        downstreamKbps: - Sets the downstream bandwidth limit in kbps. Optional.

        upstreamKbps: - Sets the upstream bandwidth limit kbps. Optional, by default unlimited.

        downstreamMaxKB: - Specifies how many kilobytes in total the client is allowed to download through the proxy. Optional, by default unlimited.

        upstreamMaxKB: - Specifies how many kilobytes in total the client is allowed to upload through the proxy. Optional, by default unlimited.

        latency: - Add the given latency to each HTTP request. Optional, by default all requests are invoked without latency.

        enable: - A boolean that enable bandwidth limiter. Optional, by default to "false", but setting any of the properties above will implicitly enable throttling

        payloadPercentage: - Specifying what percentage of data sent is payload, e.g. use this to take into account overhead due to tcp/ip. Optional.

        maxBitsPerSecond: - The max bits per seconds you want this instance of StreamManager to respect. Optional.
      }

##### client.start(options)
starts a port to use
- options

      {
        port: 'specify a port to start the proxy on',
        bindAddress: '192.168.1.222'    // if working in a multi-home env
      }




### Development

### Testing
1. Install dependencies `npm install`

2. Install and run [browsermob-proxy][1]

       npm run install-browsermob
       npm run start-browsermob

2. Run the tests

       npm test



[1]:  https://github.com/lightbody/browsermob-proxy


