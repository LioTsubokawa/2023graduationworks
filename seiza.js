var points = [];
var gravityDistance = 90;


function setup(){
    createCanvas(windowWidth, windowHeight);// width, height
	imageMode(CENTER);
	background(29,46,92);
	makeNRandomPoints(4);
}

function createPoint(x, y){
	fill(245,241,42);
	stroke(245,241,42);
	ellipse(x, y, 10, 10);
	for(var i = 0; i < points.length; i++){
		dist(x, y, points[i].x, points[i].y) < gravityDistance ? line(x, y, points[i].x, points[i].y) : null;
	}
	points.push(createVector(x,y));
}

function mouseClicked(){
	createPoint(mouseX, mouseY);
}

function randomPoint(){
	createPoint(random(0, width), random(0, height));
}

function makeNRandomPoints(number){
	for(var i = 0; i < number; i++){
		randomPoint();
	}
}

function reset(){
	points = [];
	background(0);
}

function keyPressed() {
	switch (keyCode) {
		case 32: // Space Bar
			save();
			break;
		case 38: // Up Arrow
			gravityDistance += 10;
			break;
		case 40: // Down Arrow
			gravityDistance -= 10;
			break;
		case 81: // Q
			makeNRandomPoints(5);
			break;
		case 65: // A
			randomPoint();
			break;
		case 82: // R
			reset();
			break;
	}
}