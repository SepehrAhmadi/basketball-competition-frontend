import { useApi } from "~/composables/useApi";
import type { useUserState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useUserState>;

export function useUserActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const getUserMe = () => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/users/me")
      .then((res) => {
        state.userProfile.value = res.data.data;
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

  const updateUserMe = (value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .patch("/users/me", value)
      .then((res) => {
        state.userProfile.value = res.data.data;
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

  const uploadUserAvatar = (value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    const formData = new FormData();
    formData.append("file", value);

    return axios
      .post("/users/me/avatar", formData)
      .then((res) => {
        state.userProfile.value = res.data.data;
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

  const removeUserAvatar = () => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .delete("/users/me/avatar")
      .then((res) => {
        state.userProfile.value = res.data.data;
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

  const changeUserPassword = (value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .patch("/users/me/password", value)
      .then((res) => {
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

  const deleteUserMe = () => {
    const axios = useApi();
    handlerStore.loadingBtn = true;
    handlerStore.postCheck = true;

    return axios
      .delete("/users/me")
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
    getUserMe,
    updateUserMe,
    uploadUserAvatar,
    removeUserAvatar,
    changeUserPassword,
    deleteUserMe,
  };
}
