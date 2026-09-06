<template>
    <div class="mt-2">
        <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4">
            <CardHeader class="flex gap-2 justify-start items-center px-5">
                <icon-user class="size-3.75 text-gray-500 dark:text-gray-300" />
                <CardTitle class="text-[13px] text-gray-500 dark:text-gray-300"
                    >ویرایش پروفایل</CardTitle
                >
            </CardHeader>

            <CardContent class="tw-py-2">
                <div class="flex flex-col justify-center items-center gap-1">
                    <div class="flex justify-start items-ceneter">
                        <div
                            class="w-20 h-20 rounded-full border border-gray-300 mb-2"
                        >
                            <img
                                :src="avatarPreview"
                                alt="avatar"
                                class="object-cover w-full h-full rounded-full p-1.25"
                            />
                        </div>
                    </div>
                    <div class="text-[16px]">
                        {{ userProfile?.fullName || "نام کاربر" }}
                    </div>
                    <div class="text-[14px] text-gray-600 dark:text-gray-300">
                        {{ userProfile?.phone || "-" }}
                    </div>
                    <div class="flex justify-center items-center gap-2 mt-2">
                        <Button
                            class="px-4"
                            size="sm"
                            aria-label="ویرایش پروفایل"
                            @click="openEditDrawer"
                        >
                            <icon-edit class="size-3.75" />
                            ویرایش پرافایل
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Drawer v-model:open="open">
            <DrawerContent class="h-screen max-h-screen mt-0 rounded-none">
                <DrawerHeader>
                    <DrawerTitle>ویرایش پروفایل</DrawerTitle>
                    <DrawerDescription
                        >اطلاعات پروفایل خود را ویرایش کنید</DrawerDescription
                    >
                </DrawerHeader>

                <div class="flex flex-col gap-4 px-4">
                    <div class="flex justify-start items-center gap-5">
                        <div
                            class="w-20 h-20 rounded-full border border-gray-300 mb-2"
                        >
                            <img
                                :src="avatarPreview"
                                alt="avatar"
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
                                aria-label="انتخاب تصویر پروفایل"
                                @change="handleAvatarChange"
                            />
                            <div class="flex items-center gap-2">
                                <Button
                                    class="text-[12px]"
                                    size="sm"
                                    aria-label="انتخاب تصویر پروفایل"
                                    :disabled="handlerStore.loadingBtn"
                                    @click="triggerFileInput"
                                >
                                    انتخاب تصویر
                                </Button>
                                <Button
                                    v-if="hasAvatar"
                                    class="text-[12px] bg-red-500 hover:bg-red-500/90 dark:bg-red-600 dark:hover:bg-red-600/90"
                                    size="sm"
                                    aria-label="حذف تصویر پروفایل"
                                    :disabled="handlerStore.loadingBtn"
                                    @click="removeAvatar"
                                >
                                    <icon-trash class="text-white size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label
                            class="text-gray-600 text-xs"
                            for="profile-fullName"
                            >نام و نام خانوادگی</Label
                        >
                        <Input
                            v-model="fullName"
                            id="profile-fullName"
                            type="text"
                            aria-label="نام و نام خانوادگی"
                            class="custom-input-focus text-[14px]"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label class="text-gray-600 text-xs" for="profile-phone"
                            >تلفن همراه</Label
                        >
                        <Input
                            v-model="phone"
                            id="profile-phone"
                            type="tel"
                            inputmode="tel"
                            aria-label="تلفن همراه"
                            class="custom-input-focus text-[14px]"
                            dir="rtl"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label class="text-gray-600 text-xs" for="profile-email"
                            >ایمیل</Label
                        >
                        <Input
                            v-model="email"
                            id="profile-email"
                            type="email"
                            inputmode="email"
                            aria-label="ایمیل"
                            class="custom-input-focus text-[14px]"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label
                            class="text-gray-600 text-xs"
                            for="profile-birthDate"
                            >تاریخ تولد</Label
                        >
                        <date-picker
                            v-model="birthDate"
                            simple
                            id="profile-birthDate"
                            format="jYYYY/jMM/jDD"
                            display-format="jYYYY/jMM/jDD"
                            class="default-scroll tw:text-gray-300! tw:text-[14px]! tw:text-center!"
                            color="#1d202e"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label
                            class="text-gray-600 text-xs"
                            for="profile-nationalId"
                            >کد ملی</Label
                        >
                        <Input
                            v-model="nationalId"
                            id="profile-nationalId"
                            type="text"
                            inputmode="numeric"
                            aria-label="کد ملی"
                            maxlength="10"
                            class="custom-input-focus text-[14px]"
                            dir="rtl"
                        />
                    </div>
                </div>

                <DrawerFooter>
                    <Button
                        aria-label="ذخیره تغییرات پروفایل"
                        :disabled="handlerStore.loadingBtn"
                        @click="handleSubmit"
                        >ثبت</Button
                    >
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </div>
</template>

<script setup lang="ts">
import defaultAvatar from "../../../assets/img/avatar.png";
import { useHandlerStore } from "~/store/handler";
import { useUserStore } from "~/store/user";

const handlerStore = useHandlerStore();
const userStore = useUserStore();
const { userProfile } = storeToRefs(userStore);

const open = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string>(defaultAvatar);
const hasAvatar = ref(false);

const avatar = ref<File | null>(null);
const fullName = ref("");
const phone = ref("");
const email = ref("");
const birthDate = ref("");
const nationalId = ref("");

const populateForm = (profile: any) => {
    if (!profile) return;

    fullName.value = profile.fullName ?? "";
    phone.value = String(profile.phone ?? "");
    email.value = profile.email ?? "";
    birthDate.value = profile.birthDate ?? "";
    nationalId.value = String(profile.nationalId ?? "");
};

const updateAvatarPreview = (profile: any) => {
    if (profile?.avatarUrl) {
        avatarPreview.value = profile.avatarUrl;
        hasAvatar.value = true;
    } else {
        avatarPreview.value = defaultAvatar;
        hasAvatar.value = false;
    }
};

const openEditDrawer = () => {
    populateForm(userProfile.value);
    open.value = true;
};

const resetForm = () => {
    fullName.value = "";
    phone.value = "";
    email.value = "";
    birthDate.value = "";
    nationalId.value = "";
};

const handleSubmit = () => {
    userStore
        .updateUserMe({
            fullName: fullName.value,
            phone: String(phone.value),
            email: email.value,
            birthDate: birthDate.value,
            nationalId: String(nationalId.value),
        })
        .then(() => {
            open.value = false;
            resetForm();
        });
};

watch(userProfile, (newProfile) => {
    updateAvatarPreview(newProfile);
});

function triggerFileInput() {
    fileInputRef.value?.click();
}

async function handleAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    avatar.value = file;

    const formData = new FormData();
    formData.append("file", file);

    await userStore.uploadUserAvatar(formData).then(() => {
        userStore.getUserMe();
    });
}

async function removeAvatar() {
    await userStore.removeUserAvatar().then(() => {
        avatarPreview.value = defaultAvatar;
        hasAvatar.value = false;
    });
}

onMounted(() => {
    userStore.getUserMe();
});
</script>
