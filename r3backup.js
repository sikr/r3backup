/*
  lsblk
  ls /proc/mounts
  ls -l /dev/disk/by-uuid
  fdisk -l
*/

var fs = require("fs");
let oDevices = [{uuid: "F875-D9D5"},  // 0 = SSD
                // {uuid: "2C2D-459E"},  // others = SD cards
                {uuid: "A045-F3C1"},  // 32 GB,  SD 1
                {uuid: "24F8-5F8F"},  // 64 GB,  SD 6
                {uuid: "14EB-C9EA"},  // 64 GB,  SD 7
                {uuid: "6363-6333"},  // 64 GB,  SD 10
                {uuid: "F05A-3BA2"}]; // 128 GB, SD 12
                // {uuid: "1A2B-3D4E"}];
let sSourceUuid = "";
let sDestinationUuid = "";

function getDisksByUUID(callback) {
  var spawn   = require("child_process").spawn;
  var ls      = spawn("ls", ["/dev/disk/by-uuid/"]);
  var oDisks  = [];

  ls.stdout.on("data", function (data) {
    var sBuffer = data.toString();
    var oLines = sBuffer.split(/\n/);
    for (var i = 0; i < oLines.length; i++) {
      if (oLines[i] !== "") {
        oDisks.push({"uuid": oLines[i]});
      }
    }
  });
  ls.stderr.on("data", function (data) {
    console.error("\n\n**** ERROR executing ls: %s", data);
  });
  ls.on("close", function (code) {
    callback(oDisks);
  });
}
getDisksByUUID(function(oDisks) {
  for (var j = 0; j < oDisks.length; j++) {
    for (var i = 0; i < oDevices.length; i++) {
      if (oDevices[i].uuid === oDisks[j].uuid) {
        if (i === 0) {
          console.log("Found SSD " + oDevices[i].uuid);
          sDestinationUuid = oDevices[i].uuid;
        }
        else {
          console.log("Found SD Card " + oDevices[i].uuid);
          sSourceUuid = oDevices[i].uuid;
        }
      }
    }
  }
  // for (var i = 0; i < oDisks.length; i++) {
  //   console.log("stat: " + "/media/" + oDisks[i]);
  //   fs.stat("/media/" + oDisks[i], function(err, stats) {
  //     // if (err !== undefined) {
  //     //   console.log("directory /media/" + oDisks[i] + " doesnt exist: " + err);
  //     // }
  //     if (stats !== undefined) {
  //       console.log("directory exists: " + stats);
  //     }
  //   })
  // }
});


