import { ref } from "vue";

export function useTeamState() {
  const loading = ref<boolean>(false);

  const teamList = ref<any[]>([]);
  const teamListMeta = ref<any>(null);
  const teamDetail = ref<any>(null);

  const roster = ref<any[]>([]);
  const rosterMeta = ref<any>(null);

  return {
    loading,
    teamList,
    teamListMeta,
    teamDetail,
    roster,
    rosterMeta,
  };
}
