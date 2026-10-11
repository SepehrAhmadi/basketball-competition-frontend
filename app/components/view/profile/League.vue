<template>
  <div>
    <template v-if="isLeagueLoading">
      <!-- Skeleton header -->
      <div class="flex justify-between items-center gap-2 mb-2">
        <div class="flex items-center gap-2">
          <Skeleton class="size-3.75 rounded-md" aria-hidden="true" />
          <Skeleton class="h-5 w-16 rounded-md" aria-hidden="true" />
        </div>
      </div>
      <!-- Skeleton content: shown while league list is loading -->
      <Card
        v-for="n in pageSize"
        :key="`league-skeleton-${n}`"
        class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
        aria-hidden="true"
      >
        <CardContent class="px-3">
          <div class="flex justify-start items-center gap-1">
            <div class="w-full flex justify-start items-center gap-2">
              <Skeleton class="w-15 h-15 rounded-full mb-2 shrink-0" />
              <div
                class="shrink w-full flex-1 flex justify-between items-center gap-4"
              >
                <div class="flex flex-col gap-1">
                  <Skeleton class="h-5.25 w-28 rounded-md" />
                  <Skeleton class="h-4.5 w-40 rounded-md" />
                </div>
              </div>
              <Skeleton class="h-5.25 w-18 rounded-md shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
    <template v-else>
      <Card
        v-if="myLeagueList.length <= 0"
        class="w-full shadow-xs! rounded-4xl"
        aria-hidden="true"
      >
        <CardContent
          class="flex flex-col justify-center items-center gap-3 p-4"
        >
          <icon-cup class="size-9 text-gray-500 dark:text-gray-300" />
          <div class="text-gray-500 dark:text-gray-300 text-[15px]">در حال حاضر در هیچ لیگی حضور ندارید</div>
        </CardContent>
      </Card>
      <template v-else>
        <!-- header -->
        <div class="flex justify-between items-center gap-2 mb-2">
          <div class="flex items-center gap-2">
            <icon-cup class="size-3.75 text-gray-500 dark:text-gray-300" />
            <div class="text-[13px] text-gray-500 dark:text-gray-300">
              لیگ ها
            </div>
          </div>
        </div>
        <!-- Real content: shown after league list is loaded -->
        <Card
          v-for="item in myLeagueList"
          :key="getLeagueId(item)"
          class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
        >
          <CardContent class="px-3">
            <div class="flex justify-start items-center gap-1">
              <div class="w-full flex justify-start items-center gap-2">
                <div
                  class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2 flex justify-center items-center shrink-0"
                >
                  <icon-cup class="size-7 text-white" />
                </div>
                <div
                  class="shrink w-full flex-1 flex justify-between items-center gap-4"
                >
                  <div class="flex flex-col gap-1">
                    <div class="text-[14px] font-semibold">
                      {{ getLeagueName(item) }}
                    </div>
                    <span
                      :class="cn('w-fit text-[11px] font-semibold rounded-full px-2 py-0.5', getStatusClass(getLeagueStatus(item)))"
                    >
                      {{ getStatusLabel(getLeagueStatus(item)) }}
                    </span>
                  </div>
                </div>
                <NuxtLink
                  :to="`/profile/league/${getLeagueId(item)}`"
                  class="flex items-center gap-1 text-[14px] font-semibold text-primary shrink-0"
                  aria-label="مشاهده لیگ"
                >
                  <div>مشاهده</div>
                  <icon-arrow-left class="text-[17px]" />
                </NuxtLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </template>
    </template>

    <Pagination
      v-if="!isLeagueLoading && pageCount > 1"
      v-model:page="page"
      :items-per-page="pageSize"
      :total="myLeagueListMeta?.total ?? 0"
      :sibling-count="1"
      show-edges
      class="mt-4"
      aria-label="صفحه‌بندی لیگ‌ها"
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
import { Skeleton } from "~/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { cn } from "~/lib/utils";
import { useLeagueStore } from "~/store/league";

const leagueStore = useLeagueStore();
const { myLeagueList, myLeagueListMeta } = storeToRefs(leagueStore);
const { loading: leagueLoading } = storeToRefs(leagueStore);
const isLeagueLoading = computed(() => leagueLoading.value);

const page = ref(1);
const pageSize = 3;
const pageCount = computed(() =>
  Math.ceil((myLeagueListMeta.value?.total ?? 0) / pageSize),
);

const getLeagueId = (item: any): number | string => {
  return item?.league?.id ?? item?.id ?? item?.leagueId ?? "";
};

const getLeagueName = (item: any): string => {
  return item?.league?.name ?? item?.name ?? "";
};

const getLeagueStatus = (item: any): string => {
  return item?.league?.status ?? item?.status ?? "";
};

const statusLabels: Record<string, string> = {
  REGISTRATION: "در حال ثبت‌نام",
  ACTIVE: "در جریان",
  FINISHED: "تمام‌شده",
  INACTIVE: "غیرفعال",
};

const getStatusLabel = (status: string): string => {
  return statusLabels[status] ?? status;
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case "REGISTRATION":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    case "FINISHED":
      return "bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
    default:
      return "bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
  }
};

const loadMyLeagues = () => {
  return leagueStore.getMyLeagues({
    page: page.value,
    pageSize,
  });
};

watch(page, () => {
  loadMyLeagues();
});

watch(pageCount, (newPageCount) => {
  if (newPageCount > 0 && page.value > newPageCount) {
    page.value = newPageCount;
  }
});

onMounted(() => {
  loadMyLeagues();
});
</script>
