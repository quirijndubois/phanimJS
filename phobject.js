import { Vector } from "./vector.js"
import { cloneObject, lerp, lerp2d, round_to_power_of_2 } from "./functions.js"

export class Phobject {
    constructor(position = new Vector(0, 0), color = 'white', scale = 1, z_index = 0) {
        this.position = position
        this.velocity = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
        this.force = new Vector(0, 0)
        this.mass = 1

        this.hovered = false
        this.selected = false
        this.dragged = false
        this.draggingOffset = new Vector(0, 0)

        this.z_index = z_index

        this.color = color
        this.scale = scale
        this.phobjects = []
        this.factor = 1
        this.set()
    }

    setPosition(position) {
        this.position = position
        this.set()
        return this
    }

    setColor(color) {
        this.color = color
        this.set()
        return this
    }

    createFunction(t) {
        this.factor = t
        this.set()
    }

    set() {
        this.phobjects = []
    }

    addForce(force) {
        this.force.x += force.x
        this.force.y += force.y
    }

    SDF(point) {
        throw new Error('SDF not implemented on this object')
    }

    eulerODESover(dt) {
        this.acceleration.x = this.force.x / this.mass
        this.acceleration.y = this.force.y / this.mass
        
        this.velocity.x += this.acceleration.x * dt
        this.velocity.y += this.acceleration.y * dt

        this.position.x += this.velocity.x * dt
        this.position.y += this.velocity.y * dt

        this.force.x = 0
        this.force.y = 0
    }
}

export class Group extends Phobject {
    constructor(phobjects = []) {
        super()
        this.phobjects = phobjects
    }

    add(phobject) {
        this.phobjects.push(phobject)
    }
}

export class Graph extends Group {
    constructor(n, edges, lineThickness = .1, nodeRadius = .2) {
        super()
        this.n = n
        this.edges = edges
        this.lineThickness = lineThickness
        this.nodeRadius = nodeRadius
        this.nodeFillColor = 'black'
        this.nodeStrokeColor = 'white'
        this.nodeStrokeWidth = .05
        this.lineColor = 'white'
        this.setGraph()
    }

    setGraph(){
        this.phobjects = []
        for (let i = 0; i < this.n; i++) {
            const pos = new Vector(Math.random()*4-2, Math.random()*4-2)
            this.phobjects.push(new Node(pos, this.nodeRadius, this.nodeFillColor, this.nodeStrokeColor, this.nodeStrokeWidth))
        }
        for (let i = 0; i < this.edges.length; i++) {
            const x = this.phobjects[this.edges[i][0]].position
            const y = this.phobjects[this.edges[i][1]].position
            this.phobjects.push(new Line(x,y,this.lineThickness, this.lineColor))

            this.phobjects[this.phobjects.length - 1].z_index = -1
        }
    }
}

export class LiveGrid extends Phobject {

    constructor() {
        super()
        this.z_index = -999
    }
    update(screen) {
        const brightness = 0.5
        const layers = 3
        const thickness = 2
        const amount = 8

        this.phobjects = []

        let camera = screen.camera
        let { closest, distance } = round_to_power_of_2((camera.right - camera.left) / amount)
        let step = closest

        for (let i = 0; i < layers; i++) {
            let b = lerp(brightness * i / layers, brightness * (i + 1) / layers, distance)
            this.draw_grid(
                camera,
                step / 2 ** (layers - i),
                b ** 1,
                thickness
            )
        }
        this.draw_grid(camera, step, brightness, thickness)
    }

    draw_grid(camera, step, distance, thickness) {
        let left = Math.round(camera.left / step) * step
        let top = Math.round(camera.top / step) * step
        let n = Math.ceil((camera.right - left) / step)
        thickness = camera.screen2length(thickness)

        for (let i = 0; i < n; i++) {
            let x = left + i * step
            this.phobjects.push(new Line(
                new Vector(x, camera.top),
                new Vector(x, camera.bottom),
                thickness,
                [distance * 255, distance * 255, distance * 255]
            ))
        }
        for (let i = 0; i < n; i++) {
            let y = top + i * step
            this.phobjects.push(new Line(
                new Vector(camera.left, y),
                new Vector(camera.right, y),
                thickness,
                [distance * 255, distance * 255, distance * 255]
            ))
        }
    }

}

export class Circle extends Phobject {
    constructor(position = new Vector(0, 0), radius = 1, fillColor = 'white', strokeColor = 'red', strokeWidth = .05) {
        super(position)
        this.radius = radius
        this.fillColor = fillColor
        this.strokeColor = strokeColor
        this.strokeWidth = strokeWidth
    }

    createFunction(t) {
        this.factor = t
    }
}

export class Node extends Circle {
    constructor(position = new Vector(0, 0), radius = .2, fillColor = 'black', strokeColor = 'white', strokeWidth = .05) {
        super(position, radius, fillColor, strokeColor, strokeWidth)
        this.actualRadius = radius
    }

    createFunction(t) {
        this.radius = lerp(0, this.actualRadius, t)
    }

    SDF(point) {
        return point.distance(this.position) - this.radius - this.strokeWidth/2
    }
}

export class Line extends Phobject {
    constructor(start = new Vector(0, 0), end = new Vector(1, 0), strokeWidth = .05, color = [255, 255, 255]) {
        super()
        this.length = length
        this.start = start
        this.end = end
        this.strokeWidth = strokeWidth
        this.color = color
    }

    SDF(point) {
        const a = this.start.add(this.position)
        const b = this.end.add(this.position)
        const thickness = this.strokeWidth

        let edge = b.sub(a);
        let ap = point.sub(a);
        let proj = Math.max(0, Math.min(1, ap.dot(edge) / edge.magSquared()));
        let closest = a.add(edge.mult(proj));
        let dist = point.distance(closest);
        return dist - thickness * 0.5;
    }
}

export class Polygon extends Phobject {
    constructor(position = new Vector(0, 0), vertices = [], fillColor = 'white', strokeColor = 'red', strokeWidth = .05) {
        super(position)
        this.vertices = vertices
        this.fillColor = fillColor
        this.strokeColor = strokeColor
        this.strokeWidth = strokeWidth
    }

    SDF(point) {
        const polygon = this.vertices
        let minDistSq = Infinity;
        let inside = false;
        
        for (let i = 0; i < polygon.length; i++) {
            let a = polygon[i];
            let b = polygon[(i + 1) % polygon.length];
            
            let edge = b.sub(a);
            let ap = point.sub(a);
            let proj = Math.max(0, Math.min(1, ap.dot(edge) / edge.magSquared()));
            let closest = a.add(edge.mult(proj));
            
            let distSq = point.distance(closest);
            minDistSq = Math.min(minDistSq, distSq);
            
            if ((a.y > point.y) !== (b.y > point.y)) {
                let t = (point.x - a.x) - (b.x - a.x) * (point.y - a.y) / (b.y - a.y);
                if (t < 0) inside = !inside;
            }
        }
        let minDist = Math.sqrt(minDistSq);
        return inside ? -minDist : minDist;
    }

}

export class Curve extends Phobject {
    constructor(position = new Vector(0, 0), points = [], color = 'red', strokeWidth = .05) {
        super(position)
        this.points = points
        this.color = color
        this.strokeWidth = strokeWidth
    }

    createFunction(t) {
        this.factor = t
    }

    transformFunction(OldPhobject, TargetPhobject, progress) {
        for (let i = 0; i < this.points.length; i++) {
            const oldPoint = OldPhobject.points[i]
            const targetPoint = TargetPhobject.points[i]

            const newPoint = lerp2d(oldPoint, targetPoint, progress)
            this.points[i] = newPoint
        }
    }
}

export class FunctionGraph extends Phobject {
    constructor(graphFunction = (x) => Math.sin(x * Math.PI), position = new Vector(0, 0), xRange = [-1, 1], yRange = [0, 1], color = 'red', strokeWidth = .05, resolution = 100) {
        super(position)
        this.graphFunction = graphFunction
        this.xRange = xRange
        this.yRange = yRange
        this.color = color
        this.strokeWidth = strokeWidth
        this.resolution = resolution
        this.set()
    }

    set() {
        this.phobjects = []
        this.points = []
        for (let i = 0; i < this.resolution + 1; i++) {
            const x = lerp(this.xRange[0], this.xRange[1], i / this.resolution)
            const y = lerp(this.yRange[0], this.yRange[1], this.graphFunction(x))
            this.points.push(new Vector(x, y))
        }
        this.phobjects.push(new Curve(this.position, this.points, this.color, this.strokeWidth))
    }

    createFunction(t) {
        this.factor = t
        this.set()
        this.phobjects[0].createFunction(t)
    }

    transformFunction(OldPhobject, TargetPhobject, progress) {
        this.phobjects[0].transformFunction(OldPhobject.phobjects[0], TargetPhobject.phobjects[0], progress)
    }
}