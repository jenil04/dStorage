var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var cors = require('cors');

class Client{

  constructor(){
    blobList = [];
    key = ""
  }

  printKey(key, blobList){
    if (newBlob) {
      console.log("Added:", key);
    } else {
      console.log("Already in the list:", key);
    }
}
  
  
    sendFile() {
      // This is our data file path
      var data_inner_path = "data/users/" + "/data.json"
  
      // Load current data
      this.cmd("fileGet", {
        "required": false
      }, (data) => {
        if (data) // Parse current data file
          data = JSON.parse(data)
        else // Not exists yet, use default data
          data = {
            "content": []
          }
  
        // Add to data
        data.push({
          "body": document.getElementById("data").value,
          "date_added": Date.now(),
        })
  
        // Encode data array to utf8 json text
        var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '\t')))
  
        // Write file to disk
        this.cmd("fileWrite", [data_inner_path, btoa(json_raw)], (res) => {
          if (res == "ok") {
            // Reset the message input
            document.getElementById("data").value = ""
            // Sign the changed file in our user's directory
            this.cmd("siteSign", {
              "inner_path": data_inner_path
            }, (res) => {
              this.loadMessages() // Reload data
              // Publish to other nodes
              this.cmd("sitePublish", {
                "inner_path": data_inner_path,
                "sign": false
              })
            })
          } else {
            this.cmd("wrapperNotification", ["error", "File write error: #{res}"])
          }
        })
      })
  
      return false
    }

    challengeProtocol(){
      if(blobList){
        return true;
      }
  }
  
}
