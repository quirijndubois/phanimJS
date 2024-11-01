import { Vector } from "./vector.js"
import { lerp } from "./functions.js"

export class Phobject {
    constructor(position = new Vector(0, 0), color = 'white', scale = 1) {
        this.position = position
        this.color = color
        this.scale = scale
        this.phobjects = []
        this.set()
    }

    setPosition(position) {
        this.position = position
        this.set()
        return this
    }

    setColor(color) {
        this.color = color
        this.set()
        return this
    }

    createFunction(t) {
        this.factor = t
        this.set()
    }

    set() {
        this.phobjects = []
    }
}

export class Circle extends Phobject {
    constructor(position = new Vector(0, 0), radius = .5, fillColor = 'white', strokeColor = 'red', strokeWidth = .05) {
        super(position)
        this.radius = radius
        this.fillColor = fillColor
        this.strokeColor = strokeColor
        this.strokeWidth = strokeWidth
    }
}

export class Line extends Phobject {
    constructor(start = new Vector(0, 0), end = new Vector(1, 0), strokeWidth = .05) {
        super()
        this.length = length
        this.start = start
        this.end = end
        this.strokeWidth = strokeWidth
    }
}

export class Polygon extends Phobject {
    constructor(position = new Vector(0, 0), vertices = [], fillColor = 'white', strokeColor = 'red', strokeWidth = .05) {
        super(position)
        this.vertices = vertices
        this.fillColor = fillColor
        this.strokeColor = strokeColor
        this.strokeWidth = strokeWidth
    }
}

export class Curve extends Phobject {
    constructor(position = new Vector(0, 0), points = [], color = 'red', strokeWidth = .05) {
        super(position)
        this.points = points
        this.color = color
        this.strokeWidth = strokeWidth
    }
}

export class FunctionGraph extends Phobject {
    constructor(graphFunction = (x) => Math.sin(x * Math.PI), position = new Vector(0, 0), xRange = [-1, 1], yRange = [0, 1], color = 'red', strokeWidth = .05, resolution = 100) {
        super(position)
        this.graphFunction = graphFunction
        this.xRange = xRange
        this.yRange = yRange
        this.color = color
        this.strokeWidth = strokeWidth
        this.resolution = resolution
        this.set()
    }

    set() {
        this.phobjects = []
        const points = []
        for (let i = 0; i < this.resolution; i++) {
            const x = lerp(this.xRange[0], this.xRange[1], i / this.resolution)
            const y = lerp(this.yRange[0], this.yRange[1], this.graphFunction(x))
            points.push(new Vector(x, y))
        }
        this.phobjects.push(new Curve(this.position, points, this.color, this.strokeWidth))
    }
}