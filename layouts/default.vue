<template>
  <CommonHeader />
  <div class="mx-auto pt-10 pb-[200px]">
    <slot />
  </div>
</template>

<script setup lang="ts">
const app = useNuxtApp()
</script>
