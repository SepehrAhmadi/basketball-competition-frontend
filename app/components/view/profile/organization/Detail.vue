<template>
    <div>
        <Card class="w-full shadow-xs! rounded-4xl py-5 gap-4">
            <CardContent class="tw-py-2">
                <div class="flex justify-start items-center gap-1">
                    <div class="w-full flex justify-start items-ceneter gap-3">
                        <div
                            class="w-full tw-flex-1 flex justify-start items-center gap-3"
                        >
                            <div
                                class="shrink-0 w-20 h-20 rounded-full border border-gray-300 bg-primary"
                            >
                                <img
                                    :src="building"
                                    alt="avatar"
                                    class="object-cover w-full h-full p-4"
                                />
                            </div>
                            <div class="flex flex-col gap-1">
                                <div class="text-[15px]">
                                    باشگاه ورزشی طبیعت
                                </div>
                                <div
                                    class="text-[13px] text-gray-600 dark:text-gray-300"
                                >
                                    تهران
                                </div>
                                <div
                                    class="text-[13px] text-gray-600 dark:text-gray-300"
                                >
                                    tabiat@info.com
                                </div>
                                <div
                                    class="text-[13px] text-gray-600 dark:text-gray-300"
                                >
                                    02133445566
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between items-start">
                            <div class="flex gap-2">
                                <Button
                                    class="text-[12px]"
                                    size="sm"
                                    variant="outline"
                                    aria-label="حذف تیم"
                                >
                                    <icon-trash class="size-4" />
                                </Button>
                                <Button
                                    class="text-[12px]"
                                    size="sm"
                                    variant="outline"
                                    aria-label="ویرایش تیم"
                                >
                                    <icon-edit class="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="w-full text-[13px] text-gray-600 dark:text-gray-300 mt-2 text-justify"
                >
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و
                    با استفاده از طراحان گرافیک است
                </div>
                <div class="w-full mt-4">
                    <Button
                        class="w-full px-4 text-[13px]"
                        size="sm"
                        aria-label="ویرایش پروفایل"
                    >
                        <icon-plus class="size-5 text-white" />
                        ثبت تیم
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import building from "../../../../assets/img/icon/building.png";
</script>
