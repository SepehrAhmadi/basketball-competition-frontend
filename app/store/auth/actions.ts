import { useApi } from "~/composables/useApi";
import type { useAuthState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useAuthState>;

export function useAuthActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const register = (value: any) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .post("/auth/register", value)
      .then((res) => {
        handlerStore.setSuccess(res.data.message);
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

  const login = (value: any) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .post("/auth/login", value, { withCredentials: true })
      .then((res) => {
        state.loginResult.value = res.data;
        if (res.data.data?.accessToken) {
          const token = res.data.data.accessToken;
          useCookie("token").value = token;
          navigateTo("/");
          handlerStore.setSuccess(res.data.message);
        }
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

  const refreshToken = () => {
    const axios = useApi();

    return axios
      .post("/auth/refresh-token", {}, { withCredentials: true })
      .then((res) => {
        if (res.data.data?.accessToken) {
          useCookie("token").value = res.data.data.accessToken;
        }
      })
      .catch((err) => {
        console.log(err);
        useCookie("token").value = null;
        handlerStore.setUnauthorized();
      });
  };

  const logout = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .post("/auth/logout", {}, { withCredentials: true })
      .then(() => {
        if (useCookie("token").value) {
          useCookie("token").value = null;
        }
        navigateTo("/auth");
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

  const deleteAccount = () => {
    const axios = useApi();
    handlerStore.loadingBtn = true;
    handlerStore.postCheck = true;

    return axios
      .delete("/auth/account")
      .then((res) => {
        handlerStore.setSuccess(res.data.message);
        if (useCookie("token").value) {
          useCookie("token").value = null;
        }
        navigateTo("/auth");
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
    register,
    login,
    refreshToken,
    logout,
    deleteAccount,
  };
}
