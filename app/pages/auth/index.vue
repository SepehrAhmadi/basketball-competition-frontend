<script setup lang="ts">
import { ref } from "vue";
import { safeRedirect } from "~/utils/redirect";

definePageMeta({
  layout: "auth",
});

const route = useRoute();
if (useCookie("token").value) {
  await navigateTo(safeRedirect(route.query.redirect));
}

const mode = ref<"login" | "register">("login");
</script>

<template>
  <div class="flex min-h-screen w-full items-center justify-center px-4">
    <div class="flex w-full max-w-sm flex-col items-center">
      <img src="~/assets/img/logo.png" alt="Logo" class="h-20 mb-2 w-auto dark:hidden" />
      <img src="~/assets/img/logo-dark.png" alt="Logo" class="hidden h-20 mb-2 w-auto dark:block" />

      <auth-LoginForm v-if="mode === 'login'" @switch="mode = 'register'" />
      <auth-RegisterForm v-else @switch="mode = 'login'" />
    </div>
  </div>
</template>
