function lerp(A, B, t) { //linear interpolation function
  return A + (B - A) * t; //value a, difference between b and a, fraction t
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t
      };
    }
  }

  return null;
}

function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) { // go through each point in poly1
    for (let j = 0; j < poly2.length; j++) { // go through each point in poly2
      const touch = getIntersection( // check for intersection between edges
        poly1[i], // current point of poly1
        poly1[(i + 1) % poly1.length], // next point, wrap around using modulo, last point in the polly connect first point in the polygon
        poly2[j],
        poly2[(j + 1) % poly2.length] // next point, wrap around using modulo
      );
      if (touch) {
        return true; // if there is an intersection, return true
      }
    }
  }
  return false; // if no intersections found, return false
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

function getRandomColor() { //for cars
  const hue = 290 + Math.random() * 260;
  return "hsl(" + hue + ", 100%, 60%)"; //hue saturation:%100 and lightness:%60 
}
