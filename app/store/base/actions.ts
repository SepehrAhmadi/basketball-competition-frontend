import { useApi } from "~/composables/useApi";
import type { useBaseState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useBaseState>;

export function useBaseActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const getRoles = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/roles")
      .then((res) => {
        state.roles.value = res.data.data.roles;
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

  return {
    getRoles,
  };
}
