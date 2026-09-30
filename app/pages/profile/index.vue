<template>
  <div>
    <view-profile-edit-profile />
    <div class="mt-6">
      <div class="flex items-center gap-2">
        <icon-document class="size-3.75 text-gray-500 dark:text-gray-300" />
        <div class="text-[13px] text-gray-500 dark:text-gray-300">
          اطلاعات تکمیلی
        </div>
      </div>
      <view-profile-coach v-if="canSetCoachInfo" />
      <view-profile-referee v-if="canSetRefereeInfo"/>
      <view-profile-player v-if="canSetPlayerInfo"/>
    </div>
    <div class="mt-6">
      <view-profile-organization />
    </div>
  </div>
</template>

<script setup lang="ts">
const { canSetCoachInfo, canSetRefereeInfo, canSetPlayerInfo } =
  usePermissions();

definePageMeta({
  middleware: ["auth"],
});
</script>
