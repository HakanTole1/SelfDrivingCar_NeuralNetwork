class Controls {
  constructor(type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    switch (type) {
      case "KEYS":
        this.#addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => { //arrow function to keep 'this' context
      switch (event.key) { // Check which key was pressed
        case "ArrowUp":
          this.forward = true; // Move forward
          break;
        case "ArrowLeft":
          this.left = true; // Turn left
          break;
        case "ArrowRight":
          this.right = true; // Turn right
          break;
        case "ArrowDown":
          this.reverse = true; // Move backward
          break;
      }
      console.table(this); // For debugging: show current control states
    };
    // Key release event listener
    document.onkeyup = (event) => { //arrow function to keep 'this' context
      switch (event.key) { // Check which key was pressed
        case "ArrowUp":
          this.forward = false; // Move forward
          break;
        case "ArrowLeft":
          this.left = false; // Turn left
          break;
        case "ArrowRight":
          this.right = false; // Turn right
          break;
        case "ArrowDown":
          this.reverse = false; // Move backward
          break;
      }
      console.table(this); // For debugging: show current control states
    };
  }

}




