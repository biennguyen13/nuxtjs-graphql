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
      <div class="flex justify-center items-center flex-shrink-0">
        <div id="board" style="width: 400px; height: 400px">
          <div
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
            class="absolute bg-[#ec8989a6] rounded-full border-[2px] border-solid border-black cursor-pointer z-10"
            @click="sq.onClick"
          />
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

type XiangQiType = typeof XiangQi
interface Childrends {
  movesComp: typeof Moves | null
}

const this_ = getCurrentInstance()
const nuxtApp = useNuxtApp()
const $appState = nuxtApp.$appState()
const { $utils }: any = useNuxtApp()

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
  makeMove(from: number, to: number) {
    state.xiangqiBoard.makeMove(handler.flipped(from), handler.flipped(to))
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
  choosePeice(square: number) {
    const board = document.querySelector("#board") as HTMLDivElement
    const { x: boardX, y: boardY } = board.getBoundingClientRect()

    state.currentSquareClicked = square
    // state.drawingSquares = []
    state.drawingSquares = state.squares
      .map((sq) => {
        const target = sq.toString(2).padStart(8, "0")
        const source = square.toString(2).padStart(8, "0")
        return {
          vmove: parseInt(target + source, 2),
          sq: handler.flipped(sq),
          from: handler.flipped(square),
          to: handler.flipped(sq),
        }
      })
      .filter((move) => state.xiangqiBoard.board.pos.legalMove(move.vmove))
      .map(({ sq, from, to }) => {
        const ele = document.querySelector(
          `[xisqr="${sq}"]`
        ) as HTMLImageElement

        const { x, y } = ele.getBoundingClientRect()
        return {
          from,
          to,
          x: x + ele.height / 2 - boardX - 1,
          y: y + ele.height / 2 - boardY - 1,
          width: ele.width * 0.35,
          height: ele.height * 0.35,
          onClick: function () {
            handler.makeMove(from, to)
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
