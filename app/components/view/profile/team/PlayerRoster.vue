<template>
  <div class="mt-4">
    <!-- Section Header -->
    <div class="flex justify-between items-center gap-2 mb-2">
      <div class="flex items-center gap-2">
        <icon-users class="size-3.75 text-gray-500 dark:text-gray-300" />
        <div class="text-[13px] text-gray-500 dark:text-gray-300">بازیکنان</div>
      </div>
      <div>
        <Button class="w-full text-[13px]" size="sm" @click="openAddDrawer">
          افزودن بازیکن
        </Button>
      </div>
    </div>

    <!-- Player Cards -->
    <Card
      v-for="member in playerRoster"
      :key="member.id"
      class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
    >
      <CardContent class="px-3">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-center gap-2">
            <div
              class="w-15 h-15 rounded-full border border-gray-300 mb-2"
              :class="member.user?.avatarUrl ? '' : 'bg-primary'"
            >
              <img
                v-if="member.user?.avatarUrl"
                :src="member.user.avatarUrl"
                class="w-full h-full object-cover rounded-full"
                alt="آواتار بازیکن"
              />
              <img
                v-else
                :src="defaultAvatar"
                class="w-full h-full object-cover rounded-full p-1.5"
                alt="آواتار بازیکن"
              />
            </div>
            <div
              class="shrink w-full flex-1 flex justify-between items-center gap-4"
            >
              <div>
                <div class="text-[14px] font-semibold">
                  {{ member.user?.fullName ?? "—" }}
                </div>
                <div
                  class="text-[12px] text-gray-600 dark:text-gray-400 font-semibold"
                >
                  پیراهن: {{ member.jerseyNumber ?? "—" }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <Button
                class="text-[12px]"
                size="sm"
                variant="ghost"
                aria-label="ویرایش بازیکن"
                @click="openEditDrawer(member)"
              >
                <icon-edit class="size-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger as-child>
                  <Button
                    class="text-[12px]"
                    size="sm"
                    variant="ghost"
                    aria-label="حذف بازیکن"
                  >
                    <icon-trash class="size-4.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف بازیکن</AlertDialogTitle>
                    <AlertDialogDescription>
                      آیا از حذف «{{ member.user?.fullName }}» مطمئن هستید؟ این
                      عمل قابل بازگشت نیست.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>انصراف</AlertDialogCancel>
                    <AlertDialogAction
                      class="bg-destructive text-white hover:bg-destructive/90"
                      @click="confirmDelete(member)"
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Empty state -->
    <div
      v-if="!loading && playerRoster.length === 0"
      class="flex flex-col justify-center items-center gap-1 py-8"
    >
      <icon-users class="w-8 h-8 text-gray-500 dark:text-gray-300 mb-1" />
      <p class="text-gray-500 dark:text-gray-300 text-[15px]">
        بازیکنی یافت نشد
      </p>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="pageCount > 1"
      v-model:page="page"
      :items-per-page="pageSize"
      :total="playerRosterMeta?.total ?? 0"
      :sibling-count="1"
      show-edges
      class="mt-4"
      aria-label="صفحه‌بندی بازیکنان"
    >
      <PaginationContent>
        <PaginationPrevious aria-label="صفحه قبلی" />
        <PaginationItem
          v-for="pageNumber in pageCount"
          :key="pageNumber"
          :value="pageNumber"
          :is-active="pageNumber === page"
          :aria-label="`صفحه ${pageNumber}`"
          class="w-7! h-7! p-1! text-[14px]!"
        >
          {{ pageNumber }}
        </PaginationItem>
        <PaginationNext aria-label="صفحه بعدی" />
      </PaginationContent>
    </Pagination>

    <!-- Add Player Drawer -->
    <Drawer v-model:open="addDrawerOpen">
      <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle>افزودن بازیکن</DrawerTitle>
          <DrawerDescription
            >بازیکن مورد نظر را جستجو و انتخاب کنید</DrawerDescription
          >
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <!-- Combobox: user search -->
          <div class="flex flex-col gap-1 tw-bg-red-500">
            <Combobox
              v-model="selectedUserValue"
              @update:model-value="handleUserSelect"
              dir="rtl"
              class=""
            >
              <ComboboxAnchor class="w-full border rounded-md" dir="rtl">
                <ComboboxInput
                  dir="rtl"
                  v-model="searchQuery"
                  placeholder="نام بازیکن را تایپ کنید..."
                  class="custom-input-focus text-[13px]"
                  :display-value="() => selectedUser?.fullName ?? ''"
                />
              </ComboboxAnchor>
              <ComboboxList dir="rtl">
                <ComboboxEmpty dir="rtl">
                  <div
                    class="text-gray-600 dark:text-gray-300 text-[13px] translate-y-1"
                  >
                    بازیکنی یافت نشد.
                  </div>
                </ComboboxEmpty>
                <ComboboxGroup dir="rtl">
                  <ComboboxItem
                    v-for="user in userSearchResults"
                    :key="user.id"
                    :value="user.id"
                    dir="rtl"
                  >
                    <div class="flex items-center gap-2">
                      <div
                        class="w-10 h-10 rounded-full border border-gray-300 bg-primary shrink-0"
                      >
                        <img
                          v-if="user.avatarUrl"
                          :src="user.avatarUrl"
                          class="w-full h-full object-cover rounded-full"
                          alt=""
                        />
                        <img
                          v-else
                          :src="defaultAvatar"
                          class="w-full h-full object-cover rounded-full p-0.5"
                          alt=""
                        />
                      </div>
                      <span class="font-medium text-[13px]">{{
                        user.fullName
                      }}</span>
                    </div>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
          </div>

          <!-- Jersey Number (shown after user is selected) -->
          <div v-if="selectedUser" class="flex flex-col gap-1">
            <CustomLabel :is-required="true" label="شماره پیراهن" />
            <Input
              v-model="addJerseyNumber"
              type="number"
              inputmode="numeric"
              aria-label="شماره پیراهن"
              class="custom-input-focus text-[13px] text-gray-700 dark:text-gray-300"
              placeholder="شماره پیراهن را وارد کنید"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button
            :disabled="!selectedUser || !addJerseyNumber"
            @click="handleAddSubmit"
          >
            ثبت
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>

    <!-- Edit Player Drawer -->
    <Drawer v-model:open="editDrawerOpen">
      <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle>ویرایش بازیکن</DrawerTitle>
          <DrawerDescription
            >شماره پیراهن بازیکن را ویرایش کنید</DrawerDescription
          >
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <!-- Selected user info (read-only) -->
          <div
            v-if="editingMember"
            class="flex items-center gap-3 p-3 rounded-xl border"
          >
            <div
              class="w-12 h-12 rounded-full border border-gray-300 bg-primary shrink-0"
            >
              <img
                v-if="editingMember.user?.avatarUrl"
                :src="editingMember.user.avatarUrl"
                class="w-full h-full object-cover rounded-full"
                alt=""
              />
              <img
                v-else
                :src="defaultAvatar"
                class="w-full h-full object-cover rounded-full p-1"
                alt=""
              />
            </div>
            <div>
              <div class="text-[14px] font-semibold">
                {{ editingMember.user?.fullName }}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel :is-required="true" label="شماره پیراهن" />
            <Input
              v-model="editJerseyNumber"
              type="number"
              inputmode="numeric"
              aria-label="شماره پیراهن"
              class="custom-input-focus text-[14px]"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button :disabled="!editJerseyNumber" @click="handleEditSubmit">
            ذخیره
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import defaultAvatar from "../../../../assets/img/avatar.png";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from "~/components/ui/combobox";

import { useTeamStore } from "~/store/team";
import { useUserStore } from "~/store/user";

const props = defineProps<{
  seasonId?: number | string | null;
}>();

const teamStore = useTeamStore();
const userStore = useUserStore();
const { playerRoster, playerRosterMeta } = storeToRefs(teamStore);
const { usersSearchResult } = storeToRefs(userStore);
const loading = storeToRefs(teamStore).loading;

const route = useRoute();
const teamId = computed(() => Number(route.params.slug));

// ─── Pagination ────────────────────────────────────────────────────────

const page = ref(1);
const pageSize = 5;
const pageCount = computed(() =>
  Math.ceil((playerRosterMeta.value?.total ?? 0) / pageSize),
);

// ─── Add Drawer state ──────────────────────────────────────────────────

const addDrawerOpen = ref(false);
const searchQuery = ref("");
const selectedUser = ref<any>(null);
const selectedUserValue = ref<string | null>(null);
const addJerseyNumber = ref<string>("");
const userSearchResults = computed(
  () => usersSearchResult.value?.items ?? usersSearchResult.value ?? [],
);

// Debounce timer
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchQuery, (newVal) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  if (!newVal || newVal.trim().length === 0) {
    usersSearchResult.value = null;
    return;
  }

  searchDebounceTimer = setTimeout(() => {
    userStore.getUserSearch({
      query: newVal.trim(),
      role: ["PLAYER"] as any,
      pageSize: 20,
    });
  }, 300);
});

const handleUserSelect = (value: any) => {
  if (value == null) {
    selectedUser.value = null;
    selectedUserValue.value = null;
    return;
  }

  const found = userSearchResults.value.find(
    (u: any) => String(u.id) === String(value),
  );
  if (found) {
    selectedUser.value = found;
    selectedUserValue.value = String(found.id);
  }
};

const openAddDrawer = () => {
  resetAddForm();
  addDrawerOpen.value = true;
};

const resetAddForm = () => {
  searchQuery.value = "";
  selectedUser.value = null;
  selectedUserValue.value = null;
  addJerseyNumber.value = "";
  usersSearchResult.value = null;
};

const handleAddSubmit = () => {
  if (!selectedUser.value || !addJerseyNumber.value) return;

  const payload = {
    userId: selectedUser.value.id,
    seasonId: props.seasonId,
    role: "PLAYER",
    jerseyNumber: Number(addJerseyNumber.value),
  };

  teamStore.addRosterMember(teamId.value, payload).then(() => {
    addDrawerOpen.value = false;
    resetAddForm();
    loadRoster();
  });
};

// ─── Edit Drawer state ─────────────────────────────────────────────────

const editDrawerOpen = ref(false);
const editingMember = ref<any>(null);
const editJerseyNumber = ref<string>("");

const openEditDrawer = (member: any) => {
  editingMember.value = member;
  editJerseyNumber.value = member.jerseyNumber?.toString() ?? "";
  editDrawerOpen.value = true;
};

const handleEditSubmit = () => {
  if (!editingMember.value || !editJerseyNumber.value) return;

  teamStore
    .updateRosterMember(teamId.value, editingMember.value.id, {
      jerseyNumber: Number(editJerseyNumber.value),
    })
    .then(() => {
      editDrawerOpen.value = false;
      editingMember.value = null;
      editJerseyNumber.value = "";
      loadRoster();
    });
};

// ─── Delete ────────────────────────────────────────────────────────────

const confirmDelete = (member: any) => {
  teamStore
    .removeRosterMember(teamId.value, member.id, props.seasonId)
    .then(() => {
      loadRoster();
    });
};

// ─── Data loading ──────────────────────────────────────────────────────

const loadRoster = () => {
  if (!props.seasonId) return;
  return teamStore.getRoster(teamId.value, {
    role: "PLAYER",
    seasonId: props.seasonId ?? undefined,
    page: page.value,
    pageSize,
  });
};

watch(page, () => {
  loadRoster();
});

watch(pageCount, (newPageCount) => {
  if (newPageCount > 0 && page.value > newPageCount) {
    page.value = newPageCount;
  }
});

watch(
  () => props.seasonId,
  () => {
    page.value = 1;
    loadRoster();
  },
);

onMounted(() => {
  loadRoster();
});
</script>
