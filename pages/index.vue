<template>
  <div>test</div>
</template>

<script lang="ts" setup>
const app = useNuxtApp()

const state = reactive({ search: "", options: null })

const handleDropdownOk = (val: any) => {
  console.log(val)
}
</script>

<style lang="scss"></style>
