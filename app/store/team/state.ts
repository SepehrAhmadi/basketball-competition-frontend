import { ref } from "vue";

export function useTeamState() {
  const loading = ref<boolean>(false);

  const teamList = ref<any[]>([]);
  const teamListMeta = ref<any>(null);
  const teamDetail = ref<any>(null);

  const roster = ref<any[]>([]);
  const coachRoster = ref<any[]>([]);
  const coachRosterMeta = ref<any>(null);
  const playerRoster = ref<any[]>([]);
  const playerRosterMeta = ref<any>(null);

  return {
    loading,
    teamList,
    teamListMeta,
    teamDetail,
    roster,
    coachRoster,
    coachRosterMeta,
    playerRoster,
    playerRosterMeta,
  };
}
