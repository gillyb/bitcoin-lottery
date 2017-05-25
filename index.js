const bitcoin = require('bitcoinjs-lib');
const bigi = require('bigi');
const request = require('request');

let i = 0;

const abc = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  .split('');
const abcLength = abc.length;
const createRandomString = function() {
  let a = '';
  let randomLimit = Math.floor(Math.random() * 256);
  for (let i = 0; i < randomLimit; i++) {
    a += abc[Math.floor(Math.random() * abcLength)];
  }
  return a;
};

const checkRandomAddress = function() {
  var hash = bitcoin.crypto.sha256(new Buffer(createRandomString()));
  var d = bigi.fromBuffer(hash);

  var keyPair = new bitcoin.ECPair(d);

  var address = keyPair.getAddress();

  request({
    method: 'GET',
    uri: 'https://blockchain.info/rawaddr/' + address,
    json: true
  }, (err, response, body) => {

    if (err) {
      console.log('ERR :: ' + err);
      process.exit(1);
    }
    if (response.statusCode !== 200) {
      console.log('ERR :: ' + JSON.stringify(response));
      process.exit(1);
    }

    i++;
    if (i % 10 === 0) {
      console.log('Tried ' + i + ' hashes');
    }

    if (body.n_tx !== 0) {
      console.log('!!! YOU WON THE FUCKING LOTTERY !!!');
      console.log('Private Key : ' + d);
      console.log('Address : ' + address);
      process.exit(0);
    }

    // console.log('Private Key : ' + d);
    // console.log('Address : ' + address);

    checkRandomAddress();
  });
};


checkRandomAddress();
