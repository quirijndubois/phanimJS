class Screen {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.width = canvas.width
        this.height = canvas.height
        this.backgroundColor = 'rgb(0, 10, 30)'
        console.log(this.width, this.height)

        this.setBackground()
    }

    setBackground() {
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    run() {
        requestAnimationFrame(() => {
            this.setBackground()
        })
    }
}
