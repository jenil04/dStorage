
const SHA256 = require('crypto-js/sha256');
var Blockchain = require('./Blockchain');
var Block = require('./Block');

let Alethia = new Blockchain();
var date = Date.now();
var amount = Math.random();

for(i = 0; i < 100; i++){
    Alethia.addBlock(new Block(i, date, {amount: amount}));
}

if(Alethia.isChainValid()){ 
    console.log(Alethia);       //Considering only valid blocks for now.
}

console.log('----END----');
