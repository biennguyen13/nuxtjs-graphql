<template>
  <table>
    <thead class="sticky top-0 left-0 bg-white">
      <tr>
        <td>No</td>
        <td>Move</td>
      </tr>
    </thead>
    <tbody class="bg-white">
      <template
        v-for="([redMove, blkMove], index) in movesChunkComputed"
        :key="index"
      >
        <tr
          :id="`_${this_?.uid}_${redMove.index}`"
          @click="handleClick(redMove.index, redMove)"
          :class="{
            'bg-blue-300': redMove.select,
          }"
        >
          <td>{{ index }}</td>
          <td>{{ redMove.move }}</td>
        </tr>
        <tr
          v-if="blkMove"
          :id="`_${this_?.uid}_${blkMove.index}`"
          @click="handleClick(blkMove.index, blkMove)"
          :class="{
            'bg-blue-300': blkMove.select,
          }"
        >
          <td></td>
          <td>{{ blkMove?.move }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts">
import { getCurrentInstance } from "vue"

type Props = {}

export default {
  props: {},
  setup(props: Props, { emit }) {
    const this_ = getCurrentInstance()

    const nuxtApp = useNuxtApp()
    const $chessBoard = nuxtApp.$chessBoard()

    const movesList = computed(() => {
      return $chessBoard?.xiangqiBoard?.getMoveList?.($chessBoard?.mvList) || []
    })
    const vmovesList = computed(() => {
      return $chessBoard?.mvList || []
    })
    const srctgrMovesComputed = computed(() => {
      return [
        {
          srctgr: 0,
          move: 0,
          vmove: 0,
          index: 0,
          select: false,
        },
        null,
        ...vmovesList.value.map((val: number, index: number) => ({
          srctgr: nuxtApp.$utils.VmoveToSrcTgrObj(val),
          move: movesList.value[index],
          vmove: vmovesList.value[index],
          index: index + 1,
          select: false,
        })),
      ]
    })
    const movesChunkComputed = computed(() => {
      return nuxtApp.$utils.chunk(srctgrMovesComputed.value, 2)
    })
    const movesChunkFlatComputed = computed(() => {
      return movesChunkComputed.value.flat().filter((item) => !!item)
    })

    const handleClick = (_index: number, _move: any) => {
      movesChunkFlatComputed.value.forEach((move) => {
        move.select = false
      })
      _move.select = true

      $chessBoard.handler.restartBoard(_index, _move.vmove)

      const {
        srctgr: { src, tgr },
      } = _move
      if (src && tgr) {
        $chessBoard.handler.drawSquare(src, true)
        $chessBoard.handler.drawSquare(tgr, true)
      }
      this_?.proxy?.$forceUpdate()
    }

    const getCurrentSelectedMove = () => {
      return movesChunkFlatComputed.value.find((item) => item.select) || null
    }
    const makePreviousMove = () => {
      const sltedMove =
        getCurrentSelectedMove() ??
        movesChunkFlatComputed.value[movesChunkFlatComputed.value.length - 1]

      if (!sltedMove) return
      const moveIndex = sltedMove.index - 1
      if (moveIndex < 0) return

      const id = `#_${this_?.uid}_${moveIndex}`
      document.querySelector(id)?.click()
    }
    const makeNextMove = () => {
      const sltedMove =
        getCurrentSelectedMove() ??
        movesChunkFlatComputed.value[movesChunkFlatComputed.value.length - 1]

      if (!sltedMove) return
      const moveIndex = sltedMove.index + 1
      if (moveIndex >= movesChunkFlatComputed.value.length) return

      const id = `#_${this_?.uid}_${moveIndex}`
      document.querySelector(id)?.click()
    }

    onBeforeMount(() => {
      $chessBoard.childrends.movesComp = this_
    })

    return {
      this_,
      movesChunkComputed,
      handleClick,
      getCurrentSelectedMove,
      makeNextMove,
      makePreviousMove,
    }
  },
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  margin: 0;
  tr {
    border: 1px solid #ddd;
  }
  td,
  th {
    text-align: center;
  }
  thead {
    td {
      height: 50px;
      font-weight: bold;
      padding: 3px;
      top: 0;
      padding: 0 8px;
    }
  }
  tbody {
    tr {
      &:hover {
        cursor: pointer;
        box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
      }
    }
    th {
      padding: 8px;
      height: 42px;
      position: relative;
      font-weight: normal;
      position: sticky;
      left: 0;
      z-index: 1;
    }

    td {
      padding: 8px;
    }
  }
}
</style>
