export const PlayfieldDrawing = {
  props: ['state', 'client'],

  data: function () {
    return {
      countdownTimer: null,
      submitted: false
    }
  },

  methods: {
    sendImage: async function (base64EncodedImage) {
      this.submitted = true;
      await this.client.sendImage(base64EncodedImage);
    }
  },

  created: function () {
    this.hasCountdown = !isNaN(this.state?.lastInstruction?.timeout);
    if (!this.hasCountdown) {
      return;
    }

    this.countdownTimer = setInterval(() => {
      if (!this.submitted) {
        this.sendImage(this.$refs.canvascomponent.canvas.toString());
      }
    }, this.state?.lastInstruction?.timeout);
  },

  unmounted: function () {
    clearInterval(this.countdownTimer);
  },

  template: `
      
  <section v-if="state?.lastInstruction?.type == 'drawing-request'">
    <div class="drawing-hint">
      <div class="hint-front">Draw This</div>
      <div class="hint-back">
        {{ state.lastInstruction.value }}
      </div>
    </div>
    <drawable-canvas v-on:drawing-finished="sendImage" ref="canvascomponent"></drawable-canvas>
  </section>

  `
};