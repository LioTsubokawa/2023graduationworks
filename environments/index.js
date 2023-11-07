import robot from 'robotjs';
import osc from 'osc';

const udpPort = new osc.UDPPort({
  localAddress: '127.0.0.1',
  localPort: 8000,
  metadata: true,
});

// クリックしたことにする ID のリスト
const ids = [];

const { width, height } = robot.getScreenSize();

udpPort.on('message', function (oscMsg, _timeTag, info) {
  const { address, args } = oscMsg;
  console.log(args);
  if (address === '/touches' && args.length > 1) {
    const x = args[1].value;
    const y = args[2].value;
    const id = args[3].value;

    // すでにクリックされている id であれば無視する
    if (ids.includes(id)) {
      return;
    } else {
      // クリックしたことのない id であれば画面をクリックしたことにする
      robot.moveMouse(x, y);
      robot.mouseClick();
      // クリックした事にした id を記録する
      ids.push(id);
    }

    // console.log(args[0].value, args[1].value);
  }

  // console.log('An OSC message just arrived!', oscMsg);
  // console.log('Remote info is: ', info);
});

udpPort.open();