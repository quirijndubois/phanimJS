import Screen from "./screen.js"
import { Circle, Line, Polygon, Curve, FunctionGraph, LiveGrid } from "./phobject.js"
import { Vector } from "./vector.js"
import { Shift, Create, AnimateValue } from "./animation.js"

// just some test usage
const canvas = document.getElementById('canvas')
const s = new Screen(canvas)

let curve1 = new FunctionGraph().setPosition(new Vector(0, 0))

let grid = new LiveGrid()
s.add(grid)
s.addUpdater(s => grid.update(s))

s.add(curve1)

s.play(new Shift(curve1, new Vector(1, 0)))

s.run()
