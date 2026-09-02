import { ref } from "vue";

export function useBaseState() {
  const loading = ref<boolean>(false);
  const roles = ref<any>(null);
  const coachDegree = ref<any>(null);
  const refereeDegrees = ref<any>(null);

  return {
    loading,
    roles,
    coachDegree,
    refereeDegrees,
  };
}
