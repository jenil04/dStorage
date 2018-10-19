const SHA256 = require('crypto-js/sha256');

class Block{
    constructor (index, timestamp, data, previousHash = '', transactions, merkleHash){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.transactions = transactions;
        this.merkleHash = this.calculateMerkleHash();
    }
    
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }

    calculateMerkleHash() {
        var hashes = [];
        while (hashes.length > 1) {
          var tmp = [];
          for (var i = 0; i < hashes.length / 2; ++i) {
            var sha = crypto.createHash('sha256');
            sha.update(hashes[i*2]);
            sha.update(hashes[i*2+1]);
            tmp.push(sha.digest().toString('hex'));
          }
          if (hashes.length % 2 === 1) {
            tmp.push(hashes[hashes.length - 1]);
          }
          hashes = tmp;
        }
        return hashes[0];
      }

      getMerkleHash(){
        return this.data.merkleHash;
      }
}

module.exports = Block;
