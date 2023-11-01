import axios from "axios"

export default defineNuxtPlugin((_) => {
  const instance = axios.create({})

  return {
    provide: {
      chessdbApi: {
        queryall: function (
          FEN: string = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"
        ) {
          return instance.get(
            `https://www.chessdb.cn/chessdb.php?action=queryall&learn=1&showall=1&board=${FEN}`
          )
        },
        querybest: function (
          FEN: string = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"
        ) {
          return instance.get(
            `https://www.chessdb.cn/chessdb.php?action=querybest&board=${FEN}`
          )
        },
      },
    },
  }
})
