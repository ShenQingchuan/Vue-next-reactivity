<template>
  <div id="app">
    <Counter msg="Welcome to the Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api';
import Counter from './components/Counter.vue';

export default createComponent({
  name: 'App',
  components: {
    Counter,
  },
  setup() {
  },
});
</script>

<style>
#app {
  font-family: 'Cascadia Code', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
