<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">История операций</h1>

    <div class="bg-white p-6 rounded shadow mb-6">
      <h2 class="text-xl font-semibold mb-4">Добавить операцию</h2>
      <div class="mb-4">
        <label class="block mb-2">Тип</label>
        <select v-model="operationType" class="border p-2 w-full">
          <option value="Доход">Доход</option>
          <option value="Расход">Расход</option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block mb-2">Описание</label>
        <input v-model="description" type="text" class="border p-2 w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-2">Сумма</label>
        <input v-model="amount" type="number" class="border p-2 w-full" />
      </div>
      <button
        @click="addOperation"
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Добавить
      </button>
    </div>

    <div class="bg-white p-6 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">История</h2>
      <ul>
        <li
          v-for="(operation, index) in userData.transactions"
          :key="index"
          class="flex justify-between border-b pb-2 mb-2"
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
