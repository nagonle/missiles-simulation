function Explosion(x, y, hu) {

	this.pos = createVector(x, y);
	this.particles = [];
	this.hu = hu;
	this.numberOfParticles = 30;

	this.lifespan = 120;

	for (var i = 0; i < this.numberOfParticles; i++) {
		var p = new Particle(this.pos.x, this.pos.y, this.hu);
		this.particles.push(p);
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.update = function() {
		this.lifespan -= 3;
		for (var i = this.particles.length - 1; i >= 0; i--) {
			this.particles[i].vel.mult(0.9);
			this.particles[i].update();
		}
	}

	this.isDone = function() {
		return this.lifespan < 0;
	}

	this.show = function() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].show();
		}
		strokeWeight(2);
		stroke(120, 255, 255, this.lifespan);
	}
}
