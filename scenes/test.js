import * as p from '../dist/bundle.js'

const canvas = document.getElementById('canvas')
const s = new p.Screen(canvas)

let grid = new p.LiveGrid()
s.add(grid)
s.addUpdater(s => grid.update(s))

s.add(circuit)
s.run()

