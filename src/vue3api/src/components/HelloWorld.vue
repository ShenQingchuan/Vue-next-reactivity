<template>
  <div class="hello">
    <h2> {{ msg }} </h2>
    <h3>快来试试 Vue3 Composition API 吧!</h3>
    <br>

    <h4> 这里的主要源码在: src/components/HjelloWorld.vue line 18:25 </h4>
    <div> Hi, 我是一个计数器: {{ count }} </div>
    <button class="operation" @click="increase">很好，我+1</button>
    <button class="operation" @click="reset">哼，我要重来</button>

  </div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api';

function initCountHook() {
  const count = ref(0);
  /* eslint-disable */
  const increase = () => { count.value++ };
  const reset = () => { count.value = 0 };

  return { count, increase, reset };
}

export default createComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props) {
    const countHook = initCountHook();

    return { ...countHook };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  text-align: center;
}
.hello .operation {
  margin: 5px;
  border-radius: 5px;
  outline: none;
}
</style>
