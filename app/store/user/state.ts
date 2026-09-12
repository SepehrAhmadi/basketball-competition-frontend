import { ref } from "vue";

export function useUserState() {
  const loading = ref<boolean>(false);

  const userProfile = ref<any>(null);
  const usersSearchResult = ref<any>(null);

  return {
    loading,
    userProfile,
    usersSearchResult,
  };
}
