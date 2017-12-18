// Getting from html
var popSize;
var maxForce;
var lifeSpan;
var activateMutation;
var mutationRate;
var fitnessMultiplier;

var count = 0;
var thisCanvas;

var population;
var target;

var currentGenerationAuxP;
var countSuccesAuxP;
var countFailureAuxP;
var successRateAuxP;
var currentAgeAuxP;

var prevGenerationAuxP;
var prevCountSuccesAuxP;
var prevCountFailureAuxP;
var prevSuccessRateAuxP;
var prevAgeAuxP;

var prevGeneration = -1;
var prevCountSucces = -1;
var prevCountFailure = -1;
var prevSuccessRate = -1;
var prevAge = -1;

var thisRocket;

function reloadSimulation() {
	count = 0;
	currentGenerationAuxP.remove();
	countSuccessAuxP.remove();
	countFailureAuxP.remove();
	successRateAuxP.remove();
	currentAgeAuxP.remove();

	prevGenerationAuxP.remove();
	prevCountSuccessAuxP.remove();
	prevCountFailureAuxP.remove();
	prevSuccessRateAuxP.remove();
	prevAgeAuxP.remove();

	setup();
}

function setup() {

  // Creating canvas.
  thisCanvas = createCanvas(1000, 600);
	thisCanvas.parent("simulationCanvas")
	background(10);

	// Auxiliar Html elements.
	currentGenerationAuxP = createP();
	currentGenerationAuxP.parent("currentGeneration");
	countSuccessAuxP = createP();
	countSuccessAuxP.parent("countSuccess");
	countFailureAuxP = createP();
	countFailureAuxP.parent("countFailure");
	successRateAuxP = createP();
	successRateAuxP.parent("successRate");
	currentAgeAuxP = createP();
	currentAgeAuxP.parent("currentAge");

	prevGenerationAuxP = createP();
	prevGenerationAuxP.parent("previousGeneration");
	prevCountSuccessAuxP = createP();
	prevCountSuccessAuxP.parent("previousCountSuccess"); 
	prevCountFailureAuxP = createP();
	prevCountFailureAuxP.parent("previousCountFailure"); 
	prevSuccessRateAuxP = createP();
	prevSuccessRateAuxP.parent("previousSuccessRate"); 
	prevAgeAuxP = createP();
	prevAgeAuxP.parent("previousAge"); 

	// Init undefined labels.
	prevGenerationAuxP.html("Generation: -1");
	prevCountSuccessAuxP.html("Success Count: 0");
	prevCountFailureAuxP.html("Failures Count: 0");
	prevSuccessRateAuxP.html("Success Rate: 0.00%");
	prevAgeAuxP.html("Age: 0");

	// Getting parameters from Html.
	popSize = parseInt(document.getElementById("populationSize").value);
	maxForce = parseFloat(document.getElementById("maxForce").value);
	lifeSpan = parseInt(document.getElementById("lifeSpan").value);
	activateMutation = (document.getElementById("activateMutation").value == "true");
	mutationRate = parseFloat(document.getElementById("mutationRate").value);
	fitnessMultiplier = parseFloat(document.getElementById("fitnessMultiplier").value);

	population = new Population(popSize);
}

function draw() {
	drawMap();
	currentAgeAuxP.html("Current Age: " + count);

	population.run();
	count++;

	currentGenerationAuxP.html("Generation: " + population.currentGeneration);
	countSuccessAuxP.html("Success Count: " + population.successCount);
	countFailureAuxP.html("Failures Count: " + population.failureCount);
	successRateAuxP.html("Success Rate: " + (population.successCount / population.popsize * 100).toFixed(2) + "%");

	if (population.isDone() || count == lifeSpan) {
		prevGenerationAuxP.html("Generation: " + population.currentGeneration);
		prevCountSuccessAuxP.html("Success Count: " + population.successCount);
		prevCountFailureAuxP.html("Failures Count: " + population.failureCount);
		prevSuccessRateAuxP.html("Success Rate: " + (population.successCount / population.popsize * 100).toFixed(2) + "%");
		prevAgeAuxP.html("Age: " + count);

		population.evaluate();
		population.selection();

		count = 0;
	}

}

