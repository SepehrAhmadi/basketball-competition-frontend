import { useApi } from "~/composables/useApi";
import type { useCompetitionState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useCompetitionState>;

interface GamesQuery {
  page?: number | null;
  pageSize?: number | null;
  status?: "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELED" | null;
  groupId?: number | string | null;
  leagueTeamId?: number | string | null;
  search?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  [key: string]: unknown;
}

export function useCompetitionActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const cleanQuery = (query: Record<string, unknown>) => {
    const cleaned: Record<string, unknown> = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === "string" && value.trim() === "") return;
      cleaned[key] = value;
    });
    return cleaned;
  };

  // ─── Groups ────────────────────────────────────────────────────────────

  const getPublicGroups = (leagueId: number | string) => {
    const axios = useApi();
    state.groupsLoading.value = true;

    return axios
      .get(`/leagues/${leagueId}/groups`)
      .then((res) => {
        const data = res.data.data;
        state.groupsFormat.value = data?.format ?? null;
        state.groups.value = data?.groups ?? [];
        return data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.groupsLoading.value = false;
      });
  };

  // ─── Games ─────────────────────────────────────────────────────────────

  let latestRequest = 0;

  const getPublicGames = (
    leagueId: number | string,
    query: GamesQuery = {},
    append = false,
  ) => {
    const axios = useApi();
    const requestId = ++latestRequest;
    state.gamesLoading.value = true;

    return axios
      .get(`/leagues/${leagueId}/games`, { params: cleanQuery(query) })
      .then((res) => {
        if (requestId !== latestRequest) return res.data.data;

        const data = res.data.data;
        const items = data?.items ?? [];

        if (append) {
          const existingIds = new Set(
            state.games.value.map((item: any) => Number(item.id)),
          );
          items.forEach((item: any) => {
            if (!existingIds.has(Number(item.id))) {
              state.games.value.push(item);
            }
          });
        } else {
          state.games.value = items;
        }

        state.gamesMeta.value = {
          total: data?.total ?? state.games.value.length,
          page: data?.page ?? query.page ?? 1,
          pageSize: data?.pageSize ?? query.pageSize ?? items.length,
        };

        return data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.gamesLoading.value = false;
      });
  };

  const resetGames = () => {
    state.games.value = [];
    state.gamesMeta.value = null;
  };

  // ─── League teams (filter options) ─────────────────────────────────────

  const getPublicLeagueTeams = (leagueId: number | string) => {
    const axios = useApi();
    state.teamOptionsLoading.value = true;

    return axios
      .get(`/leagues/${leagueId}/teams`, {
        params: { page: 1, pageSize: 100 },
      })
      .then((res) => {
        const items = res.data.data?.items ?? [];
        state.teamOptions.value = items.map((item: any) => ({
          value: item.id,
          label: item.team?.name ?? "—",
        }));
        return res.data.data;
      })
      .catch((err) => {
        console.log(err);
        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      })
      .finally(() => {
        state.teamOptionsLoading.value = false;
      });
  };

  return {
    getPublicGroups,
    getPublicGames,
    getPublicLeagueTeams,
    resetGames,
  };
}
