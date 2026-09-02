<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "~/store/auth";

const authStore = useAuthStore();

type Theme = "light" | "dark";

const THEME_KEY = "theme";
const DEFAULT_THEME: Theme = "light";

const theme = ref<Theme>(DEFAULT_THEME);

const applyTheme = (value: Theme) => {
    const root = document.documentElement;

    if (value === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
};

const setTheme = (value: Theme) => {
    theme.value = value;
    applyTheme(value);
    localStorage.setItem(THEME_KEY, value);
};

const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
};

const handleLogout = () => {
    authStore.logout();
};

onMounted(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const next: Theme =
        saved === "dark" || saved === "light" ? saved : DEFAULT_THEME;

    theme.value = next;
    applyTheme(next);
});
</script>

<template>
    <header
        class="flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6"
    >
        <img
            v-if="theme === 'light'"
            src="~/assets/img/logo.png"
            alt="Logo"
            class="h-8 w-auto object-contain sm:h-10"
        />
        <img
            v-else
            src="~/assets/img/logo-dark.png"
            alt="Logo"
            class="h-8 w-auto object-contain sm:h-10"
        />

        <div class="flex items-center gap-2 sm:gap-3">
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                class="cursor-pointer"
                aria-label="Toggle theme"
                :aria-pressed="theme === 'dark'"
                @click="toggleTheme"
            >
                <icon-moon
                    v-if="theme === 'dark'"
                    class="size-5"
                    aria-hidden="true"
                />
                <icon-sun v-else class="size-5" aria-hidden="true" />
                <span class="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu dir="rtl">
                <DropdownMenuTrigger as-child dir="rtl">
                    <Button
                        dir="rtl"
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        class="cursor-pointer overflow-hidden rounded-full"
                        aria-label="User menu"
                    >
                        <img
                            src="~/assets/img/avatar.png"
                            alt=""
                            class="size-8 rounded-full object-cover"
                        />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    class="min-w-40 flex flex-col gap-4 p-2"
                    dir="rtl"
                >
                    <div class="flex justify-start items-center gap-2">
                        <icon-user class="size-4" />
                        <div class="text-[13px]">سپهر احمدی</div>
                    </div>
                    <button class="flex justify-start items-center gap-2">
                        <icon-edit-box class="size-4" />
                        <div class="text-[13px]">ویرایش پروفایل</div>
                    </button>
                    <button
                        @click="handleLogout"
                        class="flex justify-start items-center gap-2 text-red-700 dark:text-red-500"
                    >
                        <icon-logout class="size-4" />
                        <div class="text-[13px]">خروج</div>
                    </button>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
</template>
