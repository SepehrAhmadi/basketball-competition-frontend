import { ref } from "vue";

export function useCompetitionState() {
  const groupsLoading = ref<boolean>(false);
  const groupsFormat = ref<string | null>(null);
  const groups = ref<any[]>([]);

  const gamesLoading = ref<boolean>(false);
  const games = ref<any[]>([]);
  const gamesMeta = ref<any>(null);

  const teamOptions = ref<any[]>([]);
  const teamOptionsLoading = ref<boolean>(false);

  return {
    groupsLoading,
    groupsFormat,
    groups,
    gamesLoading,
    games,
    gamesMeta,
    teamOptions,
    teamOptionsLoading,
  };
}
