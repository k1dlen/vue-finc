<template>
  <div class="h-full p-4 overflow-y-auto">
    <h1 class="mb-6 text-3xl font-bold">Ваши Финансы</h1>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
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
      <div class="p-6 bg-white rounded shadow">
        <h2 class="text-xl font-semibold">Баланс</h2>
        <p class="text-2xl font-bold text-yellow-500">
          {{ userData.income - userData.expenses || 0 }} ₽
        </p>
      </div>
    </div>

    <div v-if="recommendationMessage" class="p-4 mt-6 bg-red-100 rounded shadow">
      <h2 class="text-lg font-semibold text-red-600">Следите за тратами.</h2>
      <p>{{ recommendationMessage }}</p>
    </div>

    <div class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
      <div class="p-6 bg-white rounded shadow h-80">
        <h2 class="mb-4 text-xl font-semibold">Доходы и Расходы</h2>
        <div class="flex items-center justify-center h-full">
          <template v-if="incomeExpenseDataAvailable">
            <canvas id="incomeExpenseChart" class="w-full max-h-60"></canvas>
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
            <canvas id="savingsChart" class="w-full max-h-60"></canvas>
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
          <button @click="confirmDelete(index)" class="px-4 py-2 text-white bg-red-500 rounded">
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 class="mb-4 text-xl font-bold">Подтвердите удаление</h2>
        <p class="mb-6 text-gray-600">
          Вы уверены, что хотите удалить накопление
          <span class="font-semibold">{{ savingToDelete?.name }}</span
          >?
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="closeWindow" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Отмена
          </button>
          <button
            @click="deleteAndClose(index)"
            class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
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
    const isModalOpen = ref(false)

    const confirmDelete = (index) => {
      isModalOpen.value = true; 
    };

    const closeWindow = () => {
      isModalOpen.value = false;
    };

    const deleteAndClose = (index) => {
      deleteSaving(index);
      closeWindow(); 
    };

    const showModal = ref(false)
    const editingSaving = ref({})
    const editingAmount = ref(0)

    const incomeExpenseChart = ref(null)
    const savingsChart = ref(null)

    const recommendationMessage = computed(() => {
      if (userData.value.income - userData.value.expenses < 0) {
        return 'Ваши расходы превышают доходы.'
      }
    })

    const totalSavings = computed(() =>
      userData.value.savings.reduce((sum, saving) => sum + saving.amount, 0),
    )

    const incomeExpenseDataAvailable = computed(() => userData.value.transactions.length > 0)

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
      destroyChart(incomeExpenseChart)

      const incomeExpenseCtx = document.getElementById('incomeExpenseChart')?.getContext('2d')

      if (incomeExpenseDataAvailable.value && incomeExpenseCtx) {
        const incomeTransactions = userData.value.transactions.filter((t) => t.type === 'income')
        const expenseTransactions = userData.value.transactions.filter((t) => t.type === 'expense')

        const incomeLabels = incomeTransactions.map(
          (t, index) => `${index + 1} (Доход: ${t.description || 'Без описания'})`,
        )
        const expenseLabels = expenseTransactions.map(
          (t, index) => `${index + 1} (Расход: ${t.description || 'Без описания'})`,
        )

        const labels = [...incomeLabels, ...expenseLabels]

        const incomeData = incomeTransactions.map((t) => t.amount)
        const expenseData = expenseTransactions.map((t) => t.amount)

        incomeExpenseChart.value = new Chart(incomeExpenseCtx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Доходы',
                data: [...incomeData, ...Array(expenseData.length).fill(0)],
                backgroundColor: '#4CAF50',
              },
              {
                label: 'Расходы',
                data: [...Array(incomeData.length).fill(0), ...expenseData],
                backgroundColor: '#F44336',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.value} ₽`
                },
              },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      }

      if (savingsDataAvailable.value) {
        destroyChart(savingsChart)
        const savingsCtx = document.getElementById('savingsChart')?.getContext('2d')
        if (savingsDataAvailable.value && savingsCtx) {
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
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            },
          })
        }
      }
    }

    const addSavingHandler = () => {
      const initialAmount = parseFloat(savingInitial.value || 0)
      if (!savingName.value || savingGoal.value <= 0) {
        alert('Введите корректное название и цель накопления.')
        return
      }

      addSaving(savingName.value, parseFloat(savingGoal.value), initialAmount)
      alert('Накопление успешно добавлено!')
      savingName.value = ''
      savingGoal.value = 0
      savingInitial.value = 0

      drawCharts()
      location.reload()
    }

    const openEditModal = (index) => {
      editingSaving.value = { ...userData.value.savings[index] }
      editingAmount.value = 0
      showModal.value = true
    }

    const saveChanges = () => {
      editingSaving.value.amount += parseFloat(editingAmount.value || 0)
      editSaving(editingSaving.value)
      alert('Изменения успешно сохранены!')
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
      recommendationMessage,
      deleteSaving,
      isModalOpen,
      confirmDelete,
      closeWindow,
      deleteAndClose
    }
  },
}
</script>
