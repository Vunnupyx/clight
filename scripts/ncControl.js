var nodes7 = require('nodes7'); // This is the package name, if the repository is cloned you may need to require 'nodeS7' with uppercase S
var conn = new nodes7();
var doneReading = false;
var doneWriting = false;

conn.initiateConnection(
  { port: 102, host: '192.168.214.1', rack: 0, slot: 2 },
  connected
); // slot 2 for 300/400, slot 1 for 1200/1500

function connected(err) {
  if (typeof err !== 'undefined') {
    // We have an error. Maybe the PLC is not reachable.
    console.log(err);
    process.exit();
  }
  conn.addItems('DB1200,X0.2');
  // conn.removeItems(['TEST2', 'TEST3']); // We could do this.
  // conn.writeItems(['TEST5', 'TEST6'], [ 867.5309, 9 ], valuesWritten); // You can write an array of items as well.
  conn.writeItems('DB1200,X0.2', false, valuesWritten); // You can write a single array item too.
  conn.readAllItems(valuesReady);
}

function valuesReady(anythingBad, values) {
    if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
    console.log(values);
    doneReading = true;
    if (doneWriting) { process.exit(); }
  }

  
function valuesWritten(anythingBad) {
  if (anythingBad) {
    console.log('SOMETHING WENT WRONG WRITING VALUES!!!!');
  }
  console.log('Done writing.');
  process.exit();
}
