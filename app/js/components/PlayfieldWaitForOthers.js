export const PlayfieldWaitForOthers = {
  props: ['state'],

  template: `
    <div class="loader" v-if="state?.lastInstruction?.type == 'wait'">
        <h2 class="section-heading"> Waiting for other players to finish.</h2>
        <img src="../../assets/loading.gif" alt="loading" class="loader-gif" />
    </div>
    `
};


