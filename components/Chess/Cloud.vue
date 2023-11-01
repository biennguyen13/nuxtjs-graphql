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
    <tbody class="bg-white">
      <tr
        v-for="{ move, score, winrate, note } in movesComputed"
        :key="move"
        @click="handleClick(move)"
      >
        <td>{{ move.split("|")[0] }}</td>
        <td>{{ score }}</td>
        <td>{{ winrate }}</td>
        <td>{{ note }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import getXapiCdbTokenQuery from "~/graphql/queries/getXapiCdbToken.graphql"
import addChessdbMutation from "~/graphql/mutations/addChessdb.graphql"

import { addCookieValue } from "~/helpers/cookies"

const nuxtApp = useNuxtApp()
const $chessBoard = nuxtApp.$chessBoard()

const state = reactive({
  moves: "",
  loading: false,
})

watch(
  () => $chessBoard.currentFEN,
  async (_) => {
    if (_) {
      state.loading = true
      try {
        const { data } = await nuxtApp.$chessdbApi.queryall(_)
        state.moves = data

        if (!(await handleaddChessdb()) && (await handleGetXapiCdbToken())) {
          handleaddChessdb()
        }
      } catch (e) {
        console.log("Error: " + e)
      }
      state.loading = false
    }
  },
  {
    immediate: true,
  }
)

const movesComputed = computed(() => {
  return nuxtApp.$utils.convertChessdbMoves(state.moves)
})

const handleClick = (move) => {
  if (state.loading) return

  const [src, tgr] = move.split("|")[1].split(":")
  $chessBoard.xiangqiBoard.makeMove(src, tgr)
}

const handleaddChessdb = async () => {
  try {
    const res = await nuxtApp.$apolloClient.mutate({
      mutation: gql`
        ${addChessdbMutation}
      `,
      variables: {
        FEN: $chessBoard.currentFEN,
        value: state.moves,
      },
    })

    console.log(res)
    return true
  } catch (e) {
    console.log("Error: " + e)
    return false
  }
}
const handleGetXapiCdbToken = async () => {
  try {
    const { data } = await nuxtApp.$apolloClient.query({
      query: gql`
        ${getXapiCdbTokenQuery}
      `,
    })

    if (data?.getXapiCdbToken?.token) {
      addCookieValue("X-api-cdb-token", data?.getXapiCdbToken?.token)
      return true
    }
  } catch (e) {
    console.log("Error: " + e)
    return false
  }
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
