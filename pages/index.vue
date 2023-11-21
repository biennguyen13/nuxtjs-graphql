<template>
  <div class="dashboard pt-10">
    <ChessBoard />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.dashboard {
  @apply h-[100vh];
  background-image: url(~/assets/images/chess-bg.jpg);
}
</style>
