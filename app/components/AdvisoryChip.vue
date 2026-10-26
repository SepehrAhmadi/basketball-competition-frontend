<template>
  <span
    v-if="advisory"
    :class="[shapeClass, severityClass]"
    :title="advisory.message"
  >
    {{ advisory.message }}
  </span>
</template>

<script setup lang="ts">
type AdvisorySeverity = "INFO" | "WARNING" | "BLOCKER";

interface Advisory {
  code: string;
  severity: AdvisorySeverity;
  message: string;
  params: Record<string, string | number | boolean | null>;
}

const props = withDefaults(
  defineProps<{
    advisory: Advisory | null | undefined;
    shape?: "chip" | "plain";
  }>(),
  { shape: "chip" },
);

const shapeClass = computed(() =>
  props.shape === "chip"
    ? "w-fit text-[10px] font-semibold rounded-full px-2 py-0.5"
    : "text-[12px] font-semibold",
);

const severityClass = computed(() => {
  switch (props.advisory?.severity) {
    case "BLOCKER":
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
    case "WARNING":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
    default:
      return "bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
  }
});
</script>
