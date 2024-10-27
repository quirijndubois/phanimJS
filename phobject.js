import { Vector } from "./vector.js"

export class Phobject {
    constructor(position = new Vector(0, 0), color = 'white', scale = 1) {
        this.position = position
        this.color = color
        this.scale = scale
    }

    setPosition(position) {
        this.position = position
        return this
    }

    setColor(color) {
        this.color = color
        return this
    }

    createFunction(t) {
        this.factor = t
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