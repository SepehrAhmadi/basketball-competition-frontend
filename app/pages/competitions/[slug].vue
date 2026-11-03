<template>
  <div class="mt-2 px-3">
    <Card
      v-if="isLoading"
      class="w-full shadow-xs! rounded-4xl py-5 gap-4"
      aria-hidden="true"
    >
      <CardContent class="tw-py-2 flex flex-col gap-3">
        <div class="flex justify-between items-start gap-2">
          <div class="flex justify-start items-center gap-3">
            <Skeleton class="shrink-0 w-20 h-20 rounded-full" />
            <div class="flex flex-col gap-1">
              <Skeleton class="h-5.75 w-36 rounded-md" />
              <Skeleton class="h-5 w-24 rounded-md" />
            </div>
          </div>
          <Skeleton class="h-5 w-16 rounded-full" />
        </div>
        <div class="flex flex-col gap-2">
          <Skeleton
            v-for="n in 8"
            :key="n"
            class="w-full h-10 rounded-lg"
          />
        </div>
      </CardContent>
    </Card>

    <Card
      v-else-if="!leagueDetail"
      class="w-full shadow-xs! rounded-4xl"
    >
      <CardContent class="flex flex-col justify-center items-center gap-3 p-6">
        <icon-cup class="size-9 text-gray-500 dark:text-gray-300" />
        <div class="text-gray-500 dark:text-gray-300 text-[15px]">
          لیگ یافت نشد
        </div>
      </CardContent>
    </Card>

    <Card v-else class="w-full shadow-xs! rounded-4xl py-5 gap-4">
      <CardContent class="px-0 tw-py-2 flex flex-col gap-3">
        <div class="flex justify-between items-start gap-2 px-6">
          <div class="flex justify-start items-center gap-3">
            <div
              class="shrink-0 w-20 h-20 rounded-full bg-primary flex justify-center items-center"
            >
              <icon-cup class="size-9 text-white" />
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-[15px] font-semibold">
                {{ leagueDetail?.name ?? "—" }}
              </div>
              <div
                class="flex justify-start items-center gap-1 text-[13px] text-gray-600 dark:text-gray-300"
              >
                <span>{{ leagueDetail?.season?.name ?? "—" }}</span>
                <span>|</span>
                <span>{{ leagueDetail?.ageCategory?.name ?? "—" }}</span>
              </div>
            </div>
          </div>
          <span
            :class="
              cn(
                'w-fit shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5',
                getStatusClass(leagueDetail?.status ?? ''),
              )
            "
          >
            {{ getStatusLabel(leagueDetail?.status ?? "") }}
          </span>
        </div>
        
        <div class="flex flex-col divide-y divide-gray-200 dark:divide-gray-500">
          <div
            v-for="item in infoItems"
            :key="item.label"
            class="flex justify-start items-center gap-1.5 py-2.75 text-[13px] px-6"
          >
            <component
              :is="item.icon"
              class="size-4.5 shrink-0 text-gray-500 dark:text-gray-300"
            />
            <span class="text-gray-600 dark:text-gray-300">
              {{ item.label }} :
            </span>
            <span class="font-semibold">
              {{ item.value }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import { useLeagueStore } from "~/store/league";
import IconDateNumber from "~/components/icon/date-number.vue";
import IconDatePlus from "~/components/icon/date-plus.vue";
import IconDate from "~/components/icon/date.vue";
import IconDocument from "~/components/icon/document.vue";
import IconCheck from "~/components/icon/check.vue";
import IconClose from "~/components/icon/close.vue";
import IconCup from "~/components/icon/cup.vue";

const route = useRoute();
const leagueId = computed(() => String(route.params.slug));

const leagueStore = useLeagueStore();
const { leagueDetail, loading: leagueLoading } = storeToRefs(leagueStore);
const isLoading = computed(
  () => leagueLoading.value && !leagueDetail.value,
);

const statusLabels: Record<string, string> = {
  REGISTRATION: "در حال ثبت‌نام",
  ACTIVE: "در جریان",
  FINISHED: "تمام‌شده",
  INACTIVE: "غیرفعال",
};

const formatLabels: Record<string, string> = {
  GROUPS_KNOCKOUT: "گروهی + حذفی",
  SINGLE_GROUP_KNOCKOUT: "تک‌گروه + حذفی",
  KNOCKOUT_ONLY: "فقط حذفی",
};

const groupRoundTypeLabels: Record<string, string> = {
  ONE_ROUND: "یک‌دوره (همه با همه)",
  DOUBLE_ROUND: "رفت و برگشت",
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

const getFormatLabel = (format: string | null | undefined): string => {
  if (!format) return "—";
  return formatLabels[format] ?? format;
};

const getGroupRoundTypeLabel = (
  groupRoundType: string | null | undefined,
): string => {
  if (!groupRoundType) return "—";
  return groupRoundTypeLabels[groupRoundType] ?? groupRoundType;
};

const infoItems = computed(() => [
  {
    label: "تاریخ شروع",
    value: leagueDetail.value?.startDate ?? "—",
    icon: IconDateNumber,
  },
  {
    label: "تاریخ پایان",
    value: leagueDetail.value?.endDate ?? "—",
    icon: IconDateNumber,
  },
  {
    label: "مهلت ثبت‌نام",
    value: leagueDetail.value?.rosterDeadline ?? "—",
    icon: IconDatePlus,
  },
  {
    label: "حداقل تاریخ تولد",
    value: leagueDetail.value?.minBirthDate ?? "—",
    icon: IconDate,
  },
  {
    label: "ساختار",
    value: getFormatLabel(leagueDetail.value?.format),
    icon: IconDocument,
  },
  {
    label: "امتیاز برد",
    value: leagueDetail.value?.winPoints ?? "—",
    icon: IconCheck,
  },
  {
    label: "امتیاز باخت",
    value: leagueDetail.value?.lossPoints ?? "—",
    icon: IconClose,
  },
  {
    label: "نوع دور گروهی",
    value: getGroupRoundTypeLabel(leagueDetail.value?.groupRoundType),
    icon: IconCup,
  },
]);

onMounted(() => {
  leagueStore.getLeagueById(leagueId.value);
});

watch(leagueId, (next) => {
  leagueDetail.value = null;
  leagueStore.getLeagueById(next);
});
</script>

