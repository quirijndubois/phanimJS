import { Vector, add, sub } from "./vector.js"
import Camera from "./camera.js"
import { Circle, Line } from "./phobject.js"


export default class Screen {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        this.width = canvas.width
        this.height = canvas.height

        this.phobjects = []
        this.animations = []

        this.camera = new Camera(this.width, this.height)

        this.dragging = false
        this.dragStart = null
        this.mousePos = null
    }

    drawCircle(circle) {
        const screenPosition = this.camera.coords2screen(circle.position)
        const screenRadius = this.camera.length2screen(circle.radius)

        this.ctx.fillStyle = circle.color
        this.ctx.beginPath()
        this.ctx.arc(screenPosition.x, screenPosition.y, screenRadius, 0, 2 * Math.PI)
        this.ctx.fill()
    }

    drawLine(line) {
        const thickness = this.camera.length2screen(line.strokeWidth)
        const screenPosition = this.camera.coords2screen(line.position)
        const screenStart = this.camera.coords2screen(line.start)
        const screenEnd = this.camera.coords2screen(line.end)

        this.ctx.strokeStyle = line.color
        this.ctx.lineWidth = thickness
        this.ctx.beginPath()
        this.ctx.moveTo(screenStart.x, screenStart.y)
        this.ctx.lineTo(screenEnd.x, screenEnd.y)
        this.ctx.stroke()
    }

    draw(phobject) {
        if (phobject instanceof Circle) {
            this.drawCircle(phobject)
        } else if (phobject instanceof Line) {
            this.drawLine(phobject)
        }
    }

    add(phobject) {
        this.phobjects.push(phobject)
    }

    play(animation) {
        this.animations.push(animation)
    }

    updateAnimations() {
        this.animations.forEach(animation => {
            animation.update()
        })
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    updateScroll(x) {
        this.camera.zoom *= 1 + x / 1000
    }

    update() {

        this.updateAnimations()

        this.clear()

        this.phobjects.forEach(phobject => {
            this.draw(phobject)
        })

        if (this.dragging && this.dragStart) {
            const delta = sub(this.dragStart, this.LocalMousePosition)
            this.camera.position = this.cameraDragStart.add(delta)
        }

    }

    run() {
        const animate = () => {
            this.update()
            requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)

        window.addEventListener('wheel', e => {
            this.updateScroll(e.deltaY)
        })

        // on left mousebutton
        window.addEventListener('mousemove', e => {
            this.GlobalMousePosition = this.camera.screen2Global(new Vector(e.clientX, e.clientY))
            this.LocalMousePosition = this.camera.screen2Local(new Vector(e.clientX, e.clientY))
        })
        window.addEventListener('mousedown', e => {
            this.dragging = true
            this.dragStart = this.LocalMousePosition
            this.cameraDragStart = new Vector(this.camera.position.x, this.camera.position.y)
        })
        window.addEventListener('mouseup', e => {
            this.dragging = false
            this.dragStart = null
        })
    }
}
