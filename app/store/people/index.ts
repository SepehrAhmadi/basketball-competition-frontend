import { defineStore } from "pinia";
import { usePeopleState } from "./state";
import { usePeopleActions } from "./actions";

export const usePeopleStore = defineStore("peopleStore", () => {
  const state = usePeopleState();
  const actions = usePeopleActions(state);

  return {
    ...state,
    ...actions,
  };
});
