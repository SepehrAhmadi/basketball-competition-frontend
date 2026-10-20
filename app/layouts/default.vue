<template>
    <div class="relative min-h-screen">
        <!-- tall blue backdrop: shrinks into the header when scrolling -->
        <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-0 z-0 rounded-b-xl bg-[linear-gradient(to_bottom,var(--primary)_0,color-mix(in_oklab,var(--primary),black_25%)_160px)] transition-[height] duration-500 ease-out"
            :class="scrolled ? 'h-16' : 'h-33'"
        />

        <AppHeader :scrolled="scrolled" />

        <div
            class="relative z-10 px-3 pb-28! transition-[padding] duration-500 ease-out"
            :class="scrolled ? 'pt-4' : 'pt-0'"
        >
            <slot />
        </div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import BottomNav from "@/components/layout/BottomNav.vue";

const scrolled = ref(false);

// hysteresis prevents flicker around the threshold
const onScroll = () => {
    const y = window.scrollY;
    if (!scrolled.value && y > 40) scrolled.value = true;
    else if (scrolled.value && y < 8) scrolled.value = false;
};

onMounted(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
});
</script>
