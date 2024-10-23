import Screen from "./screen.js"
import { Circle, Line } from "./phobject.js"
import { Vector } from "./vector.js"

// just some test usage

const canvas = document.getElementById('canvas')
const screen = new Screen(canvas)

const circle = new Circle(new Vector(0, 0), 1)
const line = new Line(new Vector(1, 0), new Vector(2, 2))

screen.add(circle)
screen.add(line.setColor('red'))

screen.run()
