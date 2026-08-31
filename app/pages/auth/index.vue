<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "auth",
});

const mode = ref<"login" | "register">("login");
</script>

<template>
  <div class="flex min-h-screen w-full items-center justify-center px-4">
    <div class="flex w-full max-w-sm flex-col items-center">
      <img src="~/assets/img/logo.png" alt="Logo" class="h-20 w-auto" />

      <auth-LoginForm v-if="mode === 'login'" @switch="mode = 'register'" />
      <auth-RegisterForm v-else @switch="mode = 'login'" />
    </div>
  </div>
</template>
