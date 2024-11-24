<template>
  <div class="h-full p-4 overflow-y-auto">
    <h1 class="mb-6 text-3xl font-bold">Ваши Финансы</h1>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="p-6 bg-white rounded shadow">
        <h2 class="text-xl font-semibold">Доходы</h2>
        <p class="text-2xl font-bold text-green-500">{{ userData.income || 0 }} ₽</p>
      </div>
      <div class="p-6 bg-white rounded shadow">
        <h2 class="text-xl font-semibold">Расходы</h2>
        <p class="text-2xl font-bold text-red-500">{{ userData.expenses || 0 }} ₽</p>
      </div>
      <div class="p-6 bg-white rounded shadow">
        <h2 class="text-xl font-semibold">Накопления</h2>
        <p class="text-2xl font-bold text-blue-500">{{ totalSavings }} ₽</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
      <div class="p-6 bg-white rounded shadow h-80">
        <h2 class="mb-4 text-xl font-semibold">Доходы и Расходы</h2>
        <div class="flex items-center justify-center h-full">
          <template v-if="incomeExpenseDataAvailable">
            <canvas id="incomeExpenseChart" class="w-full h-64 max-h-64"></canvas>
          </template>
          <template v-else>
            <p class="text-gray-500">Пока нет данных</p>
          </template>
        </div>
      </div>

      <div class="p-6 bg-white rounded shadow h-80">
        <h2 class="mb-4 text-xl font-semibold">Накопления</h2>
        <div class="flex items-center justify-center h-full">
          <template v-if="savingsDataAvailable">
            <canvas id="savingsChart" class="w-full h-64 max-h-64"></canvas>
          </template>
          <template v-else>
            <p class="text-gray-500">Пока нет данных</p>
          </template>
        </div>
      </div>
    </div>

    <div class="p-6 mt-6 bg-white rounded shadow">
      <h2 class="mb-4 text-xl font-semibold">Добавить Накопление</h2>
      <input
        v-model="savingName"
        type="text"
        placeholder="Название"
        class="w-full p-2 mt-2 border"
      />
      <input
        v-model="savingGoal"
        type="number"
        placeholder="Целевая сумма"
        class="w-full p-2 mt-2 border"
      />
      <input
        v-model="savingInitial"
        type="number"
        placeholder="Начальная сумма (необязательно)"
        class="w-full p-2 mt-2 border"
      />
      <button @click="addSaving" class="px-4 py-2 mt-4 text-white bg-blue-500 rounded">
        Добавить Накопление
      </button>
    </div>

    <div
      v-for="(saving, index) in userData.savings"
      :key="index"
      class="p-6 mt-6 bg-white rounded shadow"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold">{{ saving.name }}</h3>
          <p>
            Текущая сумма: <span class="text-blue-500">{{ saving.amount }} ₽</span>
          </p>
          <p>
            Целевая сумма: <span class="text-gray-700">{{ saving.goal || 'Не указана' }} ₽</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="openEditModal(index)" class="px-4 py-2 text-white bg-yellow-500 rounded">
            Изменить
          </button>
          <button @click="deleteSaving(index)" class="px-4 py-2 text-white bg-red-500 rounded">
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="p-6 bg-white rounded shadow w-96">
        <h2 class="mb-4 text-xl font-semibold">Изменить Накопление</h2>
        <div>
          <label class="block mb-2">Название</label>
          <input v-model="editingSaving.name" type="text" class="w-full p-2 border" />
        </div>
        <div class="mt-4">
          <label class="block mb-2">Целевая сумма</label>
          <input v-model="editingSaving.goal" type="number" class="w-full p-2 border" />
        </div>
        <div class="mt-4">
          <label class="block mb-2">Добавить сумму</label>
          <input v-model="editingAmount" type="number" class="w-full p-2 border" />
        </div>
        <div class="flex justify-end gap-4 mt-6">
          <button @click="saveChanges" class="px-4 py-2 text-white bg-blue-500 rounded">
            Сохранить
          </button>
          <button @click="closeModal" class="px-4 py-2 text-white bg-gray-500 rounded">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import useUserData from '../composables/useUserData'

export default {
  setup() {
    const { userData, addSaving, editSaving, deleteSaving } = useUserData()

    const savingName = ref('')
    const savingGoal = ref(0)
    const savingInitial = ref(0)

    const showModal = ref(false)
    const editingSaving = ref({})
    const editingAmount = ref(0)

    const incomeExpenseChart = ref(null)
    const savingsChart = ref(null)

    const totalSavings = computed(() =>
      userData.value.savings.reduce((sum, saving) => sum + saving.amount, 0),
    )

    const incomeExpenseDataAvailable = computed(
      () => userData.value.income > 0 || userData.value.expenses > 0,
    )

    const savingsDataAvailable = computed(
      () =>
        userData.value.savings.length > 0 &&
        userData.value.savings.some((saving) => saving.amount > 0),
    )

    const destroyChart = (chartRef) => {
      if (chartRef.value) {
        chartRef.value.destroy()
        chartRef.value = null
      }
    }

    const drawCharts = () => {
      if (incomeExpenseDataAvailable.value) {
        destroyChart(incomeExpenseChart)
        const incomeExpenseCtx = document.getElementById('incomeExpenseChart')?.getContext('2d')
        if (incomeExpenseCtx) {
          incomeExpenseChart.value = new Chart(incomeExpenseCtx, {
            type: 'bar',
            data: {
              labels: ['Доходы', 'Расходы'],
              datasets: [
                {
                  label: 'Финансовые данные',
                  data: [userData.value.income || 0, userData.value.expenses || 0],
                  backgroundColor: ['#6CBF6E', '#F97373'],
                  borderWidth: 2,
                },
              ],
            },
            options: {
              responsive: true,
            },
          })
        }
      }

      if (savingsDataAvailable.value) {
        destroyChart(savingsChart)
        const savingsCtx = document.getElementById('savingsChart')?.getContext('2d')
        if (savingsCtx) {
          savingsChart.value = new Chart(savingsCtx, {
            type: 'doughnut',
            data: {
              labels: userData.value.savings.map((saving) => saving.name || 'Без названия'),
              datasets: [
                {
                  label: 'Накопления',
                  data: userData.value.savings.map((saving) => saving.amount || 0),
                  backgroundColor: ['#FF9F80', '#80C3FF', '#E880FF'],
                },
              ],
            },
            options: {
              responsive: true,
            },
          })
        }
      }
    }

    const addSavingHandler = () => {
      const initialAmount = parseFloat(savingInitial.value || 0)
      if (!savingName.value || !savingGoal.value) return
      addSaving(savingName.value, parseFloat(savingGoal.value), initialAmount)
      savingName.value = ''
      savingGoal.value = 0
      savingInitial.value = 0

      drawCharts()
    }

    const openEditModal = (index) => {
      editingSaving.value = { ...userData.value.savings[index] }
      editingAmount.value = 0
      showModal.value = true
    }

    const saveChanges = () => {
      editingSaving.value.amount += parseFloat(editingAmount.value || 0)
      editSaving(editingSaving.value)
      closeModal()

      drawCharts()
    }

    const closeModal = () => {
      showModal.value = false
      editingSaving.value = {}
      editingAmount.value = 0
    }

    onMounted(() => {
      drawCharts()
    })

    return {
      userData,
      savingName,
      savingGoal,
      savingInitial,
      totalSavings,
      incomeExpenseDataAvailable,
      savingsDataAvailable,
      showModal,
      editingSaving,
      editingAmount,
      addSaving: addSavingHandler,
      openEditModal,
      saveChanges,
      closeModal,
    }
  },
}
</script>
