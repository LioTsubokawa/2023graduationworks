import robot from 'robotjs';
import osc from 'osc';

const udpPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 12001,
  metadata: true,
});
const { width, height } = robot.getScreenSize();

udpPort.on('message', function (oscMsg, _timeTag, info) {
  const { address, args } = oscMsg;

  if (address === '/position') {
    const [x, y] = args;
    robot.moveMouse(width * x.value, height * y.value);
  }

  console.log('An OSC message just arrived!', oscMsg);
  console.log('Remote info is: ', info);
});

udpPort.open();