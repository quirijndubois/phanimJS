import Screen from "./screen.js"
import { Circle, Line, Polygon, Curve, FunctionGraph, LiveGrid,  Node} from "./phobject.js"
import { Vector } from "./vector.js"
import { Shift, Create, AnimateValue } from "./animation.js"
import { calulateSpringForce } from "./functions.js"

const canvas = document.getElementById('canvas')
const s = new Screen(canvas)

let grid = new LiveGrid()
s.add(grid)
s.addUpdater(s => grid.update(s))

let c0 = new Node(new Vector(0,0))
let c1 = new Node(new Vector(1,0))
let c2 = new Node(new Vector(2,0))

s.add(c0)
s.add(c1)
s.add(c2)
s.play([new Create(c0), new Create(c1), new Create(c2)])

s.addUpdater(s => {
    const g = new Vector(0, -9.81)
    const k = 100000

    c1.addForce(g)
    c2.addForce(g)

    c1.addForce(calulateSpringForce(new Vector(0, 0), c1.position, 1, k))
    c1.addForce(calulateSpringForce(c2.position, c1.position, 1, k))
    c2.addForce(calulateSpringForce(c1.position, c2.position, 1, k))

    c1.eulerODESover(s.dt)
    c2.eulerODESover(s.dt)
},100
)

s.run()
