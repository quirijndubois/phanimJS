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


s.run()
