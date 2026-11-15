<template>
  <div v-if="shouldRender" class="flex flex-col gap-3">
    <div v-if="isFirstLoading" class="flex flex-col gap-2" aria-hidden="true">
      <Card
        v-for="n in 3"
        :key="`game-skeleton-${n}`"
        class="w-full shadow-xs! rounded-4xl gap-3 py-4"
      >
        <CardContent class="px-4 flex flex-col gap-3">
          <Skeleton class="h-4 w-24 rounded-md" />
          <Skeleton class="h-12 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>

    <template v-else>
      <div class="flex justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <icon-cup class="size-3.75" />
          <div class="text-[13px]">بازی‌ها</div>
        </div>
        <Button
          size="sm"
          variant="outline"
          class="relative"
          aria-label="فیلتر بازی‌ها"
          @click="filterOpen = true"
        >
          <icon-filter class="size-4" />
          فیلتر
          <span
            v-if="filtersActive"
            class="absolute -top-1 -inset-s-1 size-2.5 rounded-full bg-primary"
          />
        </Button>
      </div>

      <Card v-if="games.length === 0" class="w-full shadow-xs! rounded-4xl">
        <CardContent class="flex flex-col justify-center items-center gap-3 p-4">
          <icon-cup class="size-9 text-gray-500 dark:text-gray-300" />
          <div class="text-gray-500 dark:text-gray-300 text-[15px]">
            بازی‌ای با این فیلتر یافت نشد.
          </div>
          <Button
            size="sm"
            variant="outline"
            aria-label="حذف فیلترها"
            @click="clearFilters"
          >
            حذف فیلترها
          </Button>
        </CardContent>
      </Card>

      <template v-else>
        <div class="flex flex-col">
          <Card
            v-for="game in games"
            :key="game.id"
            :class="
              cn(
                'w-full shadow-xs! rounded-4xl gap-3 py-4 mb-2',
                game.status === 'CANCELED' && 'opacity-60',
              )
            "
          >
            <CardContent class="px-4 flex flex-col gap-3">
              <div
                class="flex justify-between items-center gap-2 text-[12px] text-gray-600 dark:text-gray-300"
              >
                <div class="flex justify-start items-center gap-1">
                  <span v-if="game.scheduledDate">
                    {{ game.scheduledDate }}
                    <template v-if="game.scheduledTime">
                      · {{ game.scheduledTime }}
                    </template>
                  </span>
                  <span v-else>تاریخ نامشخص</span>
                </div>
                <div class="flex justify-end items-center gap-1">
                  <span
                    v-if="game.group"
                    class="w-fit shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
                  >
                    {{ game.group.name }}
                  </span>
                  <span
                    :class="
                      cn(
                        'w-fit shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5',
                        getStatusClass(game.status),
                      )
                    "
                  >
                    {{ getStatusLabel(game.status) }}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2">
                <div class="flex flex-col items-center gap-1 min-w-0 flex-1">
                  <div
                    class="shrink-0 w-10 h-10 rounded-full border border-gray-300 bg-primary"
                  >
                    <img
                      v-if="game.homeTeam?.team?.logoUrl"
                      :src="game.homeTeam.team.logoUrl"
                      :alt="game.homeTeam?.team?.name ?? 'لوگوی تیم'"
                      class="object-cover w-full h-full rounded-full"
                    />
                    <img
                      v-else
                      :src="teamLogo"
                      alt="لوگوی تیم"
                      class="object-cover w-full h-full rounded-full p-1"
                    />
                  </div>
                  <span
                    :class="
                      cn(
                        'text-[13px] font-semibold truncate max-w-full',
                        game.status === 'CANCELED' && 'line-through',
                        game.winnerLeagueTeamId ===
                          game.homeTeam?.leagueTeamId && 'font-bold',
                      )
                    "
                    :title="game.homeTeam?.team?.name ?? '—'"
                  >
                    {{ game.homeTeam?.team?.name ?? "—" }}
                  </span>
                  <span
                    v-if="game.homeTeam?.organization"
                    class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-full"
                  >
                    {{ game.homeTeam.organization.name }}
                  </span>
                </div>

                <div class="flex flex-col items-center gap-1 shrink-0">
                  <div v-if="hasScore(game)" class="flex items-center gap-1">
                    <span
                      :class="
                        cn(
                          'min-w-10 text-center rounded-lg px-2 py-1 text-[18px] font-bold',
                          getScoreClass(game, 'home'),
                        )
                      "
                    >
                      {{ game.homeScore }}
                    </span>
                    <span class="text-[12px] text-gray-400">-</span>
                    <span
                      :class="
                        cn(
                          'min-w-10 text-center rounded-lg px-2 py-1 text-[18px] font-bold',
                          getScoreClass(game, 'away'),
                        )
                      "
                    >
                      {{ game.awayScore }}
                    </span>
                  </div>
                  <span v-else class="text-[12px] font-semibold text-gray-500">
                    VS
                  </span>
                </div>

                <div class="flex flex-col items-center gap-1 min-w-0 flex-1">
                  <div
                    class="shrink-0 w-10 h-10 rounded-full border border-gray-300 bg-primary"
                  >
                    <img
                      v-if="game.awayTeam?.team?.logoUrl"
                      :src="game.awayTeam.team.logoUrl"
                      :alt="game.awayTeam?.team?.name ?? 'لوگوی تیم'"
                      class="object-cover w-full h-full rounded-full"
                    />
                    <img
                      v-else
                      :src="teamLogo"
                      alt="لوگوی تیم"
                      class="object-cover w-full h-full rounded-full p-1"
                    />
                  </div>
                  <span
                    :class="
                      cn(
                        'text-[13px] font-semibold truncate max-w-full',
                        game.status === 'CANCELED' && 'line-through',
                        game.winnerLeagueTeamId ===
                          game.awayTeam?.leagueTeamId && 'font-bold',
                      )
                    "
                    :title="game.awayTeam?.team?.name ?? '—'"
                  >
                    {{ game.awayTeam?.team?.name ?? "—" }}
                  </span>
                  <span
                    v-if="game.awayTeam?.organization"
                    class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-full"
                  >
                    {{ game.awayTeam.organization.name }}
                  </span>
                </div>
              </div>

              <div
                v-if="getGameNotes(game).length > 0"
                class="flex flex-col gap-1 text-[12px] text-gray-600 dark:text-gray-300"
              >
                <span v-for="note in getGameNotes(game)" :key="note">
                  {{ note }}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          v-if="hasMore"
          variant="outline"
          class="w-full"
          :disabled="gamesLoading"
          aria-label="نمایش بازی‌های بیشتر"
          @click="loadGames(nextPage, true)"
        >
          نمایش بیشتر
        </Button>
      </template>
    </template>

    <Drawer :open="filterOpen" @update:open="filterOpen = $event">
      <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle>فیلتر بازی‌ها</DrawerTitle>
          <DrawerDescription>بازی‌ها را فیلتر کنید</DrawerDescription>
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <div class="flex flex-col gap-1">
            <CustomLabel label="جستجو" />
            <div class="relative">
              <icon-search
                class="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4.5 text-gray-400"
              />
              <Input
                v-model="draft.search"
                placeholder="نام تیم"
                aria-label="جستجوی تیم"
                class="ps-9"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="وضعیت" />
            <Select v-model="draft.status" dir="rtl">
              <SelectTrigger class="w-full" aria-label="انتخاب وضعیت بازی">
                <SelectValue placeholder="همه" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectGroup>
                  <SelectItem value="all" class="px-3"> همه </SelectItem>
                  <SelectItem
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                    class="px-3"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div v-if="groups.length > 0" class="flex flex-col gap-1">
            <CustomLabel label="گروه" />
            <Select v-model="draft.groupId" dir="rtl">
              <SelectTrigger class="w-full" aria-label="انتخاب گروه">
                <SelectValue placeholder="همه" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectGroup>
                  <SelectItem value="all" class="px-3"> همه </SelectItem>
                  <SelectItem
                    v-for="group in groups"
                    :key="group.id"
                    :value="String(group.id)"
                    class="px-3"
                  >
                    {{ group.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="تیم" />
            <Select v-model="draft.leagueTeamId" dir="rtl">
              <SelectTrigger class="w-full" aria-label="انتخاب تیم">
                <SelectValue placeholder="همه" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectGroup>
                  <SelectItem value="all" class="px-3"> همه </SelectItem>
                  <SelectItem
                    v-for="option in teamOptionsForDraft"
                    :key="option.value"
                    :value="String(option.value)"
                    class="px-3"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="از تاریخ" />
            <component
              :is="DatePickerComponent"
              v-if="DatePickerComponent"
              v-model="draft.dateFrom"
              simple
              type="date"
              id="game-filter-dateFrom"
              format="jYYYY/jMM/jDD"
              display-format="jYYYY/jMM/jDD"
              class="default-scroll tw:text-gray-300! tw:text-[14px]! tw:text-center!"
              color="#1d202e"
              aria-label="از تاریخ"
            />
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="تا تاریخ" />
            <component
              :is="DatePickerComponent"
              v-if="DatePickerComponent"
              v-model="draft.dateTo"
              simple
              type="date"
              id="game-filter-dateTo"
              format="jYYYY/jMM/jDD"
              display-format="jYYYY/jMM/jDD"
              class="default-scroll tw:text-gray-300! tw:text-[14px]! tw:text-center!"
              color="#1d202e"
              aria-label="تا تاریخ"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button class="dark:text-gray-300" @click="applyFilters">
            اعمال فیلتر
          </Button>
          <Button variant="outline" @click="clearFilters"> حذف فیلترها </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "~/components/ui/skeleton";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCompetitionStore } from "~/store/competition";
import teamLogo from "~/assets/img/icon/team.png";
import { cn } from "~/lib/utils";

const props = defineProps<{
  leagueId: number | string;
}>();

const competitionStore = useCompetitionStore();
const { games, gamesMeta, gamesLoading, groups, teamOptions } =
  storeToRefs(competitionStore);

const pageSize = 20;

const statusOptions = [
  { value: "SCHEDULED", label: "برنامه‌ریزی‌شده" },
  { value: "LIVE", label: "در حال برگزاری" },
  { value: "FINISHED", label: "تمام‌شده" },
  { value: "CANCELED", label: "کنسل‌شده" },
];

const statusLabels: Record<string, string> = {
  SCHEDULED: "برنامه‌ریزی‌شده",
  LIVE: "در حال برگزاری",
  FINISHED: "تمام‌شده",
  CANCELED: "کنسل‌شده",
};

const getStatusLabel = (status: string): string => {
  return statusLabels[status] ?? status;
};

const getStatusClass = (status: string): string => {
  switch (status) {
    case "LIVE":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
    case "FINISHED":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    case "CANCELED":
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
    default:
      return "bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400";
  }
};

const toLatinDigits = (value: string): string =>
  value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));

const getTodayJalali = (): string => {
  const formatted = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return toLatinDigits(formatted).replace(/-/g, "/");
};

const defaultDateFrom = getTodayJalali();

const emptyFilters = {
  search: "",
  status: "all",
  groupId: "all",
  leagueTeamId: "all",
  dateFrom: defaultDateFrom,
  dateTo: "",
};

const appliedFilters = ref({ ...emptyFilters });
const draft = ref({ ...emptyFilters });
const filterOpen = ref(false);

const DatePickerComponent = shallowRef<any>(null);

onMounted(async () => {
  const mod: any = await import("vue3-persian-datetime-picker");
  DatePickerComponent.value = mod?.default ?? mod;
});

const filtersActive = computed(() => {
  const f = appliedFilters.value;
  return Boolean(
    f.search.trim() !== "" ||
      f.status !== "all" ||
      f.groupId !== "all" ||
      f.leagueTeamId !== "all" ||
      f.dateFrom !== defaultDateFrom ||
      f.dateTo !== "",
  );
});

const isFirstLoading = computed(
  () => gamesLoading.value && games.value.length === 0,
);

const shouldRender = computed(() => {
  if (isFirstLoading.value) return true;
  if (games.value.length > 0) return true;
  return filtersActive.value;
});

const hasMore = computed(
  () => gamesMeta.value !== null && games.value.length < gamesMeta.value.total,
);

const nextPage = computed(() => (gamesMeta.value?.page ?? 1) + 1);

const groupTeams = (groupId: string) => {
  const group = groups.value.find(
    (item: any) => String(item.id) === String(groupId),
  );
  if (!group) return [];
  return (group.teams ?? []).map((row: any) => ({
    value: row.leagueTeamId,
    label: row.team?.name ?? "—",
  }));
};

const teamOptionsForDraft = computed(() => {
  if (draft.value.groupId === "all") return teamOptions.value;
  return groupTeams(draft.value.groupId);
});

watch(
  () => draft.value.groupId,
  () => {
    const options = teamOptionsForDraft.value;
    const exists = options.some(
      (option: any) =>
        String(option.value) === String(draft.value.leagueTeamId),
    );
    if (!exists) draft.value.leagueTeamId = "all";
  },
);

const buildQuery = (page: number) => {
  const query: {
    page: number;
    pageSize: number;
    status?: "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELED";
    groupId?: number;
    leagueTeamId?: number;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  } = { page, pageSize };

  if (appliedFilters.value.status !== "all") {
    query.status = appliedFilters.value
      .status as "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELED";
  }
  if (appliedFilters.value.groupId !== "all") {
    query.groupId = Number(appliedFilters.value.groupId);
  }
  if (appliedFilters.value.leagueTeamId !== "all") {
    query.leagueTeamId = Number(appliedFilters.value.leagueTeamId);
  }

  const search = appliedFilters.value.search.trim();
  if (search !== "") query.search = search;
  if (appliedFilters.value.dateFrom !== "") {
    query.dateFrom = appliedFilters.value.dateFrom;
  }
  if (appliedFilters.value.dateTo !== "") {
    query.dateTo = appliedFilters.value.dateTo;
  }

  return query;
};

const loadGames = (page: number, append = false) => {
  return competitionStore.getPublicGames(
    props.leagueId,
    buildQuery(page),
    append,
  );
};

const applyFilters = () => {
  appliedFilters.value = { ...draft.value };
  filterOpen.value = false;
};

const clearFilters = () => {
  draft.value = { ...emptyFilters };
  appliedFilters.value = { ...emptyFilters };
  filterOpen.value = false;
};

watch(
  () => filterOpen.value,
  (isOpen) => {
    if (!isOpen) return;
    if (teamOptions.value.length === 0) {
      competitionStore.getPublicLeagueTeams(props.leagueId);
    }
    draft.value = { ...appliedFilters.value };
  },
);

let suppressFilterReload = false;

watch(
  appliedFilters,
  () => {
    if (suppressFilterReload) return;
    loadGames(1);
  },
  { deep: true },
);

watch(
  () => props.leagueId,
  () => {
    competitionStore.resetGames();
    suppressFilterReload = true;
    appliedFilters.value = { ...emptyFilters };
    draft.value = { ...emptyFilters };
    loadGames(1);
    nextTick(() => {
      suppressFilterReload = false;
    });
  },
);

onMounted(() => {
  loadGames(1);
});

const hasScore = (game: any): boolean =>
  game.status === "FINISHED" &&
  game.homeScore !== null &&
  game.homeScore !== undefined &&
  game.awayScore !== null &&
  game.awayScore !== undefined;

const getScoreClass = (game: any, side: "home" | "away"): string => {
  if (
    game.winnerLeagueTeamId === null ||
    game.winnerLeagueTeamId === undefined
  ) {
    return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
  }

  const team = side === "home" ? game.homeTeam : game.awayTeam;
  const isWinner =
    Number(game.winnerLeagueTeamId) === Number(team?.leagueTeamId);

  return isWinner
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
};

const teamNameByLeagueTeamId = (game: any, leagueTeamId: number): string => {
  if (Number(game.homeTeam?.leagueTeamId) === Number(leagueTeamId)) {
    return game.homeTeam?.team?.name ?? "—";
  }
  if (Number(game.awayTeam?.leagueTeamId) === Number(leagueTeamId)) {
    return game.awayTeam?.team?.name ?? "—";
  }
  return "—";
};

const getGameNotes = (game: any): string[] => {
  const notes: string[] = [];

  if (
    game.resultType === "FORFEIT" &&
    game.forfeitLeagueTeamId !== null &&
    game.forfeitLeagueTeamId !== undefined
  ) {
    const name = teamNameByLeagueTeamId(game, game.forfeitLeagueTeamId);
    notes.push(`فورفیت: ${name} حاضر نشد؛ نتیجه ۲۰ بر ۰ ثبت شده است.`);
  }

  if (game.status === "CANCELED" && game.rescheduledTo) {
    notes.push(
      `این بازی کنسل شده است؛ بازی جایگزین: شماره ${game.rescheduledTo.id}.`,
    );
  }

  if (game.rescheduledFrom) {
    notes.push(
      `این بازی جایگزین بازی کنسل‌شده‌ی شماره ${game.rescheduledFrom.id} است.`,
    );
  }

  return notes;
};
</script>