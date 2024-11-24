<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Регистрация</h1>
    <form @submit.prevent="registerUser">
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Имя пользователя</label>
        <input v-model="nickname" type="text" class="border p-2 w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Email</label>
        <input v-model="email" type="email" class="border p-2 w-full" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Пароль</label>
        <input v-model="password" type="password" class="border p-2 w-full" />
      </div>
      <button class="bg-blue-500 text-white py-2 px-4 rounded w-full">Зарегистрироваться</button>
    </form>
    <p class="mt-4 text-green-500" v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const nickname = ref('')
    const email = ref('')
    const password = ref('')
    const successMessage = ref('')

    const registerUser = () => {
      const userId = new Date().getTime()
      const newUser = {
        id: userId,
        nickname: nickname.value,
        email: email.value,
        password: password.value,
        transactions: [],
        savings: [],
        income: 0,
        expenses: 0,
      }
      localStorage.setItem(`user_${userId}`, JSON.stringify(newUser))
      localStorage.setItem('userId', userId)
      successMessage.value = 'Регистрация успешна! Перенаправление...'
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }

    return {
      nickname,
      email,
      password,
      successMessage,
      registerUser,
    }
  },
}
</script>
