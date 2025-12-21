import {Screen, LiveGrid} from "../dist/bundle.js"

const canvas = document.getElementById('canvas')
const s = new Screen(canvas)

let grid = new LiveGrid()
s.add(grid)
s.addUpdater(s => grid.update(s))

s.run()
