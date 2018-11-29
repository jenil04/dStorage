var socketClient  = require('socket.io-client');
var debug         = require('debug')('streams');
var ss            = require("socket.io-stream");
var fs            = require('fs');
var PORT          = 5000;
var URL           = "http://localhost:"+PORT;
//var merkle        = require('merkle');
const crypto      = require('crypto')
const SHA256      = require('crypto-js/sha256');
const Block       = require('./Block');
var MerkleTree    = require('merkletreejs')


//This storage protocol allows a blobber to store data for a client.
//The client will mantain a bloblist (list of file hashes) and challenge the blobber with a random block.

//server listening
server();
blobber("storedFile",true, true);

//server
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

    debug("broadcast image");
    var filename = "ConsensusProc.png";
    var filename2 = "ise_tb.pdf";
    //var filename3 = "";
    //var filename4 = "";
    //var filename5 = "";
    //var filename6 = "";
    //var filename7 = "";
    //var filename8 = "";
    //var filename9 = "";
    //var filename10 = "";
    //var filename11 = "";
    //var filename12 = "";
    //var filename13 = "";
    //var filename14 = "";
    //var filename15 = "";
    //var filename16 = "";
    var readStream = fs.createReadStream("assets/"+filename);
    var readStream2 = fs.createReadStream("assets/" + filename2);
    readStream.resume();
    readStream2.resume();

    consumers.forEach(function(consumer,index) {
      debug("pipe to consumer: ",index);
      var outgoingStream = ss.createStream();
      var outgoingStream2 = ss.createStream();
      ss(consumer).emit('file',outgoingStream,{name:filename});
      ss(consumer).emit('file', outgoingStream2, {name:filename2});
      readStream.pipe(outgoingStream);
      readStream2.pipe(outgoingStream2);
    }); 
  });
}


//client
function blobber(name,listen,write) {
  var serverSocket = socketClient(URL+"?name="+name,{forceNew:true});
  var serverStreamSocket = ss(serverSocket);
  var counter = 0;
  var blobList = [];
  var k = false;
  
  serverSocket.once('connect', function(){
    debug("blobber: "+name+" connected");

    if(listen) {
      serverStreamSocket.on("file",function(stream,data) {
        debug("blobber: on file");
        console.log("The file that is being stored is: " + data.name);
        blobList.push(SHA256(stream));

        if(write) {
          stream.pipe(fs.createWriteStream(name+"-"+data.name));
          console.log("The blob list is: " + blobList);
          var tree = new MerkleTree(blobList, SHA256);
          console.log("The current tree looks like: " + tree);

          //challenge protocol
          for (i = 0; i < tree.leaves; i++){
            let verified = tree.verify(proof, leaves[Math.random(i)], root);
            console.log(verified);
              if(verified){
              k = true;
            }
            else{
              return false;
            }
          }
            console.log("Blobber is cheating: " + k);

      }
      serverStreamSocket.on('end', function(){
          console.log('final output '+ data);
      });
    
      })
    }
  });
}


