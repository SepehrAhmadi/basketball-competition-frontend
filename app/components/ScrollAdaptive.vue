<template>
  <component :is="as" :class="wrapperClass">
    <slot :scrolled="scrolled" />
  </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    as?: string;
    threshold?: number;
    topClass?: string;
    scrolledClass?: string;
  }>(),
  {
    as: "div",
    threshold: 40,
    topClass: "text-white",
    scrolledClass: "text-gray-500 dark:text-gray-200",
  },
);

const scrolled = ref(false);
let ticking = false;

const update = () => {
  scrolled.value = window.scrollY > props.threshold;
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    update();
    ticking = false;
  });
};

const wrapperClass = computed(() =>
  cn(
    "transition-colors duration-300",
    scrolled.value ? props.scrolledClass : props.topClass,
  ),
);

onMounted(() => {
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
