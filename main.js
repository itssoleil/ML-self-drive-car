
//get the carCanvas
const carCanvas = document.getElementById('carCanvas')

//set the width to 200px
carCanvas.width = 200;

//carCanvas context
const carCtx = carCanvas.getContext('2d');

//get the networkCanvas
const networkCanvas = document.getElementById('networkCanvas')

//set the width to 200px
networkCanvas.width = 300;

//carCanvas context
const networkCtx = networkCanvas.getContext('2d');



// create a Road
const road = new Road(carCanvas.width/2, carCanvas.width*0.9)


const N = 100

//create a car using class car
//getLaneCenter is gonna find the lane and center the car
const cars = generateCars(N)

// create the bestCar var and init with the first car; it will change
let bestCar = cars[0]

// if it is in storage take it
if(localStorage.getItem('bestBrain')){
    // for each car
    for(let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
        if( i != 0){
            NeuralNetwork.mutate(cars[i].brain, 0.2)
        }
    }}  

// traffic is gonna be an array of cars
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -500, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -900, 30, 50, 'DUMMY', 2),
]

animate()

// store the bestCar
function save(){
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

//distroy the saved car in local storage
function discard(){
    localStorage.removeItem('bestBrain')
}

// function that generate several cars in traffic
function generateCars(N){
    const cars = []
    for (let i = 0; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100,30,50, 'AI'))
    }
    return cars
}

function animate(time){
    // for each car in traffic 
    for (let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, [])
    }
    for (let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    )
    
    //set the height to the full window innerHeight
    //iam adding this line here so it updates the height if it resizes the window
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;


    //positioning the car at 70% of carCanvas and leaving it there; the road is the one who moves
    carCtx.save()
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)

    road.draw(carCtx)
    
    //draw each element in traffic
    for (let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, 'red')
    }

    carCtx.globalAlpha = 0.2

    for (let i = 0; i < cars.length; i++){ 
        cars[i].draw(carCtx, 'blue');
    }

    carCtx.globalAlpha = 1
    bestCar.draw(carCtx, 'blue', true);


    carCtx.restore()
    
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain)
    
    //requestAnimationFrame calls the animate function many times, gives the iluttion of movement
    requestAnimationFrame(animate)

}