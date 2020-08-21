export const CopyableTextBox = {
  props: ['value'],

  data: function () {
    return {
      componentStyle: `
          display: flex;
          justify-content: flex-start;
        `
    }
  },

  methods: {
    copyLink: async function () {
      navigator.clipboard.writeText(this.value);
    }
  },

  template: `
    <div v-bind:style="componentStyle">
      <span id="copyLinkInputBox" class="copy-link-text">{{ value }}</span>
      <input type="button" v-on:click="copyLink" class="copy-link" value="Copy link" />
    </div>
`
};