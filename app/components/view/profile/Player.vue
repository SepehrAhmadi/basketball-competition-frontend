<template>
  <div class="mt-2" v-if="canSetPlayerInfo">
    <Card
      v-if="isPlayerLoading"
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
                :src="ball"
                alt="avatar"
                class="object-cover w-full h-full rounded-full p-1.5"
              />
            </div>
            <div
              class="shrink w-full flex-1 flex justify-between items-center gap-4"
            >
              <div class="text-[14px] font-semibold">اطلاعات بازیکن</div>
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
          <DrawerTitle>اطلاعات بازیکن</DrawerTitle>
          <DrawerDescription>قد و پست بازی خود را وارد کنید</DrawerDescription>
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <div class="flex flex-col gap-1">
            <Label class="text-gray-600 text-xs" for="player-height">قد</Label>
            <Input
              id="player-height"
              v-model.number="height"
              type="number"
              inputmode="numeric"
              placeholder="قد بازیکن"
              aria-label="قد بازیکن"
            />
          </div>

          <div class="flex flex-col gap-1">
            <Label class="text-gray-600 text-xs" for="player-position"
              >پست بازی</Label
            >
            <Input
              id="player-position"
              v-model="position"
              type="text"
              placeholder="پست بازی"
              aria-label="پست بازی"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button
            :disabled="
              height === undefined || !position || handlerStore.loadingBtn
            "
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
import ball from "../../../assets/img/icon/ball.png";
import { Skeleton } from "~/components/ui/skeleton";
import { usePeopleStore } from "~/store/people";
import { useHandlerStore } from "~/store/handler";

const { canSetPlayerInfo } = usePermissions();

const peopleStore = usePeopleStore();
const handlerStore = useHandlerStore();
const { playerProfile, loading: peopleLoading } = storeToRefs(peopleStore);
const isPlayerLoading = computed(
  () => peopleLoading.value && !playerProfile.value,
);

const open = ref(false);
const height = ref<number | undefined>(undefined);
const position = ref<string | undefined>(undefined);

const openDrawer = () => {
  open.value = true;
  peopleStore.getPlayerMe();
};

watch(playerProfile, (newValue) => {
  if (newValue) {
    height.value = newValue.height;
    position.value = newValue.position;
  }
});

onMounted(() => {
  if (!playerProfile.value) return;
  peopleStore.getPlayerMe();
});

const save = () => {
  if (height.value === undefined || !position.value) return;

  peopleStore
    .updatePlayerMe({ height: height.value, position: position.value })
    .then(() => {
      open.value = false;
    });
};
</script>
