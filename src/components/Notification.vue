<template>
  <div v-if="message" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
    {{ message }}
  </div>
</template>

<script>
import { ref } from 'vue'

const notificationMessage = ref('')

export function useNotification() {
  const showNotification = (msg) => {
    notificationMessage.value = msg
    setTimeout(() => {
      notificationMessage.value = ''
    }, 3000)
  }

  return {
    notificationMessage,
    showNotification,
  }
}

export default {
  setup() {
    const { notificationMessage } = useNotification()
    return { message: notificationMessage }
  },
}
</script>
