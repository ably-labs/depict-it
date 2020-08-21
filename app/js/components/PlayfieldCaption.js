export const PlayfieldCaption = {
  props: ['state', 'client'],

  data: function () {
    return {
      caption: "",
    }
  },

  methods: {
    sendCaption: async function (evt) {
      await this.client.sendCaption(this.caption);
      this.caption = "";
    }
  },

  template: `
      
  <section v-if="state?.lastInstruction?.type == 'caption-request'" class="caption">
    <h2 class="section-heading">What is this?</h2>              
    <img class="image-frame" :src="state?.lastInstruction?.value" />
    <textarea name="caption" v-model="caption" class="input textarea" />            
    <button v-on:click="sendCaption" class="form-button caption-button">Send Caption</button>
  </section>

  `
};