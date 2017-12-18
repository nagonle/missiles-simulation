// All map utils.
function drawMap() {
	background(10);
	// Canvas 1000x600.
	// Starting Point.
	target = createVector(width - 20, height/2);

	colorMode(RGB);
	noStroke();
	fill(204, 20, 20, 255);
	ellipse(0, 300, 12, 12);

	fill(204, 20, 20, 80);

	// Obstacles.
	rectMode(CENTER);
	rect(147, 138, 25, 165);
	rect(147, 462, 25, 165);

	rect(300, 300, 25, 165);

	rect(525, 55, 25, 110);
	rect(525, 545, 25, 110);

	rect(651, 303, 25, 275);

	rect(882, 165, 25, 110);
	rect(882, 435, 25, 110);

	rect(860, 13, 110, 25);
	rect(860, 587, 110, 25);

	// Target.
	fill(204, 20, 20, 255);
	ellipse(986, 300, 12, 12);
}

function checkCrash(posX, posY) {
	if (checkCrashRect(posX, posY, 147, 138, 30, 165)) {
		return true;
	} else if (checkCrashRect(posX, posY, 147, 462, 30, 165)) {
		return true;
	} else if (checkCrashRect(posX, posY, 300, 300, 30, 165)) {
		return true;
	} else if (checkCrashRect(posX, posY, 525, 55, 25, 110)) {
		return true;
	} else if (checkCrashRect(posX, posY, 525, 545, 25, 110)) {
		return true;
	} else if (checkCrashRect(posX, posY, 651, 303, 25, 275)) {
		return true;
	} else if (checkCrashRect(posX, posY, 882, 165, 25, 110)) {
		return true;
	} else if (checkCrashRect(posX, posY, 882, 435, 25, 110)) {
		return true;
	} else if (checkCrashRect(posX, posY, 860, 13, 110, 25)) {
		return true;
	} else if (checkCrashRect(posX, posY, 860, 587, 110, 25)) {
		return true;
	} else if (checkCrashBorders(posX, posY)) {
		return true;
	}

	return false;
}

function checkCrashBorders(posX, posY) {
	var crashed = false;
	if (posX > width || posX < 0) {
		crashed = true;
	} else if (posY > height || posY < 0) {
		crashed = true;
	}
	return crashed;
}


function checkCrashRect(posX, posY, rectPosX, rectPosY, rectWidth, rectHeight) {
		if (posX > (rectPosX-rectWidth/2) && posX < (rectPosX+rectWidth/2) && posY > (rectPosY-rectHeight/2) && posY < (rectPosY+rectHeight/2)) {
			return true;
		}
		return false;
}
