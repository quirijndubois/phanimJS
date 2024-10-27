import Screen from "./screen.js"
import { Circle, Line, Polygon } from "./phobject.js"
import { Vector } from "./vector.js"
import { Shift, Create, AnimateValue } from "./animation.js"

// just some test usage
const canvas = document.getElementById('canvas')
const s = new Screen(canvas)

s.play([
    new Create(new Line(new Vector(s.camera.left, 0), new Vector(s.camera.right, 0), 0.01), 30),
    new Create(new Line(new Vector(0, s.camera.top), new Vector(0, s.camera.bottom), 0.01), 30)
])

let circle = new Circle()

s.play(new Create(circle))

function update(s) {
    s.play(new Shift(circle, s.GlobalMousePosition))
}

s.addClickUpdater(update)

s.run()
