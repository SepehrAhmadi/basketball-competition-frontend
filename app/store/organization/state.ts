import { ref } from "vue";

export function useOrganizationState() {
  const loading = ref<boolean>(false);

  const organizationList = ref<any[]>([]);
  const organizationListMeta = ref<any>(null);
  const organizationDetail = ref<any>(null);

  return {
    loading,
    organizationList,
    organizationListMeta,
    organizationDetail,
  };
}
