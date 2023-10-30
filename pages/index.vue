<template>
  <div id="xiangqi_game">
    <div id="board" style="width: 400px; height: 400px"></div>
    <div style="display: none">
      <!-- Try to preload sounds -->
      <audio
        preload="auto"
        src="~/chessResources/assets/capture.wav"
        id="sndCapture"
      />
      <audio
        preload="auto"
        src="~/chessResources/assets/check.wav"
        id="sndCheck"
      />
      <audio
        preload="auto"
        src="~/chessResources/assets/move.wav"
        id="sndMove"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import XiangQi from "~/chess/app"
type XiangQiType = typeof XiangQi

const state = reactive<{ xiangqiBoard: XiangQiType | any }>({
  xiangqiBoard: null,
})

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
}

onMounted(() => {
  state.xiangqiBoard = new XiangQi()

  state.xiangqiBoard.setCallBack(
    handler.win,
    handler.draw,
    handler.lose,
    handler.firstMove
  )

  state.xiangqiBoard.start(
    1,
    0,
    "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"
  )
})
</script>

<style scoped lang="scss"></style>
