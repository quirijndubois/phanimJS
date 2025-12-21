import { cloneObject, lerp, lerp2d, qlerp } from "./functions"
import { Vector } from "./vector"

export class Animation {
    phobject: any
    animationFunction: any
    mode = 'none'
    duration: number
    frame: number
    constructor(duration: number) {
        this.duration = duration
        this.frame = 0
    }
}

export class Shift extends Animation {
    target: Vector
    startPosition: Vector

    constructor(phobject: any, target = new Vector(1, 0), duration = 60) {
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
    constructor(phobject: any, duration = 60) {
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
    valueFunction: any
    start: any
    end: any

    constructor(valueFunction: any, start: any, end: any, duration = 60) {
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

export class Transform extends Animation {
    OldPhobject: any
    TargetPhobject: any
    
    constructor(phobject: any, target: any, duration = 60) {
        super(duration)
        this.phobject = phobject
        this.OldPhobject = cloneObject(phobject)
        this.TargetPhobject = target
        this.animationFunction = qlerp
    }

    update() {
        if (this.frame < this.duration) {
            this.frame++
        }
        let progress = this.frame / this.duration
        progress = this.animationFunction(progress)
        this.phobject.transformFunction(this.OldPhobject, this.TargetPhobject, progress)
    }
}