import { Vector } from "./vector.js"

export class Phobject {
    constructor(position = new Vector(0, 0), color = 'white') {
        this.position = position
        this.color = color
    }

    setPosition(position) {
        this.position = position
        return this
    }

    setColor(color) {
        this.color = color
        return this
    }
}

export class Circle extends Phobject {
    constructor(position = new Vector(0, 0), radius = .5) {
        super(position)
        this.radius = radius
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