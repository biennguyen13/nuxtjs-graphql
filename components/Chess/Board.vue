<template>
  <div id="xiangqi_game" class="max-w-[1200px] mx-auto">
    <div class="flex flex-wrap">
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
  </div>
</template>

<script setup lang="ts">
import XiangQi from "~/chess/app"
type XiangQiType = typeof XiangQi

const state = reactive<{
  xiangqiBoard: XiangQiType | any
  currentFEN: string
  mvList: any[]
}>({
  xiangqiBoard: null,
  currentFEN: "",
  mvList: [],
})

const nuxtApp = useNuxtApp()
try {
  nuxtApp.provide("chessBoard", (name) => state)
} catch (e) {
  console.log("Error" + e)
}

const handler = {
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
    state.currentFEN = FEN
    const mvList = state.xiangqiBoard.board.pos.mvList
    state.mvList.push(mvList[mvList.length - 1])
  },
}

onMounted(() => {
  state.xiangqiBoard = new XiangQi()

  state.xiangqiBoard.setCallBack(
    handler.win,
    handler.draw,
    handler.lose,
    handler.firstMove,
    handler.onmove
  )

  state.xiangqiBoard.start(
    1,
    -1,
    "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"
  )

  nextTick(() => {
    state.currentFEN = state.xiangqiBoard.getFEN()
  })

  // state.xiangqiBoard.makeMove(170, 58)
})
</script>

<style scoped lang="scss"></style>
