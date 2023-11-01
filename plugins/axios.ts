import axios from "axios"

export default defineNuxtPlugin((app) => {
  const instance = axios.create({
    baseURL: process.env.API_URL,
    // config.headers["X-Api-Key"] = process.env.API_KEY_VALUE
  })

  instance.interceptors.request.use(function (config) {
    return config
  })

  instance.interceptors.response.use(
    function (response) {
      return { ...response, success: true }
    },
    function (error) {
      const code = error.response?.status ?? 500

      switch (code) {
        case 400:
          break
        case 409:
          break
        case 413:
          break
        case 404:
          break
        case 401:
          break
        default:
          break
      }

      return { ...error.response, success: false }
    }
  )

  return {
    provide: {
      axios: instance,
    },
  }
})
