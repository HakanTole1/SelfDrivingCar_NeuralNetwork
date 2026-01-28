class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    //Road go infinitely up and down
    const infinity = 1000000;
    this.top = -infinity; //y coordinate goes up on top 
    this.bottom = infinity; // y coordinate goes down on bottom

    //borders of the road, left and right sides
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight]
    ];


  }

  //get the center of a specific lane
  getLaneCenter(laneIndex) { // laneIndex is 0-1-2  for 3 lanes 
    const laneWidth = this.width / this.laneCount; //width of each lane
    return this.left + laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth //start from the left side of the road and add half lane width
  }

  //draw the road 
  draw(ctx) {
    ctx.lineWidth = 5; //thickness of the line
    ctx.strokeStyle = "white"; //color of the line

    //draw lane lines
    for (let i = 1; i <= this.laneCount - 1; i++) { //for each lane except the borders
      //calculate x coordinate of the lane line, linear interpolation
      const x = lerp( // get x coordinate using lerp function
        this.left, //get left side of the road
        this.right, //get right side of the road
        i / this.laneCount //get the fraction of the lane
      );



      ctx.setLineDash([20, 20]); //dashed line pattern, 20 pixels line, 20 pixels space

      //vertical line on the left side of the screen
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke()
    }

    //draw road borders
    ctx.setLineDash([]); //solid line for borders
    this.borders.forEach(border => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });

  }
}





