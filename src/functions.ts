import { Vector } from "./vector"

export function cloneObject(obj: any) {
    const clone = {} as any;
    for (const key in obj) {
        if (typeof obj[key] !== 'function') {
            clone[key] = obj[key];
        }
    }
    return clone;
}

export function mapRange(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number) {
    return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow
}

export function lerp(a: number, b: number, t: number) {
    return a * (1 - t) + b * t
}

export function lerp2d(a: Vector, b: Vector, t: number) {
    return new Vector(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
}

export function qlerp(t: number) {
    return lerp(t ** 2, t ** (1 / 2), t)
}

export function slerp(t: number) {
    return Math.sin(t * Math.PI - Math.PI / 2) / 2 + 0.5
}

export function round_to_power_of_2(value: number) {
    const log_value = Math.log(Math.abs(value)) / Math.log(2)
    const rounded_log = Math.ceil(log_value)
    const result = 2 ** rounded_log
    return {
        closest: result,
        distance: rounded_log - log_value
    }
}

export function tupleToRGB(t: number[]) {
    if (t.length != 3) {
        return t
    }
    return `rgb(${t[0]}, ${t[1]}, ${t[2]})`
}

export function calulateSpringForce(base: Vector, position: Vector,targetLength: number,springConstant: number) {
    const diff = base.sub(position)
    const diff_length = diff.magnitude()
    const diff_norm = diff.mult(1 / diff_length)
    const force_strength = -springConstant * (targetLength - diff_length)
    const force = diff_norm.mult(force_strength)

    return force
}