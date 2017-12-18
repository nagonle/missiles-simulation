function Rocket(dna) {
	this.pos = createVector(0, height/2);
	this.vel = createVector();
	this.acc = createVector();
	this.hu = random(255);

	this.completed = false;
	this.crashed = false;

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
			this.fitness *= 0.8;
		}
	}

	this.update = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		if (d < 10) {
			this.completed = true;
			this.pos = target.copy();
			//this.fitness *= 1/count; // lifeSpan proportion.
		}

		this.crashed = checkCrash(this.pos.x, this.pos.y);

		this.applyForce(this.dna.genes[count]);

		if (!this.completed && !this.crashed) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
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

	// Wait to the explosion to be completed.
	this.isDone = function() {
		if (this.alreadyExploded) {
			return this.explosionIsAlive == false;
		}
		return false;
	}

	this.isStopped = function() {
		return this.crashed || this.completed;
	}

	this.show = function() {
		if (!this.alreadyExploded) {
			push();
			colorMode(HSB);
			noStroke();
			fill(this.hu, 255, 255);
			translate(this.pos.x, this.pos.y);
			rotate(this.vel.heading());
			triangle(0, -4, 15, 0, 0, 4);
			pop();
		} else {
			if (this.explosionIsAlive) {
				this.explosion.show();
			}
		}
	}
}
