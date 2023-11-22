<template>
  <div id="xiangqi_game" class="max-w-[1200px] mx-auto">
    <div class="flex gap-4 mb-4">
      <UButton
        color="primary"
        size="xl"
        variant="solid"
        @click="handlePrevious"
        >{{ "<" }}</UButton
      >
      <UButton color="primary" size="xl" variant="solid" @click="handleNext">{{
        ">"
      }}</UButton>
    </div>
    <div class="flex">
      <div class="flex flex-shrink-0 flex-col">
        <div class="h-8 w-full text-white flex justify-between relative">
          <span
            class="absolute top-0"
            v-for="n in 9"
            :key="n"
            :style="{
              left: ((n - 0.5) / 9) * 97 + '%',
            }"
            >{{ n }}</span
          >
        </div>
        <div ref="boardRef" id="board" style="width: 400px; height: 400px">
          <div
            drawingSquares
            v-for="(sq, index) in state.drawingSquares"
            :key="index"
            :style="{
              top: `${sq.y - sq.height * 0.5}px`,
              left: `${sq.x - sq.width * 0.5}px`,
              height: sq.height + 'px',
              width: sq.width + 'px',
            }"
            :from="sq.from"
            :to="sq.to"
            class="absolute bg-[#ec8989a6] rounded-full border-[1px] border-solid border-black cursor-pointer z-10"
            @click="sq.onClick"
          />

          <div
            drawingSuggestionMove
            v-if="state.drawingSuggestionMove.y"
            :style="{
              top: `${
                state.drawingSuggestionMove.y -
                state.drawingSuggestionMove.height * 0.5
              }px`,
              left: `${
                state.drawingSuggestionMove.x -
                state.drawingSuggestionMove.width * 0.5
              }px`,
              height: state.drawingSuggestionMove.height + 'px',
              width: state.drawingSuggestionMove.width + 'px',
            }"
            :from="state.drawingSuggestionMove.from"
            :to="state.drawingSuggestionMove.to"
            class="absolute bg-[#ec8989a6] rounded-full border-[1px] border-solid border-black cursor-pointer z-10"
          />
        </div>
        <div class="h-8 w-full text-white flex justify-between relative">
          <span
            class="absolute top-0"
            v-for="n in 9"
            :key="n"
            :style="{
              left: ((n - 0.5) / 9) * 97 + '%',
            }"
            >{{ Math.abs(n - 10) }}</span
          >
        </div>
      </div>
      <div class="bg-slate-100 flex-grow min-w-[500px]">
        <ChessControlPanel />
      </div>
    </div>

    <div style="display: none">
      <!-- Try to preload sounds -->
      <audio preload="auto" src="/chess/assets/capture.wav" id="sndCapture" />
      <audio preload="auto" src="/chess/assets/check.wav" id="sndCheck" />
      <audio preload="auto" src="/chess/assets/move.wav" id="sndMove" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue"
import Moves from "./Moves.vue"
import XiangQi from "~/chess/app"
import { wait } from "~/helpers/utils"

function MOVE(sqSrc: number, sqDst: number) {
  return sqSrc + (sqDst << 8)
}

type XiangQiType = typeof XiangQi
interface Childrends {
  movesComp: typeof Moves | null
}

const PIECE_NAME = Object.freeze({
  rk: "Tướng đỏ",
  ra: "Sĩ đỏ",
  rb: "Tượng đỏ",
  rn: "Mã đỏ",
  rr: "Xe đỏ",
  rc: "Pháo đỏ",
  rp: "Tốt đỏ",
  bk: "Tướng đen",
  ba: "Sĩ đen",
  bb: "Tượng đen",
  bn: "Mã đen",
  br: "Xe đen",
  bc: "Pháo đen",
  bp: "Tốt đen",
})

const SECOND_MATRIX = Object.freeze(
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ].flat()
)

const PRIMARY_MATRIX = Object.freeze(
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ].flat()
)

const this_ = getCurrentInstance()
const nuxtApp = useNuxtApp()
const $appState = nuxtApp.$appState()
const { $utils }: any = useNuxtApp()
const boardRef = ref<HTMLDivElement | null>(null)

const childrends: Childrends = { movesComp: null }
const handler = {
  restartBoard(index: number, move: number) {
    state.drawingSquares = []

    const FEN = state.FENList[index]
    state.xiangqiBoard.restart(FEN)
    state.xiangqiBoard.board.mvLast = move
    state.currentFEN = FEN
  },
  drawSquare(sq: number | string, selected: boolean) {
    state.xiangqiBoard.board.drawSquare(sq, selected)
  },
  flipped(square: number) {
    return state.xiangqiBoard.board.flipped(square)
  },
  makeMove(from: string | number, to: string | number) {
    from = parseInt(from as string)
    to = parseInt(to as string)
    state.xiangqiBoard.board.addMove(MOVE(from, to), false)
    // state.xiangqiBoard.makeMove(handler.flipped(from), handler.flipped(to))
  },
  setDrawingSuggestionMove(
    fromSq: string | number | null,
    toSq: string | number | null
  ) {
    if (state.xiangqiBoard.board.sqSelected) {
      handler.drawSquare(state.xiangqiBoard.board.sqSelected, false)
      state.xiangqiBoard.board.sqSelected = 0
      state.drawingSquares = []
    }

    if (!fromSq || !toSq) {
      handler.drawSquare(
        handler.flipped(state.drawingSuggestionMove.from as number),
        false
      )
      return clearDrawingSuggestionMove()
    }
    const board = boardRef.value as HTMLDivElement
    const { x: boardX, y: boardY } = board.getBoundingClientRect()

    const from = handler.flipped(fromSq as number)
    const to = handler.flipped(toSq as number)
    const ele = document.querySelector(`[xisqr="${to}"]`) as HTMLImageElement
    const { x, y } = ele.getBoundingClientRect()

    state.drawingSuggestionMove.x = x + ele.height / 2 - boardX - 1
    state.drawingSuggestionMove.y = y + ele.height / 2 - boardY - 1
    state.drawingSuggestionMove.height = ele.width * 0.35
    state.drawingSuggestionMove.width = ele.width * 0.35
    state.drawingSuggestionMove.from = from
    state.drawingSuggestionMove.to = to

    handler.drawSquare(fromSq, true)
  },
  getSquareName(square: number) {
    return state.xiangqiBoard.board.getSquareName(square)
  },
  convertMoveToHumanReadable(move: string, reverseSide: boolean = false) {
    const result: {
      peice: string
      srcPos: number
      action: string
      tgrPos: number
    } = {
      peice: "",
      srcPos: 0,
      action: "",
      tgrPos: 0,
    }
    const vmove = $utils.moveToVmove(move)
    const { src, tgr } = $utils.VmoveToSrcTgrObj(vmove)
    const isPrimarySide = reverseSide
      ? state.xiangqiBoard.board.pos.sdPlayer !== 0
      : state.xiangqiBoard.board.pos.sdPlayer === 0

    const srcName = handler.getSquareName(src)
    const tgrName = handler.getSquareName(tgr)
    const matrix = isPrimarySide ? PRIMARY_MATRIX : SECOND_MATRIX

    const srcRank = parseInt(move[1])
    const tgrRank = parseInt(move[3])

    result.peice = PIECE_NAME[srcName] as string
    result.srcPos = matrix[src]
    result.action = (() => {
      if (srcRank === tgrRank) return "bình"
      if (srcRank < tgrRank) {
        return isPrimarySide ? "tấn" : "thoái"
      } else {
        return isPrimarySide ? "thoái" : "tấn"
      }
    })()
    result.tgrPos =
      matrix[tgr] === matrix[src] ? Math.abs(srcRank - tgrRank) : matrix[tgr]

    return Object.values(result).join(" ")
  },
}
const callbackHandler = {
  win() {
    console.log("call back win")
  },
  draw() {
    console.log("call back draw")
  },
  lose() {
    console.log("call back lose")
  },
  firstMove() {
    console.log("call back firstMove")
  },
  onmove(FEN: string) {
    clearDrawingSuggestionMove()
    state.currentSquareClicked = null
    state.drawingSquares = []
    state.currentFEN = FEN
    const mvList = state.xiangqiBoard.board.pos.mvList

    const currentSltedMove =
      state.childrends.movesComp?.setupState?.getCurrentSelectedMove?.()

    if (currentSltedMove) {
      state.FENList = state.FENList.slice(0, currentSltedMove.index + 1)
      state.mvList = state.mvList.slice(0, currentSltedMove.index)
    }

    state.mvList.push(mvList[mvList.length - 1])
    state.FENList.push(FEN)
  },
  choosePeice(flippedSquare: number) {
    const board = boardRef.value as HTMLDivElement
    const { x: boardX, y: boardY } = board.getBoundingClientRect()

    state.currentSquareClicked = flippedSquare
    // state.drawingSquares = []
    state.drawingSquares = state.squares
      .map((sq) => {
        const target = sq.toString(2).padStart(8, "0")
        const source = flippedSquare.toString(2).padStart(8, "0")
        return {
          vmove: parseInt(target + source, 2),
          flippedFrom: flippedSquare,
          flippedTo: sq,
        }
      })
      .filter((move) => state.xiangqiBoard.board.pos.legalMove(move.vmove))
      .map(({ flippedFrom, flippedTo }) => {
        const realFrom = handler.flipped(flippedFrom)
        const realTo = handler.flipped(flippedTo)

        const ele = document.querySelector(
          `[xisqr="${realTo}"]`
        ) as HTMLImageElement

        const { x, y } = ele.getBoundingClientRect()
        return {
          from: realFrom,
          to: realTo,
          x: x + ele.height / 2 - boardX - 1,
          y: y + ele.height / 2 - boardY - 1,
          width: ele.width * 0.35,
          height: ele.height * 0.35,
          onClick: function () {
            handler.makeMove(flippedFrom, flippedTo)
          },
        }
      })
  },
}

const state = reactive<{
  handler: any
  childrends: Childrends
  xiangqiBoard: XiangQiType | any
  currentFEN: string
  mvList: number[]
  FENList: string[]
  loading: boolean
  squares: number[]
  drawingSquares: any[]
  currentSquareClicked: number | null
  isRedFirst: number
  drawingSuggestionMove: {
    y: number
    x: number
    height: number
    width: number
    from: string | number
    to: string | number
  }
}>({
  handler,
  childrends,
  xiangqiBoard: null,
  currentFEN: "",
  mvList: [],
  FENList: [],
  loading: false,
  squares: [],
  drawingSquares: [],
  currentSquareClicked: null,
  isRedFirst: 0,
  drawingSuggestionMove: {
    y: 0,
    x: 0,
    height: 0,
    width: 0,
    from: 0,
    to: 0,
  },
})

const isRedFirst = computed(() => {
  return state.isRedFirst
})

try {
  nuxtApp.provide("chessBoard", (name) => state)
} catch (e) {
  console.log("Error" + e)
}

const handlePrevious = $utils.throttle(async () => {
  state.childrends.movesComp?.setupState?.makePreviousMove()
}, 350)
const handleNext = $utils.throttle(async () => {
  state.childrends.movesComp?.setupState?.makeNextMove()
}, 350)

watch(
  () => $appState.vw + $appState.vh + $appState.top,
  async () => {
    if (state.currentSquareClicked) {
      await wait(1)
      callbackHandler.choosePeice(state.currentSquareClicked)
    }
  }
)

const clearDrawingSuggestionMove = () => {
  state.drawingSuggestionMove.x = 0
  state.drawingSuggestionMove.y = 0
  state.drawingSuggestionMove.height = 0
  state.drawingSuggestionMove.width = 0
  state.drawingSuggestionMove.from = 0
  state.drawingSuggestionMove.to = 0
}

onMounted(() => {
  state.xiangqiBoard = new XiangQi()

  state.xiangqiBoard.setCallBack(
    callbackHandler.win,
    callbackHandler.lose,
    callbackHandler.draw,
    callbackHandler.firstMove,
    callbackHandler.onmove,
    callbackHandler.choosePeice
  )

  state.xiangqiBoard.start(
    isRedFirst.value,
    -1,
    "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"
  )

  nextTick(() => {
    const FEN = state.xiangqiBoard.getFEN()
    state.currentFEN = FEN
    state.FENList.push(FEN)

    state.squares = Array.from(document.querySelectorAll("[xisqr]")).map(
      (ele) => parseInt(ele.getAttribute("xisqr") || "0")
    )
  })

  // setTimeout(() => {
  //   state.xiangqiBoard.board.pos.undoMovePiece()
  // }, 10000)
  // state.xiangqiBoard.makeMove(170, 58)
})
</script>

<style scoped lang="scss"></style>
