<template>
    <div>
        <div class="flex justify-start items-center gap-2 mb-2">
            <div class="flex items-center gap-2">
                <icon-users
                    class="size-3.75 text-gray-500 dark:text-gray-300"
                />
                <div class="text-[13px] text-gray-500 dark:text-gray-300">
                    تیم‌های من در این لیگ
                </div>
            </div>
        </div>
        <template v-if="isMyTeamsLoading">
            <!-- Skeleton content: shown while my teams are loading -->
            <Card
                v-for="n in 3"
                :key="`my-team-skeleton-${n}`"
                class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
                aria-hidden="true"
            >
                <CardContent class="px-3">
                    <div class="flex justify-start items-center gap-1">
                        <div
                            class="w-full flex justify-start items-center gap-2"
                        >
                            <Skeleton
                                class="w-15 h-15 rounded-full mb-2 shrink-0"
                            />
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
            <Card
                v-if="myTeams.length <= 0"
                class="w-full shadow-xs! rounded-4xl"
                aria-hidden="true"
            >
                <CardContent
                    class="flex flex-col justify-center items-center gap-3 p-4"
                >
                    <icon-users
                        class="size-9 text-gray-500 dark:text-gray-300"
                    />
                    <div class="text-gray-500 dark:text-gray-300 text-[15px]">
                        در این لیگ تیمی ندارید
                    </div>
                </CardContent>
            </Card>
            <!-- Real content: shown after my teams are loaded -->
            <Card
                v-for="item in myTeams"
                :key="item.leagueTeamId"
                class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
            >
                <CardContent class="px-3">
                    <div class="flex justify-start items-center gap-1">
                        <div
                            class="w-full flex justify-start items-center gap-2"
                        >
                            <div
                                class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2 shrink-0"
                            >
                                <img
                                    v-if="item.team?.logoUrl"
                                    :src="item.team.logoUrl"
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
                                <div class="flex flex-col gap-2">
                                    <div class="flex items-center gap-2">
                                        <div class="text-[14px] font-semibold">
                                            {{ item.team?.name ?? "—" }}
                                        </div>
                                        <span
                                            v-for="role in item.myRoles ?? []"
                                            :key="role"
                                            class="w-fit text-[10px] font-semibold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400"
                                        >
                                            {{ getRoleLabel(role) }}
                                        </span>
                                    </div>

                                    <div
                                        class="text-[12px] text-gray-600 dark:text-gray-400 font-semibold line-clamp-1"
                                    >
                                        {{ item.organization?.name ?? "—" }}
                                    </div>
                                </div>
                            </div>
                            <NuxtLink
                                :to="`/profile/league/${leagueId}/team/${item.leagueTeamId}`"
                                class="flex items-center gap-1 text-[14px] font-semibold text-primary shrink-0"
                                aria-label="مشاهده تیم"
                            >
                                <div>مشاهده</div>
                                <icon-arrow-left class="text-[17px]" />
                            </NuxtLink>
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

import { useLeagueStore } from "~/store/league";
const leagueStore = useLeagueStore();
const { myTeams, loading: leagueLoading } = storeToRefs(leagueStore);
const isMyTeamsLoading = computed(() => leagueLoading.value);

const route = useRoute();
const leagueId = computed(() => String(route.params.slug));

const roleLabels: Record<string, string> = {
    MANAGER: "مدیر",
    HEAD_COACH: "سرمربی",
    COACH: "مربی",
    PLAYER: "بازیکن",
};

const getRoleLabel = (role: string): string => {
    return roleLabels[role] ?? role;
};

onMounted(() => {
    leagueStore.getMyLeagueTeams(leagueId.value);
});
</script>
