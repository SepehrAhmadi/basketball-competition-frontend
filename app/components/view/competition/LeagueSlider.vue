<template>
  <div>
    <div v-if="competitionLoading" aria-hidden="true">
      <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4" aria-hidden="true">
        <CardContent class="tw-py-2">
          <div class="flex justify-start items-center gap-1">
            <div class="w-full flex justify-start items-start gap-3">
              <div
                class="w-full tw-flex-1 flex justify-start items-center gap-3"
              >
                <Skeleton class="shrink-0 w-20 h-20 rounded-full" />
                <div class="flex flex-col gap-1">
                  <Skeleton class="h-5.75 w-36 rounded-md" />
                  <Skeleton class="h-5 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3 mt-3">
            <Skeleton
              v-for="n in 3"
              :key="`competition-skeleton-box-${n}`"
              class="h-22.5 w-full rounded-lg"
            />
          </div>
          <div class="w-full mt-3">
            <Skeleton class="w-full h-8 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card
      v-else-if="competitionList.length === 0"
      class="w-full shadow-xs! rounded-4xl"
    >
      <CardContent class="flex flex-col justify-center items-center gap-3 p-4">
        <icon-cup class="size-9 text-gray-500 dark:text-gray-300" />
        <div class="text-gray-500 dark:text-gray-300 text-[15px]">
          لیگی یافت نشد
        </div>
        <Button
          v-if="hasActiveFilter"
          size="sm"
          variant="outline"
          aria-label="حذف فیلترها"
          @click="emit('clear')"
        >
          حذف فیلترها
        </Button>
      </CardContent>
    </Card>

    <Swiper
      v-else
      dir="rtl"
      :slides-per-view="competitionList.length > 1 ? 1.15 : 1"
      :space-between="12"
      :centered-slides="competitionList.length > 1"
      :grab-cursor="true"
      class="items-stretch"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
      @reach-end="onReachEnd"
    >
      <SwiperSlide
        v-for="league in competitionList"
        :key="league.id"
        class="h-auto!"
      >
        <ViewCompetitionLeagueCard :league="league" />
      </SwiperSlide>
      <SwiperSlide v-if="competitionLoadingMore" key="loading-more" class="h-auto!">
        <Card
          class="w-full shadow-xs! rounded-4xl py-5 gap-4 h-full"
          aria-hidden="true"
        >
          <CardContent class="tw-py-2">
            <div class="flex justify-start items-center gap-3">
              <Skeleton class="shrink-0 w-20 h-20 rounded-full" />
              <div class="flex flex-col gap-1">
                <Skeleton class="h-5.75 w-36 rounded-md" />
                <Skeleton class="h-5 w-24 rounded-md" />
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3 mt-3">
              <Skeleton
                v-for="n in 3"
                :key="`competition-more-skeleton-${n}`"
                class="h-22.5 w-full rounded-lg"
              />
            </div>
            <Skeleton class="w-full h-8 rounded-md mt-3" />
          </CardContent>
        </Card>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Skeleton } from "~/components/ui/skeleton";
import { useLeagueStore } from "~/store/league";

const props = defineProps<{
  filters: {
    search?: string | null;
    status?: "REGISTRATION" | "ACTIVE" | "FINISHED" | null;
    seasonId?: number | string | null;
    ageCategoryId?: number | string | null;
  };
}>();

const emit = defineEmits<{
  (e: "clear"): void;
}>();

const pageSize = 10;

const leagueStore = useLeagueStore();
const {
  competitionList,
  competitionListMeta,
  competitionLoading,
  competitionLoadingMore,
} = storeToRefs(leagueStore);

const hasMore = computed(
  () =>
    competitionListMeta.value &&
    competitionList.value.length < competitionListMeta.value.total,
);

const hasActiveFilter = computed(() => {
  const f = props.filters;
  if (!f) return false;
  return Boolean(
    (typeof f.search === "string" && f.search.trim() !== "") ||
      f.status ||
      f.seasonId ||
      f.ageCategoryId,
  );
});

let swiperInstance: any = null;

const onSwiper = (swiper: any) => {
  swiperInstance = swiper;
};

const load = async (reset: boolean) => {
  if (reset) {
    await leagueStore.getCompetitions(
      { page: 1, pageSize, ...props.filters },
      false,
    );
    swiperInstance?.slideTo(0, 0);
  } else {
    const nextPage = (competitionListMeta.value?.page ?? 1) + 1;
    await leagueStore.getCompetitions(
      { page: nextPage, pageSize, ...props.filters },
      true,
    );
    await nextTick();
    swiperInstance?.update();
  }
};

const maybeLoadMore = (activeIndex: number) => {
  if (
    activeIndex >= competitionList.value.length - 2 &&
    hasMore.value &&
    !competitionLoadingMore.value &&
    !competitionLoading.value
  ) {
    load(false);
  }
};

const onSlideChange = (swiper: any) => {
  maybeLoadMore(swiper?.activeIndex ?? 0);
};

const onReachEnd = () => {
  if (
    hasMore.value &&
    !competitionLoadingMore.value &&
    !competitionLoading.value
  ) {
    load(false);
  }
};

onMounted(() => {
  load(true);
});

watch(
  () => props.filters,
  () => {
    load(true);
  },
  { deep: true },
);
</script>
