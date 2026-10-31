import { defineStore } from "pinia";
import { useDropdownState } from "./state";
import { useDropdownActions } from "./actions";

export const useDropdownStore = defineStore("dropdownStore", () => {
  const state = useDropdownState();
  const actions = useDropdownActions(state);

  return {
    ...state,
    ...actions,
  };
});
