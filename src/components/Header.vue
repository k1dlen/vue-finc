<template>
  <div class="flex flex-col justify-between h-screen text-white bg-gray-900">
    <div class="p-6 text-center">
      <p class="text-lg font-bold">
        <router-link
          to="/home"
          class="flex items-center justify-center">Мой План</router-link
        >
      </p>
    </div>

    <nav class="flex flex-col items-center flex-grow gap-8 mt-8">
      <router-link
        to="/home"
        class="flex items-center justify-center w-16 h-16 rounded"
        :class="getClass('/')"
      >
        <img src="../assets/Home.svg" alt="home" class="w-10 h-10" />
      </router-link>
      <router-link
        to="/dashboard"
        class="flex items-center justify-center w-16 h-16 rounded"
        :class="getClass('/dashboard')"
      >
        <img src="../assets/Analytics.svg" alt="dashboard" class="w-10 h-10" />
      </router-link>
      <router-link
        to="/settings"
        class="flex items-center justify-center w-16 h-16 rounded"
        :class="getClass('/settings')"
      >
        <img src="../assets/Settings.svg" alt="settings" class="w-10 h-10" />
      </router-link>
      <router-link
        to="/login"
        class="flex items-center justify-center w-16 h-16 rounded"
        :class="getClass('/login')"
      >
        <img src="../assets/Access.svg" alt="login" class="w-10 h-10" />
      </router-link>
    </nav>

    <div class="p-6 text-xs text-center text-gray-400">
      <p>© 2024 Мой План</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getClass(route) {
      return this.$route.path === route ? 'bg-blue-500' : 'hover:bg-gray-800'
    },
  },
}
</script>

<style scoped>
@media (max-width: 768px) {
  nav {
    gap: 2rem;
  }
}
</style>
