<template>
  <Drawer :open="open" @update:open="emit('update:open', $event)">
    <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
      <DrawerHeader>
        <DrawerTitle>فیلتر لیگ‌ها</DrawerTitle>
        <DrawerDescription>لیگ‌ها را فیلتر کنید</DrawerDescription>
      </DrawerHeader>

      <div class="flex flex-col gap-4 px-4">
        <div class="flex flex-col gap-1">
          <CustomLabel label="جستجو" />
          <div class="relative">
            <icon-search
              class="absolute inset-s-3 top-1/2 -translate-y-1/2 size-4.5 text-gray-400"
            />
            <Input
              v-model="draft.search"
              placeholder="نام لیگ"
              aria-label="جستجوی لیگ"
              class="ps-9"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <CustomLabel label="وضعیت" />
          <Select v-model="draft.status" dir="rtl">
            <SelectTrigger class="w-full" aria-label="انتخاب وضعیت">
              <SelectValue placeholder="همه" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectGroup>
                <SelectItem value="all" class="px-3"> همه </SelectItem>
                <SelectItem
                  v-for="option in statusOptions"
                  :key="option.value"
                  :value="option.value"
                  class="px-3"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-1">
          <CustomLabel label="فصل" />
          <Select v-model="draft.seasonId" dir="rtl">
            <SelectTrigger class="w-full" aria-label="انتخاب فصل">
              <SelectValue placeholder="همه" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectGroup>
                <SelectItem value="all" class="px-3"> همه </SelectItem>
                <SelectItem
                  v-for="option in seasonOptions"
                  :key="option.value"
                  :value="String(option.value)"
                  class="px-3"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-1">
          <CustomLabel label="رده سنی" />
          <Select v-model="draft.ageCategoryId" dir="rtl">
            <SelectTrigger class="w-full" aria-label="انتخاب رده سنی">
              <SelectValue placeholder="همه" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectGroup>
                <SelectItem value="all" class="px-3"> همه </SelectItem>
                <SelectItem
                  v-for="option in ageCategoryOptions"
                  :key="option.value"
                  :value="String(option.value)"
                  class="px-3"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DrawerFooter>
        <Button class="dark:text-gray-300" @click="applyFilters">
          اعمال فیلتر
        </Button>
        <Button variant="outline" @click="clearFilters"> حذف فیلترها </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<script setup lang="ts">
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useDropdownStore } from "~/store/dropdown";

const props = defineProps<{
  open: boolean;
  modelValue: {
    search?: string | null;
    status?: "REGISTRATION" | "ACTIVE" | "FINISHED" | null;
    seasonId?: number | string | null;
    ageCategoryId?: number | string | null;
  };
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (
    e: "apply",
    value: {
      search: string | null;
      status: "REGISTRATION" | "ACTIVE" | "FINISHED" | null;
      seasonId: number | string | null;
      ageCategoryId: number | string | null;
    },
  ): void;
}>();

const dropdownStore = useDropdownStore();
const { seasonOptions, ageCategoryOptions } = storeToRefs(dropdownStore);

const statusOptions = [
  { value: "REGISTRATION", label: "در حال ثبت‌نام" },
  { value: "ACTIVE", label: "در جریان" },
  { value: "FINISHED", label: "تمام‌شده" },
];

const emptyFilters = {
  search: "",
  status: "all",
  seasonId: "all",
  ageCategoryId: "all",
};

const draft = ref({ ...emptyFilters });

const toDraftValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "all";
  return String(value);
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;
    dropdownStore.getSeasonOptions();
    dropdownStore.getAgeCategoryOptions();
    draft.value = {
      search: props.modelValue?.search ?? "",
      status: toDraftValue(props.modelValue?.status),
      seasonId: toDraftValue(props.modelValue?.seasonId),
      ageCategoryId: toDraftValue(props.modelValue?.ageCategoryId),
    };
  },
);

const normalizeId = (value: string): number | string | null => {
  if (!value || value === "all") return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
};

const applyFilters = () => {
  const search = draft.value.search.trim();
  const statusValue = draft.value.status;
  emit("apply", {
    search: search === "" ? null : search,
    status:
      statusValue === "all"
        ? null
        : (statusValue as "REGISTRATION" | "ACTIVE" | "FINISHED"),
    seasonId: normalizeId(draft.value.seasonId),
    ageCategoryId: normalizeId(draft.value.ageCategoryId),
  });
};

const clearFilters = () => {
  draft.value = { ...emptyFilters };
  emit("apply", {
    search: null,
    status: null,
    seasonId: null,
    ageCategoryId: null,
  });
};
</script>
