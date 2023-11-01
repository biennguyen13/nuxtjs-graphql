<template>
  <div class="flex flex-col justify-end h-full">
    <div class="flex-grow overflow-y-auto max-h-[553px]">
      <KeepAlive>
        <component :is="componentComputed" />
      </KeepAlive>
    </div>
    <div class="flex">
      <UButton
        color="gray"
        size="xl"
        variant="solid"
        label="BOOK"
        class="flex-grow"
        @click="state.component = 0"
      />
      <UButton
        color="gray"
        size="xl"
        variant="solid"
        label="ENGINE"
        class="flex-grow"
        @click="state.component = 1"
      />
      <UButton
        color="gray"
        size="xl"
        variant="solid"
        label="CLOUD"
        class="flex-grow"
        @click="state.component = 2"
      />
      <UButton
        color="gray"
        size="xl"
        variant="solid"
        label="MOVES"
        class="flex-grow"
        @click="state.component = 3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const state = reactive({
  component: 0,
})

const componentComputed = computed(() => {
  switch (state.component) {
    case 1:
      return resolveComponent("ChessBook")
    case 2:
      return resolveComponent("ChessCloud")
    case 3:
      return resolveComponent("ChessBook")
    default:
      return resolveComponent("ChessBook")
  }
})
</script>
