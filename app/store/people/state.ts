import { ref } from "vue";

export function usePeopleState() {
  const loading = ref<boolean>(false);

  const playerProfile = ref<any>(null);
  const coachProfile = ref<any>(null);
  const refereeProfile = ref<any>(null);

  return {
    loading,
    playerProfile,
    coachProfile,
    refereeProfile,
  };
}
