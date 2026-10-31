import { useApi } from "~/composables/useApi";
import type { useLeagueState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useLeagueState>;

export function useLeagueActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const setListMeta = (
    metaRef: { value: any },
    listRef: { value: any[] },
    data: any,
    query: { page?: number; pageSize?: number },
  ) => {
    metaRef.value = data
      ? {
          total: data.total ?? listRef.value.length,
          page: data.page ?? query.page ?? 1,
          pageSize: data.pageSize ?? query.pageSize ?? listRef.value.length,
        }
      : null;
  };

  // ─── Read actions ──────────────────────────────────────────────────────

  let competitionRequestId = 0;

  const getCompetitions = (
    query: {
      page?: number | null;
      pageSize?: number | null;
      status?: "REGISTRATION" | "ACTIVE" | "FINISHED" | null;
      seasonId?: number | string | null;
      ageCategoryId?: number | string | null;
      search?: string | null;
    } = {},
    append = false,
  ) => {
    const axios = useApi();
    const cleaned: Record<string, unknown> = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === "string" && value.trim() === "") return;
      cleaned[key] = value;
    });

    const requestId = append ? competitionRequestId : ++competitionRequestId;
    if (append) {
      state.competitionLoadingMore.value = true;
    } else {
      state.competitionLoading.value = true;
    }

    return axios
      .get("/leagues", { params: cleaned })
      .then((res) => {
        if (!append && requestId !== competitionRequestId) {
          return res.data.data;
        }
        const data = res.data.data;
        const items = data?.items ?? data ?? [];
        if (append) {
          const existingIds = new Set(
            state.competitionList.value.map((item: any) => Number(item.id)),
          );
          items.forEach((item: any) => {
            if (!existingIds.has(Number(item.id))) {
              state.competitionList.value.push(item);
            }
          });
        } else {
          state.competitionList.value = items;
        }
        setListMeta(
          state.competitionListMeta,
          state.competitionList,
          data,
          query,
        );
        return data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        if (append) {
          state.competitionLoadingMore.value = false;
        } else {
          state.competitionLoading.value = false;
        }
      });
  };

  const getLeagues = (
    query: {
      page?: number;
      pageSize?: number;
      status?: "REGISTRATION" | "ACTIVE" | "FINISHED";
      seasonId?: number | string;
      ageCategoryId?: number | string;
      search?: string;
    } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/leagues", { params: query })
      .then((res) => {
        const data = res.data.data;
        state.leagueList.value = data?.items ?? data ?? [];
        setListMeta(state.leagueListMeta, state.leagueList, data, query);
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  const getMyLeagues = (
    query: {
      page?: number;
      pageSize?: number;
      status?: "REGISTRATION" | "ACTIVE" | "FINISHED";
    } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/leagues/me", { params: query })
      .then((res) => {
        const data = res.data.data;
        state.myLeagueList.value = data?.items ?? data ?? [];
        setListMeta(state.myLeagueListMeta, state.myLeagueList, data, query);
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  const getLeagueById = (leagueId: number | string) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/leagues/${leagueId}`)
      .then((res) => {
        state.leagueDetail.value = res.data.data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  const getLeagueTeams = (
    leagueId: number | string,
    query: { page?: number; pageSize?: number; search?: string } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/leagues/${leagueId}/teams`, { params: query })
      .then((res) => {
        const data = res.data.data;
        state.leagueTeams.value = data?.items ?? data ?? [];
        setListMeta(state.leagueTeamsMeta, state.leagueTeams, data, query);
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  const getMyLeagueTeams = (leagueId: number | string) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/leagues/${leagueId}/my-teams`)
      .then((res) => {
        const data = res.data.data;
        state.myTeams.value = data?.items ?? [];
        state.myTeamsLeague.value = data?.league ?? null;
        state.myTeamsMeta.value = data
          ? { total: data.total ?? state.myTeams.value.length }
          : null;
        return data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  // GET /leagues/:leagueId/teams/:leagueTeamId (public, optional token for `can`/`myRoles`)
  const getLeagueTeamById = (
    leagueId: number | string,
    leagueTeamId: number | string,
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/leagues/${leagueId}/teams/${leagueTeamId}`)
      .then((res) => {
        state.leagueTeamDetail.value = res.data.data;
        return res.data.data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  const getLeagueTeamMembers = (
    leagueId: number | string,
    leagueTeamId: number | string,
    query: {
      page?: number;
      pageSize?: number;
      role?: "COACH" | "PLAYER";
    } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/leagues/${leagueId}/teams/${leagueTeamId}/members`, {
        params: query,
      })
      .then((res) => {
        const data = res.data.data;
        state.leagueMembers.value = data?.items ?? data ?? [];
        setListMeta(state.leagueMembersMeta, state.leagueMembers, data, query);
        state.leagueMembersCan.value = data?.can ?? null;
        return data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  const getEligibleTeams = (
    leagueId: number | string,
    query: {
      page?: number;
      pageSize?: number;
      search?: string;
      organizationId?: number | string;
    } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/leagues/${leagueId}/eligible-teams`, { params: query })
      .then((res) => {
        const data = res.data.data;
        state.eligibleTeams.value = data?.items ?? data ?? [];
        setListMeta(state.eligibleTeamsMeta, state.eligibleTeams, data, query);
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  const getMemberCandidates = (
    leagueId: number | string,
    leagueTeamId: number | string,
    query: {
      page?: number;
      pageSize?: number;
      role?: "COACH" | "PLAYER";
      search?: string;
    } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/leagues/${leagueId}/teams/${leagueTeamId}/members/candidates`, {
        params: query,
      })
      .then((res) => {
        const data = res.data.data;
        state.memberCandidates.value = data?.items ?? data ?? [];
        setListMeta(
          state.memberCandidatesMeta,
          state.memberCandidates,
          data,
          query,
        );
        return data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.loading.value = false;
      });
  };

  // ─── Mutation actions ──────────────────────────────────────────────────

  const registerTeam = (
    leagueId: number | string,
    data: { teamId: number | string },
  ) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .post(`/leagues/${leagueId}/teams`, data)
      .then((res) => {
        handlerStore.setSuccess(res.data.message);
        return res.data.data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        handlerStore.loadingBtn = false;
      });
  };

  const unregisterTeam = (
    leagueId: number | string,
    leagueTeamId: number | string,
  ) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;
    handlerStore.postCheck = true;

    return axios
      .delete(`/leagues/${leagueId}/teams/${leagueTeamId}`)
      .then((res) => {
        state.leagueTeams.value = state.leagueTeams.value.filter(
          (team: any) => Number(team.id) !== Number(leagueTeamId),
        );
        handlerStore.setSuccess(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        setTimeout(() => {
          handlerStore.postCheck = false;
          handlerStore.loadingBtn = false;
        }, 500);
      });
  };

  const addMembers = (
    leagueId: number | string,
    leagueTeamId: number | string,
    data: { teamSeasonMemberIds: (number | string)[] },
  ) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .post(`/leagues/${leagueId}/teams/${leagueTeamId}/members`, data)
      .then((res) => {
        handlerStore.setSuccess(res.data.message);
        return res.data.data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        handlerStore.loadingBtn = false;
      });
  };

  const removeMember = (
    leagueId: number | string,
    leagueTeamId: number | string,
    memberId: number | string,
  ) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;
    handlerStore.postCheck = true;

    return axios
      .delete(`/leagues/${leagueId}/teams/${leagueTeamId}/members/${memberId}`)
      .then((res) => {
        state.leagueMembers.value = state.leagueMembers.value.filter(
          (member: any) => Number(member.id) !== Number(memberId),
        );
        handlerStore.setSuccess(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        setTimeout(() => {
          handlerStore.postCheck = false;
          handlerStore.loadingBtn = false;
        }, 500);
      });
  };

  return {
    getCompetitions,
    getLeagues,
    getMyLeagues,
    getLeagueById,
    getMyLeagueTeams,
    getLeagueTeamById,
    getLeagueTeams,
    getLeagueTeamMembers,
    getEligibleTeams,
    getMemberCandidates,
    registerTeam,
    unregisterTeam,
    addMembers,
    removeMember,
  };
}
