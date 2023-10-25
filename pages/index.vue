<template>
  <p>There are {{ state.data }} ships.</p>
</template>

<script lang="ts" setup>
import queryBook from "~/graphql/queries/book.graphql"
import mutationLogin from "~/graphql/mutations/login.graphql"
// const { onLogin } = useApollo()

// const query = gql`
//   ${mutationLogin}
// `
// const variables = {
//   password: "test",
//   email: "test@test.test",
// }
// const { mutate } = useMutation(query, { variables })
// const state = reactive({ data: null })

// mutate().then((res) => {
//   const token = res?.data?.login?.accessToken
//   if (token) {
//     onLogin(token)

//     // nextTick(async () => {})
//   }
// })

const query1 = gql`
  mutation AddChessdb {
    addChessdb(
      FEN: "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"
      value: "test"
    ) {
      ... on Chessdb {
        id
        vkey
        vFEN
        value
      }
      ... on Error {
        message
      }
    }
  }
`

const { mutate } = useMutation(query1)
mutate()
</script>

<style lang="scss"></style>
