export const StackItem = {
  props: ['item'],
  methods: {
    emitIdOfClickedElement: async function () {
      this.$emit('click', this.item.id);
    }
  },
  template: `    
<div class="card">
  <span v-if="item.type == 'string'"
        v-on:click="emitIdOfClickedElement"
        class="stack-item stack-text">{{ item.value }}</span>

  <img  v-else      
        v-bind:src="item.value"
        v-on:click="emitIdOfClickedElement"
        class="stack-item" />

  <div class="author">
    <!-- Author names here -->
    <span class="author-name" v-if="item.systemGenerated">🤖 Auto</span>
    <span class="author-name" v-else>{{ item.authorName }}</span>
  </div>
</div>
`
};
