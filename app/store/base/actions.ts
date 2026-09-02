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
  
  const getCoachDegree = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/coach-degrees")
      .then((res) => {
        state.coachDegree.value = res.data.data.degrees;
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

  const getRefereeDegree = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/referee-levels")
      .then((res) => {
        state.refereeDegrees.value = res.data.data.levels;
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
    getCoachDegree,
    getRefereeDegree
  };
}
