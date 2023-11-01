<template>
  <table>
    <thead class="sticky top-0 left-0 bg-white">
      <tr>
        <td>Move</td>
        <td>Score</td>
        <td>%Win</td>
        <td>Comment</td>
      </tr>
    </thead>
    <!-- <tbody class="bg-white">
      <tr
        v-for="{ id, vmove, vscore, vvalid, vmemo } in movesComputed"
        :key="id"
        @click="handleClick({ id, vmove, vscore, vvalid, vmemo })"
      >
        <td>{{ vmove.split("|")[0] }}</td>
        <td>{{ vscore }}</td>
        <td>{{ vvalid ? "Yes" : "No" }}</td>
        <td>{{ vmemo }}</td>
      </tr>
    </tbody> -->
  </table>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const $chessBoard = nuxtApp.$chessBoard?.()

const state = reactive({
  moves: "",
})

watch(
  () => $chessBoard.currentFEN,
  async (_) => {
    if (_) {
      try {
        const { data } = await nuxtApp.$chessdbApi.queryall(_)
        state.moves = data
      } catch (e) {
        console.log("Error: " + e)
      }
    }
  },
  {
    immediate: true,
  }
)

const movesComputed = computed(() => {
  return state.moves.split('|')
})
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
