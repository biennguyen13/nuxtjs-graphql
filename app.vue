<template>
  <main :class="{ isTablet: state.isTablet, isSP: state.isSP }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <div
      v-if="$store.loading"
      class="loading fixed inset-0 bg-black/25 flex items-center justify-center cursor-not-allowed"
      style="z-index: 99999"
    >
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-jpma-blue-1 cursor-not-allowed"
      >
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Processing...
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getCookieValue } from "~/helpers/cookies"

const state = reactive({ isTablet: false, isSP: false, isSSP: false })
const nuxtApp = useNuxtApp()
const { $store } = useNuxtApp()
nuxtApp.provide("appState", (name) => state)
// Function to handle viewport resize

const socket = nuxtApp.$nuxtSocket({
  transports: ["websocket"],
  withCredentials: true,
  extraHeaders: {},
  auth: {
    token: getCookieValue("apollo:graphql.token") || "",
  },
})

socket.on(`analyze`, (message) => {
  console.log(message)
})

socket.on("connect", () => {
  console.log("socket connect")
})

socket.on("reconnect", () => {
  console.log("socket reconnect")
})

socket.on("disconnect", () => {
  console.log("socket disconnect")
})

function handleViewportResize() {
  var viewportWidth = window.innerWidth
  state.isTablet = !(viewportWidth > 999)
  state.isSP = !(viewportWidth > 767)
  state.isSSP = !(viewportWidth > 619)
}

const handleSendAnalyze = () => {
  socket.emit(
    "analyze",
    {
      depth: 35,
      FEN: "rnbakabr1/9/1c4nc1/p3p1p1p/2p6/6P2/P1P1P3P/1C2C1N2/9/RNBAKAB1R w",
    },
    (data) => {
      console.log(data)
    }
  )
}

// setTimeout(() => {
//   handleSendAnalyze()
// }, 3000)

// setTimeout(() => {
//   socket.disconnect()
// }, 3000)

// setTimeout(() => {
//   socket.connect()
// }, 6000)

onMounted(() => {
  // Call the function initially to handle the current viewport size
  handleViewportResize()
  // Attach the handleViewportResize function to the resize event
  window.addEventListener("resize", handleViewportResize)
})

onUnmounted(() => {
  window.removeEventListener("resize", handleViewportResize)
})
</script>

<style lang="scss"></style>
