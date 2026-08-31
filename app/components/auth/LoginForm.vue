<script setup lang="ts">
defineEmits<{ (e: "switch"): void }>();

const showPassword = ref(false);
</script>

<template>
  <Card class="w-full shadow-xs! rounded-4xl">
    <CardHeader class="flex flex-col gap-2 justify-center items-center">
      <CardTitle class="text-lg font-bold">خوش آمدید</CardTitle>
      <CardDescription>وارد حساب کاربری خود شوید</CardDescription>
    </CardHeader>

    <CardContent class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <Label class="text-gray-600 text-xs" for="login-identifier">شماره موبایل یا ایمیل</Label>
        <Input class="custom-input-focus" id="login-identifier" type="text" />
      </div>

      <div class="flex flex-col gap-1">
        <Label class="text-gray-600 text-xs" for="login-password">رمز عبور</Label>
        <div class="relative">
          <Input
            class="custom-input-focus pe-9"
            id="login-password"
            :type="showPassword ? 'text' : 'password'"
          />
          <button
            type="button"
            class="absolute inset-y-0 inset-e-0 flex items-center px-3 text-gray-500 hover:text-cyan-700"
            :aria-label="showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'"
            @click="showPassword = !showPassword"
          >
            <icon-view-off v-if="showPassword" class="size-4" />
            <icon-view v-else class="size-4" />
          </button>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex flex-col gap-3">
      <Button class="w-full bg-cyan-700 flex justify-center items-center gap-2">
          <div>ورود</div>
          <icon-login class="size-5"/>
      </Button>
      <Button class="w-full text-xs" variant="link" @click="$emit('switch')">
          <span>
              حساب کاربری ندارید؟
          </span>
          <span class="text-cyan-500 font-bold">
              ثبت نام کنید
          </span>
      </Button>
    </CardFooter>
  </Card>
</template>
