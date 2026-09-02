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
            <view-profile-coach />
            <view-profile-referee />
            <view-profile-player />
        </div>
    </div>
</template>

<script setup lang="ts"></script>
