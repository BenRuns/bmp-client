'use strict';
const _ = require('lodash');
const request = require('request-promise-native');

const defaultConfig = {
  browserMob:{ host:'localhost',  port: 8080, protocol:'http' },
};


class BrowserMobClient {
  constructor(config){
    _.defaults(this, config || {}, defaultConfig);
    let bmp = this.browserMob;
    bmp.uri = `${ bmp.protocol }://${ bmp.host }:${ bmp.port }`;
  }


  static createClient(config){
    return new this(config);
  }


  createHar(options){
    return this. _callProxy('har','PUT', options);
  }


  getHar(){
    return this. _callProxy('har','GET');
  }

  closeProxies(){
    var that = this;
    return this.listProxies()
    .then( ports => {
      return Promise.all(
        _.map( ports.proxyList, function(portData){
          return that.end(portData.port);
        })
      );
    });
  }

  setLimits(options){
    let that = this;
    return that._callProxy('limit','PUT', options)
    .then( () => that.limits = _.extend({}, that.limits, options ) );
  }

  start(options){
    var that = this;
    return request({
       method:'POST',
       json:true,
       body: options || that.proxy || {},
       uri: `${ that.browserMob.uri }/proxy/`
    })
    .then( proxyInfo => {
      that.proxy = proxyInfo;
      return proxyInfo;
    });
  }


  end(port){
    var that = this;
    if (!port && !that.proxy) { return Promise.resolve(); }
    return this. _callProxy('','DELETE', {}, port)
    .then(data =>{
      if ( !port || that.proxy && that.proxy.port == port  ){
        delete that.proxy;
      }
    });
  }

  listProxies(){
    return this.callRest('proxy','GET');
  }

  callRest(url ,method, data ){
    return request({
       method:method,
       json:true,
       body:data || {},
       uri: `${ this.browserMob.uri }/${ url }`
    });
  }

  _callProxy(ext, method, data, proxyPort){
    let url = `proxy/${ proxyPort || this.proxy.port }/${ ext || ''}`;
    return this.callRest(url ,method, data );
  }

}

module.exports = BrowserMobClient;

