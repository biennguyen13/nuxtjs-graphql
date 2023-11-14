<template>
  <Teleport v-if="valid" to="body">
    <div :style="styles" class="fixed">
      <div :style="styles2" class="absolute top-0 left-0"></div>
      <div :style="styles3" class="absolute top-0 left-0"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  height: number
  width: number
  x: number
  y: number
  angle: number
  color: string
}>()

const styles = computed(() => {
  if (!valid.value) return {}

  return {
    transform: `rotate(${props.angle}deg)`,
    top: props.y + "px",
    left: props.x + "px",
  }
})

const styles2 = computed(() => {
  if (!valid.value) return {}

  return {
    height: props.height + "px",
    width: props.width - 40 + "px",
    backgroundColor: props.color,
    transform: "translate(20px, -50%)",
  }
})

const styles3 = computed(() => {
  if (!valid.value) return {}

  return {
    width: "0px",
    height: "0px",
    borderTop: `${props.height * 2}px solid transparent`,
    borderBottom: `${props.height * 2}px solid transparent`,
    borderLeft: `${props.height * 6}px solid ${props.color}`,
    transform: `translate(${props.width - 25}px, -${props.height * 2}px)`,
  }
})

const valid = computed(() => {
  return (
    props.height &&
    props.width &&
    props.x !== undefined &&
    props.y !== undefined &&
    props.angle !== undefined
  )
})
</script>

<style lang="scss" scoped></style>
