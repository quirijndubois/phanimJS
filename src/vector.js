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

    magSquared() {
        return this.x * this.x + this.y * this.y
    }

    magnitude() {
        return Math.sqrt(this.magSquared())
    }

    mult(factor) {
        return new Vector(this.x * factor, this.y * factor)
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y
    }

    normalize() {
        return this.mult(1 / this.magnitude())
    }

    distance(vector) {
        return Math.sqrt((this.x - vector.x) * (this.x - vector.x) + (this.y - vector.y) * (this.y - vector.y))
    }
}

export function add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y)
}

export function sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y)
}

export function magSquared(v) {
    return v.x * v.x + v.y * v.y
}

export function magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y)
}

export function normalize(v) {
    return v.mult(1 / magnitude(v))
}