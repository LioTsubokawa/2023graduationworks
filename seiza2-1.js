let images = [];
let imgCount = 5;

let positions =[];
let numImages = 200;

let clickPositions = [];




function preload() {

    for(let i = 0; i < imgCount; i++){
        images[i] = loadImage('star' + i + '.png')
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



function mousePressed(){
    if (mouseX >= imgX && mouseX <= imgX + imgWidth && mouseY >=imgY && imgY + imgHeight){
        clickPositions.push({x:mouseX, y:mouseY});
    }
    
}

console.log("Image clicked!")

function draw() {
    let randIndex = int(random(images.length));

    // stroke(233,232,65);

    for(let i = 0; i < numImages; i++){
        let pos = positions[i];
        image(pos.img,pos.x,pos.y,images[randIndex].width/50,images[randIndex].height/50);
    }

    for(let i =0; i <clickPositions.length - 1 ; i++){
        let startPos = clickPositions[i];
        let endPos = clickPositions[i + 1];
        line(startPos.x, startPos.y, endPos.x, endPos.y);
        stroke(233,232,65);
    }
    
}





