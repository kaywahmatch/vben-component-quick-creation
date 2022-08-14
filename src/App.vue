<script setup lang="ts">
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
  import HelloWorld from './components/HelloWorld.vue';
  import { onMounted, ref } from 'vue';

  const pasteFont = ref();

  onMounted(() => {
    // window.electronAPI.onUpdateCounter((_event, value) => {
    //   console.log(
    //     '🚀 ~ file: App.vue ~ line 10 ~ window.electron.onUpdateCounter ~ _event, value',
    //     _event,
    //     value
    //   );
    // });
  });

  const pasteFontBtn = () => {
    // const asd = window.electronAPI.writeLogin();
    window.electronAPI.onUpdateCounter('abc');
    // window.electronAPI.onUpdateCounter((_event, value) => {
    //   console.log(
    //     '🚀 ~ file: App.vue ~ line 10 ~ window.electron.onUpdateCounter ~ _event, value',
    //     _event,
    //     value
    //   );
    // });
  };
</script>

<template>
  {{ pasteFont }}
  <button @click="pasteFontBtn">复制粘贴</button>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>
