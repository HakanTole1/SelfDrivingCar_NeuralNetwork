// Get the canvas element and set its dimensions
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
//Network Canvas
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

// Get the 2D drawing context
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

//Traffic Cars
const N = 1;
const cars = generateCars(N);
//Define bestCar as global variable, let bec. it is changing
let bestCar = cars[0]; //first car is best in first frame but it will update 
if (localStorage.getItem("bestBrain")) {
  //Look through all cars
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse( //parsing JSON format bestBrain, // localStorage only work with strings
      localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }

  }

}

//traffic cars
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(3), -1500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(3), -1700, 30, 50, "DUMMY", 2, getRandomColor()),
];


//start the animation loop
animate();

//To save bestCar, in localStorage
function save() {
  localStorage.setItem("bestBrain", //Save in bestBrain attribute in localStorage
    JSON.stringify(bestCar.brain)); //value is coming from bestCar.brain 
}

function discard() {
  localStorage.removeItem("bestBrain");
}
// Generate traffic cars 
function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {


  for (let i = 0; i < traffic.length; i++) { // 
    traffic[i].update(road.borders, []); //[]: because dont want traffic cars damaged
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic); // Update the car's position and state
  }
  //To get best car, 
  bestCar = cars.find( //find the car
    c => c.y == Math.min( // whose y value is equal to min value
      ...cars.map(c => c.y) //of all the y values of the cars //we create a new array with only y values of the cars and spreading array bec. min doesnt work with array
    ));

  carCanvas.height = window.innerHeight; // Clear the canvas by resetting its height
  networkCanvas.height = window.innerHeight; // Clear the canvas by resetting its height

  carCtx.save(); // Save the current state of the canvas
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7); // Move the canvas to keep the car in view

  road.draw(carCtx); // Draw the road before the car
  for (let i = 0; i < traffic.length; i++) { //draw the traffic cars
    traffic[i].draw(carCtx, "red ");
  }

  //Draw the cars 
  carCtx.globalAlpha = 0.2; //draw semi transparant
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue"); //draw car
  }
  carCtx.globalAlpha = 1; //Normal draw
  bestCar.draw(carCtx, "blue", true); //draw car with sensors


  carCtx.restore(); // Restore the canvas to its original state


  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate); // Call animate again  on the next frame
}

