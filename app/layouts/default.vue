<template>
    <div class="relative min-h-screen">
        <!-- tall blue backdrop: height follows the scroll 1:1 (no transition needed) -->
        <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-0 z-0 rounded-br-3xl bg-[linear-gradient(to_bottom,var(--primary)_0,color-mix(in_oklab,var(--primary),black_25%)_160px)]"
            :style="{ height: `${backdropHeight}px` }"
        />

        <AppHeader :scrolled="scrolled" />

        <div
            class="relative z-10 px-3 pb-28!"
            :style="{ paddingTop: `${contentPaddingTop}px` }"
        >
            <slot />
        </div>
        <BottomNav />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import BottomNav from "@/components/layout/BottomNav.vue";

// backdrop height when the page is at the top / fully collapsed
const BACKDROP_FULL = 132; // h-33
const BACKDROP_REST = 64; // header height
const COLLAPSE_DISTANCE = BACKDROP_FULL - BACKDROP_REST; // 68px of scroll to fully collapse

const scrollY = ref(0);
let ticking = false;

const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        scrollY.value = window.scrollY;
        ticking = false;
    });
};

// 0 -> 1 while the first COLLAPSE_DISTANCE px are scrolled
const progress = computed(() =>
    Math.min(1, Math.max(0, scrollY.value / COLLAPSE_DISTANCE)),
);

// the backdrop shrinks exactly as much as the page scrolls
const backdropHeight = computed(
    () => BACKDROP_FULL - progress.value * COLLAPSE_DISTANCE,
);

const contentPaddingTop = computed(() => progress.value * 16);

const scrolled = computed(() => scrollY.value > 40);

onMounted(() => {
    scrollY.value = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
});
</script>
