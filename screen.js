import { Vector, add, sub } from "./vector.js"
import Camera from "./camera.js"
import { Circle, Line, Polygon, Curve } from "./phobject.js"
import { lerp, lerp2d, tupleToRGB } from "./functions.js"
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
        this.interactivePhobjects = []

        this.updaters = []
        this.clickUpdaters = []

        this.camera = new Camera(this.width, this.height)
        
        this.dragging = false
        this.dragStart = null
        this.mousePos = null
        this.draggingPhobject = false

        this.ScreenMousePosition = new Vector(0, 0)
    }

    resetCamera() {
        this.play([
            new Shift(this.camera, new Vector(0, 0)),
            new AnimateValue((v) => this.camera.setZoom(Math.pow(2.718, v)), Math.log(this.camera.zoom), Math.log(5))
        ])
    }

    drawCircle(circle) {
        const screenPosition = this.camera.coords2screen(circle.position)
        const screenRadius = this.camera.length2screen(circle.radius)

        let fillColor = circle.fillColor
        let strokeColor = circle.strokeColor

        if (circle.hovered) {
            fillColor = tupleToRGB([0, 0, 0])
            strokeColor = tupleToRGB([100, 100, 100])
        }

        this.ctx.fillStyle = fillColor
        this.ctx.strokeStyle = strokeColor
        this.ctx.lineWidth = this.camera.length2screen(circle.strokeWidth)

        this.ctx.beginPath()
        this.ctx.arc(screenPosition.x, screenPosition.y, screenRadius, 0, 2 * Math.PI * circle.factor)
        this.ctx.fill()
        this.ctx.stroke()
    }


    drawLine(line) {
        
        let color = tupleToRGB(line.color)
        if (line.hovered) {
            color = tupleToRGB([100, 100, 100])
        }

        const thickness = this.camera.length2screen(line.strokeWidth)

        const start = add(line.start, line.position)
        let end = add(line.end, line.position)
        end = lerp2d(start, end, line.factor)

        const screenStart = this.camera.coords2screen(start)
        const screenEnd = this.camera.coords2screen(end)
        this.ctx.strokeStyle = color
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

    drawCurve(curve) {
        const screenPoints = curve.points.map(point => this.camera.coords2screen(add(point, curve.position)))
        this.ctx.strokeStyle = curve.color
        this.ctx.lineWidth = this.camera.length2screen(curve.strokeWidth)
        this.ctx.beginPath()


        const factor = curve.factor
        if (factor < 1) {
            const lastIndex = (screenPoints.length) * factor
            const leftOverFactor = lastIndex - Math.floor(lastIndex)

            this.ctx.moveTo(screenPoints[0].x, screenPoints[0].y)
            for (let i = 1; i < screenPoints.length; i++) {
                if (i <= lastIndex) {
                    this.ctx.lineTo(screenPoints[i].x, screenPoints[i].y)
                }
                else {
                    const point = lerp2d(screenPoints[i - 1], screenPoints[i], leftOverFactor)
                    this.ctx.lineTo(point.x, point.y)
                    break
                }
            }
        }
        else {
            this.ctx.moveTo(screenPoints[0].x, screenPoints[0].y)
            for (let i = 1; i < screenPoints.length; i++) {
                this.ctx.lineTo(screenPoints[i].x, screenPoints[i].y)
            }
        }

        this.ctx.stroke()
    }

    draw(phobject) {
        if (phobject instanceof Circle) {
            this.drawCircle(phobject)
        } else if (phobject instanceof Line) {
            this.drawLine(phobject)
        } else if (phobject instanceof Polygon) {
            this.drawPolygon(phobject)
        } else if (phobject instanceof Curve) {
            this.drawCurve(phobject)
        }

        // we sort all subphobjects by z-index
        phobject.phobjects.sort((a, b) => {
            return a.z_index - b.z_index
        })

        // we recursively draw all subphobjects
        phobject.phobjects.forEach(phobject => {
            this.draw(phobject)
        })
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
        this.camera.setPosition(lerp2d(this.camera.position,this.GlobalMousePosition, -x/1000))
    }

    handleClick() {
        this.clickUpdaters.forEach(updater => {
            updater(this)
        })
    }

    addUpdater(updater, substeps = 1) {
        this.updaters.push([updater, substeps])
    }

    addClickUpdater(updater) {
        this.clickUpdaters.push(updater)
    }

    handleUpdaters() {
        this.updaters.forEach(updater => {
            const substeps = updater[1]

            this.dt = (1/60) / substeps

            for (let i = 0; i < substeps; i++) {
                updater[0](this)
            }
        })
    }

    makeInteractive(phobject) {
        this.interactivePhobjects.push(phobject)
    }

    handleInteractivity() {

        for (let i = 0; i < this.interactivePhobjects.length; i++) {

            if (this.interactivePhobjects[i].dragging) {
            }

            const distance = this.interactivePhobjects[i].SDF(this.GlobalMousePosition)
            if (distance < 0){
                this.interactivePhobjects[i].hovered = true
            }
            else {
                this.interactivePhobjects[i].hovered = false
            }

            if(this.interactivePhobjects[i].dragging){
                this.interactivePhobjects[i].setPosition(this.GlobalMousePosition.add(this.interactivePhobjects[i].draggingOffset))
                this.interactivePhobjects[i].velocity = new Vector(0,0)
            }
        }
    }

    mouseDownInteractivity() {
        for (let i = 0; i < this.interactivePhobjects.length; i++) {
            if (this.interactivePhobjects[i].hovered) {
                this.interactivePhobjects[i].dragging = true
                this.interactivePhobjects[i].draggingOffset = this.interactivePhobjects[i].position.sub(this.GlobalMousePosition)
                this.draggingPhobject = true
            }
        }
    }

    mouseUpInteractivity() {
        this.draggingPhobject = false
        for (let i = 0; i < this.interactivePhobjects.length; i++) {
            this.interactivePhobjects[i].dragging = false
        }
    }

    sortPhobjects() {
        this.phobjects.sort((a, b) => {
            return a.z_index - b.z_index
        })
    }

    update() {
        this.LocalMousePosition = this.camera.screen2Local(this.ScreenMousePosition)
        this.GlobalMousePosition = this.camera.screen2Global(this.ScreenMousePosition)

        this.handleUpdaters()

        this.updateAnimations()

        this.clear()

        this.sortPhobjects()

        this.handleInteractivity()

        this.phobjects.forEach(phobject => {
            this.draw(phobject)
        })

        if (this.dragging && this.dragStart && !this.draggingPhobject) {
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

            this.mouseDownInteractivity()
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

            this.mouseUpInteractivity()
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
            if (e.key == 'c') {
                this.resetCamera()
            }
            if (e.key == 'r') {
                window.location.reload()
            }
        })
    }
}
