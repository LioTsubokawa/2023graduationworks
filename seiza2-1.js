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


//星が選ばれたらtrue、選ばれてなかったらfalse。
let selected =false;



function preload() {

    for(let i = 0; i < imgCount; i++){
        images[i] = loadImage('star' + i + '.png')

        img = loadImage('stargradation3.png')
    }

}

function setup() {
    createCanvas(windowWidth,windowHeight);
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
}


function draw() {
    background(29,46,92);
    let randIndex = int(random(images.length));

    // stroke(233,232,65);
    //０番目の画像の大きさの基準にする
    imgWidth = images[0].width /40;
    imgHeight = images[0].height /40;


    for(let i = 0; i < numImages; i++){
        let pos = positions[i];
        image(pos.img, pos.x, pos.y, images[randIndex].width / 25,images[randIndex].height / 25);
    }

    for(let i =0; i <clickPositions.length  ; i++){
        let abc = clickPositions[i];
        // var abc = [clickPositions];
        for(let j =0; j <abc.length - 1 ; j++){
            console.log(abc[j])
            
            let startPos = abc[j];
            let endPos = abc[j + 1];
            line(startPos.x, startPos.y, endPos.x, endPos.y);
            stroke(233,232,65);
        }
    }
    if(selected === true){
        image(img, (imgX-(img.width/30)), (imgY-(img.height/30)), img.width / 15, img.height / 15);
    }
    // image(img, imgX, imgY, img.width / 40, img.height / 40);
}




