function Particle(x, y, hu) {
	this.pos = createVector(x, y);
	this.lifespan = 120;
	this.hu = hu;

	this.vel = p5.Vector.random2D();
	this.vel.mult(random(4));
	

	this.acc = createVector(0, 0);

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}


	this.show = function() {
		push();
		colorMode(HSB);
		strokeWeight(2);
		stroke(this.hu, 255, 255, this.lifespan);
		point(this.pos.x, this.pos.y);
		pop();
	}

}
