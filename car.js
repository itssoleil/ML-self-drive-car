class Car{
    //x and y are the location
    constructor(x, y, width, height, controlType, maxSpeed = 3){
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.speed = 0
        this.accelaration = 0.2
        //because the speed can be infinite increase by the keys i need a max.
        this.maxSpeed = maxSpeed
        this.friction = 0.05
        //create angle var so when my car goes in adiagonal it doesnt pass the maxSpeed
        this.angle = 0
        this.damaged = false

        this.useBrain = controlType == 'AI'

        // disable the ray sensor for dummy car
        if(controlType != 'DUMMY'){
            this.sensor = new Sensor(this)
            
            this.brain = new NeuralNetwork(
                //array of neuron counts
                [this.sensor.rayCount,
                     6,
                      4 //foward, right, left, reverse
                    ]
             )
        }

        //add controls for car
        this.controls = new Controls(controlType)
    }

    //this method is going to move the car
    update(roadBorders, traffic){
        //if my car is damge it will stop
        if(!this.damaged){
            this.#move()
            this.polygon = this.#createPolygon()
            this.damaged = this.#assesDamage(roadBorders, traffic)
        }
        if (this.sensor){
            this.sensor.update(roadBorders, traffic)
            //take the offsets from the sensor readings
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offset // from each sensor readin 's', if it is null return 0, esle return 1 - the sesor offset
                // the neuron will receive LOW values if the object is far away, and higher if the object is close
                )
                const outputs = NeuralNetwork.feedForward(offsets, this.brain)

                if(this.brain){
                    this.controls.forward = outputs[0]
                    this.controls.left = outputs[1]
                    this.controls.right = outputs[2]
                    this.controls.reverse = outputs[3]

                }
            }
        

    }

    #assesDamage(roadBorders, traffic){
        for (let i = 0; i < roadBorders.length; i++){
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true
            }
        }
        for (let i = 0; i < traffic.length; i++){
            if(polysIntersect(this.polygon, traffic[i].polygon)){
                return true
            }
        }
        return false
    }

    #createPolygon(){
        const points = []
        const rad = Math.hypot(this.width, this.height)/2
        const alpha = Math.atan2(this.width, this.height)
        points.push({ // top-right point
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        }) 
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        })
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        })  
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        })  
        return points
    }


    #move(){
        if (this.controls.forward){
            //modify the speed
            this.speed += this.accelaration
        }
        if (this.controls.reverse){
            //modify the speed
            this.speed -= this.accelaration 
        }
        if (this.speed > this.maxSpeed){
            // check that it doesnt go beyond the maxspeed
            this.speed = this.maxSpeed
        }
        //use negative maxspeed to indicate that is going backwards
        if (this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2
        }
        if (this.speed > 0){
            this.speed -= this.friction
        }
        if (this.speed < 0){
            this.speed += this.friction
        }
        // completaley stop the movement
        if (Math.abs(this.speed) < this.friction){
            this.speed = 0
        }

        if (this.speed != 0){
            const flip = this.speed > 0 ? 1: -1
        
            // move in the x axis
            if (this.controls.left){
                this.angle += 0.03 * flip
            }
            if (this.controls.right){
                this.angle -= 0.03 * flip
            } }
        this.x -= Math.sin(this.angle) * this.speed
        this.y -= Math.cos(this.angle) * this.speed
    }
    
    //create a draw method, it draws the rectamgular car
    draw(ctx, color, drawSensor = false){
        if(this.damaged){
            ctx.fillStyle = "gray"
        } else{
            ctx.fillStyle = color
        }
        ctx.beginPath()
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for (let i = 1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)

        }
        ctx.fill()

        if(this.sensor && drawSensor){
            this.sensor.draw(ctx)
        }
        
    }
}

