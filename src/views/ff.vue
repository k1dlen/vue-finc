<!-- <template>
  <div class="h-full overflow-y-auto">
    <h1 class="text-3xl font-bold mb-6">Ваши Финансы</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold">Доходы</h2>
        <p class="text-2xl font-bold text-green-500">{{ userData.income }} ₽</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold">Расходы</h2>
        <p class="text-2xl font-bold text-red-500">{{ userData.expenses }} ₽</p>
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold">Накопления</h2>
        <p class="text-2xl font-bold text-blue-500">{{ totalSavings }} ₽</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">Доходы и Расходы</h2>
        <BarChart :chart-data="chartData" />
      </div>
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">Накопления</h2>
        <DoughnutChart :chart-data="savingsChartData" />
      </div>
    </div>

    <div class="mt-6 bg-white p-6 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Добавить Накопление</h2>
      <input
        v-model="savingName"
        type="text"
        placeholder="Название"
        class="border p-2 w-full mt-2"
      />
      <input
        v-model="savingGoal"
        type="number"
        placeholder="Целевая сумма"
        class="border p-2 w-full mt-2"
      />
      <button @click="addSaving" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Добавить Накопление
      </button>
    </div>

    <div
      v-for="(saving, index) in userData.savings"
      :key="index"
      class="mt-6 bg-white p-6 rounded shadow"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">{{ saving.name }}</h3>
          <p class="text-sm text-gray-600">
            Цель: {{ saving.goal }} ₽, Текущая сумма: {{ saving.amount }} ₽
          </p>
        </div>
        <div class="flex gap-2">
          <button @click="openEditModal(index)" class="bg-yellow-500 text-white px-4 py-2 rounded">
            Изменить
          </button>
          <button @click="deleteSaving(index)" class="bg-red-500 text-white px-4 py-2 rounded">
            Удалить
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow w-96">
        <h2 class="text-xl font-semibold mb-4">Изменить Накопление</h2>
        <div>
          <label class="block mb-2">Название</label>
          <input v-model="editingSaving.name" type="text" class="border p-2 w-full" />
        </div>
        <div class="mt-4">
          <label class="block mb-2">Целевая сумма</label>
          <input v-model="editingSaving.goal" type="number" class="border p-2 w-full" />
        </div>
        <div class="mt-4">
          <label class="block mb-2">Добавить сумму</label>
          <input v-model="editingAmount" type="number" class="border p-2 w-full" />
        </div>
        <div class="mt-6 flex gap-4 justify-end">
          <button @click="saveChanges" class="bg-blue-500 text-white px-4 py-2 rounded">
            Сохранить
          </button>
          <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import useUserData from '../composables/useUserData'
import { Bar } from 'vue-chartjs'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

export default {
  components: {
    BarChart: Bar,
    DoughnutChart: Doughnut,
  },
  setup() {
    const { userData, addSaving, editSaving, deleteSaving } = useUserData()

    const savingName = ref('')
    const savingGoal = ref(0)

    const showModal = ref(false)
    const editingSaving = ref({})
    const editingAmount = ref(0)

    const totalSavings = computed(() =>
      userData.value.savings.reduce((sum, saving) => sum + saving.amount, 0),
    )

    const chartData = computed(() => ({
      labels: ['Доходы', 'Расходы'],
      datasets: [
        {
          label: 'Суммы',
          data: [userData.value.income, userData.value.expenses],
          backgroundColor: ['#4CAF50', '#F44336'],
        },
      ],
    }))

    const savingsChartData = computed(() => ({
      labels: userData.value.savings.map((saving) => saving.name),
      datasets: [
        {
          label: 'Накопления',
          data: userData.value.savings.map((saving) => saving.amount),
          backgroundColor: ['#2196F3', '#FFC107', '#9C27B0'],
        },
      ],
    }))

    const addSavingHandler = () => {
      if (!savingName.value || !savingGoal.value) return
      addSaving(savingName.value, parseFloat(savingGoal.value))
      savingName.value = ''
      savingGoal.value = 0
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
    }

    const closeModal = () => {
      showModal.value = false
      editingSaving.value = {}
      editingAmount.value = 0
    }

    return {
      userData,
      savingName,
      savingGoal,
      totalSavings,
      chartData,
      savingsChartData,
      showModal,
      editingSaving,
      editingAmount,
      addSaving: addSavingHandler,
      openEditModal,
      saveChanges,
      closeModal,
      deleteSaving,
    }
  },
}
</script> -->
