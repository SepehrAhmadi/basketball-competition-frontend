<template>
    <div>
        <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4">
            <CardContent class="tw-py-2">
                <div class="flex justify-start items-center gap-1">
                    <div class="w-full flex justify-start items-start gap-3">
                        <div
                            class="w-full tw-flex-1 flex justify-start items-center gap-3"
                        >
                            <div
                                class="shrink-0 w-20 h-20 rounded-full border border-gray-300 bg-primary"
                            >
                                <img
                                    v-if="organizationDetail?.logoUrl"
                                    :src="organizationDetail.logoUrl"
                                    alt="لوگوی سازمان"
                                    class="object-cover w-full h-full rounded-full"
                                />
                                <img
                                    v-else
                                    :src="building"
                                    alt="لوگوی سازمان"
                                    class="object-cover w-full h-full p-4"
                                />
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="text-[15px]">
                                    {{ organizationDetail?.name }}
                                </div>
                                <div
                                    class="text-[13px] text-gray-600 dark:text-gray-300"
                                >
                                    {{ organizationDetail?.city }}
                                </div>
                                <div
                                    class="text-[13px] text-gray-600 dark:text-gray-300"
                                >
                                    {{ organizationDetail?.email }}
                                </div>
                                <div
                                    class="text-[13px] text-gray-600 dark:text-gray-300"
                                >
                                    {{ organizationDetail?.phone }}
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end items-start">
                            <div class="flex gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger as-child>
                                        <Button
                                            class="text-[12px]"
                                            size="sm"
                                            variant="outline"
                                            aria-label="حذف سازمان"
                                        >
                                            <icon-trash class="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle
                                                >حذف سازمان</AlertDialogTitle
                                            >
                                            <AlertDialogDescription>
                                                آیا از حذف «{{
                                                    organizationDetail?.name
                                                }}»
                                                مطمئن هستید؟ این عمل قابل بازگشت
                                                نیست.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                >انصراف</AlertDialogCancel
                                            >
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
                                    aria-label="ویرایش سازمان"
                                    @click="openDrawer"
                                >
                                    <icon-edit class="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-if="organizationDetail?.description"
                    class="w-full text-[13px] text-gray-600 dark:text-gray-300 mt-2 text-justify"
                >
                    {{ organizationDetail.description }}
                </div>
                <div class="w-full mt-4">
                    <Button
                        class="w-full px-4 text-[13px]"
                        size="sm"
                        aria-label="ثبت تیم"
                        @click="openTeamDrawer"
                    >
                        <icon-plus class="size-5" />
                        ثبت تیم
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Drawer v-model:open="open">
            <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
                <DrawerHeader>
                    <DrawerTitle>ویرایش سازمان</DrawerTitle>
                    <DrawerDescription
                        >اطلاعات سازمان را ویرایش کنید</DrawerDescription
                    >
                </DrawerHeader>

                <div class="flex flex-col gap-4 px-4">
                    <div class="flex justify-start items-center gap-5">
                        <div
                            class="w-20 h-20 rounded-full border border-gray-300 mb-2"
                        >
                            <img
                                :src="logoPreview"
                                alt="لوگوی سازمان"
                                class="object-cover w-full h-full rounded-full p-1.25"
                            />
                        </div>
                        <div>
                            <div class="flex flex-col gap-2 mb-2">
                                <div
                                    class="text-gray-600 dark:text-gray-400 text-xs"
                                >
                                    تصویر را در ابعاد مربعی انتخاب کنید
                                </div>
                                <div
                                    class="text-gray-600 dark:text-gray-400 text-xs"
                                >
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

        <Drawer v-model:open="teamDrawerOpen">
            <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
                <DrawerHeader>
                    <DrawerTitle>ثبت تیم</DrawerTitle>
                    <DrawerDescription
                        >اطلاعات تیم جدید را وارد کنید</DrawerDescription
                    >
                </DrawerHeader>

                <div class="flex flex-col gap-4 px-4">
                    <div class="flex justify-start items-center gap-5">
                        <div
                            class="w-20 h-20 rounded-full border border-gray-300 mb-2"
                        >
                            <img
                                :src="teamLogoPreview"
                                alt="لوگوی تیم"
                                class="object-cover w-full h-full rounded-full p-1.25"
                            />
                        </div>
                        <div>
                            <div class="flex flex-col gap-2 mb-2">
                                <div
                                    class="text-gray-600 dark:text-gray-400 text-xs"
                                >
                                    تصویر را در ابعاد مربعی انتخاب کنید
                                </div>
                                <div
                                    class="text-gray-600 dark:text-gray-400 text-xs"
                                >
                                    فرمت عکس باید PNG یا JPG باشد
                                </div>
                            </div>
                            <input
                                ref="teamFileInputRef"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                class="hidden"
                                aria-label="انتخاب لوگوی تیم"
                                @change="handleTeamLogoChange"
                            />
                            <div class="flex items-center gap-2">
                                <Button
                                    class="text-[12px]"
                                    size="sm"
                                    aria-label="انتخاب لوگوی تیم"
                                    @click="teamFileInputRef?.click()"
                                >
                                    انتخاب تصویر
                                </Button>
                                <Button
                                    v-if="teamHasLogo"
                                    class="text-[12px] bg-red-500 hover:bg-red-500/90 dark:bg-red-600 dark:hover:bg-red-600/90"
                                    size="sm"
                                    aria-label="حذف لوگوی تیم"
                                    @click="removeTeamLogo"
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
                            v-model="teamFoundedYear"
                            simple
                            type="year"
                            id="team-foundedYear"
                            format="jYYYY"
                            display-format="jYYYY"
                            class="default-scroll tw:text-gray-300! tw:text-[14px]! tw:text-center!"
                            color="#1d202e"
                        />
                    </div>
                </div>

                <DrawerFooter>
                    <Button @click="handleTeamSubmit">ثبت</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </div>
</template>

<script setup lang="ts">
import building from "../../../../assets/img/icon/building.png";
import defaultAvatar from "../../../../assets/img/avatar.png";
import { Textarea } from "~/components/ui/textarea";
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

import { useOrganizationStore } from "~/store/organization";
const organizationStore = useOrganizationStore();
const { organizationDetail } = storeToRefs(organizationStore);

import { useTeamStore } from "~/store/team";
const teamStore = useTeamStore();

import { useHandlerStore } from "~/store/handler";
const handlerStore = useHandlerStore();

const route = useRoute();
const organizationId = computed(() => String(route.params.slug));

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

const fillForm = (organization: {
    name?: string;
    description?: string;
    city?: string;
    phone?: string | number;
    email?: string;
    logoUrl?: string;
}) => {
    name.value = organization.name ?? "";
    description.value = organization.description ?? "";
    city.value = organization.city ?? "";
    phone.value = String(organization.phone ?? "");
    email.value = organization.email ?? "";
    logo.value = null;
    logoPreview.value = organization.logoUrl ?? defaultAvatar;
    removeLogoFlag.value = false;
    if (fileInputRef.value) {
        fileInputRef.value.value = "";
    }
};

const openDrawer = () => {
    if (organizationDetail.value) {
        fillForm(organizationDetail.value);
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
    if (!name.value || !city.value || !phone.value || !email.value) {
        handlerStore.setError("لطفا موارد الزامی را وارد کنید");
        return;
    }
    organizationStore
        .updateOrganization(organizationId.value, buildFormData())
        .then(() => {
            open.value = false;
            organizationStore.getOrganizationById(organizationId.value);
        });
};

const confirmDelete = () => {
    organizationStore.deleteOrganization(organizationId.value).then(() => {
        navigateTo("/profile");
    });
};

watch(organizationDetail, (newValue) => {
    if (newValue) {
        fillForm(newValue);
    }
});

onMounted(() => {
    organizationStore.getOrganizationById(organizationId.value);
});

// ─── Team creation ────────────────────────────────────────────────────

const teamDrawerOpen = ref(false);
const teamName = ref("");
const teamFoundedYear = ref("");
const teamFileInputRef = ref<HTMLInputElement | null>(null);
const teamLogo = ref<File | null>(null);
const teamLogoPreview = ref<string>(defaultAvatar);
const teamRemoveLogoFlag = ref(false);
const teamHasLogo = computed(() => teamLogoPreview.value !== defaultAvatar);

const openTeamDrawer = () => {
    resetTeamForm();
    teamDrawerOpen.value = true;
};

const resetTeamForm = () => {
    teamName.value = "";
    teamFoundedYear.value = "";
    teamLogo.value = null;
    teamLogoPreview.value = defaultAvatar;
    teamRemoveLogoFlag.value = false;
    if (teamFileInputRef.value) {
        teamFileInputRef.value.value = "";
    }
};

const handleTeamLogoChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    teamLogo.value = file;
    teamLogoPreview.value = URL.createObjectURL(file);
    teamRemoveLogoFlag.value = false;
};

const removeTeamLogo = () => {
    teamLogo.value = null;
    teamLogoPreview.value = defaultAvatar;
    teamRemoveLogoFlag.value = true;
    if (teamFileInputRef.value) {
        teamFileInputRef.value.value = "";
    }
};

const buildTeamFormData = () => {
    const formData = new FormData();
    formData.append("name", teamName.value);
    formData.append("organizationId", organizationId.value);
    if (teamFoundedYear.value) {
        formData.append("foundedYear", teamFoundedYear.value);
    }
    if (teamLogo.value) {
        formData.append("logo", teamLogo.value);
    }
    formData.append("removeLogo", String(teamRemoveLogoFlag.value));
    return formData;
};

const handleTeamSubmit = () => {
    if (!teamName.value) {
        handlerStore.setError("لطفا نام تیم را وارد کنید");
        return;
    }
    teamStore.createTeam(buildTeamFormData()).then(() => {
        teamDrawerOpen.value = false;
        resetTeamForm();
        teamStore.getTeams({
            organizationId: organizationId.value,
            page: 1,
            pageSize: 10,
        });
    });
};
</script>
