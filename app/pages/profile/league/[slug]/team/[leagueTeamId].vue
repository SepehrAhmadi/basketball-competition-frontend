<template>
  <div class="mt-2">
    <!-- Team Detail -->
    <!-- Skeleton content: shown while team detail is loading -->
    <Card
      v-if="isDetailLoading"
      class="w-full shadow-xs! rounded-4xl py-5 gap-4"
      aria-hidden="true"
    >
      <CardContent>
        <div class="w-full flex justify-start items-center gap-3">
          <Skeleton class="shrink-0 w-20 h-20 rounded-full" />
          <div class="flex flex-col gap-1">
            <Skeleton class="h-6 w-36 rounded-md" />
            <Skeleton class="h-5.25 w-28 rounded-md" />
            <Skeleton class="h-5.25 w-32 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
    <!-- Real content: shown after team detail is loaded -->
    <Card v-else class="card-decor w-full shadow-xs! rounded-4xl py-5 gap-4">
      <CardContent>
        <div class="w-full flex justify-start items-center gap-3">
          <div
            class="shrink-0 w-20 h-20 rounded-full border border-gray-300 bg-primary"
          >
            <img
              v-if="teamDetail?.team?.logoUrl"
              :src="teamDetail.team.logoUrl"
              alt="لوگوی تیم"
              class="object-cover w-full h-full rounded-full"
            />
            <img
              v-else
              :src="teamLogo"
              alt="لوگوی تیم"
              class="object-cover w-full h-full rounded-full p-2"
            />
          </div>
          <div class="w-full flex-1 flex justify-between items-start gap-2">
            <div class="flex flex-col gap-1">
              <div class="flex justify-start items-center gap-2">
                <div class="text-[16px]">
                  {{ teamDetail?.team?.name ?? "—" }}
                </div>
                <span
                  v-if="leagueDetail?.status"
                  :class="
                    cn(
                      'w-fit text-[10px] font-semibold rounded-full px-2 py-0.5',
                      getStatusClass(leagueDetail.status),
                    )
                  "
                >
                  {{ getStatusLabel(leagueDetail.status) }}
                </span>
              </div>

              <div
                v-if="teamDetail?.organization?.name"
                class="text-[13px] text-gray-600 dark:text-gray-300"
              >
              {{ teamDetail.organization.name }}
              </div>
            </div>
            <AlertDialog v-if="teamDetail?.can?.unregister">
              <AlertDialogTrigger as-child>
                <Button
                  class="text-[12px]"
                  size="sm"
                  variant="outline"
                  aria-label="حذف تیم از لیگ"
                >
                  <icon-trash class="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>حذف تیم از لیگ</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا از حذف «{{ teamDetail?.team?.name }}» از این لیگ مطمئن
                    هستید؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                  <AlertDialogAction
                    class="bg-destructive text-white hover:bg-destructive/90"
                    @click="confirmDelete"
                  >
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Rosters -->
    <div v-for="section in sections" :key="section.role" class="mt-4">
      <div class="flex items-center gap-2 mb-2">
        <icon-users class="size-3.75 text-gray-500 dark:text-gray-300" />
        <div class="text-[13px] text-gray-500 dark:text-gray-300">
          {{ section.title }}
        </div>
      </div>

      <template v-if="isRosterLoading">
        <Card
          v-for="n in 3"
          :key="`${section.role}-skeleton-${n}`"
          class="w-full shadow-xs! rounded-4xl gap-4 py-3 px-1 mb-2"
          aria-hidden="true"
        >
          <CardContent class="px-3">
            <div class="flex items-center gap-2">
              <Skeleton class="w-15 h-15 rounded-full shrink-0" />
              <div class="flex-1 flex flex-col gap-1">
                <Skeleton class="h-5.25 w-28 rounded-md" />
                <Skeleton class="h-4.5 w-24 rounded-md" />
              </div>
              <Skeleton class="size-8 rounded-full shrink-0" />
            </div>
          </CardContent>
        </Card>
      </template>
      <template v-else>
        <Card
          v-if="section.items.length === 0"
          class="w-full shadow-xs! rounded-4xl py-6"
        >
          <CardContent class="flex justify-center">
            <p class="text-gray-500 dark:text-gray-300 text-[14px]">
              {{ rosterError ? "دسترسی به این بخش ندارید" : section.empty }}
            </p>
          </CardContent>
        </Card>
        <Card
          v-for="person in section.items"
          :key="person.teamSeasonMemberId"
          :class="
            cn(
              'w-full shadow-xs! rounded-4xl gap-4 py-3 px-1 mb-2 transition',
              person.selected && 'border-gray-300',
            )
          "
        >
          <CardContent class="px-3">
            <div class="w-full flex items-center gap-2">
              <div class="relative shrink-0">
                <div
                  class="w-15 h-15 rounded-full border border-gray-300"
                  :class="person.avatarUrl ? '' : 'bg-primary'"
                >
                  <img
                    v-if="person.avatarUrl && person.avatarUrl !== null"
                    :src="person.avatarUrl"
                    class="w-full h-full object-cover rounded-full"
                    alt="آواتار"
                  />
                  <img
                    v-else
                    :src="defaultAvatar"
                    class="w-full h-full object-cover rounded-full p-1.5"
                    alt="آواتار"
                  />
                </div>
                <span
                  v-if="person.role === 'PLAYER' && person.jerseyNumber != null"
                  class="absolute -bottom-1 -right-1 flex items-center justify-center min-w-6 h-6 px-1 rounded-full bg-primary text-white text-[11px] font-bold border-2 border-white dark:border-gray-900 shadow-sm"
                  dir="ltr"
                >
                  {{ person.jerseyNumber }}
                </span>
              </div>
              <div class="flex-1 min-w-0 flex flex-col gap-1">
                <div class="text-[14px] font-semibold truncate">
                  {{ person.fullName ?? "—" }}
                </div>
                <div class="flex flex-wrap items-center gap-1">
                  <span
                    v-if="person.role === 'PLAYER'"
                    class="text-[12px] text-gray-600 dark:text-gray-400 font-semibold"
                  >
                    پیراهن: {{ person.jerseyNumber ?? "—" }}
                  </span>
                  <span
                    v-if="person.isHeadCoach"
                    class="w-fit text-[10px] font-semibold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
                  >
                    سرمربی
                  </span>
                  <span
                    v-if="isManageMode && !person.eligible && !person.selected"
                    class="w-fit text-[10px] font-semibold rounded-full px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                  >
                    {{ reasonLabel(person.ineligibleReason) }}
                  </span>
                </div>
              </div>
              <Button
                v-if="!isLocked(person)"
                size="icon-sm"
                class="rounded-full! shrink-0"
                :variant="person.selected ? 'default' : 'outline'"
                :disabled="busyId !== null"
                :aria-label="
                  person.selected ? 'حذف از ترکیب' : 'افزودن به ترکیب'
                "
                @click="toggle(person)"
              >
                <icon-spinner
                  v-if="busyId === person.teamSeasonMemberId"
                  class="size-4 animate-spin"
                />
                <icon-check v-else-if="person.selected" class="size-4" />
                <icon-plus v-else class="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import teamLogo from "../../../../../assets/img/icon/team.png";
import defaultAvatar from "../../../../../assets/img/avatar.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { cn } from "~/lib/utils";
import { useLeagueStore } from "~/store/league";
import { useHandlerStore } from "~/store/handler";

definePageMeta({
  middleware: ["auth"],
});

const handlerStore = useHandlerStore();
const leagueStore = useLeagueStore();
const { leagueTeamDetail: teamDetail, leagueDetail } = storeToRefs(leagueStore);

const route = useRoute();
const leagueId = computed(() => String(route.params.slug));
const leagueTeamId = computed(() => String(route.params.leagueTeamId));

const isDetailLoading = ref(true);
const isRosterLoading = ref(true);
const rosterError = ref(false);
const busyId = ref<number | null>(null);

const coaches = ref<any[]>([]);
const players = ref<any[]>([]);

const sections = computed(() => [
  {
    role: "COACH",
    title: "مربیان",
    empty: "مربی‌ای برای این تیم ثبت نشده است",
    items: coaches.value,
  },
  {
    role: "PLAYER",
    title: "بازیکنان",
    empty: "بازیکنی برای این تیم ثبت نشده است",
    items: players.value,
  },
]);

const statusLabels: Record<string, string> = {
  REGISTRATION: "در حال ثبت‌نام",
  ACTIVE: "در جریان",
  FINISHED: "تمام‌شده",
  INACTIVE: "غیرفعال",
};
const getStatusLabel = (status: string): string =>
  statusLabels[status] ?? status;
const getStatusClass = (status: string): string => {
  switch (status) {
    case "REGISTRATION":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    default:
      return "bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
  }
};

const reasonLabel = (reason: string | null): string =>
  ({
    BIRTH_DATE_MISSING: "تاریخ تولد ثبت نشده",
    TOO_OLD: "خارج از رده سنی",
    IN_OTHER_TEAM: "در تیم دیگری عضو است",
  })[reason ?? ""] ?? "غیرمجاز";

// Manage mode: league in REGISTRATION + backend allows roster management.
// Status source is teamDetail.league.status with leagueDetail.status fallback.
const effectiveLeagueStatus = computed(
  () => teamDetail.value?.league?.status ?? leagueDetail.value?.status ?? null,
);
const isManageMode = computed(
  () =>
    effectiveLeagueStatus.value === "REGISTRATION" &&
    teamDetail.value?.can?.manageRoster === true,
);

// The backend is the source of truth: team-level `can` plus per-row `canToggle`.
const isLocked = (person: any): boolean =>
  teamDetail.value?.can?.manageRoster !== true || person.canToggle !== true;

const loadDetail = async () => {
  await leagueStore.getLeagueTeamById(leagueId.value, leagueTeamId.value);
};

const loadCandidates = async () => {
  const [coachData, playerData] = await Promise.all([
    leagueStore.getMemberCandidates(leagueId.value, leagueTeamId.value, {
      role: "COACH",
      pageSize: 100,
    }),
    leagueStore.getMemberCandidates(leagueId.value, leagueTeamId.value, {
      role: "PLAYER",
      pageSize: 100,
    }),
  ]);
  rosterError.value = !coachData && !playerData;
  coaches.value = coachData?.items ?? [];
  players.value = playerData?.items ?? [];
};

// Read-only mode: public members list, no per-row toggle flags.
const loadMembers = async () => {
  const [coachData, playerData] = await Promise.all([
    leagueStore.getLeagueTeamMembers(leagueId.value, leagueTeamId.value, {
      role: "COACH",
      pageSize: 100,
    }),
    leagueStore.getLeagueTeamMembers(leagueId.value, leagueTeamId.value, {
      role: "PLAYER",
      pageSize: 100,
    }),
  ]);
  rosterError.value = !coachData && !playerData;
  coaches.value = coachData?.items ?? [];
  players.value = playerData?.items ?? [];
};

const loadRoster = async () => {
  if (isManageMode.value) return loadCandidates();
  return loadMembers();
};

const toggle = async (person: any) => {
  if (isLocked(person) || busyId.value !== null) return;
  busyId.value = person.teamSeasonMemberId;
  try {
    if (person.selected) {
      if (person.leagueTeamMemberId == null) return;
      await leagueStore.removeMember(
        leagueId.value,
        leagueTeamId.value,
        person.leagueTeamMemberId,
      );
    } else {
      await leagueStore.addMembers(leagueId.value, leagueTeamId.value, {
        teamSeasonMemberIds: [person.teamSeasonMemberId],
      });
    }
    // Refresh rows (new member ids, lock state) and the member count.
    await Promise.all([loadDetail(), loadRoster()]);
  } finally {
    busyId.value = null;
  }
};

const confirmDelete = async () => {
  await leagueStore.unregisterTeam(leagueId.value, leagueTeamId.value);
  if (handlerStore.checkAlert !== 2) {
    navigateTo(`/profile/league/${leagueId.value}`);
  }
};

onMounted(async () => {
  leagueStore.leagueTeamDetail = null;
  leagueStore.getLeagueById(leagueId.value);
  // Detail first: roster mode depends on league status + can.manageRoster.
  await loadDetail().finally(() => (isDetailLoading.value = false));
  await loadRoster().finally(() => (isRosterLoading.value = false));
});
</script>
