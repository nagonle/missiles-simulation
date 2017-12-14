// Getting from html
var popSize;
var maxForce;
var lifeSpan;
var activateMutation;
var mutationRate;
var fitnessMultiplier;

var count = 0;
var ry = 250;
var rh = 10;
var thisCanvas;

var population;
var target;

var info;
var currentGeneration;
var countSucces;
var successRate;
var currentAge;

var currentGenerationCounter = 0;
var successCountCounter = 0;

var thisRocket;

function reloadSimulation() {
	count = 0;
	currentGenerationCounter = 0;
	successCountCounter = 0;
	currentGeneration.remove();
	countSuccess.remove();
	successRate.remove();
	currentAge.remove();
	setup();
}

function setup() {
	//bg = loadImage("assets/space.jpg");
	background(0);
  // Creating canvas.
  thisCanvas = createCanvas(800, 600);
	thisCanvas.parent("simulationCanvas")
	// Html elements.
	currentGeneration = createP();
	currentGeneration.parent("currentGeneration");
	countSuccess = createP();
	countSuccess.parent("countSuccess");
	successRate = createP();
	successRate.parent("successRate");
	currentAge = createP();
	currentAge.parent("currentAge");
	// Getting parameters from Html.
	popSize = parseInt(document.getElementById("populationSize").value);
	maxForce = parseFloat(document.getElementById("maxForce").value);
	lifeSpan = parseInt(document.getElementById("lifeSpan").value);
	activateMutation = (document.getElementById("activateMutation").value == "true");
	mutationRate = parseFloat(document.getElementById("mutationRate").value);
	fitnessMultiplier = parseFloat(document.getElementById("fitnessMultiplier").value);

	// Variable with all parameters.
	info = {"Population Size": popSize, "MaxForce":maxForce, "LifeSpan":lifeSpan, "Mutation Enabled":activateMutation, "Mutation Rate":mutationRate, "Fitness Multiplier":fitnessMultiplier};


	population = new Population();
	target = createVector(width/2, 50);
}

function draw() {
	background(0);
	currentAge.html("Current Age: " + count);

	population.run();
	count++;
	if (count == 1) {
		currentGeneration.html("Current Generation: " + currentGenerationCounter);
	}

	if (population.isDead()) {
		count = lifeSpan;
	}

	countSuccess.html("Success Count: " + successCountCounter);
	successRate.html("Success Rate: " + (successCountCounter / popSize * 100).toFixed(2) + "%");
	if (count == lifeSpan) {
		population.evaluate();
		population.selection();
		count = 0;
		currentGenerationCounter++;
		successCountCounter = 0;
	}

	noStroke();
	drawObstacles();

	ellipse(target.x, target.y, 16, 16);
}

function drawObstacles() {
	fill(255);
	rect(180, ry, 100, rh);
	rect(320, ry, 80, rh);
	rect(440, ry, 80, rh);
	rect(560, ry, 100, rh);
}

function Population() {
	this.rockets = [];
	this.popsize = popSize;
	this.matingpool = [];

	for (var i=0; i<this.popsize; i++) {
		this.rockets[i] = new Rocket();
	}

	this.evaluate = function() {
		var maxfit = 0;
		for (var i = 0; i < this.popsize; i++) {
			this.rockets[i].calculateFitness();
			if (this.rockets[i].fitness > maxfit) {
				maxfit = this.rockets[i].fitness;
			}
		}

		for (var i = 0; i < this.popsize; i++) {
			this.rockets[i].fitness /= maxfit;
		}

		this.matingpool = [];
		for (var i = 0; i < this.popsize; i++) {
			var n = this.rockets[i].fitness * 100;
			for (var j = 0; j < n; j++) {
				this.matingpool.push(this.rockets[i]);
			}
		}
		
	}

	this.selection = function() {
		var newRockets= [];
		for (var i = 0; i < this.rockets.length; i++) {
			var parentA = random(this.matingpool).dna;
			var parentB = random(this.matingpool).dna;
			var child = parentA.crossover(parentB);
			if (activateMutation) {
				child.mutation();
			}
			newRockets[i] = new Rocket(child);
		}
		this.rockets = newRockets;
	}

	this.isDead = function() {
		for (var i = 0; i < this.rockets.length; i++) {
			if (!this.rockets[i].isDone()) {
				return false;
			}
		}
		return true;
	}

	this.run = function() {
		for (var i=0; i<this.rockets.length; i++) {
				this.rockets[i].update();
				this.rockets[i].show();
		}
	}
}

function DNA(genes) {
	if (genes){
		this.genes = genes;
	} else {
		this.genes = [];
		for (var i = 0; i < lifeSpan; i++) {
			this.genes[i] = p5.Vector.random2D();
			this.genes[i].setMag(maxForce);
		}
	}

	this.crossover = function(partner) {
		var newgenes = [];
		var mid = floor(random(this.genes.length));
		for (var i = 0; i < this.genes.length; i++) {
			if (i > mid){
				newgenes[i] = this.genes[i];
			} else {
				newgenes[i] = partner.genes[i];
			}
		}
		return new DNA(newgenes);
	}

	this.mutation = function() {
		for (var i = 0; i < this.genes.length; i++) {
			if (random(1) < mutationRate) {
				this.genes[i] = p5.Vector.random2D();
				this.genes[i].setMag(maxForce);
			}
		}
	}
}

function Rocket(dna) {
	this.pos = createVector(width/2, height);
	this.vel = createVector();
	this.acc = createVector();
	//this.hu = random(255);
	this.hu = random(255);
	this.completed = false;
	this.crashed = false;
	this.flagOfCount = false;
	this.alreadyExploded = false;
	this.explosionIsAlive = true;

	this.explosion;

	if (dna) {
		this.dna = dna;
	} else {
		this.dna = new DNA();
	}
	this.fitness = 0;

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.calculateFitness = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		this.fitness = map(d, 0, width, width, 0);
		if (this.completed) {
			this.fitness *= fitnessMultiplier;
		}
		if (this.crashed) {
			this.fitness = 1;
		}
	}

	this.update = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		if (d < 10) {
			this.completed = true;
			this.pos = target.copy();
			//this.fitness *= 1/count; // lifeSpan proportion.
		}

		if (this.pos.x > 180 && this.pos.x < 180 + 100 && this.pos.y > ry && this.pos.y < ry +rh) {
			this.crashed = true;
		} else if (this.pos.x > 320 && this.pos.x < 320 + 80 && this.pos.y > ry && this.pos.y < ry +rh) {
			this.crashed = true;
		} else if (this.pos.x > 440 && this.pos.x < 440 + 80 && this.pos.y > ry && this.pos.y < ry +rh) {
			this.crashed = true;
		} else if (this.pos.x > 560 && this.pos.x < 560 + 100 && this.pos.y > ry && this.pos.y < ry +rh) {
			this.crashed = true;
		}

		if (this.pos.x > width || this.pos.x < 0) {
			this.crashed = true;
		}
		if (this.pos.y > height || this.pos.y < 0) {
			this.crashed = true;
		}

		this.applyForce(this.dna.genes[count]);

		if (!this.completed && !this.crashed) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}
		if (this.completed && this.flagOfCount == false) {
			this.flagOfCount = true;
			successCountCounter++;
		}

		if (this.crashed && !this.alreadyExploded) {
			this.alreadyExploded = true;
			this.explosion = new Explosion(this.pos.x, this.pos.y, this.hu);
		}
		if (this.alreadyExploded) {
			if (this.explosionIsAlive) {
				if (this.explosion.isDone()) {
					this.explosion = [];
					this.explosionIsAlive = false;
				} else {
					this.explosion.update();
				}
			}
		}
	}

	this.isDone = function() {
		//if (this.alreadyExploded) {
			//return this.explosion.isDone();
		//}
		//return false;
		if (this.alreadyExploded) {
			return this.explosionIsAlive == false;
		}
		return false;
	}

	this.show = function() {
		if (!this.alreadyExploded) {
			push();
			noStroke();
			fill(this.hu, 255, 255);
			translate(this.pos.x, this.pos.y);
			rotate(this.vel.heading());
			triangle(0, -4, 15, 0, 0, 4);
			pop();
		} else {
			colorMode(HSB);
			if (this.explosionIsAlive) {
				this.explosion.show();
			}
		}
	}
}
