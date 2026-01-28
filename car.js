//Car 
class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3, color = "blue") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0; // Current speed of the car
    this.acceleration = 0.2; // Acceleration rate
    this.maxSpeed = maxSpeed; // Maximum speed
    this.friction = 0.05; // Friction to slow down the car
    this.angle = 0;  //To avoid diagonal speed increase

    this.damage = false; // Car damage state

    this.useBrain = controlType == "AI"; //If our controlType is AI, brain is going to be in use

    //sensors 
    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this); // Attach a sensor to the car
      this.brain = new NeuralNetwork(
        [this.sensor.rayCount, 6, 4] //Hidden Layer:6, Output Layer: 4 (Forward,Backward,Left,Right) 
      );
    }

    this.controls = new Controls(controlType); // Initialize controls for the car

    //Refer to image png
    this.img = new Image();
    this.img.src = "car.png"

    //AI car sized new canvas for other cars
    this.mask = document.createElement("canvas");
    this.mask.width = width;
    this.mask.height = height;
    //draw the car on mini canvas first
    const maskCtx = this.mask.getContext("2d");
    this.img.onload = () => { //wait for image to load
      maskCtx.fillStyle = color;
      maskCtx.rect(0, 0, this.width, this.height);
      maskCtx.fill();

      //When we are going to draw car image,  blue rectangle keeps color (blue) on where it overlaps with the visible pixels of the car image
      maskCtx.globalCompositeOperation = "destination-atop";
      maskCtx.drawImage(this.img, 0, 0, this.width, this.height)

    }

  }


  //update method to update car state
  update(roadBorders, traffic) {
    if (!this.damaged) { //only move if not damaged
      this.#move();
      this.polygon = this.#createPolygon(); // Update the car's polygon for collision detection
      this.damaged = this.#assessDamage(roadBorders, traffic); // Check for collisions
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic); // Update the sensor's rays
      const offsets = this.sensor.readings.map( //readings : X,Y,offset
        s => s == null ? 0 : 1 - s.offset //To make our neurons to receive low values if object is far away, higher values if object close
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);


      //To use neuralNetwork 
      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamage(roadBorders, traffic) { // private method to check for collisions
    for (let i = 0; i < roadBorders.length; i++) { // go through each road border
      if (polysIntersect(this.polygon, roadBorders[i])) { // use polysIntersect function to check for intersection
        return true; // if there is a collision, return true
      }
    }
    for (let i = 0; i < traffic.length; i++) { // go through each road border
      if (polysIntersect(this.polygon, traffic[i].polygon)) { // use polysIntersect function to check for intersection
        return true; // if there is a collision, return true
      }
    }
    return false; // if no collisions, return false
  }

  //to detect car corners
  #createPolygon() {
    const points = []; //array to hold corner points
    const rad = Math.hypot(this.width, this.height) / 2; //distance from center to corner for car
    const alpha = Math.atan2(this.width, this.height); //angle between center and corner
    points.push({// top-right corner
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad
    });
    points.push({// top-left corner
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad
    });
    points.push({ // 
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad, //Math.PI= 180 degree, to go opposite direction
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
    });
    points.push({ // 
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad, //Math.PI= 180 degree, to go opposite direction
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
    });
    return points;


  }


  //private method to handle car movement
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration; // Increase speed
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration; // Decrease speed
    }

    // Limit speed to maxSpeed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction; // Apply friction when moving forward
    }
    if (this.speed < 0) {
      this.speed += this.friction; // Apply friction when moving backward
    }

    //To prevent very small speeds
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1; // Determine direction of movement, when reverse controls are applied
      //Left and Right controlles
      if (this.controls.left) {
        this.angle += 0.03 * flip; // Update angle based on speed
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip; // Update angle based on speed
      }
    }

    //to move car in direction of angle
    this.x -= Math.sin(this.angle) * this.speed; // Update position based on speed
    this.y -= Math.cos(this.angle) * this.speed;
  }



  //draw car on canvas
  draw(ctx, drawSensor = false) {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx); // Draw the sensor rays
    }


    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    if (!this.damaged) {
      ctx.drawImage(this.mask,
        -this.width / 2,
        - this.height / 2,
        this.width,
        this.height);
      ctx.globalCompositeOperation = "multiply";
    }
    ctx.drawImage(this.img,
      -this.width / 2,
      - this.height / 2,
      this.width,
      this.height);
    ctx.restore(); // to avoid translate and rotate again and again for every car and each frame



  }
}
