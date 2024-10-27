import { lerp, lerp2d } from "./functions.js"

export class Animation {
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
    }

    update() {
        console.log(this.frame)
        if (this.frame < this.duration) {
            this.frame++
        }
        const progress = this.frame / this.duration
        this.phobject.position = lerp2d(this.startPosition, this.target, progress)
    }
}