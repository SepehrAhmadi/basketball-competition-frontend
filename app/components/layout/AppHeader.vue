<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "~/store/auth";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark";

const THEME_KEY = "theme";
const DEFAULT_THEME: Theme = "light";
// Temporary until profile data is reliably available from auth state.
const FALLBACK_USERNAME = "کاربر";

const authStore = useAuthStore();
const theme = ref<Theme>(DEFAULT_THEME);

const username = computed(() => {
    const profile = authStore.profileResult as {
        fullName?: string;
        username?: string;
        data?: { fullName?: string; username?: string };
    } | null;

    return (
        profile?.fullName ||
        profile?.username ||
        profile?.data?.fullName ||
        profile?.data?.username ||
        FALLBACK_USERNAME
    );
});

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

useHead({
    script: [
        {
            id: "theme-init",
            innerHTML:
                "(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark')}catch(e){}})();",
        },
    ],
});

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
            src="~/assets/img/logo.png"
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

            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button
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

                <DropdownMenuContent align="end" class="min-w-44">
                    <DropdownMenuLabel class="font-medium">
                        {{ username }}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        class="cursor-pointer text-destructive"
                        :disabled="authStore.loading"
                        @click="handleLogout"
                    >
                        خروج
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
</template>
