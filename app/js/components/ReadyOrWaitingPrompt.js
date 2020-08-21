export const ReadyOrWaitingPrompt = {
  props: ['isHost', 'state'],

  computed: {
    gameReady: function () {
      return this.state && !this.state.started
    }
  },

  methods: {
    emitStartGameEvent: async function () {
      this.$emit('startgame');
    }
  },

  template: `
    <div v-if="gameReady" class="ready-or-waiting-prompt">
        <div v-if="isHost">
            <p>Everybody ready?</p>
            <button v-on:click="emitStartGameEvent" class="form-button">Start Game</button>
        </div>

        <div v-if="!isHost">
            <span id="wait-message">Waiting for {{ state?.hostIdentity?.friendlyName }} to start the game.</span>
        </div>
    </div>
`
};