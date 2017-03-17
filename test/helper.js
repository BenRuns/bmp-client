const chai = require('chai');
const assert = chai.assert;

const BrowserMob = require('../index');

before(function(){
  //TODO
});

after(function(){
  this.timeout(0);
  let client = BrowserMob.createClient({});
  return client.closeProxies();
});
