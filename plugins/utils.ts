export default defineNuxtPlugin((_) => {
  const moveToVmove = function (move: string) {
    if (!move) return ""

    const board = [
      [0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b],
      [0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b],
      [0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x5b],
      [0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b],
      [0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x7b],
      [0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x8b],
      [0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0x9b],
      [0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xab],
      [0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xbb],
      [0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xcb],
    ]

    const _board = [
      ["a9", "b9", "c9", "d9", "e9", "f9", "g9", "h9", "i9"],
      ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "i8"],
      ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "i7"],
      ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "i6"],
      ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "i5"],
      ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "i4"],
      ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "i3"],
      ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "i2"],
      ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "i1"],
      ["a0", "b0", "c0", "d0", "e0", "f0", "g0", "h0", "i0"],
    ]

    const result: { src: number | null; tgr: number | null } = {
      src: null,
      tgr: null,
    }

    _board.forEach((row, x) => {
      row.forEach((colValue, y) => {
        if (colValue === move[0] + move[1]) {
          result.src = board[x][y]
        }

        if (colValue === move[2] + move[3]) {
          result.tgr = board[x][y]
        }
      })
    })

    const bin1 = result.src?.toString(2).padStart(8, "0") || "0"
    const bin2 = result.tgr?.toString(2).padStart(8, "0") || "0"

    return parseInt(bin1 + bin2, 2)
  }

  const VmoveToSrcTgr = function (decMove: number) {
    if (!decMove) return ""

    const bin = decMove.toString(2).padStart(16, "0")

    const [decSrc, decTgr] = [
      parseInt(bin.slice(0, 8), 2),
      parseInt(bin.slice(8, 16), 2),
    ]

    return decSrc + ":" + decTgr
  }

  const VmoveToSrcTgrObj = function (decMove: number) {
    if (!decMove) return ""

    const bin = decMove.toString(2).padStart(16, "0")

    const [decSrc, decTgr] = [
      parseInt(bin.slice(0, 8), 2),
      parseInt(bin.slice(8, 16), 2),
    ]

    return { src: decSrc, tgr: decTgr }
  }

  const convertChessdbMoves = function (moves: string) {
    if (!moves) return ""

    const data = moves.split("|").map((item) => {
      const obj: any = {}
      item.split(",").forEach((_item) => {
        const [key, value] = _item.split(":")
        if (key === "move") {
          obj[key] = value + "|" + VmoveToSrcTgr(moveToVmove(value) as number)
        } else {
          obj[key] = value
        }
      })
      return obj
    })

    return data
  }

  const chunk = function (array: [], size: number) {
    return [...Array(Math.ceil(array.length / size))].map((_) =>
      array.splice(0, size)
    )
  }

  const debounce = function (fn, delay = 0) {
    let timer
    return function (...args) {
      if (timer) {
        clearTimeout(timer) // clear any pre-existing timer
      }
      const context = this // get the current context
      return new Promise((res, rej) => {
        timer = setTimeout(async () => {
          try {
            const result = await fn.apply(context, args) // call the function if time expires
            res(result)
          } catch (e) {
            rej(e)
          }
        }, delay)
      })
    }
  }

  const throttle = function (fn, delay = 0) {
    return (args) => {
      if (fn.id) return

      fn.id = setTimeout(() => {
        fn.call(this, args)
        clearTimeout(fn.id)
        fn.id = null
      }, delay)
    }
  }

  return {
    provide: {
      utils: {
        VmoveToSrcTgr,
        moveToVmove,
        convertChessdbMoves,
        VmoveToSrcTgrObj,
        chunk,
        debounce,
        throttle,
      },
    },
  }
})
