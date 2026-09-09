<template>
  <div>
    <div class="flex justify-between items-center gap-2 mb-2">
      <div class="flex items-center gap-2">
        <icon-building class="size-3.75 text-gray-500 dark:text-gray-300" />
        <div class="text-[13px] text-gray-500 dark:text-gray-300">
          سازمان ها
        </div>
      </div>
      <div>
        <Button class="w-full text-[13px]" size="sm" @click="openDrawer()">
          ثبت سازمان
        </Button>
      </div>
    </div>
    <Card
      v-if="organizationList.length > 0"
      v-for="organization in organizationList"
      :key="organization.id"
      class="w-full shadow-xs! rounded-4xl gap-4 py-3 mb-2"
    >
      <CardContent class="px-3">
        <div class="flex justify-start items-center gap-1">
          <div class="w-full flex justify-start items-center gap-2">
            <div
              class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2"
            >
              <img
                v-if="organization.logoUrl"
                :src="organization.logoUrl"
                class="w-full h-full object-cover rounded-full"
                alt="logo"
              />
              <img
                v-else
                :src="teamLogo"
                class="w-full h-full object-cover rounded-full p-1.5"
                alt="logo"
              />
            </div>
            <div
              class="shrink w-full flex-1 flex justify-between items-center gap-4"
            >
              <div>
                <div class="text-[14px] font-semibold">
                  {{ organization.name }}
                </div>
                <div
                  class="text-[12px] text-gray-600 dark:text-gray-400 font-semibold line-clamp-1"
                >
                  {{ organization.description }}
                </div>
              </div>
            </div>
            <NuxtLink
              :to="`/profile/organization/${organization.id}`"
              class="flex items-center gap-1 text-[14px] font-semibold text-primary shrink-0"
              aria-label="مشاهده سازمان"
            >
              <div>مشاهده</div>
              <icon-arrow-left class="text-[17px]" />
            </NuxtLink>
          </div>
        </div>
      </CardContent>
    </Card>

    <Pagination
      v-if="pageCount > 1"
      v-model:page="page"
      :items-per-page="pageSize"
      :total="organizationListMeta?.total ?? 0"
      :sibling-count="1"
      show-edges
      class="mt-4"
      aria-label="صفحه‌بندی سازمان‌ها"
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

    <Drawer v-model:open="open">
      <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle>ثبت سازمان</DrawerTitle>
          <DrawerDescription
            >اطلاعات سازمان جدید را وارد کنید</DrawerDescription
          >
        </DrawerHeader>

        <div class="flex flex-col gap-4 px-4">
          <div class="flex justify-start items-center gap-5">
            <div class="w-20 h-20 rounded-full border border-gray-300 mb-2">
              <img
                :src="logoPreview"
                alt="لوگوی سازمان"
                class="object-cover w-full h-full rounded-full p-1.25"
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
                aria-label="انتخاب لوگوی سازمان"
                @change="handleLogoChange"
              />
              <div class="flex items-center gap-2">
                <Button
                  class="text-[12px]"
                  size="sm"
                  aria-label="انتخاب لوگوی سازمان"
                  @click="triggerFileInput"
                >
                  انتخاب تصویر
                </Button>
                <Button
                  v-if="hasLogo"
                  class="text-[12px] bg-red-500 hover:bg-red-500/90 dark:bg-red-600 dark:hover:bg-red-600/90"
                  size="sm"
                  aria-label="حذف لوگوی سازمان"
                  @click="removeLogo"
                >
                  <icon-trash class="text-white size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel :is-required="true" label="نام سازمان" />
            <Input
              v-model="name"
              id="org-name"
              type="text"
              aria-label="نام سازمان"
              class="custom-input-focus text-[14px]"
            />
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="شهر" :is-required="true" />
            <Input
              v-model="city"
              id="org-city"
              type="text"
              aria-label="شهر"
              class="custom-input-focus text-[14px]"
            />
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="تلفن" :is-required="true" />
            <Input
              v-model="phone"
              id="org-phone"
              type="number"
              inputmode="tel"
              aria-label="تلفن"
              class="custom-input-focus text-[14px]"
              dir="rtl"
            />
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="ایمیل" :is-required="true" />
            <Input
              v-model="email"
              id="org-email"
              type="email"
              inputmode="email"
              aria-label="ایمیل"
              class="custom-input-focus text-[14px]"
            />
          </div>

          <div class="flex flex-col gap-1">
            <CustomLabel label="توضیحات" />
            <Textarea
              v-model="description"
              aria-label="توضیحات سازمان"
              class="custom-input-focus text-[14px]"
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
import { Textarea } from "~/components/ui/textarea";
import defaultAvatar from "../../../assets/img/avatar.png";
import teamLogo from "../../../assets/img/icon/team.png";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

import { useOrganizationStore } from "~/store/organization";
const organizationStore = useOrganizationStore();
const { organizationList, organizationListMeta, organizationDetail } =
  storeToRefs(organizationStore);

const open = ref(false);
const name = ref("");
const description = ref("");
const city = ref("");
const phone = ref("");
const email = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);
const logo = ref<File | null>(null);
const logoPreview = ref<string>(defaultAvatar);
const removeLogoFlag = ref(false);
const hasLogo = computed(() => logoPreview.value !== defaultAvatar);

const page = ref(1);
const pageSize = 3;
const pageCount = computed(() =>
  Math.ceil((organizationListMeta.value?.total ?? 0) / pageSize),
);

const openDrawer = () => {
  resetForm();
  open.value = true;
};

const resetForm = () => {
  name.value = "";
  description.value = "";
  city.value = "";
  phone.value = "";
  email.value = "";
  logo.value = null;
  logoPreview.value = defaultAvatar;
  removeLogoFlag.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
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
  formData.append("name", name.value);
  formData.append("description", description.value);
  formData.append("city", city.value);
  formData.append("phone", String(phone.value));
  formData.append("email", email.value);
  if (logo.value) {
    formData.append("logo", logo.value);
  }
  formData.append("removeLogo", String(removeLogoFlag.value));
  return formData;
};

const handleSubmit = () => {
  organizationStore.createOrganization(buildFormData()).then(() => {
    loadOrganizations();
    open.value = false;
    resetForm();
  });
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const loadOrganizations = () => {
  return organizationStore.getOrganizations({
    page: page.value,
    pageSize,
  });
};

watch(page, () => {
  loadOrganizations();
});

watch(pageCount, (newPageCount) => {
  if (newPageCount > 0 && page.value > newPageCount) {
    page.value = newPageCount;
  }
});

onMounted(() => {
  loadOrganizations();
});
</script>
