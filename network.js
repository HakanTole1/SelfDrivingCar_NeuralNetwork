class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level( //For each level specify input and output count 
        neuronCounts[i], neuronCounts[i + 1]
      ));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(
      givenInputs, network.levels[0]); //First level produce it output
    for (let i = 1; i < network.levels.length; i++) { //remainging levels
      outputs = Level.feedForward(
        outputs, network.levels[i]); //Puting in the output of the previous level into new level as the input
    }
    return outputs; //Return the final outputs, card should go :forward,backward,left,right 
  }

  //mutate a network 
  static mutate(network, amount = 1) { //if the amount go %100 then we get 
    network.levels.forEach(level => { //for each level 
      for (let i = 0; i < level.biases.length; i++) { // for all biases
        level.biases[i] = lerp(
          level.biases[i], //current value of biases
          Math.random() * 2 - 1, //random value between -1 and 1
          amount //depending on that amount 
        )
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          )
        }
      }
    });
  }



}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount); //get from car sensors
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    //connect every input neuron to every output neuron 
    this.weights = [];
    for (let i = 0; i < inputCount; i++) { //For each input node we have number of output connections
      this.weights[i] = new Array(outputCount);
    }

    //Randomize
    Level.#randomize(this);

  }

  //we want to serialize this object afterwards, and methods dont serialize
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        //for every input output pair set weight random, Math.random gives 0-1
        level.weights[i][j] = Math.random() * 2 - 1; // -1 and 1
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  //Compute the output values with feed forward algorithm
  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) { //go through all level inputs
      level.inputs[i] = givenInputs[i];
    }
    //get the outputs
    for (let i = 0; i < level.outputs.length; i++) {
      //calculate sum inputs and weights
      let sum = 0
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1; //Turn on 
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}
