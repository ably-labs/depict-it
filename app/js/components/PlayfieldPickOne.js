export const PlayfieldPickOne = {
  props: ['state', 'client', 'isHost'],

  methods: {
    sendVote: async function (id) {
      await this.client.logVote(id);
    },
    progressVote: async function () {
      await this.client.hostProgressedVote();
    },
    storeStackInLocalStorage: async function () {
      localStorage.setItem("share", JSON.stringify(this.state?.lastInstruction?.stack));
    },
  },

  computed: {
    displaySkipButtonForHost: function () {
      const previousInstruction = this.state?.instructionHistory[this.state?.instructionHistory.length - 2];
      return this.isHost && (this.state?.lastInstruction?.type == 'wait' && previousInstruction.type == "pick-one-request");
    }
  },

  template: `
    <div>
      <h2 v-if="state?.lastInstruction?.type == 'pick-one-request'" class="section-heading">Vote and Share</h2>
      <h3 v-if="state?.lastInstruction?.type == 'pick-one-request'" class="section-subheading">Click on a card to pick your favourite and award points to its depictor.</h3>
      <section v-if="state?.lastInstruction?.type == 'pick-one-request'" class="gallery">
        <div v-for="item in state?.lastInstruction?.stack.items" class="gallery-item">
          <stack-item :item="item" v-on:click="sendVote"></stack-item>
        </div>
      </section>
      <a v-if="state?.lastInstruction?.type == 'pick-one-request'" v-on:click="storeStackInLocalStorage" href="/share" target="_twitterShare" class="tweet">Tweet this progression</a>          

      <div v-if="displaySkipButtonForHost" class="form">
        <p>You are the host and can skip the scoring forwards.</p>
        <p>If a player drops out and the game won't move forwards, click the button below.</p>
        <button v-on:click="progressVote">Move vote forwards</button>
      </div>
    </div>
    `
};
