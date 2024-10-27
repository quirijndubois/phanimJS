import Screen from "./screen.js"
import { Circle, Line, Polygon } from "./phobject.js"
import { Vector } from "./vector.js"
import { Shift, Create, AnimateValue } from "./animation.js"

// just some test usage
const canvas = document.getElementById('canvas')
const screen = new Screen(canvas)

screen.play([
    new Create(new Line(new Vector(screen.camera.left, 0), new Vector(screen.camera.right, 0), 0.01), 30),
    new Create(new Line(new Vector(0, screen.camera.top), new Vector(0, screen.camera.bottom), 0.01), 30)
])

screen.play(new Create(new Circle()))



screen.run()
