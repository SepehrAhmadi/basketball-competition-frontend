<template>
  <div class="mt-2">
    <!-- Skeleton content: shown while coach profile is loading -->
    <Card
      v-if="isCoachLoading"
      class="w-full shadow-xs! rounded-4xl gap-4 py-3"
      aria-hidden="true"
    >
      <CardContent class="px-3">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-center gap-2">
            <Skeleton class="w-15 h-15 rounded-full mb-2 shrink-0" />
            <div
              class="shrink w-full flex-1 flex justify-between items-center gap-4"
            >
              <Skeleton class="h-5.25 w-24 rounded-md" />
              <Skeleton class="h-5.25 w-18 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    <!-- Real content: shown after coach profile is loaded -->
    <Card v-else class="w-full shadow-xs! rounded-4xl gap-4 py-3">
      <CardContent class="px-3">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-center gap-2">
            <div
              class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2"
            >
              <img
                :src="court"
                alt="avatar"
                class="object-cover w-full h-full rounded-full p-1.5"
              />
            </div>
            <div
              class="shrink w-full flex-1 flex justify-between items-center gap-4"
            >
              <div class="text-[14px] font-semibold">اطلاعات مربی</div>
              <button
                type="button"
                class="flex items-center gap-1 text-[14px] font-semibold text-primary"
                @click="openDrawer"
              >
                <div>مشاهده</div>
                <icon-arrow-left class="text-[17px]" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Drawer v-model:open="open">
      <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle>اطلاعات مربی</DrawerTitle>
          <DrawerDescription
            >درجه مربی‌گری خود را انتخاب کنید</DrawerDescription
          >
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <div class="flex flex-col gap-1">
            <CustomLabel :is-required="true" label="درجه مربی‌گری" />
            <Select v-model="selectedDegree" dir="rtl">
              <SelectTrigger
                id="coach-degree"
                class="w-full"
                aria-label="انتخاب درجه مربی‌گری"
              >
                <SelectValue placeholder="انتخاب درجه" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectGroup>
                  <SelectItem
                    v-for="degree in coachDegreeList"
                    :key="degree.value"
                    :value="degree.value"
                    class="px-3"
                  >
                    {{ degree.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter>
          <Button
            :disabled="!selectedDegree || handlerStore.loadingBtn"
            @click="save"
          >
            <Spinner v-if="handlerStore.loadingBtn" />
            <span v-else>ثبت</span>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import court from "../../../assets/img/icon/basketball-court.png";
import { Skeleton } from "~/components/ui/skeleton";
import { usePeopleStore } from "~/store/people";
import { useHandlerStore } from "~/store/handler";
import { useBaseStore } from "~/store/base";


const peopleStore = usePeopleStore();
const handlerStore = useHandlerStore();
const baseStore = useBaseStore();
const { coachDegree: coachDegreeList } = storeToRefs(baseStore);
const { coachProfile, loading: peopleLoading } = storeToRefs(peopleStore);
const isCoachLoading = computed(
  () => peopleLoading.value && !coachProfile.value,
);

const open = ref(false);
const selectedDegree = ref<string | undefined>(undefined);

const openDrawer = () => {
  open.value = true;
  peopleStore.getCoachMe();
};

watch(coachProfile, (newValue) => {
  if (newValue) {
    selectedDegree.value = newValue.degree;
  }
});

onMounted(() => {
  baseStore.getCoachDegree();
  if (!coachProfile.value) return;
  peopleStore.getCoachMe();
});

const save = () => {
  if (!selectedDegree.value) return;

  peopleStore.updateCoachMe({ degree: selectedDegree.value }).then(() => {
    open.value = false;
  });
};
</script>
