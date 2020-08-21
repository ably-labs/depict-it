export class DrawableCanvasElement {
    constructor(canvasElementId) {
        this.canvasElementId = canvasElementId;
        this.paintCanvas = document.getElementById(canvasElementId);
        this.paintContext = this.paintCanvas.getContext("2d");

        this.activeColour = "black";
        this.lineWidth = 1;
        this.dragging = false;
        this.cursorPoint = { x: 0, y: 0 };

        this.paintCanvas.onmousedown = (e) => { this.startDrawing(e); };
        this.paintCanvas.onmouseup = (e) => { this.stopDrawing(e); };
        this.paintCanvas.onmouseout = (e) => { this.stopDrawing(e); };
        this.paintCanvas.onmousemove = (e) => { this.makeMarks(e); };

        const canvas = this.paintCanvas;

        document.body.addEventListener("touchstart", (e) => {
            if (e.target == canvas) {
                e.preventDefault();
                this.startDrawing(e);
            }
        }, false);

        document.body.addEventListener("touchend", (e) => {
            if (e.target == canvas) {
                e.preventDefault();
                this.stopDrawing(e);
            }
        }, false);

        document.body.addEventListener("touchmove", (e) => {
            if (e.target == canvas) {
                e.preventDefault();
                this.makeMarks(e);
            }
        }, false);

        this.notificationBuffer = [];
        this.notificationBatch = 200;
    }

    registerPaletteElements(paletteContainer) {
        const palette = document.getElementById(paletteContainer);
        for (let colour of palette.children) {
            colour.addEventListener('click', (event) => {
                this.setActiveColour(event.target.style["background-color"]);
            });
        }
        return this;
    }

    setActiveColour(colour) {
        this.activeColour = colour;
    }

    clear() {
        this.paintContext.clearRect(0, 0, 100000, 100000);
    }

    getLocationFrom(e) {
        const location = { x: 0, y: 0 };

        if (e.constructor.name === "TouchEvent") {
            const bounds = e.target.getBoundingClientRect();
            const touch = e.targetTouches[0];

            location.x = touch.clientX - bounds.left - 10;
            location.y = touch.clientY - bounds.top - 10;
        } else {
            location.x = e.offsetX;
            location.y = e.offsetY;
        }

        return location;
    }

    startDrawing(e) {
        this.dragging = true;

        const location = this.getLocationFrom(e);
        this.cursorPoint = location;

        this.paintContext.lineWidth = this.lineWidth;
        this.paintContext.lineCap = 'round';
        this.paintContext.filter = 'blur(1px)';
        this.paintContext.beginPath();
        this.paintContext.moveTo(location.x, location.y);
        this.paintContext.strokeStyle = this.activeColour;
    }

    stopDrawing(e) {
        this.dragging = false;
        this.notify(null, true);
    }

    makeMarks(e) {
        if (!this.dragging) return;

        const location = this.getLocationFrom(e);
        this.paintContext.lineTo(location.x, location.y);
        this.paintContext.stroke();

        this.notify(location);
    }

    addMarks(markCollection) {
        this.paintContext.beginPath();
        this.paintContext.moveTo(location.x, location.y);
        this.paintContext.strokeStyle = this.activeColour;

        for (let location of markCollection) {
            this.paintContext.lineTo(location.x, location.y);
            this.paintContext.stroke();
        }
    }

    onNotification(callback) {
        this.notificationCallback = callback;
        return this;
    }

    notify(evt, force = false) {
        if (this.notificationCallback == null) {
            return;
        }

        if (evt != null) {
            this.notificationBuffer.push(evt);
        }

        if ((force || this.notificationBuffer.length === this.notificationBatch) && this.notificationBuffer.length > 0) {
            this.notificationCallback(this.notificationBuffer);
            this.notificationBuffer = [];
        }
    }

    toString() {
        return this.paintCanvas.toDataURL("image/png");
    }
}
