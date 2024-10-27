import Screen from "./screen.js"
import { Circle, Line } from "./phobject.js"
import { Vector } from "./vector.js"
import { Shift } from "./animation.js"

// just some test usage
const canvas = document.getElementById('canvas')
const screen = new Screen(canvas)

const circle = new Circle(new Vector(0, 0), 1)
const line = new Line(new Vector(-2, 0), new Vector(2, 0))

screen.add(circle)
screen.add(line.setColor('red'))

let animation = new Shift(circle, new Vector(1, 0), 60)
let animation2 = new Shift(line, new Vector(0, 1), 60)

screen.play(animation)
screen.play(animation2)

screen.run()
