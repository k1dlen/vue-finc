<template>
  <div class="flex h-screen overflow-hidden">
    <div class="w-60 bg-gray-900 text-white h-screen">
      <Header />
    </div>

    <div class="flex-grow p-4 bg-gray-100 relative">
      <router-view :key="$route.fullPath" />

      <Notification />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Notification from "./components/Notification.vue";

export default {
  components: {
    Header,
    Notification,
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
