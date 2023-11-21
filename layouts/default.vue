<template>
  <div class="">
    <slot />
  </div>
</template>

<script setup lang="ts">
const app = useNuxtApp()
const colorMode = useColorMode()
colorMode.preference = "light"
</script>
