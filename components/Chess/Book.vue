<template>
  <table>
    <thead class="sticky top-0 left-0 bg-white">
      <tr>
        <td>Move</td>
        <td>Score</td>
        <td>Valid</td>
        <td>Note</td>
      </tr>
    </thead>
    <tbody class="bg-white">
      <tr
        v-for="{
          id,
          vmove,
          vscore,
          vvalid,
          vmemo,
          translate,
        } in translatedMoves"
        :key="id"
        @click="handleClick({ id, vmove, vscore, vvalid, vmemo })"
        @mouseenter="handleMouseEnter(vmove)"
        @mouseleave="handleMouseLeave"
      >
        <td>{{ translate }}</td>
        <td>{{ vscore }}</td>
        <td>{{ vvalid ? "Yes" : "No" }}</td>
        <td>{{ vmemo }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import queryBook from "~/graphql/queries/book.graphql"

type Move = {
  id: number
  vmove: string
  vscore: number
  vvalid: boolean
  vmemo: string
  translate: string
}

const nuxtApp = useNuxtApp()
const chessboardState = nuxtApp.$chessBoard().chessboardState

const state = reactive<{ moves: Move[] }>({
  moves: [],
})

const { refetch, load, onResult, onError, loading } = useLazyQuery(
  gql`
    ${queryBook}
  `,
  {
    FEN:
      chessboardState.currentFEN ||
      "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w",
  },
  {
    fetchPolicy: "cache-first",
  }
)
watch(
  () => chessboardState.currentFEN,
  async (newValue) => {
    if (newValue) {
      ;(await load()) || (await refetch({ FEN: newValue }))
    }
  }
)

onResult(({ data }) => {
  state.moves = data?.book ?? []
})
onError((e) => {
  console.log("Error: " + e)
})

const translatedMoves = computed(() => {
  return state.moves.map((data: any) => ({
    ...data,
    translate: chessboardState.handler.convertMoveToHumanReadable(
      data.vmove.split("|")[0]
    ),
  }))
})

const handleClick = ({ vmove }: Move) => {
  if (loading.value) return
  const [src, tgr] = vmove.split("|")[1].split(":")
  chessboardState.handler.makeMove(src, tgr)
}
const handleMouseEnter = (vmove: string) => {
  const [src, tgr] = vmove.split("|")[1].split(":")
  chessboardState.handler.setDrawingSuggestionMove(src, tgr)
}
const handleMouseLeave = () => {
  chessboardState.handler.setDrawingSuggestionMove(null)
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
