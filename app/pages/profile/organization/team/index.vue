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
                                :src="teamAvatar"
                                alt="avatar"
                                class="object-cover w-full h-full rounded-full p-2"
                            />
                        </div>
                        <div
                            class="w-full tw-flex-1 flex justify-between items-start"
                        >
                            <div class="flex flex-col gap-1">
                                <div class="text-[16px]">
                                    تیم نوجوانان طبیعت
                                </div>
                                <div
                                    class="text-[14px] text-gray-600 dark:text-gray-300"
                                >
                                    نوجوانان | زیر 16 سال
                                </div>
                                <div
                                    class="text-[14px] text-gray-600 dark:text-gray-300"
                                >
                                    سازمان : طبیعت
                                </div>
                            </div>
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
                <div class="w-full mt-5 flex flex-col gap-1">
                    <Select dir="rtl">
                        <SelectTrigger
                            id="coach-degree"
                            class="w-full custom-input-focus px-2 shadow-xs"
                            aria-label="انتخاب درجه مربی‌گری"
                        >
                            <SelectValue placeholder="فصل" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                            <SelectGroup>
                                <SelectItem class="px-3"> </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div class="flex items-center gap-2 ms-1">
                        <div class="bg-cyan-500 dark:bg-gray-400 w-0.75 h-0.75"></div>
                        <p class="text-cyan-500 dark:text-gray-400 text-[11px]">
                            برای مشاهده اعضا ابتدا فصل را انتخاب کنید
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- No selected season -->
        <div class="mt-8">
            <div class="flex flex-col justify-center items-center gap-1">
                <icon-date class="w-8 h-8 text-gray-500 dark:text-gray-300 mb-1" />
                <p class="text-gray-500 dark:text-gray-300 text-[15px]">فصل را انتخاب کنید</p>
                <p class="text-gray-500 dark:text-gray-300 text-[13px]">برای مشاهده اعضای تیم ابتدا فصل مور دنظر را انتخاب کنید</p>
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import teamAvatar from "../../../../assets/img/icon/team.png";
</script>
