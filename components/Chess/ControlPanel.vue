<template>
  <div class="flex flex-col justify-end h-full">
    <div class="flex-grow overflow-y-auto max-h-[617px]">
      <ChessBook v-show="state.component === 0" />
      <ChessEngine v-show="state.component === 1" v-bind="engineProps" />
      <ChessCloud v-show="state.component === 2" />
      <ChessMoves v-show="state.component === 3" />
    </div>
    <div class="flex">
      <UButton
        :color="state.component === 0 ? 'amber' : 'gray'"
        size="xl"
        variant="solid"
        label="BOOK"
        class="flex-grow"
        @click="state.component = 0"
      />
      <UButton
        :color="state.component === 1 ? 'amber' : 'gray'"
        size="xl"
        variant="solid"
        label="ENGINE"
        class="flex-grow"
        @click="state.component = 1"
      />
      <UButton
        :color="state.component === 2 ? 'amber' : 'gray'"
        size="xl"
        variant="solid"
        label="CLOUD"
        class="flex-grow"
        @click="state.component = 2"
      />
      <UButton
        :color="state.component === 3 ? 'amber' : 'gray'"
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
const attr = useAttrs()
const engineProps = computed(() => {
  return attr.engine
})

const state = reactive({
  component: 0,
})
</script>
