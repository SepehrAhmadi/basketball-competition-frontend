import { useApi } from "~/composables/useApi";
import type { usePeopleState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof usePeopleState>;

export function usePeopleActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const getPlayerMe = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/players/me")
      .then((res) => {
        state.playerProfile.value = res.data.data;
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

  const updatePlayerMe = (value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .put("/players/me", value)
      .then((res) => {
        state.playerProfile.value = res.data.data;
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

  const getCoachMe = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/coaches/me")
      .then((res) => {
        state.coachProfile.value = res.data.data;
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

  const updateCoachMe = (value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .put("/coaches/me", value)
      .then((res) => {
        state.coachProfile.value = res.data.data;
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

  const getRefereeMe = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/referees/me")
      .then((res) => {
        state.refereeProfile.value = res.data.data;
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

  const updateRefereeMe = (value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .put("/referees/me", value)
      .then((res) => {
        state.refereeProfile.value = res.data.data;
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

  return {
    getPlayerMe,
    updatePlayerMe,
    getCoachMe,
    updateCoachMe,
    getRefereeMe,
    updateRefereeMe,
  };
}
