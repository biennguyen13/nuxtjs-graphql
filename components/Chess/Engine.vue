<template>
  <div class="engine h-full relative">
    <template v-if="!isOutofPooling">
      <div class="engine__move-item flex justify-center p-2">
        <svg
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
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
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <div
        v-for="(
          { depth, score, time, nodes, moves, vmove }, index
        ) in movesFilteredComputed"
        :key="index"
        class="engine__move-item cursor-pointer flex flex-wrap max-w-full p-2 bg-white"
        @click="handleClick(vmove)"
      >
        <div class="flex-1 font-bold text-blue-700">Depth: {{ depth }}</div>
        <div class="flex-1 font-bold text-blue-700">Score: {{ score }}</div>
        <div class="flex-1 font-bold text-blue-700">Time: {{ time }}s</div>
        <div class="flex-1 font-bold text-blue-700">NPS: {{ nodes }}</div>
        <div class="px-2 flex-4 w-full">{{ moves }}</div>
      </div>
    </template>

    <div
      v-if="isOutofPooling"
      class="text-center mt-4 items-center flex justify-center flex-wrap h-full"
    >
      <div>
        <UButton
          :disabled="state.delay"
          color="primary"
          size="xl"
          variant="solid"
          @click="!state.delay && handleSendAnalyze($chessBoard.currentFEN)"
        >
          Reload
        </UButton>

        <div class="font-bold text-red-600 mt-8 w-full">
          {{ outofPoolingText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const $chessBoard = nuxtApp.$chessBoard()

const { getToken } = useApollo()

const state = reactive({ analysis: [], delay: false })

const socket = nuxtApp.$nuxtSocket({
  transports: ["websocket"],
  withCredentials: true,
  extraHeaders: {},
  auth: {
    token: await getToken(),
  },
})

socket.on(`analyze`, (message) => {
  state.analysis.push(message)
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

const handleSendAnalyze = (FEN) => {
  state.analysis = []
  socket.emit("analyze", {
    depth: 40,
    FEN: FEN || "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w",
  })
}

watch(
  () => $chessBoard.currentFEN,
  async (FEN) => {
    if (FEN) {
      try {
        handleSendAnalyze(FEN)
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
  return state.analysis
    .map(({ msg, type }) => {
      const inputString = msg

      // Sử dụng regular expression để tìm các dữ liệu cần lấy
      const depthMatch = inputString.match(/depth (\d+)/)
      const scoreMatch = inputString.match(/score (\S+)/)
      const nodesMatch = inputString.match(/nodes (\d+)/)
      const timeMatch = inputString.match(/time (\d+)/)

      // Kiểm tra nếu các kết quả tìm thấy và lấy giá trị từ kết quả
      const depth = depthMatch ? depthMatch[1] : null
      const score = scoreMatch ? scoreMatch[1] : null
      const nodes = nodesMatch ? nodesMatch[1] : null
      const time = timeMatch ? timeMatch[1] : null

      const arr = msg.split("pv")

      return {
        depth,
        score,
        time: (parseInt(time) / 1000).toFixed(1),
        nodes,
        // msg,
        // type,
        moves: arr[arr.length - 1],
      }
    })
    .reverse()
})

const movesFilteredComputed = computed(() => {
  return movesComputed.value
    .filter(({ moves }) => {
      return (
        !moves.includes("bestmove") &&
        moves
          .replaceAll("\n", "")
          .split(" ")
          .filter((_moves) => _moves).length > 2
      )
    })
    .map((item) => {
      return {
        ...item,
        vmove: nuxtApp.$utils.moveToVmove(
          item.moves.split(" ").filter((i) => i)[0]
        ),
      }
    })
})

const isOutofPooling = computed(() => {
  return state.analysis.some(({ type }) => type === "BUSY")
})
watch(
  () => isOutofPooling.value,
  async (_) => {
    if (_) {
      state.delay = true
      setTimeout(() => {
        state.delay = false
      }, 3000)
    }
  }
)

const outofPoolingText = computed(() => {
  return state.analysis.find(({ type }) => type === "BUSY")?.msg
})

onUnmounted(() => {
  socket.disconnect()
})

//   socket.connect()

const handleClick = (vmove) => {
  const { src, tgr } = nuxtApp.$utils.VmoveToSrcTgrObj(vmove)
  $chessBoard.xiangqiBoard.makeMove(src, tgr)
}
</script>

<style lang="scss" scoped>
.engine {
  &__move-item {
    border-bottom: 1px solid #ddd;
    &:hover {
      box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    }
  }
}
</style>
