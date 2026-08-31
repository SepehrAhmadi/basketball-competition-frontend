<template>
    <div>
        <slot />
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import BottomNav from "@/components/layout/BottomNav.vue";
</script>
