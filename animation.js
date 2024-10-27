import { lerp, lerp2d, qlerp } from "./functions.js"

export class Animation {
    mode = 'none'
    constructor(duration) {
        this.duration = duration
        this.frame = 0
    }
}

export class Shift extends Animation {
    constructor(phobject, target = new Vector(1, 0), duration = 60) {
        super(duration)
        this.phobject = phobject
        this.target = target
        this.startPosition = phobject.position
        this.animationFunction = qlerp
    }

    init() {
        this.startPosition = this.phobject.position
    }

    update() {
        if (this.frame == 0) {
            this.init()
        }

        if (this.frame < this.duration) {
            this.frame++
        }
        let progress = this.frame / this.duration
        progress = this.animationFunction(progress)
        this.phobject.setPosition(lerp2d(this.startPosition, this.target, progress))
    }
}

export class Create extends Animation {
    mode = 'add'
    constructor(phobject, duration = 60) {
        super(duration)
        this.phobject = phobject
        this.animationFunction = qlerp
    }

    update() {
        if (this.frame < this.duration) {
            this.frame++
        }
        let progress = this.frame / this.duration
        progress = this.animationFunction(progress)
        this.phobject.createFunction(progress)
    }
}

export class AnimateValue extends Animation {
    constructor(valueFunction, start, end, duration = 60) {
        super(duration)
        this.valueFunction = valueFunction
        this.start = start
        this.end = end
        this.animationFunction = lerp
    }

    update() {
        if (this.frame < this.duration) {
            this.frame++
        }
        let progress = this.frame / this.duration
        progress = this.animationFunction(this.start, this.end, progress)
        this.valueFunction(progress)
    }
}