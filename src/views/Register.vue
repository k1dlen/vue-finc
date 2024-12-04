<template>
  <div class="h-full p-4 overflow-y-auto">
    <h1 class="mb-6 text-3xl font-bold">Регистрация</h1>
    <form @submit.prevent="registerUser">
      <div class="mb-4">
        <label class="block mb-1 text-sm font-semibold">Имя пользователя</label>
        <input v-model="nickname" type="text" class="w-full p-2 border" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-sm font-semibold">Пароль</label>
        <input v-model="password" type="password" class="w-full p-2 border" />
      </div>
      <button class="w-full px-4 py-2 text-white bg-blue-500 rounded">Зарегистрироваться</button>
    </form>
    <p class="mt-4 text-green-500" v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import bcrypt from 'bcryptjs'

export default {
  setup() {
    const nickname = ref('')
    const password = ref('')
    const successMessage = ref('')

    const registerUser = async () => {
      if (!nickname.value || !password.value) {
        alert('Введите имя пользователя и пароль.')
        return
      }

      const allUsers = Object.keys(localStorage)
        .filter((key) => key.startsWith('user_'))
        .map((key) => JSON.parse(localStorage.getItem(key)))

      if (allUsers.find((user) => user.nickname === nickname.value)) {
        alert('Имя пользователя уже занято.')
        return
      }

      const userId = new Date().getTime()
      const hashedPassword = await bcrypt.hash(password.value, 10)
      const newUser = {
        id: userId,
        nickname: nickname.value,
        password: hashedPassword,
        transactions: [],
        savings: [],
        income: 0,
        expenses: 0,
      }

      localStorage.setItem(`user_${userId}`, JSON.stringify(newUser))
      localStorage.setItem('userId', userId)
      successMessage.value = 'Регистрация успешна! Перенаправление...'
      setTimeout(() => {
        window.location.href = '/home'
      }, 1000)
    }

    return {
      nickname,
      password,
      successMessage,
      registerUser,
    }
  },
}
</script>
