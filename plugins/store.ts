export default defineNuxtPlugin((app) => {
  const store = reactive({ global: { loading: false } })
  return {
    provide: {
      store,
    },
  }
})
