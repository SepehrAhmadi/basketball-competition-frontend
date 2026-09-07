<template>
    <div>
        <Label for="register-fullname">
            <span class="text-gray-600 text-xs">{{ label }}</span>
            <span
                v-if="isRequired"
                class="text-red-500 dark:text-red-600 text-[10px]"
                >(الزامی)</span
            >
        </Label>
    </div>
</template>

<script setup lang="ts">
import { Label } from "~/components/ui/label";

const props = defineProps({
    label: String,
    isRequired: {
        default: false,
    },
});
</script>
