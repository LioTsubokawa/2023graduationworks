import osc from 'osc';

const udpPort = new osc.UDPPort({
  // metadata: true,
  remoteAddress: '127.0.0.1',
  remotePort: 12001,
});


// Open the socket.
udpPort.open();

// When the port is read, send an OSC message to, say, SuperCollider
udpPort.on("ready", function () {
  console.log('ready');
  udpPort.send(
    {
      address: '/position',
      args: [
        {
          type: 's',
          value: 'default',
        },
        {
          type: 'i',
          value: 100,
        },
      ],
    }
  );
});