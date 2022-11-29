// NeuralNetwork made out of Levels
class NeuralNetwork{
    // constructor takes an array of neurons on each level
    constructor(neuronCounts){
        this.levels = []
        // for each level i am gonna specified the input and outp count
        for(let i = 0; i < neuronCounts.length - 1; i++){
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ))
        }
    }

    // given some inputs and a network iam gonna call
    // the feedFoward method FROM LEVEL
    static feedForward(givenInputs, network){
        // get the outputs from level; the first level 
        let outputs = Level.feedForward(givenInputs, network.levels[0])
      
        // looping from the reamining levels
        for(let i = 1; i < network.levels.length; i++){
            // update the outputs from the remaining levels
                outputs = Level.feedForward(outputs, network.levels[i])
            }        
        return outputs
        } 

    static mutate(network, amount = 1){
        // for each level of my network
        network.levels.forEach(level => {
            // iterate through biases
            for(let i = 0; i <level.biases.length; i++){
                // the biase is going to be equal to lerp
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i = 0; i <level.weights.length; i++){
                for(let j = 0; j <level.weights[i].length; j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        })
    }
}




class Level{
    constructor(inputCount, outputCount){
        //define the neurons
        this.inputs = new Array(inputCount)
        this.outputs = new Array(outputCount)
        // each output has a bias, a valueabove it wil be fire
        this.biases = new Array(outputCount)

        // the connection between an inout neuron and an output neuron has a weight
        this.weights = []
        for (let i = 0; i < inputCount; i++){
            // for each input i am gonna to create an array the size of output
            this.weights[i] = new Array(outputCount)
        }

        Level.#randomize(this)// the first level will have random weights
    }

    // static method:
    //-> Static methods are used to create utility functions and create objects that contain default information.
    //-> In this case its use to be able to serialize the object
    static #randomize(level){
        for(let i = 0; i<level.inputs.length; i++){
            for(let j = 0; j < level.outputs.length; j++){
                // for every input-output pair i am going to set the weight to a random value between 1 and -1
                level.weights[i][j] = Math.random() * 2 - 1
            }
        }
        // the values are -1 & 1 because the descicion the car make is right or left
        for(let i = 0; i < level.biases.length; i++){
            level.biases[i] = Math.random() * 2 - 1
        }

    }

    // given some input iam gonna compute the output values
    static feedForward(givenInputs, level){
        for(let i = 0; i < level.inputs.length; i++){
            // for every given input i am gonna firs compute them as themselve. These values come from the sensor.
            level.inputs[i] = givenInputs[i]
        }

        // for every output ia gonna calculate the sum, i am gonna init at 0
        for(let i = 0; i < level.outputs.length; i++){
            let sum = 0
            // for every input im gonna sum the product between the j input and the weight of j-i
            for(let j = 0; j < level.inputs.length; j++){
                sum += level.inputs[j] * level.weights[j][i]
            }

            // check of the sum calculated is greate than the bias
            if(sum > level.biases[i]){
                // set the level output to 1, basically TURN ON the neuron
                level.outputs[i] = 1
            }
            else {
                level.outputs[i] = 0
            }
        }
        return level.outputs
    }
}
