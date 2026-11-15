import { defineStore } from "pinia";
import { useCompetitionState } from "./state";
import { useCompetitionActions } from "./actions";

export const useCompetitionStore = defineStore("competitionStore", () => {
  const state = useCompetitionState();
  const actions = useCompetitionActions(state);

  return {
    ...state,
    ...actions,
  };
});
