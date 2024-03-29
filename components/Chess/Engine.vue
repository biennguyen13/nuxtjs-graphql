<template>
  <div class="engine h-full relative">
    <ChessEngineArrow
      :x="state.bestMoveDrawing.x"
      :y="state.bestMoveDrawing.y"
      :height="state.bestMoveDrawing.height"
      :width="state.bestMoveDrawing.width"
      :angle="state.bestMoveDrawing.angle"
      :color="state.bestMoveDrawing.color"
    />
    <ChessEngineArrow
      :x="state.ponderMoveDrawing.x"
      :y="state.ponderMoveDrawing.y"
      :height="state.ponderMoveDrawing.height"
      :width="state.ponderMoveDrawing.width"
      :angle="state.ponderMoveDrawing.angle"
      :color="state.ponderMoveDrawing.color"
    />

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

      <template v-if="movesFilteredComputed.length || bestMoveFinal">
        <div
          v-for="(
            { depth, score, time, nodes, vmove, type, translate }, index
          ) in movesFilteredComputed.length
            ? movesFilteredComputed
            : [bestMoveFinal]"
          :key="index"
          class="engine__move-item cursor-pointer flex flex-wrap max-w-full p-2"
          :class="{
            'bg-red-50': type === 'ANALYZE',
            'bg-blue-50': type === 'LAZY_ANALYZE',
          }"
          @click="handleClick(vmove)"
        >
          <div class="flex-1 font-bold text-blue-700">Depth: {{ depth }}</div>
          <div class="flex-1 font-bold text-blue-700">Score: {{ score }}</div>
          <div class="flex-1 font-bold text-blue-700">Time: {{ time }}s</div>
          <div class="flex-1 font-bold text-blue-700">NPS: {{ nodes }}</div>
          <div class="px-2 flex-4 w-full">{{ translate }}</div>
        </div>
      </template>
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
          @click="!state.delay && handleSendAnalyze(chessboardState.currentFEN)"
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

<script setup lang="ts">
import { wait } from "~/helpers/utils"

const props = withDefaults(
  defineProps<{
    computerTiming: number
    computerRed: boolean
    computerBlack: boolean
  }>(),
  {
    computerTiming: 5000,
    computerRed: false,
    computerBlack: false,
  }
)

const nuxtApp = useNuxtApp()
const chessboardState = nuxtApp.$chessBoard().chessboardState
const $appState = nuxtApp.$appState()

const { getToken } = useApollo()

const state = reactive({
  analysis: [],
  delay: false,
  bestMoveDrawing: {
    x: 0,
    y: 0,
    height: 3,
    width: 0,
    angle: 0,
    color: "#191970",
  },
  ponderMoveDrawing: {
    x: 0,
    y: 0,
    height: 3,
    width: 0,
    angle: 0,
    color: "#528B8B",
  },
})

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

const handleSendAnalyze = (FEN: string) => {
  state.analysis = []
  socket.emit("analyze", {
    depth: 40,
    FEN: FEN || "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w",
  })
  lazyComputerExcute()
}

const lazyComputerExcute = nuxtApp.$utils.debounce(() => {
  if (!document.body.contains(chessboardState.xiangqiBoard.board.element))
    return

  console.log(
    props.computerRed,
    chessboardState.xiangqiBoard.board.pos.sdPlayer === 0,
    props.computerBlack,
    chessboardState.xiangqiBoard.board.pos.sdPlayer === 1
  )
  if (
    (props.computerRed &&
      chessboardState.xiangqiBoard.board.pos.sdPlayer === 0) ||
    (props.computerBlack &&
      chessboardState.xiangqiBoard.board.pos.sdPlayer === 1)
  ) {
    try {
      const { vmove } = movesFilteredComputed.value[0]
      const { src, tgr } = nuxtApp.$utils.VmoveToSrcTgrObj(vmove as number)
      chessboardState.handler.makeMove(src, tgr)
    } catch (e) {
      console.log("Error " + e)

      handleSendAnalyze(chessboardState.currentFEN)
    }
  }
}, props.computerTiming)
watch(
  () => chessboardState.currentFEN,
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
watch(
  () => [props.computerRed, props.computerBlack],
  async ([computerRed, computerBlack]) => {
    ;(computerRed || computerBlack) && lazyComputerExcute()
  },
  {
    immediate: true,
    deep: true,
  }
)

let unwatch: any = null
onMounted(() => {
  setTimeout(() => {
    unwatch = watch(
      () => chessboardState.xiangqiBoard.board.pos.sdPlayer,
      (_) => {
        console.log(_)
      }
    )
  }, 500)
})

// const isRedTurnComputed = computed(() => {
//   return chessboardState.xiangqiBoard.board.pos.sdPlayer === 0
// })
// const isBlackTurnComputed = computed(() => {
//   return chessboardState.xiangqiBoard.board.pos.sdPlayer === 1
// })

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
        type,
        moves: arr[arr.length - 1],
      }
    })
    .reverse()
})
const bestMoveFinal = computed(() => {
  const best = JSON.parse(
    JSON.stringify(
      movesComputed.value.filter(({ moves }) => {
        return moves.includes("bestmove")
      })[0] ?? null
    )
  )

  let result = null
  if (best) {
    const moves = best.moves
      ?.replaceAll("\n", "")
      ?.replaceAll("\r", "")
      ?.split("bestmove")[1]
      ?.split(" ")

    const bestmove = moves[1]
    const ponder = moves[3]

    result = {
      ...best,
      vmove: nuxtApp.$utils.moveToVmove(bestmove),
      bestvmove: nuxtApp.$utils.moveToVmove(bestmove),
      pondervmove: nuxtApp.$utils.moveToVmove(ponder),
      translate: [bestmove, ponder]
        .filter((data) => !!data)
        .map((data, index) =>
          chessboardState.handler.convertMoveToHumanReadable(
            data,
            index % 2 !== 0
          )
        )
        .join(", "),
    }
  }

  if (result?.vmove) {
    return result
  }

  return null
})

const isOutofPooling = computed(() => {
  return state.analysis.some(({ type }) => type === "BUSY")
})
watch(
  () => isOutofPooling.value,
  async (_) => {
    if (_) {
      state.delay = true
      await wait(3000)
      state.delay = false
    }
  }
)

const outofPoolingText = computed(() => {
  return state.analysis.find(({ type }) => type === "BUSY")?.msg
})

const movesFilteredComputed = computed(() => {
  if (isOutofPooling.value) return []

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
      const moves = item.moves.split(" ").filter((i) => i)
      return {
        ...item,
        vmove: nuxtApp.$utils.moveToVmove(moves[0]),
        bestvmove: nuxtApp.$utils.moveToVmove(moves[0]),
        pondervmove: nuxtApp.$utils.moveToVmove(moves[1]),
        translate: item.moves
          .split(" ")
          .filter((data) => !!data)
          .map((data, index) =>
            chessboardState.handler.convertMoveToHumanReadable(
              data,
              index % 2 !== 0
            )
          )
          .join(", "),
      }
    })
})
const bestMoveCoordinates = computed(() => {
  $appState.vw
  $appState.vh
  $appState.top
  const move = movesFilteredComputed.value?.[0]

  if (!move || isOutofPooling.value) return null

  const { bestvmove } = move

  let { src, tgr } = nuxtApp.$utils.VmoveToSrcTgrObj(bestvmove)

  src = chessboardState.handler.flipped(src)
  tgr = chessboardState.handler.flipped(tgr)

  const srcEle = document.querySelector(`[xisqr="${src}"]`)
  const tgrEle = document.querySelector(`[xisqr="${tgr}"]`)
  if (!srcEle || !tgrEle) return null

  const { x: srcX, y: srcY } = srcEle.getBoundingClientRect()
  const { x: tgrX, y: tgrY } = tgrEle.getBoundingClientRect()

  const offset = srcEle.height / 2

  return {
    srcX: srcX + offset,
    srcY: srcY + offset,
    tgrX: tgrX + offset,
    tgrY: tgrY + offset,
  }
})
watch(
  () => bestMoveCoordinates.value,
  (_, __) => {
    if (!_) {
      state.bestMoveDrawing.x = 0
      state.bestMoveDrawing.y = 0
      state.bestMoveDrawing.width = 0
      state.bestMoveDrawing.angle = 0
      return
    }

    const { srcX: ax, srcY: ay, tgrX: Bx, tgrY: By } = _
    const { distance } = calculateMidpointAndDistance(ax, ay, Bx, By)
    const { bx, by } = calculateEndpoint(ax, ay, distance)
    const angle = calculateAngle(ax, ay, bx, by, Bx, By)

    // console.log({
    //   ax,
    //   ay,
    //   distance,
    //   angle,
    // })

    state.bestMoveDrawing.x = ax
    state.bestMoveDrawing.y = ay
    state.bestMoveDrawing.width = distance
    state.bestMoveDrawing.angle = angle
  },
  {
    deep: true,
  }
)

const ponderMoveCoordinates = computed(() => {
  $appState.vw
  $appState.vh
  $appState.top
  const move = movesFilteredComputed.value?.[0]

  if (!move || isOutofPooling.value) return null

  const { pondervmove } = move

  let { src, tgr } = nuxtApp.$utils.VmoveToSrcTgrObj(pondervmove)

  src = chessboardState.handler.flipped(src)
  tgr = chessboardState.handler.flipped(tgr)

  const srcEle = document.querySelector(`[xisqr="${src}"]`)
  const tgrEle = document.querySelector(`[xisqr="${tgr}"]`)
  if (!srcEle || !tgrEle) return null

  const { x: srcX, y: srcY } = srcEle.getBoundingClientRect()
  const { x: tgrX, y: tgrY } = tgrEle.getBoundingClientRect()

  const offset = srcEle.height / 2

  return {
    srcX: srcX + offset,
    srcY: srcY + offset,
    tgrX: tgrX + offset,
    tgrY: tgrY + offset,
  }
})
watch(
  () => ponderMoveCoordinates.value,
  (_, __) => {
    if (!_) {
      state.ponderMoveDrawing.x = 0
      state.ponderMoveDrawing.y = 0
      state.ponderMoveDrawing.width = 0
      state.ponderMoveDrawing.angle = 0
      return
    }

    const { srcX: ax, srcY: ay, tgrX: Bx, tgrY: By } = _
    const { distance } = calculateMidpointAndDistance(ax, ay, Bx, By)
    const { bx, by } = calculateEndpoint(ax, ay, distance)
    const angle = calculateAngle(ax, ay, bx, by, Bx, By)
    // console.log({
    //   ax,
    //   ay,
    //   distance,
    //   angle,
    // })

    state.ponderMoveDrawing.x = ax
    state.ponderMoveDrawing.y = ay
    state.ponderMoveDrawing.width = distance
    state.ponderMoveDrawing.angle = angle
  },
  {
    deep: true,
  }
)

onUnmounted(() => {
  unwatch?.()
  socket.disconnect()
})

//   socket.connect()

const handleClick = (vmove) => {
  const { src, tgr } = nuxtApp.$utils.VmoveToSrcTgrObj(vmove)
  chessboardState.handler.makeMove(src, tgr)
}
function calculateMidpointAndDistance(x1, y1, x2, y2) {
  // Calculate midpoint
  var x_mid = (x1 + x2) / 2
  var y_mid = (y1 + y2) / 2

  // Calculate distance
  var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

  return { midpoint: { x: x_mid, y: y_mid }, distance: distance }
}
function calculateEndpoint(ax, ay, length, direction = "x") {
  // ax, ay: tọa độ của điểm xuất phát (a0)
  // length: độ dài của đoạn thẳng A
  // direction: hướng của đoạn thẳng (x hoặc y)

  var bx, by

  if (direction === "x") {
    // Đoạn thẳng A nằm theo trục x
    bx = ax + length
    by = ay
  } else if (direction === "y") {
    // Đoạn thẳng A nằm theo trục y
    bx = ax
    by = ay + length
  } else {
    console.error("Hướng không hợp lệ. Hãy chọn 'x' hoặc 'y'.")
    return null
  }

  return { bx, by }
}
function calculateAngle(x0, y0, x1, y1, x2, y2) {
  // Tính các vector từ điểm xuất phát đến điểm cuối của các đoạn thẳng
  var vectorA = { x: x1 - x0, y: y1 - y0 }
  var vectorB = { x: x2 - x0, y: y2 - y0 }

  // Tính cross product
  var crossProduct = vectorA.x * vectorB.y - vectorA.y * vectorB.x

  // Tính dot product
  var dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y

  // Tính góc (radian)
  var angleRad = Math.atan2(crossProduct, dotProduct)

  // Chuyển đổi radian sang độ
  var angleDeg = (angleRad * 180) / Math.PI

  return angleDeg
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
