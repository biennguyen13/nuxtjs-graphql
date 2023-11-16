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
        <div id="board" style="width: 400px; height: 400px"></div>
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

    <div
      v-for="(sq, index) in state.drawingSquares"
      :key="index"
      :style="{
        top: `${sq.y - sq.height * 0.5}px`,
        left: `${sq.x - sq.width * 0.5}px`,
        height: sq.height + 'px',
        width: sq.width + 'px',
      }"
      class="fixed bg-[#ec8989a6] rounded-full border-[2px] border-solid border-black cursor-pointer"
      @click="sq.onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue"

import XiangQi from "~/chess/app"
type XiangQiType = typeof XiangQi

const this_ = getCurrentInstance()
const nuxtApp = useNuxtApp()
const $appState = nuxtApp.$appState()

const childrends: { movesComp: any | null } = { movesComp: null }
const handler = {
  restartBoard(index: number, move: number) {
    const FEN = state.FENList[index]
    state.xiangqiBoard.restart(FEN)
    state.xiangqiBoard.board.mvLast = move
    state.currentFEN = FEN
  },
  drawSquare(sq: number | string, selected: boolean) {
    state.xiangqiBoard.board.drawSquare(sq, selected)
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
    state.currentSquareClicked = square
    // state.drawingSquares = []
    state.drawingSquares = state.squares
      .map((sq) => {
        const target = sq.toString(2).padStart(8, "0")
        const source = square.toString(2).padStart(8, "0")
        return {
          vmove: parseInt(target + source, 2),
          sq,
        }
      })
      .filter((move) => state.xiangqiBoard.board.pos.legalMove(move.vmove))
      .map(({ sq }) => {
        const ele = document.querySelector(
          `[xisqr="${sq}"]`
        ) as HTMLImageElement

        const { x, y } = ele.getBoundingClientRect()
        return {
          x: x + ele.height / 2,
          y: y + ele.height / 2,
          width: ele.width * 0.35,
          height: ele.height * 0.35,
          onClick: function () {
            state.xiangqiBoard.makeMove(square, sq)
          },
        }
      })
  },
}

const state = reactive<{
  handler: any
  childrends: { movesComp: any | null }
  xiangqiBoard: XiangQiType | any
  currentFEN: string
  mvList: number[]
  FENList: string[]
  loading: boolean
  squares: number[]
  drawingSquares: any[]
  currentSquareClicked: number | null
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
})

try {
  nuxtApp.provide("chessBoard", (name) => state)
} catch (e) {
  console.log("Error" + e)
}

const handlePrevious = nuxtApp.$utils.throttle(async () => {
  state.childrends.movesComp?.setupState?.makePreviousMove()
}, 500)
const handleNext = nuxtApp.$utils.throttle(async () => {
  state.childrends.movesComp?.setupState?.makeNextMove()
}, 500)

watch(
  () => $appState.vw + $appState.vh + $appState.top,
  () => {
    if (state.currentSquareClicked) {
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
    1,
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

  // state.xiangqiBoard.makeMove(170, 58)
})
</script>

<style scoped lang="scss"></style>
