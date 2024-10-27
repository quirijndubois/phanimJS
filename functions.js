import { Vector } from "./vector.js"

export function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
    return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow
}

export function lerp(a, b, t) {
    return a * (1 - t) + b * t
}

export function lerp2d(a, b, t) {
    return new Vector(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
}

export function qlerp(t) {
    return lerp(t ** 2, t ** (1 / 2), t)
}

export function slerp(t) {
    return Math.sin(t * Math.PI - Math.PI / 2) / 2 + 0.5
}