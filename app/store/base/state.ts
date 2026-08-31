import { ref } from "vue";

export function useBaseState() {
  const loading = ref<boolean>(false);
  const roles = ref<any>(null);

  return {
    loading,
    roles,
  };
}
