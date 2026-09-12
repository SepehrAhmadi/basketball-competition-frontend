<template>
  <div class="mt-2">
    <!-- Team Detail -->
    <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4">
      <CardContent class="tw-py-2">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-ceneter gap-3">
            <div
              class="shrink-0 w-20 h-20 rounded-full border border-gray-300 mb-2 bg-primary"
            >
              <img
                v-if="teamDetail?.logoUrl"
                :src="teamDetail.logoUrl"
                alt="لوگوی تیم"
                class="object-cover w-full h-full rounded-full"
              />
              <img
                v-else
                :src="teamAvatar"
                alt="لوگوی تیم"
                class="object-cover w-full h-full rounded-full p-2"
              />
            </div>
            <div class="w-full tw-flex-1 flex justify-between items-start">
              <div class="flex flex-col gap-1">
                <div class="text-[16px]">
                  {{ teamDetail?.name ?? "—" }}
                </div>
                <div
                  v-if="teamDetail?.foundedDate || teamDetail?.founded_date"
                  class="text-[14px] text-gray-600 dark:text-gray-300"
                >
                  تأسیس:
                  {{ teamDetail?.foundedDate ?? teamDetail?.founded_date }}
                </div>
                <div
                  v-if="teamOrganizationName"
                  class="text-[14px] text-gray-600 dark:text-gray-300"
                >
                  سازمان : {{ teamOrganizationName }}
                </div>
                <div
                  v-if="teamDetail?.description"
                  class="text-[14px] text-gray-600 dark:text-gray-300 line-clamp-1"
                >
                  {{ teamDetail.description }}
                </div>
              </div>
              <div class="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button
                      class="text-[12px]"
                      size="sm"
                      variant="outline"
                      aria-label="حذف تیم"
                    >
                      <icon-trash class="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف تیم</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف «{{ teamDetail?.name }}» مطمئن هستید؟ این عمل
                        قابل بازگشت نیست.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>انصراف</AlertDialogCancel>
                      <AlertDialogAction
                        class="bg-destructive text-white hover:bg-destructive/90"
                        @click="confirmDelete"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  class="text-[12px]"
                  size="sm"
                  variant="outline"
                  aria-label="ویرایش تیم"
                  @click="openDrawer"
                >
                  <icon-edit class="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full mt-5 flex flex-col gap-1">
          <Select v-model="selectedSeason" dir="rtl">
            <SelectTrigger
              id="coach-degree"
              class="w-full custom-input-focus px-2 shadow-xs"
              aria-label="انتخاب درجه مربی‌گری"
            >
              <SelectValue placeholder="فصل" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectGroup>
                <SelectItem
                  v-for="season in seasons"
                  :key="season.value"
                  :value="season.value"
                  class="px-3"
                >
                  {{ season.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div class="flex items-center gap-2 ms-1">
            <div class="bg-cyan-500 dark:bg-gray-400 w-0.75 h-0.75"></div>
            <p class="text-primary dark:text-gray-400 text-[11px]">
              برای مشاهده اعضا ابتدا فصل را انتخاب کنید
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Player Roster -->
    <view-profile-team-player-roster
      v-if="selectedSeason"
      :season-id="selectedSeason"
    />

    <!-- No selected season -->
    <div v-if="!selectedSeason" class="mt-8" >
      <div class="flex flex-col justify-center items-center gap-1">
        <icon-date class="w-8 h-8 text-gray-500 dark:text-gray-300 mb-1" />
        <p class="text-gray-500 dark:text-gray-300 text-[15px]">
          فصل را انتخاب کنید
        </p>
        <p class="text-gray-500 dark:text-gray-300 text-[13px]">
          برای مشاهده اعضای تیم ابتدا فصل مور دنظر را انتخاب کنید
        </p>
      </div>
    </div>

    <Drawer v-model:open="open">
      <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle>ویرایش تیم</DrawerTitle>
          <DrawerDescription>اطلاعات تیم را ویرایش کنید</DrawerDescription>
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <div class="flex justify-start items-center gap-5">
            <div
              class="w-20 h-20 rounded-full border border-gray-300 mb-2"
              :class="hasLogo ? '' : 'bg-primary'"
            >
              <img
                v-if="!hasLogo"
                :src="logoPreview"
                alt="لوگوی تیم"
                class="object-cover w-full h-full rounded-full p-1.25"
              />
              <img
                v-else
                :src="logoPreview"
                alt="لوگوی تیم"
                class="object-cover w-full h-full rounded-full"
              />
            </div>
            <div>
              <div class="flex flex-col gap-2 mb-2">
                <div class="text-gray-600 dark:text-gray-400 text-xs">
                  تصویر را در ابعاد مربعی انتخاب کنید
                </div>
                <div class="text-gray-600 dark:text-gray-400 text-xs">
                  فرمت عکس باید PNG یا JPG باشد
                </div>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                class="hidden"
                aria-label="انتخاب لوگوی تیم"
                @change="handleLogoChange"
              />
              <div class="flex items-center gap-2">
                <Button
                  class="text-[12px]"
                  size="sm"
                  aria-label="انتخاب لوگوی تیم"
                  @click="triggerFileInput"
                >
                  انتخاب تصویر
                </Button>
                <Button
                  v-if="hasLogo"
                  class="text-[12px] bg-red-500 hover:bg-red-500/90 dark:bg-red-600 dark:hover:bg-red-600/90"
                  size="sm"
                  aria-label="حذف لوگوی تیم"
                  @click="removeLogo"
                >
                  <icon-trash class="text-white size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel :is-required="true" label="نام تیم" />
            <Input
              v-model="teamName"
              id="team-name"
              type="text"
              aria-label="نام تیم"
              class="custom-input-focus text-[14px]"
            />
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="سال تأسیس" />
            <date-picker
              v-model="foundedDate"
              simple
              type="date"
              id="team-foundedDate"
              format="jYYYY/jMM/jDD"
              display-format="jYYYY/jMM/jDD"
              class="default-scroll tw:text-gray-300! tw:text-[14px]! tw:text-center!"
              color="#1d202e"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button @click="handleSubmit">ثبت</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import defaultAvatar from "../../../../assets/img/icon/team.png";
import teamAvatar from "../../../../assets/img/icon/team.png";
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

import { useTeamStore } from "~/store/team";
const teamStore = useTeamStore();
const { teamDetail } = storeToRefs(teamStore);

import { useHandlerStore } from "~/store/handler";
const handlerStore = useHandlerStore();

import { useBaseStore } from "~/store/base";
const baseStore = useBaseStore();
const { seasons } = storeToRefs(baseStore);

const route = useRoute();
const teamId = computed(() => Number(route.params.slug));

const selectedSeason = ref<number | null>(null);

const teamOrganizationName = computed(() => {
  const detail: any = teamDetail.value;
  return detail?.organization?.name ?? "";
});

// ─── Team roster ────────────────────────────────────────────────

// ─── Edit drawer state ────────────────────────────────────────────────

const open = ref(false);
const teamName = ref("");
const foundedDate = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);
const logo = ref<File | null>(null);
const logoPreview = ref<string>(defaultAvatar);
const removeLogoFlag = ref(false);
const hasLogo = computed(() => logoPreview.value !== defaultAvatar);
const organizationId = ref(null);

const fillForm = (team: {
  name?: string;
  foundedDate?: string;
  founded_date?: string;
  logoUrl?: string;
  logo?: string;
}) => {
  teamName.value = team.name ?? "";
  foundedDate.value = team.foundedDate ?? team.founded_date ?? "";
  logo.value = null;
  logoPreview.value = team.logoUrl ?? team.logo ?? defaultAvatar;
  removeLogoFlag.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const resetForm = () => {
  teamName.value = "";
  foundedDate.value = "";
  logo.value = null;
  logoPreview.value = defaultAvatar;
  removeLogoFlag.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const openDrawer = () => {
  if (teamDetail.value) {
    fillForm(teamDetail.value);
  } else {
    resetForm();
  }
  open.value = true;
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleLogoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  logo.value = file;
  logoPreview.value = URL.createObjectURL(file);
  removeLogoFlag.value = false;
};

const removeLogo = () => {
  logo.value = null;
  logoPreview.value = defaultAvatar;
  removeLogoFlag.value = true;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const buildFormData = () => {
  const formData = new FormData();
  formData.append("name", teamName.value);
  if (foundedDate.value) {
    formData.append("foundedDate", foundedDate.value);
  }
  if (logo.value) {
    formData.append("logo", logo.value);
  }
  formData.append("removeLogo", String(removeLogoFlag.value));
  return formData;
};

const handleSubmit = () => {
  if (!teamName.value) {
    handlerStore.setError("لطفا نام تیم را وارد کنید");
    return;
  }
  teamStore.updateTeam(teamId.value, buildFormData()).then(() => {
    open.value = false;
    teamStore.getTeamById(teamId.value);
  });
};

const confirmDelete = () => {
  organizationId.value = teamDetail.value.organizationId;
  teamStore.deleteTeam(teamId.value).then(() => {
    navigateTo(`/profile/organization/${organizationId.value}`);
  });
};

// ─── Load team ────────────────────────────────────────────────────────

watch(teamDetail, (newValue) => {
  if (newValue && open.value) {
    fillForm(newValue);
  }
});

onMounted(() => {
  baseStore.getSeasons();
  teamStore.getTeamById(teamId.value);
});
</script>
