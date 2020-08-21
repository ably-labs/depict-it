import { DrawableCanvasElement } from "../../../web_modules/DrawableCanvasElement.js";

export const DrawableCanvas = {
  data: function () {
    return {
      canvasId: "canvas-" + crypto.getRandomValues(new Uint32Array(1))[0],
      paletteId: "palette-" + crypto.getRandomValues(new Uint32Array(1))[0],
      canvas: null
    }
  },

  mounted: function () {
    const element = document.getElementById(this.canvasId);
    if (element && !this.canvas) {
      this.canvas = new DrawableCanvasElement(this.canvasId).registerPaletteElements(this.paletteId);
    }
  },

  methods: {
    colorSelected: async function (evt) {
      this.canvas.paintCanvas.classList.remove("eraser");
      this.canvas.lineWidth = 1;
    },
    eraserSelected: async function (evt) {
      this.canvas.paintCanvas.classList.add("eraser");
      this.canvas.lineWidth = 10;
    }
  },

  template: `
  <div class="drawable-canvas">
    <div class="canvas-and-paints">
      <canvas v-bind:id="canvasId" class="image-frame paint-canvas" width="400" height="400"></canvas>  
      <div v-bind:id="paletteId" class="palette">
        <div style="background-color: black;" v-on:click="colorSelected"></div>
        <div style="background-color: red;" v-on:click="colorSelected"></div>
        <div style="background-color: green;" v-on:click="colorSelected"></div>
        <div style="background-color: blue;" v-on:click="colorSelected"></div>
        <div style="background-color: white;" v-on:click="eraserSelected"></div>
      </div>
    </div>
    <button v-on:click="$emit('drawing-finished', canvas.toString())" class="form-button finished-drawing">I'm finished!</button>
  </div>`
};