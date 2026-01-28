class Sensor {
  constructor(car) { // where car is the car object the sensor is attached to
    this.car = car;
    this.rayCount = 5; // number of rays, cast rays different directions
    this.rayLength = 150; // length of each ray
    this.raySpread = Math.PI / 2; // spread angle of the rays

    this.rays = []; // keep each individual ray
    this.readings = []; // store the readings (intersections) of each ray, telling how far the nearest border is
  }

  update(roadBorders, traffic) { //use roadBorders to check for collisions to borders 
    this.#castRays(); // call private method to cast rays
    this.readings = []; // reset readings before calculating new ones
    for (let i = 0; i < this.rays.length; i++) {// go through each ray
      this.readings.push( // get the reading for each ray and push it to readings array
        this.#getReading(
          this.rays[i],
          roadBorders,
          traffic
        )
      );
    }
  }

  #getReading(ray, roadBorders, traffic) { // private method to get the reading for a single ray
    let touches = []; // store all the intersection points

    for (let i = 0; i < roadBorders.length; i++) { // go through each road border 
      const touch = getIntersection( // use getIntersection function to find intersection point
        ray[0], // start point of the ray
        ray[1], // end point of the ray
        roadBorders[i][0], // start point of the border
        roadBorders[i][1]  // end point of the border
      );
      if (touch) {
        touches.push(touch); // if there is an intersection, add it to touches array
      }
    }

    //for traffic cars
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      for (let j = 0; j < poly.length; j++) {
        const value = getIntersection(
          ray[0], // start point of the ray
          ray[1], // end point of the ray
          poly[j],
          poly[(j + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }


    if (touches.length == 0) {
      return null; // if no intersections, return null
    } else {
      const offsets = touches.map(e => e.offset); // get the offsets of all intersection points
      const minOffset = Math.min(...offsets); // find the minimum offset, spreading to array indivuidual elements
      return touches.find(e => e.offset == minOffset); // go through touches and return the one with the minimum offset
    }
  }

  #castRays() {
    this.rays = []; //setting rays to empty array before calculating new rays
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp( //figure out the angle of each ray, use lerp function
        this.raySpread / 2, //unit circle divided by 2 (half the spread)
        -this.raySpread / 2, // negative half the spread
        this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) // how far along the ray we are
      ) + this.car.angle; //add the car's current angle to the ray angle, to rays  angle move with the car

      //calculate the start and end points of each ray
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength
      };

      this.rays.push([start, end]); //push the start and end points as an array into rays array
    }
  }

  //draw the sensor rays
  draw(ctx) {
    //go through all of the rays
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1]; //default end point of the ray
      if (this.readings[i]) { //X,Y,OFFSET
        end = this.readings[i]; //if there is a reading, set end point to the reading point
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(
        this.rays[i][0].x,
        this.rays[i][0].y
      ); //move to the start point of the ray
      ctx.lineTo(
        end.x,
        end.y
      ); //draw line to the end point of the ray
      ctx.stroke(); //actually draw the line

      //end of array to the maximum length of the ray
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(
        this.rays[i][1].x,
        this.rays[i][1].y
      ); //move to the start point of the ray
      ctx.lineTo(
        end.x,
        end.y
      ); //draw line to the end point of the ray
      ctx.stroke(); //actually draw the line
    }
  }








}


