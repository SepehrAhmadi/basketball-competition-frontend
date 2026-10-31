import { useApi } from "~/composables/useApi";
import type { useDropdownState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useDropdownState>;

export function useDropdownActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const getSeasonOptions = () => {
    if (state.seasonOptions.value.length > 0) {
      return Promise.resolve(state.seasonOptions.value);
    }
    const axios = useApi();

    return axios
      .get("/dropdown/seasons", { params: { pageSize: 100 } })
      .then((res) => {
        state.seasonOptions.value = res.data.data.items ?? [];
        return state.seasonOptions.value;
      })
      .catch((err) => {
        console.log(err);

        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      });
  };

  const getAgeCategoryOptions = () => {
    if (state.ageCategoryOptions.value.length > 0) {
      return Promise.resolve(state.ageCategoryOptions.value);
    }
    const axios = useApi();

    return axios
      .get("/dropdown/age-categories", { params: { pageSize: 100 } })
      .then((res) => {
        state.ageCategoryOptions.value = res.data.data.items ?? [];
        return state.ageCategoryOptions.value;
      })
      .catch((err) => {
        console.log(err);

        const message = err.response?.data?.message || "خطای سرور";
        handlerStore.setError(message);
      });
  };

  return {
    getSeasonOptions,
    getAgeCategoryOptions,
  };
}
