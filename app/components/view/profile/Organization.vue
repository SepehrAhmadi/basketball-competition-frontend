<template>
    <div>
        <div class="flex justify-between items-center gap-2">
            <div class="flex items-center gap-2">
                <icon-building
                    class="size-3.75 text-gray-500 dark:text-gray-300"
                />
                <div class="text-[13px] text-gray-500 dark:text-gray-300">
                    سازمان ها
                </div>
            </div>
            <div>
                <Button
                    class="w-full text-[13px]"
                    size="sm"
                    @click="openDrawer('add')"
                >
                    ثبت سازمان
                </Button>
            </div>
        </div>
        <Card
            v-if="organizationList.length > 0"
            v-for="organization in organizationList"
            :key="organization.id"
            class="w-full shadow-xs! rounded-4xl gap-4 py-3"
        >
            <CardContent class="px-3">
                <div class="flex justify-start items-center gap-1">
                    <div class="w-full flex justify-start items-center gap-2">
                        <div
                            class="w-15 h-15 bg-primary rounded-full border border-gray-300 mb-2"
                        ></div>
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
                        <div class="flex justify-between items-center">
                            <Button
                                variant="ghost"
                                class="px-2.5!"
                                aria-label="ویرایش سازمان"
                                @click="openDrawer('edit', organization.id)"
                            >
                                <icon-edit class="size-4.5" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger as-child>
                                    <Button
                                        @click="
                                            openDeleteDialog(organization.id)
                                        "
                                        variant="ghost"
                                        class="px-2.5!"
                                        aria-label="حذف سازمان"
                                    >
                                        <icon-trash class="size-5" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle
                                            >حذف سازمان</AlertDialogTitle
                                        >
                                        <AlertDialogDescription>
                                            آیا از حذف «{{ organization.name }}»
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
                                            @click="confirmDelete()"
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
                    <DrawerTitle>{{
                        mode === "add" ? "ثبت سازمان" : "ویرایش سازمان"
                    }}</DrawerTitle>
                    <DrawerDescription>{{
                        mode === "add"
                            ? "اطلاعات سازمان جدید را وارد کنید"
                            : "اطلاعات سازمان را ویرایش کنید"
                    }}</DrawerDescription>
                </DrawerHeader>

                <div class="flex flex-col gap-4 px-4">
                    <div class="flex flex-col gap-1">
                        <Label class="text-gray-600 text-xs" for="org-name"
                            >نام سازمان</Label
                        >
                        <Input
                            v-model="name"
                            id="org-name"
                            type="text"
                            aria-label="نام سازمان"
                            class="custom-input-focus text-[14px]"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label
                            class="text-gray-600 text-xs"
                            for="org-description"
                            >توضیحات</Label
                        >
                        <shadcnTextarea
                            v-model="description"
                            aria-label="توضیحات سازمان"
                            class="custom-input-focus text-[14px]"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label class="text-gray-600 text-xs" for="org-city"
                            >شهر</Label
                        >
                        <Input
                            v-model="city"
                            id="org-city"
                            type="text"
                            aria-label="شهر"
                            class="custom-input-focus text-[14px]"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <Label class="text-gray-600 text-xs" for="org-phone"
                            >تلفن</Label
                        >
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
                        <Label class="text-gray-600 text-xs" for="org-email"
                            >ایمیل</Label
                        >
                        <Input
                            v-model="email"
                            id="org-email"
                            type="email"
                            inputmode="email"
                            aria-label="ایمیل"
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
import shadcnTextarea from "~/components/ui/textarea/Textarea.vue";
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

const page = ref(1);
const pageSize = 3;
const pageCount = computed(() =>
    Math.ceil((organizationListMeta.value?.total ?? 0) / pageSize),
);

const open = ref(false);
const mode = ref<"add" | "edit">("add");

const organizationId = ref<number | undefined>();
const name = ref("");
const description = ref("");
const city = ref("");
const phone = ref("");
const email = ref("");

const openDrawer = (value: "add" | "edit", id?: number) => {
    mode.value = value;
    if (id) {
        organizationId.value = id;
    }
    if (mode.value == "edit") {
        organizationStore.getOrganizationById(id as number);
    } else {
        resetForm();
    }
    open.value = true;
};

const resetForm = () => {
    organizationId.value = undefined;
    name.value = "";
    description.value = "";
    city.value = "";
    phone.value = "";
    email.value = "";
};

const openDeleteDialog = (id: number) => {
    organizationId.value = id;
};

const confirmDelete = () => {
    if (organizationId.value) {
        organizationStore.deleteOrganization(organizationId.value).then(() => {
            loadOrganizations();
            open.value = false;
            resetForm();
        });
    }
};

const handleSubmit = () => {
    if (mode.value == "add") {
        organizationStore
            .createOrganization({
                name: name.value,
                description: description.value,
                city: city.value,
                phone: String(phone.value),
                email: email.value,
            })
            .then(() => {
                loadOrganizations();
                open.value = false;
                resetForm();
            });
    } else {
        organizationStore
            .updateOrganization(organizationId.value as number, {
                name: name.value,
                description: description.value,
                city: city.value,
                phone: String(phone.value),
                email: email.value,
            })
            .then(() => {
                loadOrganizations();
                open.value = false;
                resetForm();
            });
    }
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

watch(organizationDetail, (newValue) => {
    if (newValue) {
        name.value = newValue.name;
        description.value = newValue.description;
        city.value = newValue.city;
        phone.value = String(newValue.phone);
        email.value = newValue.email;
    }
});

onMounted(() => {
    loadOrganizations();
});
</script>
