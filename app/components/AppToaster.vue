<script setup lang="ts">
import { toast } from "vue-sonner";
import { Toaster } from "@/components/ui/sonner";
import { useHandlerStore } from "~/store/handler";

const handlerStore = useHandlerStore();

// 1 = success, 2 = error, 3 = warning, 4 = info (store/handler/actions.ts)
watch(
    () => handlerStore.checkAlert,
    (value) => {
        if (!value) return;

        if (value === 1 && handlerStore.successMessage) {
            toast.success(handlerStore.successMessage);
        } else if (value === 2 && handlerStore.errorMessage) {
            toast.error(handlerStore.errorMessage);
        } else if (value === 3 && handlerStore.warningMessage) {
            toast.warning(handlerStore.warningMessage);
        } else if (value === 4 && handlerStore.infoMessage) {
            toast.info(handlerStore.infoMessage);
        }

        handlerStore.clearMessages();
    },
);
</script>

<template>
    <Toaster rich-colors position="top-center" />
</template>
