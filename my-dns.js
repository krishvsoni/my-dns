const dgram = require('node:dgram');
const dnsPacket = require('dns-packet')
const server = dgram.createSocket('udp4');
const db = {
  'krishsoni.co':'1.2.3.4.5',
  'vercel.app':'4.4.69.7.8'
}

server.on('message', (msg, rinfo) => {
  const incomingReq = dnsPacket.decode(msg);
  const ipFromDb = db[incomingReq.questions[0].name];
  if (ipFromDb) {
    const ans = dnsPacket.encode({
      type:'response',
      id: incomingReq.id,
      flags:dnsPacket.AUTHORITATIVE_ANSWER,
      questions: incomingReq.questions,
      answers: [{
          type:'A',
          class:'IN',
          name: incomingReq.questions[0].name,
          data: ipFromDb
      }]
    });
    server.send(ans, rinfo.port, rinfo.address);
  } else {
    console.log(`Domain not found: ${incomingReq.questions[0].name}`);
  }
});

server.bind(200, () => console.log('DNS Server is running on PORT 200'));
