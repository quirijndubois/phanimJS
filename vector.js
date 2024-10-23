export class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y)
    }

    sub(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y)
    }
}

export function add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y)
}

export function sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y)
}