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

    <div v-else>
      <div class="flex items-center gap-2">
        <icon-document class="size-3.75 text-gray-500 dark:text-gray-300" />
        <div class="text-[13px] text-gray-500 dark:text-gray-300">
         گروه‌ها
        </div>
      </div>
      <Swiper
        dir="rtl"
        :slides-per-view="slidesPerView"
        :space-between="12"
        :centered-slides="visibleGroups.length > 1"
        :grab-cursor="true"
        :class="visibleGroups.length > 1 ? 'items-stretch mt-2!' : 'items-stretch mt-2! px-3!'"
      >
        <SwiperSlide
          v-for="group in visibleGroups"
          :key="group.id"
          class="h-auto!"
        >
          <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4 h-full">
            <CardContent class="tw-py-2 flex flex-col gap-3 h-full">
              <div class="flex justify-between items-center gap-2">
                <div class="text-[13px] font-semibold">
                  {{ group.name }}
                </div>
                <span
                  class="w-fit text-[9px] font-semibold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
                >
                  {{ group.teams.length }} تیم
                </span>
              </div>

              <div class="w-full overflow-x-auto">
                <table class="w-full table-fixed text-right">
                  <caption class="sr-only">
                    جدول گروه
                    {{
                      group.name
                    }}
                  </caption>
                  <thead>
                    <tr
                      class="text-[12px] text-gray-500 dark:text-gray-400 font-normal"
                    >
                      <th class="py-2 font-normal">تیم</th>
                      <th class="py-2 font-normal text-center w-10">بازی</th>
                      <th class="py-2 font-normal text-center w-10">امتیاز</th>
                      <th class="py-2 font-normal text-center w-10">برد</th>
                      <th class="py-2 font-normal text-center w-10">باخت</th>
                      <th class="py-2 font-normal text-center w-10">تفاضل</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row, index) in groupRows(group)"
                      :key="row.leagueTeamId"
                      class="text-[13px] border-t border-gray-100 dark:border-gray-800"
                    >
                      <TooltipProvider :delay-duration="0">
                        <td class="py-2 ps-1">
                          <div class="flex justify-start items-center gap-2">
                            <span
                              v-if="isQualified(group, row, Number(index))"
                              class="w-0.5 self-stretch rounded-full bg-primary my-0.5 shrink-0"
                              aria-hidden="true"
                            />
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
                            <Tooltip
                              :open="openTooltipId === row.leagueTeamId"
                              @update:open="
                                (value) => {
                                  if (!value) openTooltipId = null;
                                }
                              "
                            >
                              <TooltipTrigger as-child>
                                <button
                                  type="button"
                                  class="min-w-0 truncate max-w-30 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm"
                                  :aria-label="`نمایش اطلاعات ${row.team?.name ?? 'تیم'}`"
                                  @click="toggleTooltip(row.leagueTeamId)"
                                >
                                  {{ row.team?.name ?? "—" }}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent
                                class="flex items-center gap-2 p-2"
                              >
                                <span
                                  class="text-[13px] font-semibold whitespace-normal"
                                >
                                  {{ row.team?.name ?? "—" }}
                                </span>
                                <div
                                  class="shrink-0 w-8 h-8 rounded-full border border-gray-300 bg-primary"
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
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </TooltipProvider>
                      <td class="py-2 text-center w-11">{{ row.played ?? "—" }}</td>
                      <td class="py-2 text-center w-11">{{ row.points ?? "—" }}</td>
                      <td class="py-2 text-center w-11">{{ row.won ?? "—" }}</td>
                      <td class="py-2 text-center w-11">{{ row.lost ?? "—" }}</td>
                      <td class="py-2 text-center w-11">
                        <span dir="ltr" class="inline-block">
                          {{ row.difference == null ? "—" : formatDiff(row.difference) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                v-if="
                  group.qualifiers !== null && group.qualifiers !== undefined
                "
                class="text-[11px] text-gray-500 dark:text-gray-400"
              >
                {{ group.qualifiers }} تیم اول صعود می‌کنند
              </div>
            </CardContent>
          </Card>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useCompetitionStore } from "~/store/competition";
import teamLogo from "~/assets/img/icon/team.png";

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

const groupRows = (group: any) => {
  const standings = new Map<number, any>(
    (group.standings ?? []).map((row: any) => [row.leagueTeamId, row]),
  );
  return [...group.teams]
    .map((team: any) => ({
      ...team,
      ...(standings.get(team.leagueTeamId) ?? {}),
    }))
    .sort((a: any, b: any) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
};

const isQualified = (group: any, row: any, index: number): boolean => {
  if (typeof row.qualified === "boolean") return row.qualified;
  const qualifiers = group.qualifiers;
  if (typeof qualifiers !== "number") return false;
  return index < qualifiers;
};

const formatDiff = (value: number) =>
  value > 0 ? `+ ${value}` : value < 0 ? `− ${Math.abs(value)}` : "0";

const openTooltipId = ref<number | null>(null);

const toggleTooltip = (leagueTeamId: number) => {
  openTooltipId.value =
    openTooltipId.value === leagueTeamId ? null : leagueTeamId;
};

const closeTooltipOnOutsideClick = (event: MouseEvent) => {
  if (openTooltipId.value === null) return;
  const target = event.target as HTMLElement | null;
  if (
    target?.closest(
      "[data-slot='tooltip-trigger'], [data-slot='tooltip-content']",
    )
  ) {
    return;
  }
  openTooltipId.value = null;
};

onMounted(() => {
  document.addEventListener("click", closeTooltipOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeTooltipOnOutsideClick);
});
</script>
