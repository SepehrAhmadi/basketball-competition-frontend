<script setup lang="ts">
import { useAuthStore } from "~/store/auth";
import { useHandlerStore } from "~/store/handler";
import { useBaseStore } from "~/store/base";

const authStore = useAuthStore();
const handlerStore = useHandlerStore();
const baseStore = useBaseStore();
const { roles: rolesList } = storeToRefs(baseStore);

defineEmits<{ (e: "switch"): void }>();

const showPassword = ref(false);

const fullName = ref("");
const phone = ref("");
const email = ref("");
const password = ref("");
const roles = ref([]);

const submit = () => {
    const selectedRoles = roles.value.map((role: any) => role.value);
    authStore.register({
        fullName: fullName.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
        roles: selectedRoles,
    });
};

onMounted(() => {
    baseStore.getRoles();
});
</script>

<template>
    <Card class="w-full shadow-xs! rounded-4xl">
        <CardHeader class="flex flex-col gap-2 justify-center items-center">
            <CardTitle class="text-lg font-bold">ثبت‌نام</CardTitle>
            <CardDescription>یک حساب کاربری جدید بسازید</CardDescription>
        </CardHeader>

        <CardContent class="flex flex-col gap-4">
            <!-- full name -->
            <div class="flex flex-col gap-1">
                <Label class="text-gray-600 text-xs" for="register-fullname"
                    >نام و نام خانوادگی</Label
                >
                <Input
                    v-model="fullName"
                    class="custom-input-focus"
                    id="register-fullname"
                    type="text"
                />
            </div>

            <!-- phone   -->
            <div class="flex flex-col gap-1">
                <Label class="text-gray-600 text-xs" for="register-identifier"
                    >شماره موبایل
                </Label>
                <Input
                    v-model="phone"
                    class="custom-input-focus"
                    id="register-identifier"
                    type="text"
                />
            </div>

            <!-- email   -->
            <div class="flex flex-col gap-1">
                <Label class="text-gray-600 text-xs" for="register-identifier"
                    >ایمیل</Label
                >
                <Input
                    v-model="email"
                    class="custom-input-focus"
                    id="register-identifier"
                    type="text"
                />
            </div>

            <!-- password -->
            <div class="flex flex-col gap-1">
                <Label class="text-gray-600 text-xs" for="register-password"
                    >رمز عبور</Label
                >
                <div class="relative">
                    <Input
                        v-model="password"
                        class="custom-input-focus pe-9"
                        id="register-password"
                        :type="showPassword ? 'text' : 'password'"
                    />
                    <button
                        type="button"
                        class="absolute inset-y-0 inset-e-0 flex items-center px-3 text-gray-500 hover:text-cyan-700"
                        :aria-label="
                            showPassword
                                ? 'مخفی کردن رمز عبور'
                                : 'نمایش رمز عبور'
                        "
                        @click="showPassword = !showPassword"
                    >
                        <icon-view-off v-if="showPassword" class="size-4" />
                        <icon-view v-else class="size-4" />
                    </button>
                </div>
            </div>

            <!-- roles -->
            <div class="flex flex-col gap-1">
                <Label class="text-gray-600 text-xs" for="register-roles"
                    >نقش ها</Label
                >
                <Combobox
                    v-model="roles"
                    multiple
                    by="label"
                    for="register-roles"
                    class="rtl"
                    dir="rtl"
                >
                    <ComboboxAnchor as-child class="rtl">
                        <ComboboxTrigger as-child>
                            <Button
                                variant="outline"
                                class="w-full! justify-between"
                            >
                                <span
                                    v-if="roles.length > 0"
                                    class="truncate text-gray-700 text-[14px]"
                                >
                                    {{
                                        roles
                                            .map((role: any) => role.label)
                                            .join(", ")
                                    }}
                                </span>
                                <span
                                    v-if="roles.length <= 0"
                                    class="truncate text-gray-700 text-[12px]"
                                >
                                    انتخاب نقش
                                </span>
                                <ChevronsUpDownIcon class="opacity-50" />
                            </Button>
                        </ComboboxTrigger>
                    </ComboboxAnchor>
                    <ComboboxList class="w-full" align="start">
                        <ComboboxInput dir="rtl" placeholder="جستجو نقش" />
                        <ComboboxEmpty dir="rtl">نقشی یافت نشد.</ComboboxEmpty>
                        <ComboboxGroup dir="rtl">
                            <ComboboxItem
                                v-for="role in rolesList"
                                :key="role.value"
                                :value="role"
                            >
                                <div
                                    class="border-input data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground pointer-events-none size-4 shrink-0 rounded-[4px] border transition-all select-none *:[svg]:opacity-0 data-[selected=true]:*:[svg]:opacity-100"
                                    :data-selected="
                                        roles.some(
                                            (f: any) => f.value === role.value,
                                        )
                                    "
                                >
                                    <CheckIcon class="size-3.5" />
                                </div>
                                {{ role.label }}
                            </ComboboxItem>
                        </ComboboxGroup>
                    </ComboboxList>
                </Combobox>
            </div>
        </CardContent>

        <CardFooter class="flex flex-col gap-3">
            <Button
                @click="submit"
                class="w-full bg-cyan-700 flex justify-center items-center gap-2"
            >
                <div>ثبت‌نام</div>
                <icon-user-add class="size-5" />
            </Button>
            <Button
                class="w-full text-xs"
                variant="link"
                @click="$emit('switch')"
            >
                <span> قبلاً حساب دارید؟ </span>
                <span class="text-cyan-500 font-bold"> ورود </span>
            </Button>
        </CardFooter>
    </Card>
</template>
