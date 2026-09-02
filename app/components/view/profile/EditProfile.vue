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
                                :src="avatar"
                                alt="avatar"
                                class="object-cover w-full h-full rounded-full p-1.25"
                            />
                        </div>
                    </div>
                    <div class="text-[16px]">سپهر احمدی</div>
                    <div class="text-[14px] text-gray-600 dark:text-gray-300">09335107437</div>
                    <Button class="mt-2 px-4" size="sm">
                        <icon-edit class="size-3.75" />
                        ویرایش پرافایل
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import avatar from "../../../assets/img/avatar.png";
</script>
