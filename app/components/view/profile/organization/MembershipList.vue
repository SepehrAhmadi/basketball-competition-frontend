<template>
  <div v-if="isLoading || memberships.length > 0" class="mt-2">
    <div class="flex justify-start items-center gap-2 mb-2">
      <div class="flex items-center gap-2">
        <icon-users class="size-3.75 text-gray-500 dark:text-gray-300" />
        <div class="text-[13px] text-gray-500 dark:text-gray-300">
          عضویت‌های من در این سازمان
        </div>
      </div>
    </div>

    <Card class="w-full shadow-xs! rounded-4xl py-3 gap-0">
      <CardContent class="px-3 py-0">
        <template v-if="isLoading">
          <!-- Skeleton rows inside single card -->
          <div
            v-for="n in 3"
            :key="`membership-skeleton-${n}`"
            class="flex items-center gap-2 py-1.75"
            :class="n !== 3 ? 'border-b border-gray-100 dark:border-gray-800' : ''"
            aria-hidden="true"
          >
            <Skeleton class="size-1.5 rounded-full shrink-0" />
            <Skeleton class="h-4 flex-1 rounded-md" />
          </div>
        </template>

        <template v-else>
          <!-- Minimal list inside single card -->
          <!-- ex: فصل ۱۴۰۵ - تیم اول - بازیکن / سرمربی -->
          <div
            v-for="(membership, index) in memberships"
            :key="`${membership.teamId}-${membership.seasonId}-${membership.role}-${index}`"
            class="flex items-center gap-2 py-1.75 text-[13px]"
            :class="
              index !== memberships.length - 1
                ? 'border-b border-gray-100 dark:border-gray-800'
                : ''
            "
          >
            <span class="size-1.5 rounded-full bg-primary shrink-0" />
            <span class="truncate text-gray-700 dark:text-gray-200">
              {{ membership.seasonName }} -
              {{ membership.teamName?.trim() || "—" }} -
              {{ getRoleLabel(membership) }}
            </span>
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "~/components/ui/skeleton";
import { useOrganizationStore } from "~/store/organization";

interface Membership {
  seasonId: number | string;
  seasonName: string;
  teamId: number | string;
  teamName: string;
  role: string;
  isHeadCoach: boolean;
}

const organizationStore = useOrganizationStore();
const { organizationDetail, loading } = storeToRefs(organizationStore);

const isLoading = computed(
  () => loading.value && !organizationDetail.value,
);

const memberships = computed<Membership[]>(
  () => organizationDetail.value?.memberships ?? [],
);

const getRoleLabel = (membership: Membership) => {
  if (!membership) return "—";
  if (membership.role === "COACH") {
    return membership.isHeadCoach ? "سرمربی" : "مربی";
  }
  if (membership.role === "PLAYER") return "بازیکن";
  if (membership.role === "REFEREE") return "داور";
  if (membership.role === "ADMIN") return "مدیر";
  return membership.role ?? "—";
};
</script>
