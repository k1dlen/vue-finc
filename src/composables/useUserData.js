import { ref } from 'vue'

export default function useUserData() {
  const userId = ref(localStorage.getItem('userId'))
  const userData = ref(
    JSON.parse(localStorage.getItem(`user_${localStorage.getItem('userId')}`)) || {
      transactions: [],
      savings: [],
      income: 0,
      expenses: 0,
    },
  )

  const isSafetyEnabled = ref(JSON.parse(localStorage.getItem('isSafetyEnabled')) || false)

  const saveUserData = () => {
    if (userId.value) {
      localStorage.setItem(`user_${userId.value}`, JSON.stringify(userData.value))
    }
  }

  const addTransaction = (type, description, amount) => {
    userData.value.transactions.push({
      type,
      description,
      amount,
      date: new Date().toLocaleDateString(),
    })

    if (type === 'income') {
      userData.value.income += amount

      if (isSafetyEnabled.value) {
        const cushionAmount = amount * 0.15
        const safetySaving = userData.value.savings.find(
          (saving) => saving.name === 'Финансовая Подушка',
        )

        if (safetySaving) {
          safetySaving.amount += cushionAmount
        } else {
          userData.value.savings.push({
            name: 'Финансовая Подушка',
            amount: cushionAmount,
            goal: null,
          })
        }
      }
    }

    if (type === 'expense') {
      userData.value.expenses += amount
    }

    saveUserData()
  }

  const addSaving = (name, goal, initialAmount = 0) => {
    userData.value.savings.push({ name, amount: initialAmount, goal })
    saveUserData()
  }

  const editSaving = (saving) => {
    const index = userData.value.savings.findIndex((s) => s.name === saving.name)
    if (index !== -1) {
      userData.value.savings[index] = saving
      saveUserData()
    }
  }

  const deleteSaving = (index) => {
    userData.value.savings.splice(index, 1)
    saveUserData()
  }

  return {
    userId,
    userData,
    isSafetyEnabled,
    addTransaction,
    addSaving,
    editSaving,
    deleteSaving,
  }
}
