<script setup lang="ts">
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
  import { onMounted, ref } from 'vue';
  import IndexDB from '../electron/libs/indexDB/index';

  const indexDB = new IndexDB();

  const clipboardList = ref<any[]>([]);

  async function handleDeleteData(id: string | number, index) {
    await indexDB.deleteData(id);
    clipboardList.value.splice(index, 1);
  }

  onMounted(() => {
    indexDB.init();
    // indexDB.getData();
    console.log('🚀 ~ file: App.vue ~ line 19 ~ onMounted ~ indexDB', indexDB);

    setInterval(async () => {
      const data = await indexDB.getData();
      clipboardList.value = data as any[];
    }, 1000);
  });
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>

  <ul>
    <li v-for="(item, index) in clipboardList" :key="item._id" style="text-align: left">
      {{ item._id }} - {{ item.type }} - {{ item.content }} - {{ item.createDate }}
      <button @click="handleDeleteData(item._id, index)">X</button>
    </li>
  </ul>
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
