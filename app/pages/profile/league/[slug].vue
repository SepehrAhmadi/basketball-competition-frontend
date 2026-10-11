<template>
  <div>
    <ViewProfileLeagueDetail class="mt-2" />
    <ViewProfileLeagueMyTeamList class="mt-2" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import { useLeagueStore } from "~/store/league";
const leagueStore = useLeagueStore();

const route = useRoute();
const leagueId = computed(() => String(route.params.slug));

const loadLeague = () => {
  leagueStore.getLeagueById(leagueId.value);
  return leagueStore.getMyLeagueTeams(leagueId.value);
};

onMounted(() => {
  loadLeague();
});

defineExpose({ loadLeague });
</script>
