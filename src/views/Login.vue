<template>
  <div>
    <div v-if="isLoggedIn">
      <h1 class="text-3xl font-bold">Ваш Профиль</h1>
      <p class="text-lg nick">Имя пользователя: {{ userData.nickname }}</p>
      <button @click="logout" class="px-4 py-2 mt-4 text-white bg-red-500 rounded">Выйти</button>
    </div>

    <div v-else>
      <h1 class="mb-6 text-3xl font-bold">Вход</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-semibold">Имя пользователя или Email</label>
          <input v-model="identifier" type="text" class="w-full p-2 border" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-semibold">Пароль</label>
          <input v-model="password" type="password" class="w-full p-2 border" />
        </div>
        <button class="w-full px-4 py-2 text-white bg-blue-500 rounded">Войти</button>
      </form>
      <p class="mt-4 text-sm">
        Нет аккаунта?
        <router-link to="/register" class="text-blue-500 underline">
          Зарегистрируйтесь здесь
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const identifier = ref('')
    const password = ref('')
    const isLoggedIn = ref(!!localStorage.getItem('userId'))
    const userData = ref(
      isLoggedIn.value
        ? JSON.parse(localStorage.getItem(`user_${localStorage.getItem('userId')}`))
        : null,
    )

    const login = () => {
      const allUsers = Object.keys(localStorage)
        .filter((key) => key.startsWith('user_'))
        .map((key) => JSON.parse(localStorage.getItem(key)))

      const user = allUsers.find(
        (u) =>
          (u.nickname === identifier.value || u.email === identifier.value) &&
          u.password === password.value,
      )

      if (user) {
        localStorage.setItem('userId', user.id)
        location.reload()
      } else {
        alert('Неверные данные для входа')
      }
    }

    const logout = () => {
      localStorage.removeItem('userId')
      location.reload()
    }

    return {
      identifier,
      password,
      isLoggedIn,
      userData,
      login,
      logout,
    }
  },
}
</script>
