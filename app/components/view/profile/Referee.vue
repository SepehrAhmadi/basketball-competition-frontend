<template>
  <div class="mt-2" v-if="canSetRefereeInfo">
    <Card
      v-if="isRefereeLoading"
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
    <Card v-else class="w-full shadow-xs! rounded-4xl gap-4 py-3">
      <CardContent class="px-3">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-center gap-2">
            <div
              class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2"
            >
              <img
                :src="whistle"
                alt="avatar"
                class="object-cover w-full h-full rounded-full p-1.5"
              />
            </div>
            <div
              class="shrink w-full flex-1 flex justify-between items-center gap-4"
            >
              <div class="text-[14px] font-semibold">اطلاعات داور</div>
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
          <DrawerTitle>اطلاعات داور</DrawerTitle>
          <DrawerDescription>درجه داوری خود را انتخاب کنید</DrawerDescription>
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <div class="flex flex-col gap-1">
            <CustomLabel label="درجه داوری" :is-required="true" />
            <Select v-model="selectedDegree" dir="rtl">
              <SelectTrigger
                id="referee-degree"
                class="w-full"
                aria-label="انتخاب درجه داوری"
              >
                <SelectValue placeholder="انتخاب درجه" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectGroup>
                  <SelectItem
                    v-for="degree in refereeDegreeList"
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
import whistle from "../../../assets/img/icon/whistle.png";
import { Skeleton } from "~/components/ui/skeleton";
import { usePeopleStore } from "~/store/people";
import { useHandlerStore } from "~/store/handler";
import { useBaseStore } from "~/store/base";

const { canSetRefereeInfo } = usePermissions();

const peopleStore = usePeopleStore();
const handlerStore = useHandlerStore();
const baseStore = useBaseStore();
const { refereeDegrees: refereeDegreeList } = storeToRefs(baseStore);
const { refereeProfile, loading: peopleLoading } = storeToRefs(peopleStore);
const isRefereeLoading = computed(
  () => peopleLoading.value && !refereeProfile.value,
);

const open = ref(false);
const selectedDegree = ref<string | undefined>(undefined);

const openDrawer = () => {
  open.value = true;
  peopleStore.getRefereeMe();
};

watch(refereeProfile, (newValue) => {
  if (newValue) {
    selectedDegree.value = newValue.licenseLevel;
  }
});

onMounted(() => {
  baseStore.getRefereeDegree();
  if (!refereeProfile.value) return;
  peopleStore.getRefereeMe();
});

const save = () => {
  if (!selectedDegree.value) return;

  peopleStore
    .updateRefereeMe({ licenseLevel: selectedDegree.value })
    .then(() => {
      open.value = false;
    });
};
</script>
