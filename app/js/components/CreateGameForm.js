import { generateName } from "../util/GenerateName.js";

const urlParams = new URLSearchParams(location.search);
const queryGameId = urlParams.get("gameId");

export const CreateGameForm = {
  props: [],

  data: function () {
    return {
      friendlyName: generateName(2),
      gameId: queryGameId || generateName(3, "-").toLocaleLowerCase(),
      isJoinLink: [...urlParams.keys()].indexOf("join") > -1
    }
  },

  methods: {
    emitCreateGameEvent: async function (evt) {
      evt.preventDefault();
      this.$emit('create', { gameId: this.gameId, friendlyName: this.friendlyName });
    },
    emitJoinGameEvent: async function (evt) {
      evt.preventDefault();
      this.$emit('join', { gameId: this.gameId, friendlyName: this.friendlyName });
    }
  },

  template: `
  <form class="create-game-form form">
    <h2 class="section-heading">Start a new game:</h2>
    <label for="name-name">Enter your name</label>
    <input type="text" name="name" v-model="friendlyName" class="input">          

    <button v-if="!isJoinLink" v-on:click="emitCreateGameEvent" class="form-button form-button--host">Create Game</button>
    <button v-if="isJoinLink" v-on:click="emitJoinGameEvent" class="form-button">Join a Session</button>
  </form>
`
};