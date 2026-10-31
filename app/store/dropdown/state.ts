import { ref } from "vue";

export function useDropdownState() {
  const seasonOptions = ref<any[]>([]);
  const ageCategoryOptions = ref<any[]>([]);

  return {
    seasonOptions,
    ageCategoryOptions,
  };
}
