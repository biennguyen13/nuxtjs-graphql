<template>
  <table>
    <thead class="sticky top-0 left-0 bg-white">
      <tr>
        <td>No</td>
        <td>Move</td>
      </tr>
    </thead>
    <tbody class="bg-white">
      <template
        v-for="([redMove, blkMove], index) in movesChunkComputed"
        :key="index"
      >
        <tr @click="handleClick(redMove.index)">
          <td>{{ index + 1 }}</td>
          <td>{{ redMove.move }}</td>
        </tr>
        <tr v-if="blkMove" @click="handleClick(blkMove.index)">
          <td></td>
          <td>{{ blkMove?.move }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const $chessBoard = nuxtApp.$chessBoard()

const movesList = computed(() => {
  return $chessBoard?.xiangqiBoard?.getMoveList?.($chessBoard?.mvList) || []
})
const vmovesList = computed(() => {
  return $chessBoard?.mvList || []
})
const srctgrMovesComputed = computed(() => {
  return vmovesList.value.map((val: number, index: number) => ({
    srctgr: nuxtApp.$utils.VmoveToSrcTgrObj(val),
    move: movesList.value[index],
    vmove: vmovesList.value[index],
    index,
  }))
})
const movesChunkComputed = computed(() => {
  return nuxtApp.$utils.chunk(srctgrMovesComputed.value, 2)
})

const handleClick = (index: number) => {
  $chessBoard.handler.setFEN(index)
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  margin: 0;
  tr {
    border: 1px solid #ddd;
  }
  td,
  th {
    text-align: center;
  }
  thead {
    td {
      height: 50px;
      font-weight: bold;
      padding: 3px;
      top: 0;
      padding: 0 8px;
    }
  }
  tbody {
    tr {
      &:hover {
        cursor: pointer;
        box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
      }
    }
    th {
      padding: 8px;
      height: 42px;
      position: relative;
      font-weight: normal;
      position: sticky;
      left: 0;
      z-index: 1;
    }

    td {
      padding: 8px;
    }
  }
}
</style>
