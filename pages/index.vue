<template>
  <div class="dashboard pt-10">
    <ChessBoard v-if="state.chessboard" @switch-side="handleSwitchSide" />
  </div>
</template>

<script setup lang="ts">
const state = reactive({
  chessboard: true,
})

const handleSwitchSide = () => {
  state.chessboard = false
  setTimeout(() => {
    state.chessboard = true
  }, 1)
}
</script>

<style scoped lang="scss">
.dashboard {
  @apply h-[100vh];
  background-image: url(~/assets/images/chess-bg.jpg);
}
</style>
