<template>
    <div>
        <AppHeader />
        <slot />
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import BottomNav from "@/components/layout/BottomNav.vue";
</script>
