var socketClient  = require('socket.io-client');
var debug         = require('debug')('streams');
var ss            = require("socket.io-stream");
var fs            = require('fs');
var PORT          = 5000;
var URL           = "http://localhost:"+PORT;
var MerkleTree    = require('merkletreejs')
const crypto      = require('crypto')
const SHA256      = require('crypto-js/sha256');


server();
blobber("storedFile",true,true);

// SERVER
function server() { 
  var http = require('http').Server();
  var io   = require('socket.io')(http);
  http.listen(PORT, function(){
    debug('server listening on *:' + PORT);
  });
  var nsp = io.of('/');
  var consumers = [];
  nsp.on('connection', function(socket) {
    var query = socket.handshake.query;
    debug("server: new connection: ",query.name);
    //var streamingSocket = ss(socket);
    consumers.push(socket);
  });
  // at an arbitrary interval the server sends an image arround
  setInterval(function() {
    debug("broadcast image");
    var filename = "ConsensusProc.png";
    var readStream = fs.createReadStream("assets/"+filename);
    readStream.resume();                                  // switch the stream into flowing-mode
    consumers.forEach(function(consumer,index) {
      debug("pipe to consumer: ",index);
      var outgoingStream = ss.createStream();
      ss(consumer).emit('file',outgoingStream,{name:filename});
      readStream.pipe(outgoingStream);
      //console.log(consumers);
    });
  },2000); 
}

//CLIENT
function blobber(name,listen,write) {
  var serverSocket = socketClient(URL+"?name="+name,{forceNew:true});
  var serverStreamSocket = ss(serverSocket);
  var counter = 0;
  var blobList = [];

  serverSocket.once('connect', function(){
    debug("blobber: "+name+" connected");

    if(listen) {
      serverStreamSocket.on("file",function(stream,data) {
        debug("blobber: on file");
        if(write) {
          stream.pipe(fs.createWriteStream(name+"-"+data.name));
          //counter++;
          
        }
      });
    }
  });

  // MERKLE TREE 
function sha256(data) {
  // returns Buffer
  return crypto.createHash('sha256').update(data).digest();
}

var leaves = ['a', 'b', 'c'].map(x => sha256(x));
var tree = new MerkleTree(leaves, sha256);
console.log(tree.getRoot());
console.log(tree);

function hashAlgorithm(data){
  if (blobber("storedFile", true, true)){
      return SHA256(readStream).toString();
      blobList.push(readStream);
  }
}
    console.log(blobList); 
//Returns true if the proof path (array of hashes) can connect the target node to the Merkle root.

function challengeProtocol(tree){
  verified = false
  for (i = 0; i < tree.leaves; i++){
    verified = tree.verify(proof, leaves[Math.random(i)], root);

    if(verified){
      return true;
    }
    else{
      return false;
    }
  }
}

}



