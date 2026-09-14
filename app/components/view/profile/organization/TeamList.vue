<template>
    <div>
        <div class="flex justify-start items-center gap-2 mb-2">
            <div class="flex items-center gap-2">
                <icon-users
                    class="size-3.75 text-gray-500 dark:text-gray-300"
                />
                <div class="text-[13px] text-gray-500 dark:text-gray-300">
                    تیم ها
                </div>
            </div>
        </div>
        <template v-if="isTeamListLoading">
            <!-- Skeleton content: shown while team list is loading -->
            <Card
                v-for="n in 10"
                :key="`team-skeleton-${n}`"
                class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
                aria-hidden="true"
            >
                <CardContent class="px-3">
                    <div class="flex justify-start items-center gap-1">
                        <div class="w-full flex justify-start items-center gap-2">
                            <Skeleton class="w-15 h-15 rounded-full mb-2 shrink-0" />
                            <div
                                class="shrink w-full flex-1 flex justify-between items-center gap-4"
                            >
                                <div class="flex flex-col gap-1">
                                    <Skeleton class="h-5.25 w-28 rounded-md" />
                                    <Skeleton class="h-4.5 w-40 rounded-md" />
                                </div>
                            </div>
                            <Skeleton class="h-5.25 w-18 rounded-md shrink-0" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </template>
        <template v-else>
        <!-- Real content: shown after team list is loaded -->
        <Card
            v-for="team in teams"
            :key="team.id"
            class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
        >
            <CardContent class="px-3">
                <div class="flex justify-start items-center gap-1">
                    <div class="w-full flex justify-start items-center gap-2">
                        <div
                            class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2"
                        >
                            <img
                                v-if="team.logoUrl"
                                :src="team.logoUrl"
                                class="w-full h-full object-cover rounded-full"
                                alt="لوگوی تیم"
                            />
                            <img
                                v-else
                                :src="teamLogo"
                                class="w-full h-full object-cover rounded-full p-1.5"
                                alt="لوگوی تیم"
                            />
                        </div>
                        <div
                            class="shrink w-full flex-1 flex justify-between items-center gap-4"
                        >
                            <div>
                                <div class="text-[14px] font-semibold">
                                    {{ team.name }}
                                </div>
                                <div
                                    class="text-[12px] text-gray-600 dark:text-gray-400 font-semibold line-clamp-1"
                                >
                                    {{ team.description }}
                                </div>
                            </div>
                        </div>
                        <nuxt-link :to="`/profile/organization/team/${team.id}`">
                            <div class="flex items-center gap-1 text-[14px] font-semibold text-primary">
                                <div>مشاهده</div>
                                <icon-arrow-left class="text-[17px]" />
                            </div>
                        </nuxt-link>
                    </div>
                </div>
            </CardContent>
        </Card>
        </template>
    </div>
</template>

<script setup lang="ts">
import teamLogo from "../../../../assets/img/icon/team.png";
import { Skeleton } from "~/components/ui/skeleton";
import { useTeamStore } from "~/store/team";

defineProps<{
    teams: any[];
}>();

const teamStore = useTeamStore();
const { loading: teamLoading } = storeToRefs(teamStore);
const isTeamListLoading = computed(() => teamLoading.value);
</script>
