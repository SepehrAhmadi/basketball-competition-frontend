<script setup lang="ts">
import { computed } from "vue";
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
};

const items: NavItem[] = [
    { label: "خانه", to: "/", icon: IconHome },
    { label: "مسابقات", to: "/", icon: IconCup },
    { label: "زمان بندی", to: "/", icon: IconDate },
    { label: "پروفایل", to: "/profile", icon: IconUser },
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
            :key="item.label"
            :to="item.to"
            class="flex flex-col items-center gap-1"
        >
            <div
                class="flex h-9.5 w-9.5 items-center justify-center rounded-full text-foreground transition-all duration-300"
                :class="
                    index === activeIndex
                        ? 'bg-cyan-700 text-white'
                        : 'hover:bg-white/10'
                "
            >
                <component :is="item.icon" class="h-6.5 w-6.5" aria-hidden="true" />
            </div>
            <div class="text-[10px]">
                {{ item.label }}
            </div>
        </NuxtLink>
    </nav>
</template>
