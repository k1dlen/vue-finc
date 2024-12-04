<template>
  <div class="h-full p-4 overflow-y-auto">
    <h1 class="mb-6 text-3xl font-bold">История операций</h1>

    <div class="p-6 mb-6 bg-white rounded shadow">
      <h2 class="mb-4 text-xl font-semibold">Добавить операцию</h2>
      <div class="mb-4">
        <label class="block mb-2">Тип</label>
        <select v-model="operationType" class="w-full p-2 border">
          <option value="Доход">Доход</option>
          <option value="Расход">Расход</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block mb-2">Описание</label>
        <input v-model="description" type="text" class="w-full p-2 border" />
      </div>
      <div class="mb-4">
        <label class="block mb-2">Сумма</label>
        <input v-model="amount" type="number" class="w-full p-2 border" />
      </div>
      <button
        @click="addOperation"
        class="px-4 py-2 text-white bg-blue-500 rounded"
      >
        Добавить
      </button>
    </div>

    <div class="p-6 bg-white rounded shadow">
      <h2 class="mb-4 text-xl font-semibold">История</h2>
      <ul>
        <li
          v-for="(operation, index) in userData.transactions"
          :key="index"
          class="flex justify-between pb-2 mb-2 border-b"
        >
          <span>{{ operation.date }} - {{ operation.description }}</span>
          <span :class="operation.type === 'Доход' ? 'text-green-500' : 'text-red-500'">
            {{ operation.amount }} ₽
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import useUserData from "../composables/useUserData";

export default {
  setup() {
    const { userData, addTransaction } = useUserData();

    const operationType = ref("Доход");
    const description = ref("");
    const amount = ref(0);

    const addOperation = () => {
      if (!description.value || !amount.value) return;
      addTransaction(operationType.value, description.value, parseFloat(amount.value));
      description.value = "";
      amount.value = 0;
    };

    return {
      userData,
      operationType,
      description,
      amount,
      addOperation,
    };
  },
};
</script>
