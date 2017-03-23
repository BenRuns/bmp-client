'use strict';
const _ = require('lodash');
const util = require('util');
const request = require('request-promise-native');

const defaultConfig = {
  browserMob:{ host:'localhost',  port: 8080, protocol:'http' },
};


class BrowserMobClient {
    constructor(config){
      _.defaults(this, config || {}, defaultConfig);
    }


    static createClient(config){
      return new this(config);
    }


    createHar(options){
      var that = this;
      return request({
         method:'PUT',
         json:true,
         body: options || {},
         uri: this._buildURI('browserMob', 'proxy/' + that.proxy.port + '/har')
      });
    }


    getHar(){
      var that = this;
      return request({
         method:'GET',
         json:true,
         uri: this._buildURI('browserMob', 'proxy/' + that.proxy.port + '/har')
      });
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


    start(options){
      var that = this;
      return request({
         method:'POST',
         json:true,
         body: options || that.proxy || {},
         uri: this._buildURI('browserMob', 'proxy')
      })
      .then( proxyInfo => {
        that.proxy = proxyInfo;
        return proxyInfo;
      });
    }


    /**
    * @method
    * @description Returns a promise that resolves on end
    * @param port {number=} optional proxy port to end - will skip ending existing proxy
    * @returns {promise}
    **/
    end(port){
      var that = this;
      if (!port && !that.proxy) { return Promise.resolve(); }
      return request({
         method:'DELETE',
         json:true,
         uri: this._buildURI('browserMob', 'proxy/' + (port || that.proxy.port))
      })
      .then(data =>{
        if ( !port || that.proxy && that.proxy.port == port  ){
          delete that.proxy;
        }
      });
    }

    /**
    * @method
    * @returns {promise} Resolves to { proxyList: [ { port: 8081 }, { port: 8082 }, { port: 8083 } ] }
    **/
    listProxies(){

      return request({
         method:'GET',
         json:true,
         uri: this._buildURI('browserMob', 'proxy')
      });
    }

  _buildURI(destinationName, ext){
    var d = this[destinationName];
    return util.format('%s://%s:%s/%s', d.protocol, d.host, d.port, ext || '');
  }


}

module.exports = BrowserMobClient;

