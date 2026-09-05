import { useApi } from "~/composables/useApi";
import type { useOrganizationState } from "./state";
import { useHandlerStore } from "../handler";

type StateType = ReturnType<typeof useOrganizationState>;

export function useOrganizationActions(state: StateType) {
  const handlerStore = useHandlerStore();

  const getOrganizations = (query: { page?: number; pageSize?: number } = {}) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get("/organizations", { params: query })
      .then((res) => {
        const data = res.data.data;
        state.organizationList.value = data?.items ?? data ?? [];
        state.organizationListMeta.value = data
          ? {
              total: data.total ?? state.organizationList.value.length,
              page: data.page ?? query.page ?? 1,
              pageSize: data.pageSize ?? query.pageSize ?? state.organizationList.value.length,
            }
          : null;
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

  const getOrganizationById = (id: number | string) => {
    const axios = useApi();
    state.loading.value = true;

    return axios
      .get(`/organizations/${id}`)
      .then((res) => {
        state.organizationDetail.value = res.data.data;
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

  const createOrganization = (value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .post("/organizations", value)
      .then((res) => {
        handlerStore.setSuccess(res.data.message);
        return res.data.data;
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

  const updateOrganization = (id: number | string, value: any) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;

    return axios
      .put(`/organizations/${id}`, value)
      .then((res) => {
        state.organizationDetail.value = res.data.data;
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

  const deleteOrganization = (id: number | string) => {
    const axios = useApi();
    handlerStore.loadingBtn = true;
    handlerStore.postCheck = true;

    return axios
      .delete(`/organizations/${id}`)
      .then((res) => {
        state.organizationList.value = state.organizationList.value.filter(
          (org: any) => org.id !== id,
        );
        handlerStore.setSuccess(res.data.message);
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
    getOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
}
