import { ref } from "vue";

export function useLeagueState() {
  const loading = ref<boolean>(false);

  const leagueList = ref<any[]>([]);
  const leagueListMeta = ref<any>(null);

  const myLeagueList = ref<any[]>([]);
  const myLeagueListMeta = ref<any>(null);

  const leagueDetail = ref<any>(null);

  const leagueTeamDetail = ref<any>(null);

  const myTeams = ref<any[]>([]);
  const myTeamsLeague = ref<any>(null);
  const myTeamsMeta = ref<any>(null);

  const leagueTeams = ref<any[]>([]);
  const leagueTeamsMeta = ref<any>(null);

  const leagueMembers = ref<any[]>([]);
  const leagueMembersMeta = ref<any>(null);
  const leagueMembersCan = ref<any>(null);

  const eligibleTeams = ref<any[]>([]);
  const eligibleTeamsMeta = ref<any>(null);

  const memberCandidates = ref<any[]>([]);
  const memberCandidatesMeta = ref<any>(null);

  const competitionList = ref<any[]>([]);
  const competitionListMeta = ref<any>(null);
  const competitionLoading = ref<boolean>(false);
  const competitionLoadingMore = ref<boolean>(false);

  return {
    loading,
    leagueList,
    leagueListMeta,
    myLeagueList,
    myLeagueListMeta,
    leagueDetail,
    leagueTeamDetail,
    myTeams,
    myTeamsLeague,
    myTeamsMeta,
    leagueTeams,
    leagueTeamsMeta,
    leagueMembers,
    leagueMembersMeta,
    leagueMembersCan,
    eligibleTeams,
    eligibleTeamsMeta,
    memberCandidates,
    memberCandidatesMeta,
    competitionList,
    competitionListMeta,
    competitionLoading,
    competitionLoadingMore,
  };
}
