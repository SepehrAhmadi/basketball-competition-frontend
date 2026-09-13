import { ref } from "vue";

export function useAuthState() {
  const loginResult = ref<any>(null);
  const loading = ref<boolean>(false);

  const isAuthResolved = ref<boolean>(false);

  return {
    loginResult,
    loading,
    isAuthResolved,
  };
}
