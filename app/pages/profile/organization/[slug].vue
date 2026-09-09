<template>
    <div>
        <ViewProfileOrganizationDetail class="mt-2" />
        <ViewProfileOrganizationTeamList :teams="teamList" class="mt-2" />

        <Pagination
            v-if="pageCount > 1"
            v-model:page="page"
            :items-per-page="pageSize"
            :total="teamListMeta?.total ?? 0"
            :sibling-count="1"
            show-edges
            class="mt-4"
            aria-label="صفحه‌بندی تیم‌ها"
        >
            <PaginationContent>
                <PaginationPrevious aria-label="صفحه قبلی" />
                <PaginationItem
                    v-for="pageNumber in pageCount"
                    :key="pageNumber"
                    :value="pageNumber"
                    :is-active="pageNumber === page"
                    :aria-label="`صفحه ${pageNumber}`"
                    class="w-7! h-7! p-1! text-[14px]!"
                >
                    {{ pageNumber }}
                </PaginationItem>
                <PaginationNext aria-label="صفحه بعدی" />
            </PaginationContent>
        </Pagination>
    </div>
</template>

<script setup lang="ts">
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";

import { useTeamStore } from "~/store/team";
const teamStore = useTeamStore();
const { teamList, teamListMeta } = storeToRefs(teamStore);

const route = useRoute();
const organizationId = computed(() => String(route.params.slug));

const page = ref(1);
const pageSize = 10;
const pageCount = computed(() =>
    Math.ceil((teamListMeta.value?.total ?? 0) / pageSize),
);

const loadTeams = () => {
    return teamStore.getTeams({
        organizationId: organizationId.value,
        page: page.value,
        pageSize,
    });
};

watch(page, () => {
    loadTeams();
});

watch(pageCount, (newPageCount) => {
    if (newPageCount > 0 && page.value > newPageCount) {
        page.value = newPageCount;
    }
});

onMounted(() => {
    loadTeams();
});

defineExpose({ loadTeams });
</script>
