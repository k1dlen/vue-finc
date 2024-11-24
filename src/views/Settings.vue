<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Настройки</h1>

    <div class="bg-white p-6 rounded shadow mb-6">
      <h2 class="text-xl font-semibold mb-4">Финансовая Подушка</h2>
      <label class="flex items-center space-x-4">
        <input
          type="checkbox"
          v-model="isSafetyEnabled"
          class="form-checkbox h-6 w-6"
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
