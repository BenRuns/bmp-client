

const _ = require('lodash');
const util = require('util');
const request = require('request-promise-native');

const defaultConfig = {
  browserMob:{ host:'localhost',  port: 8080, protocol:'http' },
};

/**
 *
 * @constructor
 */
class BrowserMobClient {
    constructor(config){
      _.defaults(this, config || {}, defaultConfig);
    }



    /**
     *
     * @static
     * @param  {object=} config  defaults to:
     *
     *        {
     *          browserMob:{ // *optional* details on where browsermob is running
     *             host:'localhost',
     *             port: 8080,
     *             protocol:http
     *           },
     *          proxy:{ // *optional*
     *              port:8081,
     *              bindAddress: `192.168.1.222`.
     *           }
     *        }
     */
    static createClient(config){
      return new this(config);
    }

    /**
    * @method
    * @description creates a har
    * @param  {object=} options  example:
    *
    *      {
    *          captureHeaders: - Boolean, capture headers or not.
    *                            Optional, default to "false".
    *
    *           captureContent: - Boolean, capture content bodies or not.
    *                           Optional, default to "false".
    *
    *          captureBinaryContent:  Boolean, capture binary content or not.
    *                              Optional, default to "false".
    *
    *          initialPageRef: - The string name of The first page ref
    *                           that should be used in the HAR. Optional,
    *                           default to "Page 1".
    *
    *         initialPageTitle: - The title of first HAR page. Optional,
    *                            default to initialPageRef.
    *        }
    *
    * @returns {promise}
    **/
    createHar(options){
      var that = this;
      return request({
         method:'PUT',
         json:true,
         body: options || {},
         uri: this._buildURI('browserMob', 'proxy/' + that.proxy.port + '/har')
      });
    }

    /**
    * @method
    * @description gets the har
    *
    * @returns {promise} Resolves to { proxyList: [ { port: 8081 }, { port: 8082 }, { port: 8083 } ] }
    **/
    getHar(){
      var that = this;
      return request({
         method:'GET',
         json:true,
         uri: this._buildURI('browserMob', 'proxy/' + that.proxy.port + '/har')
      });
    }



    /**
    * @method
    * @description closes all the proxies
    * @returns {promise} Resolves to { proxyList: [ { port: 8081 }, { port: 8082 }, { port: 8083 } ] }
    **/
    closeProxies(){
      var that = this;
      return this.listProxies()
      .then( ports =>{
        return Promise.all(
          _.map( ports.proxyList, function(portData){
            return that.end(portData.port);
          })
        );
      });
    }

    /**
    * @method
    * @description Starts a proxy
    * @param  {object=} options  example:
    *
    *      {
    *           port: 'specify a port to start the proxy on',
    *           bindAddress=192.168.1.222    * if working in a multi-home env *
    *        }
    * @returns {promise}
    **/
    start(options){
      var that = this;
      return request({
         method:'POST',
         json:true,
         body: options || that.proxy || {},
         uri: this._buildURI('browserMob', 'proxy')
      })
      .then( proxyInfo =>{
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

