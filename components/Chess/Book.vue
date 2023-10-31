<template>
  <table>
    <thead>
      <tr>
        <td>Move</td>
        <td>Score</td>
        <td>Valid</td>
        <td>Note</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ id, vmove, vscore, vvalid, vmemo } in state.moves" :key="id">
        <td>{{ vmove.split("|")[0] }}</td>
        <td>{{ vscore }}</td>
        <td>{{ vvalid }}</td>
        <td>{{ vmemo }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
type Move = {
  id: number
  vmove: string
  vscore: number
  vvalid: boolean
  vmemo: string
}

const nuxtApp = useNuxtApp()
const $chessBoard = nuxtApp.$chessBoard?.()

const state = reactive<{ moves: Move[] }>({
  moves: [],
})

watch(
  () => $chessBoard.currentFEN,
  (newValue, oldValue) => {
    if (newValue) {
      console.log(newValue)
    }
  }
)
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
