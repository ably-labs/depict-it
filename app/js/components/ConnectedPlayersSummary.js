export const ConnectedPlayersSummary = {
  props: ['state'],

  template: `
    <div class="connected-players-summary">
      <h3 class="subtitle">Players: {{ state?.players?.length }}</h3>
      <ul class="players">
        <single-player-summary 
          v-for="user in state?.players" 
          v-bind:key="user.clientId"
          :user="user"
        ></single-player-summary>
      </ul>
    </div>
`
};

export const SinglePlayerSummary = {
  props: ['user'],

  data: function () {
    const randomColour = Math.floor(Math.random() * 254) + 1;
    return {
      bgColour: `background-color: hsl(${randomColour}deg, 50%, 53%)`
    }
  },

  template: `
      <li class="player">
        <span v-bind:style="bgColour" class="colour"></span>        
       {{ user.friendlyName }}
      </li>
`
};