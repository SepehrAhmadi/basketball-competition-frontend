<template>
  <div class="mt-2">
    <div class="flex justify-between items-center gap-2 mb-2 px-3!">
      <ScrollAdaptive class="flex items-center gap-2">
        <icon-cup class="size-3.75" />
        <div class="text-[13px]">لیگ‌ها</div>
      </ScrollAdaptive>
      <Button
        size="sm"
        variant="outline"
        class="relative"
        aria-label="فیلتر لیگ‌ها"
        @click="filterOpen = true"
      >
        <icon-filter class="size-4" />
        فیلتر
        <span
          v-if="hasActiveFilter"
          class="absolute -top-1 -inset-s-1 size-2.5 rounded-full bg-primary"
        />
      </Button>
    </div>

    <ViewCompetitionLeagueSlider :filters="appliedFilters" @clear="clearFilters" />

    <ViewCompetitionFilterDrawer
      v-model:open="filterOpen"
      :model-value="appliedFilters"
      @apply="applyFilters"
    />
  </div>
</template>

<script setup lang="ts">
const filterOpen = ref(false);

const appliedFilters = ref<{
  search: string | null;
  status: "REGISTRATION" | "ACTIVE" | "FINISHED" | null;
  seasonId: number | string | null;
  ageCategoryId: number | string | null;
}>({
  search: null,
  status: null,
  seasonId: null,
  ageCategoryId: null,
});

const hasActiveFilter = computed(() => {
  const f = appliedFilters.value;
  if (typeof f.search === "string" && f.search.trim() !== "") return true;
  return Boolean(f.status || f.seasonId || f.ageCategoryId);
});

const applyFilters = (value: {
  search: string | null;
  status: "REGISTRATION" | "ACTIVE" | "FINISHED" | null;
  seasonId: number | string | null;
  ageCategoryId: number | string | null;
}) => {
  appliedFilters.value = { ...value };
  filterOpen.value = false;
};

const clearFilters = () => {
  appliedFilters.value = {
    search: null,
    status: null,
    seasonId: null,
    ageCategoryId: null,
  };
};
</script>
