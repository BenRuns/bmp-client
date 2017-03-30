'use strict';

const _ = require('lodash');
const chai = require('chai');
const assert = chai.assert;

const BrowserMob = require('../index');

describe('Static Methods', function(){
  describe('createClient', function(){

    it ("instantiates a client", function(){
      let client = BrowserMob.createClient({
          BrowserMob:{ host:'localhost',  port: 8080 },
          selenium: { host:'localhost', port: 4444 }
       });
       assert(client instanceof BrowserMob);
    });
  });
});


describe('instance methods', function(){
      this.timeout(10 * 1000);
  var defaultProxy;

  beforeEach(function(){
    defaultProxy = BrowserMob.createClient();
    return defaultProxy.start();
  });

  afterEach(function(){
    return delay(null, 500)
    .then(() => defaultProxy.end());
  });

  describe('callRest', function(){
    it("allows the user to call browsermob's REST API directly", function(){
      return defaultProxy.callRest(`proxy/${ defaultProxy.proxy.port }/hosts` ,'POST', {"example.com": "1.2.3.4"})
      .then( response => {
         //TODO test something
      });
    });
  });


  describe('createHar', function(){
    it("creates a har", function(){

      return defaultProxy.createHar()
      .then( response => {
         //test something
      });
    });
  });

  describe('getHar', function(){
    it("gets har data", function(){
      return defaultProxy.createHar()
      .then( response => defaultProxy.getHar() )
      .then( har => {
        assert(har.log, "should get back something");
      });
    });
  });

  describe('setLimits', function(){
    it("assigns limits to the object", function(){
      return defaultProxy.setLimits({
        enable:true
      })
      .then(function(){
        assert(defaultProxy.limits,"Should be assigned");
      });
    });
  });

  describe('start', function(){
    it("starts something", function(){
      var proxy = BrowserMob.createClient();
      return proxy.start();
    });

    it("assigns a port to the client", function(){
      var proxy = BrowserMob.createClient();
      return proxy.start()
      .then( response => {
        assert.equal(proxy.proxy.port, response.port );
        assert(response.port, 'should return something like { port:8081}' );
      });
    });
  });

  describe('end', function(){

    it("shuts down the port", function(){
      let proxy = BrowserMob.createClient({ });
      return proxy.start()
      .then( port => {
        let proxyPort = proxy.proxy.port;
        return proxy.end()
        .then( () => proxy.listProxies() )
        .then( ports => {

          let stillActive =_.find(ports.proxyList, function(data){
            return data.port == proxyPort;
          });
          assert(!stillActive, "Port should have been shut down" );
        });
      });
    });
  });



  describe('listProxies', function(){
    it("returns a list of ports", function(){

      return defaultProxy.listProxies()
      .then( ports =>{
        assert(Array.isArray(ports.proxyList), 'should be returning a list of ports');
      });
    });
  });

  describe('closeProxies', function(){
    this.timeout(10 * 10000);
    it("closes all the proxies", function(){
      return defaultProxy.listProxies()
      .then( ports => {
        assert(ports.proxyList.length > 0, 'At least one port should be open');
        return defaultProxy.closeProxies()
        .then( () => defaultProxy.listProxies() )
        .then( refreshedPorts => {
          assert(refreshedPorts.proxyList.length === 0, 'all ports should be closed' );
        });
      });
    });
  });
});

function delay(data, time){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve(data);
    }, time);
  });
}