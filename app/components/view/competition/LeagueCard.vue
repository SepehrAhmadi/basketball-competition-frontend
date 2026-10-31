<template>
  <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4 h-full">
    <CardContent class="tw-py-2 flex flex-col gap-3 h-full">
      <div class="flex justify-between items-start gap-2">
        <div class="flex justify-start items-center gap-3">
          <div
            class="shrink-0 w-20 h-20 rounded-full bg-primary flex justify-center items-center"
          >
            <icon-cup class="size-9 text-white" />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-[15px] font-semibold">
              {{ league?.name ?? "—" }}
            </div>
            <div
              class="flex justify-start items-center gap-1 text-[13px] text-gray-600 dark:text-gray-300"
            >
              <span>{{ league?.season?.name ?? "—" }}</span>
              <span>|</span>
              <span>{{ league?.ageCategory?.name ?? "—" }}</span>
            </div>
          </div>
        </div>
        <span
          :class="
            cn(
              'w-fit shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5',
              getStatusClass(league?.status ?? ''),
            )
          "
        >
          {{ getStatusLabel(league?.status ?? "") }}
        </span>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div
          class="flex flex-col justify-center items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-500"
        >
          <icon-date-number class="size-7 text-gray-400 dark:text-gray-300" />
          <div
            class="text-gray-600 dark:text-gray-300 flex flex-col justify-center items-center gap-0.5"
          >
            <div class="text-[12px]">تاریخ شروع</div>
            <div class="text-[15px]">
              {{ league?.startDate ?? "—" }}
            </div>
          </div>
        </div>
        <div
          class="flex flex-col justify-center items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-500"
        >
          <icon-date-number class="size-7 text-gray-400 dark:text-gray-300" />
          <div
            class="text-gray-600 dark:text-gray-300 flex flex-col justify-center items-center gap-0.5"
          >
            <div class="text-[12px]">تاریخ پایان</div>
            <div class="text-[15px]">
              {{ league?.endDate ?? "—" }}
            </div>
          </div>
        </div>
        <div
          class="flex flex-col justify-center items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-500"
        >
          <icon-date-plus class="size-7 text-gray-400 dark:text-gray-300" />
          <div
            class="text-gray-600 dark:text-gray-300 flex flex-col justify-center items-center gap-0.5"
          >
            <div class="text-[12px]">مهلت ثبت‌نام</div>
            <div class="text-[15px]">
              {{ league?.rosterDeadline ?? "—" }}
            </div>
          </div>
        </div>
      </div>

      <Button as-child size="sm" class="w-full mt-auto" aria-label="مشاهده لیگ">
        <NuxtLink :to="`/competitions/${league?.id}`"> مشاهده </NuxtLink>
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { cn } from "~/lib/utils";

defineProps<{
  league: any;
}>();

const statusLabels: Record<string, string> = {
  REGISTRATION: "در حال ثبت‌نام",
  ACTIVE: "در جریان",
  FINISHED: "تمام‌شده",
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
</script>
