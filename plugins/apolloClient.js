import ApolloClient from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { ApolloLink, concat } from "apollo-link"

import { getCookieValue } from "~/helpers/cookies"

export default defineNuxtPlugin((app) => {
  const runtimeConfig = useRuntimeConfig()

  // Cấu hình Apollo Client ở đây
  const httpLink = new HttpLink({
    uri: runtimeConfig.public?.GRAPHQL_URL, // Đường dẫn đến GraphQL API của bạn
  })

  // Tạo một ApolloLink để thêm headers tùy chỉnh
  const customHeaderLink = new ApolloLink((operation, forward) => {
    // Thêm headers tùy chỉnh vào mỗi request ở đây
    operation.setContext(({ headers }) => ({
      headers: {
        ...headers,
        "X-api-cdb-token": getCookieValue("X-api-cdb-token") || "",
        Authorization: getCookieValue("apollo:graphql.token") || "",
      },
    }))
    return forward(operation)
  })

  const client = new ApolloClient({
    link: concat(customHeaderLink, httpLink),
    cache: new InMemoryCache(),
  })

  return {
    provide: {
      apolloClient: client,
    },
  }
})
