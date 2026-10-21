<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "~/store/auth";
import logoLight from "~/assets/img/logo.png";
import logoDark from "~/assets/img/logo-dark.png";

const props = defineProps<{ scrolled?: boolean }>();

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
    class="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-4 transition-colors duration-500 sm:px-6"
    :class="
      props.scrolled
        ? 'border-white/20 bg-white/10 text-foreground shadow-2xl backdrop-blur-xl'
        : 'border-transparent text-primary-foreground'
    "
  >
    <!-- gradient layer: fades out when scrolled so the glass shows -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--primary)_0,color-mix(in_oklab,var(--primary),black_25%)_120px)] transition-opacity duration-300"
      :class="props.scrolled ? 'opacity-0' : 'opacity-100'"
    />
    <img
      :src="props.scrolled && theme === 'light' ? logoLight : logoDark"
      alt="Logo"
      class="h-9 w-auto object-contain sm:h-10"
    />

    <div class="flex items-center gap-2 sm:gap-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        class="cursor-pointer hover:bg-white/15 text-white"
        :class="
          props.scrolled && theme === 'light'
            ? 'text-foreground hover:text-gray-700'
            : 'text-white hover:text-gray-100 overflow-hidden rounded-full'
        "
        aria-label="Toggle theme"
        :aria-pressed="theme === 'dark'"
        @click="toggleTheme"
      >
        <icon-moon v-if="theme === 'dark'" class="size-5" aria-hidden="true" />
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
            class="cursor-pointer hover:bg-white/15 overflow-hidden rounded-full text-white"
            aria-label="User menu"
            :class="
              props.scrolled && theme === 'light'
                ? 'text-foreground hover:text-gray-700'
                : 'text-white hover:text-gray-100 overflow-hidden rounded-full'
            "
          >
            <icon-user class="size-5" aria-hidden="true" />
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
