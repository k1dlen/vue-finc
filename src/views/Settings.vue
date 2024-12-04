<template>
  <div class="h-full p-4 overflow-y-auto">
    <h1 class="mb-6 text-3xl font-bold">Настройки</h1>

    <div class="p-6 mb-6 bg-white rounded shadow">
      <h2 class="mb-4 text-xl font-semibold">Финансовая Подушка</h2>
      <label class="flex items-center space-x-4">
        <input
          type="checkbox"
          v-model="isSafetyEnabled"
          class="w-6 h-6 form-checkbox"
        />
        <span>Автоматическое накопление 15% от дохода</span>
      </label>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const isSafetyEnabled = ref(
      JSON.parse(localStorage.getItem("isSafetyEnabled")) || false
    );

    const toggleSafety = () => {
      localStorage.setItem("isSafetyEnabled", JSON.stringify(isSafetyEnabled.value));
    };

    return {
      isSafetyEnabled,
      toggleSafety,
    };
  },
  watch: {
    isSafetyEnabled: {
      handler: "toggleSafety",
    },
  },
};
</script>
