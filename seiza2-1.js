const keyboard = document.querySelector('#js-keyboard');
const input = document.querySelector('#myInput');

let images = [];
let imgCount = 5;

let positions =[];
let numImages = 200;

let clickPositions = [[]];

let imgWidth = 0;
let imgHeight = 0;

let img;
let imgX = 0;
let imgY = 0;

let canvas;

// const time1 = 10000;
//タイマーの秒数は指定したい秒数×１０００で書く。
let startTime = 0;
// 経過時間
let elapsedTime = 0;
//実質、timeがタイマーの役割。
const createTimer = 20000; // 星座を作る時間 20 秒
const inputTimer = createTimer + 20000; // 名前を作る時間 20 秒
// let time = 10000;
let x = 0;

//星が選ばれたらtrue、選ばれてなかったらfalse。
let selected =false;

let cx, cy;
let secondsRadius;



function preload() {

    for(let i = 0; i < imgCount; i++){
        images[i] = loadImage('star' + i + '.png')

         img = loadImage('stargradation3.png')

        
    }

}

function setup() {
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.parent('js-canvas-container');
    background(29,46,92);
    for(let i = 0; i < numImages; i++){
        let randIndex = int(random(images.length));
        let xPos = random(width);
        let yPos = random(height);
        
         positions[i] = {
             img: images[randIndex],
             x:xPos,
             y:yPos
         }
    }
    //noLoop();

    const body = document.getElementById('js-body');

    body.addEventListener('click', (e) => {
        const { currentTarget } = e; // currentTarget は、この場合 body 要素

        console.log(currentTarget.getBoundingClientRect());
        
        const x = window.scrollX + e.clientX;
        const y = window.scrollY + e.clientY;
        currentTarget.insertAdjacentHTML('afterbegin', '<span class="ripple" style="left: ' + (x) + 'px; top: ' + (y) + 'px;"></span>');
    });

    let radius = min(width, height) / 5;
    secondsRadius = radius * 0.9;

    cx = width / 2;
    cy = height / 2;

}


// function mousePressed(){
//     if (mouseX >= imgX && mouseX <= imgX + imgWidth && mouseY >=imgY && imgY + imgHeight){
//         console.log("Image clicked!")
//     }
//     clickPositions.push({x:mouseX, y:mouseY});

// }

console.log("Image clicked!")

function mousePressed(){
    selected = false;
    for(let i = 0; i < numImages; i++){
        const pos = positions[i];

        //星が選ばれているか？
        if(
            mouseX >= pos.x &&
            mouseX <= pos.x + imgWidth &&
            mouseY >= pos.y &&
            mouseY <= pos.y + imgHeight
        ){
            //星がクリックされたらここが動く。
            clickPositions[clickPositions.length - 1].push({x:mouseX, y:mouseY});
            //星が選ばれたらtrue
            console.log('星が選ばれました。')
            //falseをtrueにする。
            selected = true;
        }
    }
    if(selected === false){
        clickPositions.push([]);
    }
    imgX = mouseX;
    imgY = mouseY;

    // console.log(mouseX,mouseY);
}


function draw() {
    let from = color(29, 46, 92);
    let to = color(153, 198, 250);

  // 経過時間
  elapsedTime = millis() - startTime;

  let interA = lerpColor(from, to, elapsedTime / createTimer);
  background(interA);

  if (elapsedTime > inputTimer) {
    // 名前を作る時間が終わった時の処理
    keyboard.classList.remove('keyboard-show');
    // 名前をリセット
    input.value = '';
    // タイマーをリセット
    startTime = millis();
    // ここで画像を送る処理をする
  } else if (elapsedTime > createTimer) {
    // 星座を作る時間が終わった時の処理
    keyboard.classList.add('keyboard-show');
  }

  // background(29,46,92);

  let randIndex = int(random(images.length));

  // stroke(233,232,65);
  //０番目の画像の大きさの基準にする
  imgWidth = images[0].width / 40;
  imgHeight = images[0].height / 40;

  for (let i = 0; i < numImages; i++) {
    let pos = positions[i];
    image(
      pos.img,
      pos.x,
      pos.y,
      images[randIndex].width / 25,
      images[randIndex].height / 25
    );
  }

  for (let i = 0; i < clickPositions.length; i++) {
    let abc = clickPositions[i];
    // var abc = [clickPositions];
    for (let j = 0; j < abc.length - 1; j++) {
      console.log(abc[j]);

      let startPos = abc[j];
      let endPos = abc[j + 1];
      line(startPos.x, startPos.y, endPos.x, endPos.y);
      stroke(233, 232, 65);
    }
}
if (selected === true) {
    image(
      img,
      imgX - img.width / 30,
      imgY - img.height / 30,
      img.width / 15,
      img.height / 15
    );
}

//   image(img, imgX, imgY, img.width / 40, img.height / 40);

  // const currentTime = millis();
  // background(204);
  // let from = color(29,46,92);
  // let to = color(153, 198, 250);
  // let interA = lerpColor(from, to, currentTime/time);
  // background(interA);

  // console.log(currentTime/time)
  // if (currentTime > time) {
  //     print('timeを過ぎた');
  //     // x -= 0.5;
  // }

  // let from = color(29,46,92);
  // let to = color(153, 198, 250);
  // let interA = lerpColor(from, to, currentTime/time);
  // background(interA);
  // else if (currentTime > time1) {
  //     print('time1を過ぎた');
  //     // x += 2;
  // }



  //タイマーの表示。
  //↓横線
  noStroke();
  fill(230,230,230);
  rect(10, windowHeight-20, windowWidth, 10);
  //バーの上の●表示
  noStroke();
  fill(255,192,135);
  circle(30/2,windowHeight-15, 25);

  
  
  
}

  
// ボタン要素を取得します
const buttonlist = document.querySelectorAll('.js-button');

// ボタンがクリックされたときのイベントハンドラを設定します
// button.addEventListener('click', function() {
//   // コンソールログにメッセージを出力します
//   console.log('ボタンがクリックされました');
// });

// const highlightedItems = userList.querySelectorAll(".highlighted");

buttonlist.forEach((button) => {
    // ボタンがクリックされたときのイベントハンドラを設定します
    button.addEventListener('click', function(e) {
        const value = e.currentTarget.value;

        if (value === 'もじけし'){
            //「ち」「つ」にも濁点つくよ。
            // コンソールログにメッセージを出力します
        console.log(value);
        input.value = input.value.slice(0, -1);

        }else if (value === 'だくてん'){
            //入力されている最後の文字に濁点の文字があるか
            switch (input.value.slice(-1)) {
                case 'か':
                    //入力されている文字の末尾を削除する
                    input.value = input.value.slice(0, -1);
                    //新しく文字を入力させる。
                    input.value = input.value + 'が';
                    break;

                case 'き':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぎ';
                    break;

                case 'く':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぐ';
                    break;

                case 'け':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'げ';
                    break;

                case 'こ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ご';
                    break;

                case 'さ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ざ';
                    break;

                case 'し':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'じ';
                    break;

                case 'す':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ず';
                    break;

                case 'せ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぜ';
                    break;

                case 'そ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぞ';
                    break;

                case 'た':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'だ';
                    break;

                case 'ち':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぢ';
                    break;

                case 'つ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'づ';
                    break;

                case 'て':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'で';
                    break;

                case 'と':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ど';
                    break;

                case 'は':
                case 'ぱ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ば';
                    break;

                case 'ひ':
                case 'ぴ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'び';
                    break;

                case 'ふ':
                case 'ぷ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぶ';
                    break;

                case 'へ':
                case 'ぺ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'べ';
                    break;

                case 'ほ':
                case 'ぽ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぼ';
                    break;
                
                default:
                  console.log('default');
              }
              
            console.log(value);
            
        }else if (value === 'はんだくてん'){
            //入力されている最後の文字に濁点の文字があるか
            switch (input.value.slice(-1)) {
                case 'は':
                case 'ば':
                    //入力されている文字の末尾を削除する
                    input.value = input.value.slice(0, -1);
                    //新しく文字を入力させる。
                    input.value = input.value + 'ぱ';
                    break;

                case 'ひ':
                case 'び':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぴ';
                    break;
                
                case 'ふ':
                case 'ぶ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぷ';
                    break;

                case 'へ':
                case 'べ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぺ';
                    break;

                case 'ほ':
                case 'ぼ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぽ';
                    break;

                
                default:
                  console.log('default');
              }
              
            console.log(value);
            
        }else if (value === 'こもじ'){
            //入力されている最後の文字に濁点の文字があるか
            switch (input.value.slice(-1)) {
                case 'あ':
                    //入力されている文字の末尾を削除する
                    input.value = input.value.slice(0, -1);
                    //新しく文字を入力させる。
                    input.value = input.value + 'ぁ';
                    break;

                case 'い':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぃ';
                    break;
                
                case 'う':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぅ';
                    break;

                case 'え':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぇ';
                    break;

                case 'お':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ぉ';
                    break;

                case 'つ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'っ';
                    break;

                case 'や':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ゃ';
                    break;

                case 'ゆ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ゅ';
                    break;

                case 'よ':
                    input.value = input.value.slice(0, -1);
                    input.value = input.value + 'ょ';
                    break;

                
                default:
                  console.log('default');
              }
              
            console.log(value);
            
        }else if (value === 'けってい'){
            //入力されている最後の文字に濁点の文字があるか
            saveCanvas(canvas, ((input.value) + '座'), 'png');
              
            console.log(value);
            
        }else{
            // コンソールログにメッセージを出力します
        console.log(value);
        input.value = ((input.value) + value);
        }

        
    });
});

// document.getElementById('js-button').addEventListener('click', (ev) => {
//     document.getElementById('js-button').insertAdjacentHTML('afterbegin', '<span class="ripple" style="left: ' + (ev.offsetX) + 'px; top: ' + (ev.offsetY) + 'px;"></span>');
// })


//ｓキーを押すと画像をpngで保存する。
// function keyPressed() {
//     if (key == 's') {
//         saveCanvas(c, ((input.value) + '座'), 'png');
//     }
// }