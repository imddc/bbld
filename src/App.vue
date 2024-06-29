<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="size-full bg-gray-50 text-gray-950 relative dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 z-0">
    <div
      class="bg-[#fbe2e3] absolute -z-10 top-[-6rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#5b3b3c]"
    />
    <div
      class="bg-[#dbd7fb] absolute -z-10 top-[-1rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#433f68]"
    />

    <RouterLink to="/">
      Index
    </RouterLink>
    <RouterLink to="/prepare">
      Prepare
    </RouterLink>

    <main class="py-6">
      <router-view #default="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>
