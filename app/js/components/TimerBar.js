export const TimerBar = {
  props: ['countdown'],

  data: function () {
    return {
      timeRemaining: null,
      countdownTimer: null,
      hasCountdown: false
    }
  },

  computed: {
    seconds: function () { return Math.floor(this.timeRemaining / 1000); },
    percentage: function () { return this.timeRemaining / (this.countdown / 100); }
  },

  created: function () {
    this.hasCountdown = !isNaN(this.countdown);
    this.timeRemaining = this.countdown;

    this.countdownTimer = setInterval(() => {
      this.timeRemaining -= 50;

      if (this.timeRemaining <= 0) {
        this.timeRemaining = null;
        this.hasCountdown = false;
        clearInterval(this.countdownTimer);
      }
    }, 50);
  },

  template: `
    <div class="timer">
      <div v-bind:style="{ width: percentage + '%'}" class="timer-bar"></div>
    </div>
`
};