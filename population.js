function Population(popSize) {
	this.rockets = [];
	this.popsize = popSize;
	this.matingpool = [];
	this.failureCount = 0;
	this.successCount = 0;
	this.currentGeneration = 0;
	var checkCounted = [];

	// Creating population.
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
		this.currentGeneration++;
		checkCounted = [];
		this.successCount = 0;
		this.failureCount = 0;
	}

	// Check if every individual in the population has terminated his activity.
	this.isDone = function() {
		for (var i = 0; i < this.rockets.length; i++) {
			if (!this.rockets[i].isStopped()) {
				return false;
			}
		}
		return true;
	}

	// Loop through the steps needed for the simulation.
	this.run = function() {
		for (var i = 0; i < this.rockets.length; i++) {
				this.rockets[i].update();
				this.rockets[i].show();
				if (checkCounted[i] != 1) {
					if (this.rockets[i].completed) {
						this.successCount++;
						checkCounted[i] = 1;
					} else if (this.rockets[i].crashed) {
						this.failureCount++;
						checkCounted[i] = 1;
					}
				}
		}
	}
}
