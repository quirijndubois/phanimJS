import { Vector } from "./vector"
import { mapRange } from "./functions"

export default class Camera {
    position: Vector
    zoom: number
    width: number
    height: number
    aspectRatio: number
    left = 0;
    right = 0;
    top = 0;
    bottom = 0;

    constructor(width: number, height: number, position = new Vector(0, 0), zoom = 5) {
        this.position = position
        this.zoom = zoom
        this.width = width
        this.height = height
        this.aspectRatio = width / height
        this.calculateBounds()
    }

    setPosition(position: Vector) {
        this.position = position
        this.calculateBounds()
        return this
    }

    setZoom(zoom: number) {
        this.zoom = zoom
        this.calculateBounds()
        return this
    }

    coords2screen(position: Vector) {
        return new Vector(
            mapRange(position.x - this.position.x, -this.zoom, this.zoom, 0, this.width),
            mapRange(position.y - this.position.y, this.zoom / this.aspectRatio, -this.zoom / this.aspectRatio, 0, this.height),
        )
    }

    screen2Global(position: Vector) {
        return new Vector(
            mapRange(position.x, 0, this.width, -this.zoom + this.position.x, this.zoom + this.position.x),
            mapRange(position.y, this.height, 0, -this.zoom / this.aspectRatio + this.position.y, this.zoom / this.aspectRatio + this.position.y),
        )
    }
    screen2Local(position: Vector) {
        return new Vector(
            mapRange(position.x, 0, this.width, -this.zoom, this.zoom),
            mapRange(position.y, this.height, 0, -this.zoom / this.aspectRatio, this.zoom / this.aspectRatio),
        )
    }

    local2Global(position: Vector) {
        return new Vector(
            mapRange(position.x, -this.zoom, this.zoom, -this.zoom + this.position.x, this.zoom + this.position.x),
            mapRange(position.y, -this.zoom / this.aspectRatio, this.zoom / this.aspectRatio, -this.zoom / this.aspectRatio + this.position.y, this.zoom / this.aspectRatio + this.position.y),
        )
    }

    length2screen(length: number) {
        return mapRange(length, 0, 2 * this.zoom, 0, this.width)
    }

    screen2length(length: number) {
        return mapRange(length, 0, this.width, 0, 2 * this.zoom)
    }

    calculateBounds() {
        this.left = this.position.x - this.zoom
        this.right = this.position.x + this.zoom
        this.top = this.position.y - this.zoom / this.aspectRatio
        this.bottom = this.position.y + this.zoom / this.aspectRatio
    }
}