import Screen from "../src/screen.js"
import { Circle, Line, Polygon, Curve, FunctionGraph, LiveGrid,  Node} from "../src/phobject.js"
import { Vector } from "../src/vector.js"
import { Shift, Create, AnimateValue } from "../src/animation.js"
import { calulateSpringForce } from "../src/functions.js"

const canvas = document.getElementById('canvas')
const s = new Screen(canvas)

let grid = new LiveGrid()
s.add(grid)
s.addUpdater(s => grid.update(s))

let c0 = new Node(new Vector(0,0))
let c1 = new Node(new Vector(0,1))
let c2 = new Node(new Vector(0,2))

c2.velocity = new Vector(0.001, 0)

let l1 = new Line(c0.position, c1.position, .1)
let l2 = new Line(c1.position, c2.position, .1)

s.add(l1)
s.add(l2)

s.add(c0)
s.add(c1)
s.add(c2)

s.makeInteractive(c0)
s.makeInteractive(c1)
s.makeInteractive(c2)

s.play([new Create(c0, 30), new Create(l1, 60), new Create(c1, 90), new Create(l2, 120), new Create(c2, 150)])

s.addUpdater(s => {

    l1.setEnds(c0.position, c1.position)
    l2.setEnds(c1.position, c2.position)
    const g = new Vector(0, -9.81)
    const k = 1e7

    c1.addForce(g)
    c2.addForce(g)

    c1.addForce(calulateSpringForce(new Vector(0, 0), c1.position, 1, k))
    c1.addForce(calulateSpringForce(c2.position, c1.position, 1, k))
    c2.addForce(calulateSpringForce(c1.position, c2.position, 1, k))

    c1.eulerODESover(s.dt)
    c2.eulerODESover(s.dt)


},1000
)

s.run()
