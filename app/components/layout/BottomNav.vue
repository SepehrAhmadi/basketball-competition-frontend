<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const items = [
    { label: "خانه", to: "/", letter: "A" },
    { label: "بازی‌ها", to: "/", letter: "B" },
    { label: "اعلان‌ها", to: "/", letter: "C" },
    { label: "علاقه‌مندی‌ها", to: "/", letter: "D" },
];

const route = useRoute();

const activeIndex = computed(() =>
    items.findIndex((item) => item.to === route.path),
);
</script>

<template>
    <nav
        class="fixed inset-x-6 bottom-6 z-50 mx-auto flex h-20 max-w-md items-center justify-between rounded-full border border-white/20 bg-white/10 px-5 shadow-2xl backdrop-blur-xl"
    >
        <NuxtLink
            v-for="(item, index) in items"
            :key="item.to"
            :to="item.to"
            class="flex flex-col items-center gap-1"
        >
            <div
                class="flex h-9.5 w-9.5 items-center justify-center rounded-full text-sm font-semibold text-foreground transition-all duration-300"
                :class="
                    index === activeIndex
                        ? 'bg-cyan-700 text-white'
                        : 'hover:bg-white/10'
                "
            >
                {{ item.letter }}
            </div>
            <div class="text-[10px]">
                {{ item.label }}
            </div>
        </NuxtLink>
    </nav>
</template>
