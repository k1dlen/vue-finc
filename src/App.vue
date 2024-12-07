<template>
  <div class="flex h-screen overflow-hidden">
    <div class="h-screen text-white bg-gray-900 w-60">
      <Header />
    </div>

    <div class="relative flex-grow p-4 bg-gray-100">
      <router-view :key="$route.fullPath" />

    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  components: {
    Header,
  },
};
</script>

<style>
html,
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
