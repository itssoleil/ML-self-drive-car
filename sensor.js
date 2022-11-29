//the sensor for the car
class Sensor{
    constructor(car){
        this.car = car
        this.rayCount = 5 //ray of sensor
        this.rayLength = 150 //reach of these sensors
        this.raySpread = Math.PI/2 //angle of ray
        
        //store each individual ray
        this.rays = []

        //read if there is a border
        this.readings = []
    }

    update(roadBorders, traffic){
        this.#castRays()
        this.readings = []
        for (let i = 0; i < this.rays.length; i++){
            // add the readings of borders
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            )
        }
    }
    
    //read when it touches a border
    #getReading(ray, roadBorders, traffic){
        let touches = []

        for (let i = 0; i < roadBorders.length; i++){
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            )
            if (touch){
                touches.push(touch)
            }
        }

        for (let i = 0; i < traffic.length; i++){
            const poly = traffic[i].polygon
            for(let j = 0; j < poly.length; j++){
                const value = getIntersection(
                    ray[0], ray[1], poly[j], poly[(j + 1) % poly.length]
                )
                //if get a value is because it got touch
                if(value){
                    touches.push(value)
                }
            }
        }

        if(touches.length == 0){
            return null
        } else {
            const offsets = touches.map(e => e.offset)
            const minOffset = Math.min(...offsets)
            return touches.find(e => e.offset == minOffset)
        }
    }

    #castRays(){
        this.rays = []
        for (let i = 0; i < this.rayCount; i++){
            //found the rayAngle of each ray using lerp 
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle
            //start and endpoint of ray
            const start = {x: this.car.x, y: this.car.y}
            const end = {
                x: this.car.x- 
                Math.sin(rayAngle) * this.rayLength,
                y: this.car.y-
                 Math.cos(rayAngle) * this.rayLength
            }
            // for each ray iam gonna push the start and end as a segment to the rays array
            this.rays.push([start,end])
        }
    }

    draw(ctx){
        for (let i = 0; i < this.rayCount; i++){
            let end = this.rays[i][1]
            if (this.readings[i]){
                end = this.readings[i]
            }
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "yellow"
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            )
            ctx.lineTo(
                end.x,
                end.y
            )
            ctx.stroke()

            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = "black"
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            )
            ctx.lineTo(
                end.x,
                end.y
            )
            ctx.stroke()
        }
    }
}