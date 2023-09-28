import robot from 'robotjs';
import osc from 'osc';

const udpPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 8000,
  metadata: true,
});

const { width, height } = robot.getScreenSize();

udpPort.on('message', function (oscMsg, _timeTag, info) {
  const { address, args } = oscMsg;

  if (address === '/touches' && args.length > 1) {
    const x = args[1].value;
    const y = args[2].value;
    robot.moveMouse(x, y);
    // console.log(args[0].value, args[1].value);
  }

  console.log('An OSC message just arrived!', oscMsg);
  console.log('Remote info is: ', info);
});

udpPort.open();