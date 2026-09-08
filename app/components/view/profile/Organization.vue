<template>
    <div>
        <div class="flex justify-between items-center gap-2 mb-2">
            <div class="flex items-center gap-2">
                <icon-building
                    class="size-3.75 text-gray-500 dark:text-gray-300"
                />
                <div class="text-[13px] text-gray-500 dark:text-gray-300">
                    سازمان ها
                </div>
            </div>
        </div>
        <Card
            v-if="organizationList.length > 0"
            v-for="organization in organizationList"
            :key="organization.id"
            class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
        >
            <CardContent class="px-3">
                <div class="flex justify-start items-center gap-1">
                    <div class="w-full flex justify-start items-center gap-2">
                        <div
                            class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2"
                        >
                            <img
                                v-if="organization.logoUrl"
                                :src="organization.logoUrl"
                                class="w-full h-full object-cover rounded-full"
                                alt="logo"
                            />
                            <img
                                v-else
                                :src="teamLogo"
                                class="w-full h-full object-cover rounded-full p-1.5"
                                alt="logo"
                            />
                        </div>
                        <div
                            class="shrink w-full flex-1 flex justify-between items-center gap-4"
                        >
                            <div>
                                <div class="text-[14px] font-semibold">
                                    {{ organization.name }}
                                </div>
                                <div
                                    class="text-[12px] text-gray-600 dark:text-gray-400 font-semibold line-clamp-1"
                                >
                                    {{ organization.description }}
                                </div>
                            </div>
                        </div>
                        <NuxtLink
                            :to="`/profile/organization/${organization.id}`"
                            class="flex items-center gap-1 text-[14px] font-semibold text-primary shrink-0"
                            aria-label="مشاهده سازمان"
                        >
                            <div>مشاهده</div>
                            <icon-arrow-left class="text-[17px]" />
                        </NuxtLink>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Pagination
            v-if="pageCount > 1"
            v-model:page="page"
            :items-per-page="pageSize"
            :total="organizationListMeta?.total ?? 0"
            :sibling-count="1"
            show-edges
            class="mt-4"
            aria-label="صفحه‌بندی سازمان‌ها"
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
import teamLogo from "../../../assets/img/icon/team.png";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";

import { useOrganizationStore } from "~/store/organization";
const organizationStore = useOrganizationStore();
const { organizationList, organizationListMeta } =
    storeToRefs(organizationStore);

const page = ref(1);
const pageSize = 3;
const pageCount = computed(() =>
    Math.ceil((organizationListMeta.value?.total ?? 0) / pageSize),
);

const loadOrganizations = () => {
    return organizationStore.getOrganizations({
        page: page.value,
        pageSize,
    });
};

watch(page, () => {
    loadOrganizations();
});

watch(pageCount, (newPageCount) => {
    if (newPageCount > 0 && page.value > newPageCount) {
        page.value = newPageCount;
    }
});

onMounted(() => {
    loadOrganizations();
});
</script>
