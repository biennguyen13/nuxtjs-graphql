<template>
  <button @click="handleLogin">login</button>
  <button @click="handleTest">test</button>
  <div></div>
  <button @click="handleGetXapiCdbToken">get token cdb</button>
  <button @click="handleaddChessdb">addChessdb</button>
</template>

<script lang="ts" setup>
import queryBook from "~/graphql/queries/book.graphql"
import getXapiCdbToken from "~/graphql/queries/getXapiCdbToken.graphql"

import mutationLogin from "~/graphql/mutations/login.graphql"
import addChessdb from "~/graphql/mutations/addChessdb.graphql"
// const colorMode = useColorMode()

// console.log(colorMode.preference)
const { onLogin } = useApollo()
// definePageMeta({
//   colorMode: "light",
// })
const query = gql`
  ${mutationLogin}
`
const variables = {
  password: "test",
  email: "test@test.test",
}
const { mutate } = useMutation(query, { variables })
const state = reactive({ data: null })

const handleLogin = async () => {
  mutate().then((res) => {
    const token = res?.data?.login?.accessToken
    if (token) {
      onLogin(token)
    }
  })

  // const { data } = await $apolloClient.mutate({
  //   variables: {
  //     email: "test@test.test",
  //     password: "test",
  //   },
  //   mutation: gql`
  //     ${mutationLogin}
  //   `,
  // })

  // console.log(data)

  // if (data?.login?.accessToken) {
  //   addCookieValue("Authorization", "Bearer " + data?.login?.accessToken)
  // }
}

const { mutate: mutate1 } = useMutation(
  gql`
    ${addChessdb}
  `,
  {
    variables: {
      FEN: "r1bakabnr/9/c1n3c2/p1p1p1p1p/9/6P2/P1P1P3P/2C4CN/9/RNBAKAB1R w",
      value:
        "move:c3c4,score:3,rank:2,note:! (10-01),winrate:50.23|move:c2c6,score:0,rank:2,note:! (07-02),winrate:50.00|move:c0e2,score:-26,rank:0,note:? (06-01),winrate:48.03|move:i0h0,score:-31,rank:0,note:? (06-01),winrate:47.65|move:c2c1,score:-44,rank:0,note:? (07-02),winrate:46.67|move:h2f2,score:-55,rank:0,note:? (06-01),winrate:45.84|move:c2f2,score:-74,rank:0,note:? (19-01),winrate:44.42|move:i0i1,score:-89,rank:0,note:? (02-01),winrate:43.30|move:c2e2,score:-113,rank:0,note:? (23-01),winrate:41.52|move:h2e2,score:-117,rank:0,note:? (09-01),winrate:41.23|move:a0a2,score:-121,rank:0,note:? (01-01),winrate:40.93|move:c2d2,score:-134,rank:0,note:? (18-01),winrate:39.99|move:c2a2,score:-137,rank:0,note:? (20-02),winrate:39.77|move:c2g2,score:-189,rank:0,note:? (12-01),winrate:36.06|move:i2h0,score:-194,rank:0,note:? (24-01),winrate:35.71|move:c2b2,score:-195,rank:0,note:? (01-01),winrate:35.64|move:e0e1,score:??,rank:0,note:? (??-??)|move:f0e1,score:??,rank:0,note:? (??-??)|move:d0e1,score:??,rank:0,note:? (??-??)|move:g0e2,score:??,rank:0,note:? (??-??)|move:c0a2,score:??,rank:0,note:? (??-??)|move:b0a2,score:??,rank:0,note:? (??-??)|move:a0a1,score:??,rank:0,note:? (??-??)|move:h2h0,score:??,rank:0,note:? (??-??)|move:h2h1,score:??,rank:0,note:? (??-??)|move:h2g2,score:??,rank:0,note:? (??-??)|move:h2d2,score:??,rank:0,note:? (??-??)|move:h2h3,score:??,rank:0,note:? (??-??)|move:h2h4,score:??,rank:0,note:? (??-??)|move:h2h5,score:??,rank:0,note:? (??-??)|move:h2h6,score:??,rank:0,note:? (??-??)|move:h2h7,score:??,rank:0,note:? (??-??)|move:h2h8,score:??,rank:0,note:? (??-??)|move:i3i4,score:??,rank:0,note:? (??-??)|move:e3e4,score:??,rank:0,note:? (??-??)|move:a3a4,score:??,rank:0,note:? (??-??)|move:g4g5,score:??,rank:0,note:? (??-??)",
    },
  }
)
const handleaddChessdb = async () => {
  try {
    // const res = await mutate1()

    const res = await $apolloClient.mutate({
      variables: {
        FEN: "r1bakabnr/9/c1n3c2/p1p1p1p1p/9/6P2/P1P1P3P/2C4CN/9/RNBAKAB1R w",
        value:
          "move:c3c4,score:3,rank:2,note:! (10-01),winrate:50.23|move:c2c6,score:0,rank:2,note:! (07-02),winrate:50.00|move:c0e2,score:-26,rank:0,note:? (06-01),winrate:48.03|move:i0h0,score:-31,rank:0,note:? (06-01),winrate:47.65|move:c2c1,score:-44,rank:0,note:? (07-02),winrate:46.67|move:h2f2,score:-55,rank:0,note:? (06-01),winrate:45.84|move:c2f2,score:-74,rank:0,note:? (19-01),winrate:44.42|move:i0i1,score:-89,rank:0,note:? (02-01),winrate:43.30|move:c2e2,score:-113,rank:0,note:? (23-01),winrate:41.52|move:h2e2,score:-117,rank:0,note:? (09-01),winrate:41.23|move:a0a2,score:-121,rank:0,note:? (01-01),winrate:40.93|move:c2d2,score:-134,rank:0,note:? (18-01),winrate:39.99|move:c2a2,score:-137,rank:0,note:? (20-02),winrate:39.77|move:c2g2,score:-189,rank:0,note:? (12-01),winrate:36.06|move:i2h0,score:-194,rank:0,note:? (24-01),winrate:35.71|move:c2b2,score:-195,rank:0,note:? (01-01),winrate:35.64|move:e0e1,score:??,rank:0,note:? (??-??)|move:f0e1,score:??,rank:0,note:? (??-??)|move:d0e1,score:??,rank:0,note:? (??-??)|move:g0e2,score:??,rank:0,note:? (??-??)|move:c0a2,score:??,rank:0,note:? (??-??)|move:b0a2,score:??,rank:0,note:? (??-??)|move:a0a1,score:??,rank:0,note:? (??-??)|move:h2h0,score:??,rank:0,note:? (??-??)|move:h2h1,score:??,rank:0,note:? (??-??)|move:h2g2,score:??,rank:0,note:? (??-??)|move:h2d2,score:??,rank:0,note:? (??-??)|move:h2h3,score:??,rank:0,note:? (??-??)|move:h2h4,score:??,rank:0,note:? (??-??)|move:h2h5,score:??,rank:0,note:? (??-??)|move:h2h6,score:??,rank:0,note:? (??-??)|move:h2h7,score:??,rank:0,note:? (??-??)|move:h2h8,score:??,rank:0,note:? (??-??)|move:i3i4,score:??,rank:0,note:? (??-??)|move:e3e4,score:??,rank:0,note:? (??-??)|move:a3a4,score:??,rank:0,note:? (??-??)|move:g4g5,score:??,rank:0,note:? (??-??)",
      },
      mutation: gql`
        ${addChessdb}
      `,
    })

    console.log(res)
  } catch (e) {
    console.log("Error: " + e)
  }
}

// const { refetch, onResult, result } = useQuery(
//   gql`
//     ${queryBook}
//   `,
//   { FEN: "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w" }
// )

// onResult(({ data }) => {
//   console.log(result)
// })

// const handleTest = () => {
//   refetch()
// }

const { load, refetch, onResult, result } = useLazyQuery(
  gql`
    ${queryBook}
  `,
  { FEN: "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w" }
)

onResult(({ data }) => {
  // console.log(result, data)
})

const handleTest = async () => {
  try {
    const result = (await load()) || (await refetch())
    // console.log(result)
  } catch (error) {
    console.log("Error: " + error)
  }
}

// $apolloClient
const { $apolloClient } = useNuxtApp()
import { addCookieValue } from "~/helpers/cookies"

const handleGetXapiCdbToken = async () => {
  const { data } = await $apolloClient.query({
    query: gql`
      ${getXapiCdbToken}
    `,
  })

  if (data?.getXapiCdbToken?.token) {
    addCookieValue("X-api-cdb-token", data?.getXapiCdbToken?.token)
  }
}
</script>

<style lang="scss">
button {
  border: 1px solid green;
  background-color: antiquewhite;
  border-radius: 5px;
  padding: 4px 20px;
  margin: 10px;
}
</style>
