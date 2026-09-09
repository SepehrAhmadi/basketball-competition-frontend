import { useApi } from "~/composables/useApi";
import type { useTeamState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useTeamState>;

export function useTeamActions(state: StateType) {
  const handlerStore = useHandlerStore();

  // ─── Read actions ──────────────────────────────────────────────────────

  const getTeams = (
    query: { page?: number; pageSize?: number } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/teams", { params: query })
      .then((res) => {
        const data = res.data.data;
        state.teamList.value = data?.items ?? data ?? [];
        state.teamListMeta.value = data
          ? {
              total: data.total ?? state.teamList.value.length,
              page: data.page ?? query.page ?? 1,
              pageSize:
                data.pageSize ??
                query.pageSize ??
                state.teamList.value.length,
            }
          : null;
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

  const getTeamById = (teamId: number | string) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/teams/${teamId}`)
      .then((res) => {
        state.teamDetail.value = res.data.data;
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

  const getRoster = (
    teamId: number | string,
    query: { page?: number; pageSize?: number } = {},
  ) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/teams/${teamId}/roster`, { params: query })
      .then((res) => {
        const data = res.data.data;
        state.roster.value = data?.items ?? data ?? [];
        state.rosterMeta.value = data
          ? {
              total: data.total ?? state.roster.value.length,
              page: data.page ?? query.page ?? 1,
              pageSize:
                data.pageSize ??
                query.pageSize ??
                state.roster.value.length,
            }
          : null;
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

  const createTeam = (formData: FormData) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .post("/teams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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

  const updateTeam = (teamId: number | string, formData: FormData) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .put(`/teams/${teamId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        state.teamDetail.value = res.data.data;
        handlerStore.setSuccess(res.data.message);
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

  const deleteTeam = (teamId: number | string) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;
    handlerStore.postCheck = true;

    return axios
      .delete(`/teams/${teamId}`)
      .then((res) => {
        state.teamList.value = state.teamList.value.filter(
          (team: any) => team.id !== teamId,
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

  const updateTeamLogo = (teamId: number | string, formData: FormData) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .put(`/teams/${teamId}/logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (state.teamDetail.value) {
          state.teamDetail.value = {
            ...state.teamDetail.value,
            logo: res.data.data?.logo,
          };
        }
        handlerStore.setSuccess(res.data.message);
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

  // ─── Roster mutation actions ───────────────────────────────────────────

  const addRosterMember = (teamId: number | string, data: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .post(`/teams/${teamId}/roster`, data)
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

  const updateRosterMember = (
    teamId: number | string,
    memberId: number | string,
    data: any,
  ) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .put(`/teams/${teamId}/roster/${memberId}`, data)
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

  const removeRosterMember = (
    teamId: number | string,
    memberId: number | string,
  ) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;
    handlerStore.postCheck = true;

    return axios
      .delete(`/teams/${teamId}/roster/${memberId}`)
      .then((res) => {
        state.roster.value = state.roster.value.filter(
          (member: any) => member.id !== memberId,
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
    getTeams,
    getTeamById,
    getRoster,
    createTeam,
    updateTeam,
    deleteTeam,
    updateTeamLogo,
    addRosterMember,
    updateRosterMember,
    removeRosterMember,
  };
}
