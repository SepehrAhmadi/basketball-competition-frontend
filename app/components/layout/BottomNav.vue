<script setup lang="ts">
import { ref, watch } from "vue";
import type { Component } from "vue";
import { useRoute } from "vue-router";
import IconUser from "@/components/icon/user.vue";
import IconHome from "@/components/icon/home.vue";
import IconDate from "@/components/icon/date.vue";
import IconCup from "@/components/icon/cup.vue";

type NavItem = {
    label: string;
    to: string;
    icon: Component;
    noActive?: boolean;
};

const items: NavItem[] = [
    { label: "خانه", to: "/", icon: IconHome },
    { label: "مسابقات", to: "/competitions", icon: IconCup },
    { label: "زمان بندی", to: "/", icon: IconDate, noActive: true },
    { label: "پروفایل", to: "/profile", icon: IconUser },
];

const route = useRoute();

function matchIndex(path: string): number {
    let best = -1;
    let bestLen = -1;
    items.forEach((item, index) => {
        if (item.noActive) return;
        const to = item.to;
        const matched =
            path === to || (to !== "/" && path.startsWith(to + "/"));
        if (matched && to.length > bestLen) {
            best = index;
            bestLen = to.length;
        }
    });
    return best;
}

const activeIndex = ref(-1);

watch(
    () => route.path,
    (path) => {
        const next = matchIndex(path);
        if (next !== -1) activeIndex.value = next;
    },
    { immediate: true },
);

const pressKey = ref<number[]>(items.map(() => 0));
const lastPressedIndex = ref(-1);

function bump(index: number) {
    pressKey.value = pressKey.value.map((v, i) => (i === index ? v + 1 : v));
    lastPressedIndex.value = index;
}

function handlePress(index: number) {
    bump(index);
}

watch(activeIndex, (next) => {
    if (next >= 0 && next !== lastPressedIndex.value) bump(next);
});
</script>

<template>
    <nav
        class="fixed inset-x-6 bottom-6 z-50 mx-auto flex h-20 max-w-md items-center justify-between rounded-full border border-white/20 bg-white/10 px-5 shadow-2xl backdrop-blur-xl"
    >
        <NuxtLink
            v-for="(item, index) in items"
            :key="item.label"
            :to="item.to"
            class="flex flex-col items-center gap-1"
            @click="handlePress(index)"
        >
            <div
                class="relative flex h-9.5 w-9.5 items-center justify-center overflow-hidden rounded-full text-foreground transition-all duration-300"
                :class="
                    index === activeIndex
                        ? 'bg-primary text-white'
                        : 'hover:bg-white/10'
                "
            >
                <Transition name="nav-icon" mode="out-in">
                    <component
                        :is="item.icon"
                        :key="pressKey[index]"
                        class="h-6.5 w-6.5 will-change-transform"
                        aria-hidden="true"
                    />
                </Transition>
            </div>
            <div class="text-[10px]">
                {{ item.label }}
            </div>
        </NuxtLink>
    </nav>
</template>

<style scoped>
.nav-icon-enter-active {
    transition:
        transform 0.50s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.35s ease-out;
}
.nav-icon-leave-active {
    transition: none;
}
.nav-icon-enter-from {
    transform: translateY(110%);
    opacity: 0;
}
.nav-icon-enter-to {
    transform: translateY(0);
    opacity: 1;
}
.nav-icon-leave-from {
    opacity: 0;
}
.nav-icon-leave-to {
    opacity: 0;
}
</style>
