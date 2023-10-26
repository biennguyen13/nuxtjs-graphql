<template>
  <button @click="handleLogin">login</button>
  <button @click="handleaddChessdb">addChessdb</button>
</template>

<script lang="ts" setup>
import queryBook from "~/graphql/queries/book.graphql"
import mutationLogin from "~/graphql/mutations/login.graphql"
const { onLogin } = useApollo()

const query = gql`
  ${mutationLogin}
`
const variables = {
  password: "test",
  email: "test@test.test",
}
const { mutate } = useMutation(query, { variables })
const state = reactive({ data: null })

const handleLogin = () => {
  mutate().then((res) => {
    const token = res?.data?.login?.accessToken
    if (token) {
      onLogin(token)

      // nextTick(async () => {})
    }
  })
}

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

const { mutate: mutate1 } = useMutation(query1)

const handleaddChessdb = async () => {
  try {
    const res = await mutate1()
  } catch (e) {
    console.log("Error: " + e)
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
