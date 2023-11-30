
const keyboard = document.querySelector('#js-keyboard');
const input = document.querySelector('#myInput');
const startButton = document.querySelector('#js-start-button');
const ketteiButton = document.querySelector('#kettei');
const starName = document.querySelector('#myStar');
const starImages = document.querySelector('#seiza_img');
const API_BASE_URL = 'https://28o7sq3hdf.execute-api.ap-northeast-1.amazonaws.com/dev';

const stars = [];
const lines = [];
let isCreateMode = false;//星座を作っている画面ではtrueになる。

let images = [];
let imgCount = 5;//星の種類。

let positions =[];
let numImages = 30;//星の数。

let clickPositions = [[]];//線の頂点の座標。

let imgWidth = 0;
let imgHeight = 0;

let img;
let imgX = 0;
let imgY = 0;

let canvas;

let x1 = 100; // 初期化

// const time1 = 10000;
//タイマーの秒数は指定したい秒数×１０００で書く。
let startTime = 0;
// 経過時間
let elapsedTime = 0;
//実質、timeがタイマーの役割。
const createTimer = 30000; // 星座を作る時間 20 秒
const inputTimer = createTimer + 30000; // 名前を作る時間 20 秒
// let time = 10000;
let x = 0;

//星が選ばれたらtrue、選ばれてなかったらfalse。
let selected =false;

let cx, cy;
let secondsRadius;

const bgm = new Howl({
    autoplay :true,
    src: ['audio.mp3'],
    loop:true,
});

const selectSE = new Howl({
    src : ['star.mp3'],
});

//星の座標を更新する。
function uppdatePosition(){

    stars.splice(0,stars.length);


    //星の画像（種類）と座標を決める。
    for(let i = 0; i < numImages; i++){
        const randIndex = int(random(images.length));
        const xPos = random(width);
        const yPos = random(height);

        //星を作る
        stars.push(new Star(xPos,yPos,images[randIndex]));
        
        // positions[i] = {
        //      img: images[randIndex],
        //      x:xPos,
        //      y:yPos,
        // }
    }
}



function preload() {

    img = loadImage('stargradation3.png')

    for(let i = 0; i < imgCount; i++){
        images[i] = loadImage('star' + i + '.png')

    }

    // img = loadImage('change.png');

}

function setup() {
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.parent('js-canvas-container');
    background(29,46,92);

    // imageMode(CENTER);

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

    console.log(canvas);



    // image(img, 0, 0, width, height, 0, 0, img.width, img.height);

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
    for(let i = 0; i < stars.length; i++){
        const star = stars[i];

        //星が選ばれているか？
        if(
            mouseX >= star.x - imgWidth * 0.5&&
            mouseX <= star.x + imgWidth * 0.5&&
            mouseY >= star.y - imgHeight * 0.5&&
            mouseY <= star.y + imgHeight * 0.5&&
            isCreateMode
        ){
            const index = clickPositions.length - 1;
            selectSE.play();
            star.select();
            //星がクリックされたらここが動く。
            // clickPositions[clickPositions.length - 1].push({
            //     x:star.x, 
            //     y:star.y,
            // });
            clickPositions[index].push({
                x: star.x,
                y: star.y,
            });

            const positionsLength = clickPositions[index].length;
            const lastIndex = positionsLength - 1;

            if (positionsLength >= 1) {
                lines.push(
                  new Line(
                    clickPositions[index][lastIndex - 1].x,
                    clickPositions[index][lastIndex - 1].y,
                    clickPositions[index][lastIndex].x,
                    clickPositions[index][lastIndex].y
                  )
                );
            }

            //星が選ばれたらtrue
            console.log('星が選ばれました。')
            //falseをtrueにする。
            selected = true;
            console.log(positions[i]);
            break;
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

    //星座を１つずつ更新する
    stars.forEach((star)=>{
        star.update();
    });
    
    //   // 経過時間
    //   elapsedTime = millis() - startTime;

    //   let from = color(29, 46, 92);
    //   let to = color(153, 198, 250);
    //   let progress = elapsedTime / createTimer; // 「星座を作る」や「名前を作る」の進捗率 0.0 ~ 1.0
    //   let interA = lerpColor(from, to, elapsedTime / createTimer);
    //   background(interA);
 background(21,30,60);

    //   if (elapsedTime > inputTimer) {
    //     // 名前を作る時間が終わった時の処理
    //     keyboard.classList.remove('keyboard-show');
    //     // 名前をリセット
    //     input.value = '';
    //     // タイマーをリセット
    //     startTime = millis();
    //     // ここで画像を送る処理をする
    //   } else if (elapsedTime > createTimer) {
    //     // 星座を作る時間が終わった時の処理
    //     keyboard.classList.add('keyboard-show');
    //     progress = (elapsedTime - createTimer) / (inputTimer - createTimer);
    //   }

    // background(29,46,92);

    //   let randIndex = int(random(images.length));

  // stroke(233,232,65);
  //０番目の画像の大きさの基準にする
  imgWidth = images[0].width * 0.14;
  imgHeight = images[0].height * 0.14;//画像のサイズを0.14倍にする。（約７分の１）



//星の画像を表示する。
// for (let i = 0; i < positions.length; i++) {
//     let pos = positions[i];
//     image(
//       pos.img,
//       pos.x,
//       pos.y,
//       images[randIndex].width / 7,//画像の幅を5分の1にする。
//       images[randIndex].height / 7,//画像の高さを5分の1にする。
//     );
// }


  //↓線結んでるコード
for (let i = 0; i < clickPositions.length; i++) {
    let abc = clickPositions[i];
    // var abc = [clickPositions];
    
        for (let j = 0; j < abc.length - 1; j++) {
        //   console.log(abc[j]);

        //   if(
        //     mouseX >= pos.x &&
        //     mouseX <= pos.x + imgWidth &&
        //     mouseY >= pos.y &&
        //     mouseY <= pos.y + imgHeight){
        //         startPos.x = images[randIndex].width-(images[randIndex].width/2)
        //         endPos.x = images[randIndex].width-(images[randIndex].width/2)
        //         startPos.y = images[randIndex].height-(images[randIndex].height/2)
        //         endPos.y = images[randIndex].height-(images[randIndex].height/2)
        //     }

      let startPos = abc[j];
      let endPos = abc[j + 1];
      line(startPos.x,startPos.y,endPos.x,endPos.y);
      strokeWeight(4);
      stroke(233, 232, 65);
    }
}

//線を１つずつ描画する。
lines.forEach((line) => {
    line.draw();
});

//星の座標を１つずつ描画する。
stars.forEach((star)=>{
    star.draw();
});


if (selected === true) {
    image(
        img,
        imgX - img.width / 30,
        imgY - img.height / 30,
        img.width / 15,
        img.height / 15,
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



//   //タイマーの表示。
//   //↓横線
//   noStroke();
//   fill(230,230,230);
//   rect(10, windowHeight-20, windowWidth, 10);
//   //バーの上の●表示
//   noStroke();
//   fill(255,192,135);
//   circle(30/2,windowHeight-15, 25);

//   if (x >= 400) { // 繰り返し条件
//     noLoop();
//   }

//   x1 += 5; // 更新式

//     // タイマーの位置
//     const timerX = 1460;
//     const timerY = 75;
//     // タイマーの大きさ
//     const timerRad = 100;
  
//     push();
//     noStroke();
//     translate(timerX, timerY);
//     fill(230,230,230);
//     ellipse(0, 0, timerRad, timerRad);
//     rotate(PI / 180 * 270);
//     fill(255,192,135);
//     arc(0, 0, timerRad, timerRad, 0, progress * TWO_PI, PIE);
//     pop();

}


// function slideAnimation() {
//     // 現在の位置に10ピクセルずつ追加してスライド
//     currentPosition += 10;
//     rectangle.style.left = currentPosition + 'px';

//     // 画面外に出たらリセット
//     if (currentPosition >= window.innerWidth) {
//         currentPosition = -100; // 初期位置に戻す
//     }

//     // アニメーションを継続
//     requestAnimationFrame(slideAnimation);
// }

  
// ボタン要素を取得します




//決定ボタンの情報を読み込んでる。
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
            
        }
        
        // else if (value === 'けってい'){
        //     // let canvas = document.getElementById('seiza_img');
        //     // const ctx = canvas.canvas.getContext('2d');
        //     let mime_type = "image/png";
        //     var data_url = canvas.canvas.toDataURL(mime_type);
        //     // var base64 = window.btoa(data_url);
        //     //入力されている最後の文字に濁点の文字があるか
        //     // saveCanvas(canvas, ((input.value) + '座'), 'png');
        //     //var newImagePath = ((),png);
        //     // img = loadImage('change.png');
        //     // image(img, 0, 0, width, height, 0, 0, img.width, img.height);
        //     const url = (data_url);
        //     starImages.src = url;
        //     console.log(data_url);//imgのsrcに指定する。
        //     console.log(value);
            

            
        // }
        
        else{
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





//タイムラインの設定。インプットの中身を空にして、線を白紙にして、星の位置をリロードさせる。
const tl = gsap.timeline({
    paused: true,
    onStart: () => {
        clickPositions = [[]];
        input.value = '';
        uppdatePosition();
        console.log('タイムラインがはじまった')
        starName.textContent = 'ななし';
    }
});
const state = {
    progress : 0.0
};

//スタートボタンが消える。
tl.to("#js-start-button", {
    duration: 3,
    autoAlpha:0,
    ease: "power3.out",
});

//スタートの背景が消える。
tl.to("#js-start", {
    duration: 3,
    autoAlpha:0,
    ease: "power3.out",
    onStart: () => {
        isCreateMode = true;
    }
});

//タイマーを表示させる。
tl.to("#js-timer", {
    duration: 1,
    autoAlpha:1,
    
})



//タイマーの設定。星座作るときのタイマー。
tl.to('#js-timer',{
    duration:5,
    backgroundImage: 'conic-gradient(#FDAE66 360deg, #ccc 360deg)',
    ease :'none',
});



//キーボードを表示させる。
tl.to("#js-keyboard", {
    duration: 3,
    autoAlpha:1,
    ease: "power3.out",
    onStart: () => {
        isCreateMode = false;
    }
});


//名前つけるときのタイマー。
tl.fromTo(
    '#js-timer',
    // アニメーション始める前の設定。
    {
        backgroundImage: 'conic-gradient(#FDAE66 0deg, #ccc 0deg)',
    },
    {
        duration:5,
        backgroundImage: 'conic-gradient(#FDAE66 360deg, #ccc 360deg)',
        ease :'none',
    }
);

// tl.to(state,{
//     duration:30,
//     progress:1,
// });
//キーボードと星画面を隠す。
tl.to("#js-keyboard,#js-canvas-container" ,{
    duration: 3,
    autoAlpha:0,
    ease: "power3.in",
});


// //スキップさせるコード
// tl.addLabel("skip-target");



// tl.to("#js-canvas-container", {
//     duration: 2,
//     autoAlpha:0,
//     ease: "power3.in",
// });

//「保存されました」画面のタイマー
tl.fromTo(
    '#js-timer',
    // アニメーション始める前の設定。
    {
        backgroundImage: 'conic-gradient(#FDAE66 0deg, #ccc 0deg)',
    },
    {
        duration:5,
        backgroundImage: 'conic-gradient(#FDAE66 360deg, #ccc 360deg)',
        ease :'none',
        onStart: () => {
            if ((input.value).length  >= 1 ){
                starName.textContent = input.value;
            }

            let mime_type = "image/png";
            var data_url = canvas.canvas.toDataURL(mime_type);
            const url = (data_url);
            starImages.src = url;
            // console.log(data_url);//imgのsrcに指定する。
            // console.log(value);

         

                fetch(`${API_BASE_URL}/star`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    // 星座の名前
                    name: input.value.length > 0 ? input.value : 'ななし',
                    // 星座の画像データ（Base64 形式）
                    image: (data_url),
                    
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.status === 'OK') {
                      console.log('星座を登録しました');
                      console.log(data);
                    }
                  });
            

        }
    }

    
);

//「保存されました画面」を隠す。
tl.to("#js-save, #js-timer",{
    duration: 3,
    autoAlpha:0,
});

//交代案内の画面を１０秒間表示させる。
tl.to(state,{
    duration:10,
    progress:1,
});

//スタート画面を表示させる。
tl.to("#js-start, #js-start-button", {
    duration: 3,
    autoAlpha:1,
    ease: "power3.in",
});

console.log(startButton);

//スタートボタンが押されたらコンソールログをだす。
startButton.addEventListener('click', (e) => {

    console.log('スタートボタンが押されました。');

    tl.play(0);
    
});


// ketteiButton.addEventListener("click", () => {
//     tl.seek("skip-target");
// });


// document.getElementById("#myStar").textContent = '';