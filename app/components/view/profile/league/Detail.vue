<template>
  <div>
    <!-- Skeleton content: shown while league detail is loading -->
    <Card
      v-if="isLeagueDetailLoading"
      class="w-full shadow-xs! rounded-4xl py-5 gap-4"
      aria-hidden="true"
    >
      <CardContent class="tw-py-2">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-start gap-3">
            <div class="w-full tw-flex-1 flex justify-start items-center gap-3">
              <Skeleton class="shrink-0 w-20 h-20 rounded-full" />
              <div class="flex flex-col gap-1">
                <Skeleton class="h-5.75 w-36 rounded-md" />
                <Skeleton class="h-5 w-24 rounded-md" />
                <Skeleton class="h-5 w-32 rounded-md" />
                <Skeleton class="h-5 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </div>
        <Skeleton class="w-full h-5 rounded-md mt-2" />
        <div class="w-full mt-4">
          <Skeleton class="w-full h-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
    <!-- Real content: shown after league detail is loaded -->
    <Card v-else class="w-full shadow-xs! rounded-4xl py-5 gap-4">
      <CardContent class="tw-py-2">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-start gap-3">
            <div class="w-full tw-flex-1 flex justify-start items-center gap-3">
              <div
                class="shrink-0 w-20 h-20 rounded-full border border-gray-300 bg-primary flex justify-center items-center"
              >
                <icon-cup class="size-9 text-white" />
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex justify-start items-center gap-2">
                  <div class="text-[15px]">
                    {{ leagueDetail?.name ?? "—" }}
                  </div>
                  <span
                    :class="
                      cn(
                        'w-fit text-[10px] font-semibold rounded-full px-2 py-0.5',
                        getStatusClass(leagueDetail?.status ?? ''),
                      )
                    "
                  >
                    {{ getStatusLabel(leagueDetail?.status ?? "") }}
                  </span>
                </div>
                <div class="flex justify-start items-center gap-2 mt-1">
                  <div
                    v-if="leagueDetail?.season?.name"
                    class="text-[13px] text-gray-600 dark:text-gray-300"
                  >
                    {{ leagueDetail.season.name }}
                  </div>
                  <div v-if="leagueDetail?.season?.name">|</div>
                  <div
                    v-if="leagueDetail?.ageCategory?.name"
                    class="text-[13px] text-gray-600 dark:text-gray-300"
                  >
                    {{ leagueDetail.ageCategory.name }}
                  </div>
                  <div
                    v-if="
                      leagueDetail?.teamsCount !== undefined &&
                      leagueDetail?.teamsCount !== null
                    "
                  >
                    |
                  </div>
                  <div
                    v-if="
                      leagueDetail?.teamsCount !== undefined &&
                      leagueDetail?.teamsCount !== null
                    "
                    class="text-[13px] text-gray-600 dark:text-gray-300"
                  >
                    <span>{{ leagueDetail.teamsCount }} تیم</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-3 mt-3">
          <div
            v-if="leagueDetail?.startDate"
            class="flex flex-col justify-center items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-500"
          >
            <icon-date-number class="size-7 text-gray-400 dark:text-gray-300" />
            <div
              class="text-gray-600 dark:text-gray-300 flex flex-col justify-center items-center gap-0.5"
            >
              <div class="text-[12px]">تاریخ شروع</div>
              <div class="text-[15px]">
                {{ leagueDetail.startDate }}
              </div>
            </div>
          </div>
          <div
            v-if="leagueDetail?.endDate"
            class="flex flex-col justify-center items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-500"
          >
            <icon-date-number class="size-7 text-gray-400 dark:text-gray-300" />
            <div
              class="text-gray-600 dark:text-gray-300 flex flex-col justify-center items-center gap-0.5"
            >
              <div class="text-[12px]">تاریخ پایان</div>
              <div class="text-[15px]">
                {{ leagueDetail.endDate }}
              </div>
            </div>
          </div>
          <div
            v-if="leagueDetail?.rosterDeadline"
            class="flex flex-col justify-center items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-500"
          >
            <icon-date-plus class="size-7 text-gray-400 dark:text-gray-300" />
            <div
              class="text-gray-600 dark:text-gray-300 flex flex-col justify-center items-center gap-0.5"
            >
              <div class="text-[12px]">مهلت ثبت‌نام</div>
              <div class="text-[15px]">
                {{ leagueDetail.rosterDeadline }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="leagueDetail?.description"
          class="w-full text-[13px] text-gray-600 dark:text-gray-300 text-justify ms-0.75 mt-3"
        >
          {{ leagueDetail.description }}
        </div>
        <div class="w-full mt-3">
          <Button
            v-if="leagueDetail?.can?.registerTeam"
            class="w-full px-4 text-[13px]"
            size="sm"
            aria-label="ثبت تیم در لیگ"
            @click="openRegisterDrawer"
          >
            <icon-plus class="size-5" />
            ثبت تیم در لیگ
          </Button>
        </div>
      </CardContent>
    </Card>

    <Drawer v-model:open="registerDrawerOpen">
      <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle>ثبت تیم در لیگ</DrawerTitle>
          <DrawerDescription
            >تیم مورد نظر را جستجو و انتخاب کنید</DrawerDescription
          >
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <div class="flex flex-col gap-1">
            <CustomLabel :is-required="true" label="تیم" />
            <Combobox
              v-model="selectedTeamValue"
              dir="rtl"
              @update:model-value="handleTeamSelect"
            >
              <ComboboxAnchor class="w-full border rounded-md" dir="rtl">
                <ComboboxInput
                  v-model="searchQuery"
                  dir="rtl"
                  placeholder="نام تیم را تایپ کنید..."
                  class="custom-input-focus text-[13px]"
                  :display-value="() => selectedTeam?.team?.name ?? ''"
                />
              </ComboboxAnchor>
              <ComboboxList dir="rtl">
                <ComboboxEmpty dir="rtl">
                  <div
                    class="text-gray-600 dark:text-gray-300 text-[13px] translate-y-1"
                  >
                    تیمی یافت نشد.
                  </div>
                </ComboboxEmpty>
                <ComboboxGroup dir="rtl">
                  <ComboboxItem
                    v-for="item in eligibleTeamOptions"
                    :key="item.team.id"
                    :value="item.team.id"
                    :disabled="item.alreadyRegistered"
                    dir="rtl"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-10 h-10 rounded-full border border-gray-300 bg-primary shrink-0"
                      >
                        <img
                          v-if="item.team?.logoUrl"
                          :src="item.team.logoUrl"
                          class="w-full h-full object-cover rounded-full"
                          alt=""
                        />
                        <img
                          v-else
                          :src="teamLogo"
                          class="w-full h-full object-cover rounded-full p-0.5"
                          alt=""
                        />
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium text-[13px]">{{
                          item.team?.name
                        }}</span>
                        <span
                          class="text-[12px] text-gray-600 dark:text-gray-400"
                        >
                          {{ item.organization?.name }}
                          <template
                            v-if="
                              item.activeRosterCount !== undefined &&
                              item.activeRosterCount !== null
                            "
                          >
                            —
                            {{ item.activeRosterCount }}
                            نفر
                          </template>
                          <template v-if="item.alreadyRegistered">
                            — ثبت شده</template
                          >
                        </span>
                      </div>
                    </div>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
          </div>
        </div>

        <DrawerFooter>
          <Button :disabled="!selectedTeam" @click="handleRegisterSubmit">
            ثبت
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import teamLogo from "../../../../assets/img/icon/team.png";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from "~/components/ui/combobox";

import { useLeagueStore } from "~/store/league";
const leagueStore = useLeagueStore();
const {
  leagueDetail,
  eligibleTeams,
  loading: leagueLoading,
} = storeToRefs(leagueStore);
const isLeagueDetailLoading = computed(
  () => leagueLoading.value && !leagueDetail.value,
);

import { useHandlerStore } from "~/store/handler";
const handlerStore = useHandlerStore();

const route = useRoute();
const leagueId = computed(() => String(route.params.slug));

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

// ─── Register drawer state ────────────────────────────────────────────

const registerDrawerOpen = ref(false);
const searchQuery = ref("");
const selectedTeam = ref<any>(null);
const selectedTeamValue = ref<string | null>(null);
const eligibleTeamOptions = computed(() => eligibleTeams.value ?? []);

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (newVal) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    leagueStore.getEligibleTeams(leagueId.value, {
      page: 1,
      pageSize: 100,
      search: newVal?.trim() ? newVal.trim() : undefined,
    });
  }, 300);
});

const handleTeamSelect = (value: any) => {
  if (value == null) {
    selectedTeam.value = null;
    selectedTeamValue.value = null;
    return;
  }

  const found = eligibleTeamOptions.value.find(
    (item: any) => String(item.team?.id) === String(value),
  );
  if (found && !found.alreadyRegistered) {
    selectedTeam.value = found;
    selectedTeamValue.value = String(found.team.id);
  }
};

const openRegisterDrawer = () => {
  resetRegisterForm();
  registerDrawerOpen.value = true;
  leagueStore.getEligibleTeams(leagueId.value, { page: 1, pageSize: 100 });
};

const resetRegisterForm = () => {
  searchQuery.value = "";
  selectedTeam.value = null;
  selectedTeamValue.value = null;
};

const handleRegisterSubmit = () => {
  if (!selectedTeam.value) {
    handlerStore.setError("لطفا یک تیم انتخاب کنید");
    return;
  }

  leagueStore
    .registerTeam(leagueId.value, { teamId: selectedTeam.value.team.id })
    .then(() => {
      registerDrawerOpen.value = false;
      resetRegisterForm();
      leagueStore.getMyLeagueTeams(leagueId.value);
      leagueStore.getLeagueById(leagueId.value);
    });
};

onMounted(() => {
  leagueStore.getLeagueById(leagueId.value);
});
</script>
