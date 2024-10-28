import { Vector, add, sub } from "./vector.js"
import Camera from "./camera.js"
import { Circle, Line, Polygon } from "./phobject.js"
import { lerp2d } from "./functions.js"
import { Shift, Create, AnimateValue } from "./animation.js"


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

        this.updaters = []
        this.clickUpdaters = []

        this.camera = new Camera(this.width, this.height)

        this.dragging = false
        this.dragStart = null
        this.mousePos = null

        this.ScreenMousePosition = new Vector(0, 0)
    }

    drawCircle(circle) {
        const screenPosition = this.camera.coords2screen(circle.position)
        const screenRadius = this.camera.length2screen(circle.radius)

        this.ctx.fillStyle = circle.fillColor
        this.ctx.strokeStyle = circle.strokeColor
        this.ctx.lineWidth = this.camera.length2screen(circle.strokeWidth)

        this.ctx.beginPath()
        this.ctx.arc(screenPosition.x, screenPosition.y, screenRadius, 0, 2 * Math.PI * circle.factor)
        this.ctx.fill()
        this.ctx.stroke()
    }

    resetCamera() {
        this.play([
            new Shift(this.camera, new Vector(0, 0)),
            new AnimateValue((v) => this.camera.setZoom(v), this.camera.zoom, 5)
        ])
    }

    drawLine(line) {
        const thickness = this.camera.length2screen(line.strokeWidth)

        const start = add(line.start, line.position)
        let end = add(line.end, line.position)
        end = lerp2d(start, end, line.factor)

        const screenStart = this.camera.coords2screen(start)
        const screenEnd = this.camera.coords2screen(end)
        this.ctx.strokeStyle = line.color
        this.ctx.lineWidth = thickness
        this.ctx.beginPath()
        this.ctx.moveTo(screenStart.x, screenStart.y)
        this.ctx.lineTo(screenEnd.x, screenEnd.y)
        this.ctx.stroke()
    }

    drawPolygon(polygon) {
        const screenPoints = polygon.vertices.map(point => this.camera.coords2screen(point))
        this.ctx.fillStyle = polygon.fillColor
        this.ctx.beginPath()
        this.ctx.strokeStyle = polygon.strokeColor
        this.ctx.lineWidth = this.camera.length2screen(polygon.strokeWidth)
        this.ctx.moveTo(screenPoints[0].x, screenPoints[0].y)
        for (let i = 1; i < screenPoints.length; i++) {
            this.ctx.lineTo(screenPoints[i].x, screenPoints[i].y)
        }
        this.ctx.lineTo(screenPoints[0].x, screenPoints[0].y)
        this.ctx.fill()
        this.ctx.stroke()
    }

    draw(phobject) {
        if (phobject instanceof Circle) {
            this.drawCircle(phobject)
        } else if (phobject instanceof Line) {
            this.drawLine(phobject)
        } else if (phobject instanceof Polygon) {
            this.drawPolygon(phobject)
        }
    }

    add(phobject) {
        this.phobjects.push(phobject)
    }

    play(animation) {
        if (animation instanceof Array) {
            this.animations.push(animation)
        }
        else {
            this.animations.push([animation])
        }
    }


    updateAnimations() {
        if (this.animations.length == 0) {
            return
        }
        this.animations[0].forEach(animation => {
            animation.update()

            if (animation.mode == 'add') {
                if (this.phobjects.indexOf(animation.phobject) == -1) {
                    this.add(animation.phobject)
                }
            }

            if (animation.frame >= animation.duration) {
                this.animations[0].splice(this.animations[0].indexOf(animation), 1)
            }
        })
        if (this.animations[0].length == 0) {
            this.animations.shift()
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    handleScroll(x) {
        this.camera.setZoom(this.camera.zoom * (1 + x / 1000))

    }

    handleClick() {
        this.clickUpdaters.forEach(updater => {
            updater(this)
        })
    }

    addUpdater(updater) {
        this.updaters.push(updater)
    }

    addClickUpdater(updater) {
        this.clickUpdaters.push(updater)
    }

    handleUpdaters() {
        this.updaters.forEach(updater => {
            updater(this)
        })
    }

    update() {
        this.LocalMousePosition = this.camera.screen2Local(this.ScreenMousePosition)
        this.GlobalMousePosition = this.camera.screen2Global(this.ScreenMousePosition)

        this.handleUpdaters()

        this.updateAnimations()

        this.clear()

        this.phobjects.forEach(phobject => {
            this.draw(phobject)
        })

        if (this.dragging && this.dragStart) {
            const delta = sub(this.dragStart, this.LocalMousePosition)
            this.camera.setPosition(this.cameraDragStart.add(delta))
        }
    }

    run() {
        const animate = () => {
            this.update()
            requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)

        window.addEventListener('wheel', e => {
            this.handleScroll(e.deltaY)
        })

        window.addEventListener('mousemove', e => {
            this.ScreenMousePosition = new Vector(e.clientX, e.clientY)

            if (this.dragStart) {
                if (sub(this.LocalMousePosition, this.dragStart).magnitude() > (.01 * this.camera.zoom)) {
                    this.dragging = true
                }
            }
        })

        window.addEventListener('touchmove', e => {
            const touch = e.touches[0]
            this.ScreenMousePosition = new Vector(touch.clientX, touch.clientY)
            if (this.dragStart) {
                if (sub(this.LocalMousePosition, this.dragStart).magnitude() > (.01 * this.camera.zoom)) {
                    this.dragging = true
                }
            }
        })

        window.addEventListener('mousedown', e => {
            this.dragStarted = true
            this.dragStart = this.LocalMousePosition
            this.cameraDragStart = new Vector(this.camera.position.x, this.camera.position.y)
        })
        window.addEventListener('touchstart', e => {
            const touch = e.touches[0]
            this.dragStarted = true
            this.dragStart = this.camera.screen2Local(new Vector(touch.clientX, touch.clientY))
            this.cameraDragStart = new Vector(this.camera.position.x, this.camera.position.y)
        })

        window.addEventListener('mouseup', e => {
            if (!this.dragging) {
                this.handleClick()
            }
            this.dragging = false
            this.dragStarted = false
            this.dragStart = null
        })
        window.addEventListener('touchend', e => {
            if (!this.dragging) {
                this.handleClick()
            }
            this.dragging = false
            this.dragStarted = false
            this.dragStart = null
        })

        window.addEventListener('keydown', e => {
            if (e.key == 'r') {
                this.resetCamera()
            }
        })

    }
}
