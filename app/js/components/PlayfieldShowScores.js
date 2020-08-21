export const PlayfieldShowScores = {
  props: ['state', 'isHost'],

  methods: {
    emitNextRoundEvent: async function () {
      this.$emit('nextround');
    }
  },
  
  computed: {
    orderedScores: function () {
      return this.state.lastInstruction.playerScores.sort((a, b) => {
        return b.score - a.score;
      });
    }
  },

  template: `
  <div v-if="state?.lastInstruction?.type == 'show-scores'" class="game-lobby score-card">
    <h2 class="section-heading">Scores</h2>
    <ul class="scores">
    <li v-for="player in orderedScores" class="score">
      <span class="score-name">{{ player.friendlyName }}: </span>
      <span class="score-score">{{ player.score }}</span>
    </li>
    </ul>

    <div v-if="isHost">
      <h3 class="subtitle">Play again?</h3>
      <button id="nextRoundButton" v-on:click="emitNextRoundEvent" class="form-button">Start a new game</button>
    </div>

  </div>
  `
};