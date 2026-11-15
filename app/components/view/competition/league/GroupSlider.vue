<template>
  <div v-if="hasGroups || groupsLoading">
    <Card
      v-if="groupsLoading && groups.length === 0"
      class="w-full shadow-xs! rounded-4xl py-5 gap-4"
      aria-hidden="true"
    >
      <CardContent class="tw-py-2 flex flex-col gap-3">
        <div class="flex justify-between items-center gap-2">
          <Skeleton class="h-5 w-28 rounded-md" />
          <Skeleton class="h-4 w-14 rounded-full" />
        </div>
        <div class="flex flex-col gap-2">
          <Skeleton
            v-for="n in 4"
            :key="`group-skeleton-row-${n}`"
            class="w-full h-8 rounded-md"
          />
        </div>
      </CardContent>
    </Card>

    <Swiper
      v-else
      dir="rtl"
      :slides-per-view="slidesPerView"
      :space-between="12"
      :centered-slides="visibleGroups.length > 1"
      :grab-cursor="true"
      class="items-stretch"
    >
      <SwiperSlide
        v-for="group in visibleGroups"
        :key="group.id"
        class="h-auto!"
      >
        <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4 h-full">
          <CardContent class="tw-py-2 flex flex-col gap-3 h-full">
            <div class="flex justify-between items-center gap-2">
              <div class="text-[15px] font-semibold">
                {{ group.name }}
              </div>
              <span
                class="w-fit text-[10px] font-semibold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
              >
                {{ group.teams.length }} تیم
              </span>
            </div>

            <div class="w-full overflow-x-auto">
              <table class="w-full text-right">
                <caption class="sr-only">
                  جدول گروه {{ group.name }}
                </caption>
                <thead>
                  <tr
                    class="text-[12px] text-gray-500 dark:text-gray-400 font-normal"
                  >
                    <th class="py-2 font-normal">تیم</th>
                    <th class="py-2 font-normal text-center">بازی</th>
                    <th class="py-2 font-normal text-center">امتیاز</th>
                    <th class="py-2 font-normal text-center">برد</th>
                    <th class="py-2 font-normal text-center">باخت</th>
                    <th class="py-2 font-normal text-center">تفاضل</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in group.teams"
                    :key="row.leagueTeamId"
                    :class="
                      cn(
                        'text-[13px] border-t border-gray-100 dark:border-gray-800',
                        isQualified(group, Number(index)) &&
                          'border-r-2 border-r-primary',
                      )
                    "
                  >
                    <td class="py-2">
                      <div class="flex justify-start items-center gap-2">
                        <div
                          class="shrink-0 w-6 h-6 rounded-full border border-gray-300 bg-primary"
                        >
                          <img
                            v-if="row.team?.logoUrl"
                            :src="row.team.logoUrl"
                            :alt="row.team?.name ?? 'لوگوی تیم'"
                            class="object-cover w-full h-full rounded-full"
                          />
                          <img
                            v-else
                            :src="teamLogo"
                            alt="لوگوی تیم"
                            class="object-cover w-full h-full rounded-full p-0.5"
                          />
                        </div>
                        <span
                          class="truncate max-w-30"
                          :title="row.team?.name ?? '—'"
                        >
                          {{ row.team?.name ?? "—" }}
                        </span>
                      </div>
                    </td>
                    <td class="py-2 text-center text-gray-400">—</td>
                    <td class="py-2 text-center text-gray-400">—</td>
                    <td class="py-2 text-center text-gray-400">—</td>
                    <td class="py-2 text-center text-gray-400">—</td>
                    <td class="py-2 text-center text-gray-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-if="group.qualifiers !== null && group.qualifiers !== undefined"
              class="text-[11px] text-gray-500 dark:text-gray-400"
            >
              {{ group.qualifiers }} تیم اول صعود می‌کنند
            </div>
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
import { useCompetitionStore } from "~/store/competition";
import teamLogo from "~/assets/img/icon/team.png";
import { cn } from "~/lib/utils";

defineProps<{
  leagueId: number | string;
}>();

const competitionStore = useCompetitionStore();
const { groups, groupsLoading } = storeToRefs(competitionStore);

const visibleGroups = computed(() =>
  groups.value.filter((group: any) => (group.teams?.length ?? 0) > 0),
);

const hasGroups = computed(() => visibleGroups.value.length > 0);

const slidesPerView = computed(() =>
  visibleGroups.value.length > 1 ? 1.08 : 1,
);

const isQualified = (group: any, index: number): boolean => {
  const qualifiers = group.qualifiers;
  if (typeof qualifiers !== "number") return false;
  return index < qualifiers;
};
</script>
