<template>
  <div>
    <vue-markdown :key="key"> {{ content }} </vue-markdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';

export default {
  name: 'text-content',

  components: {
    VueMarkdown,
  },

  props: {
    content: null,
  },

  data() {
    return {
      key: 0,
    };
  },

  watch: {
    content() {
      this.key += 1;
    },
  },
};
</script>

<style>

</style>
