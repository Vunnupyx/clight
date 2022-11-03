const net = require('node:net');
const client = net.createConnection(7878, 'DM8CF3196AE6B5', () => {
  console.log('Client connected!');
});
client.on('data', async (data) => {
  console.log(data.toString());
});
