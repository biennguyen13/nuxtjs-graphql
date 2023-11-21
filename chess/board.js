/*
book.js - Source Code for XiangQi Wizard Light, Part III

XiangQi Wizard Light - a Chinese Chess Program for JavaScript
Designed by Morning Yellow, Version: 1.0, Last Modified: Sep. 2012
Copyright (C) 2004-2012 www.xqbase.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
import DAT from "./DAT"

const DAT_LEN = ~~(DAT.length / 3)

function book_dat(i, j) {
  return DAT[(i << 1) + i + j] // i*3 + j
}

/*
position.js - Source Code for XiangQi Wizard Light, Part I

XiangQi Wizard Light - a Chinese Chess Program for JavaScript
Designed by Morning Yellow, Version: 1.0, Last Modified: Sep. 2012
Copyright (C) 2004-2012 www.xqbase.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
function binarySearch(vlss, vl) {
  let low = 0
  let high = DAT_LEN - 1
  while (low <= high) {
    let mid = (low + high) >> 1
    if (vlss(mid, 0) < vl) {
      low = mid + 1
    } else if (vlss(mid, 0) > vl) {
      high = mid - 1
    } else {
      return mid
    }
  }
  return -1
}

const MATE_VALUE = 10000
const BAN_VALUE = MATE_VALUE - 100
const WIN_VALUE = MATE_VALUE - 200
const NULL_SAFE_MARGIN = 400
const NULL_OKAY_MARGIN = 200
const DRAW_VALUE = 20
const ADVANCED_VALUE = 3

const PIECE_KING = 0
const PIECE_ADVISOR = 1
const PIECE_BISHOP = 2
const PIECE_KNIGHT = 3
const PIECE_ROOK = 4
const PIECE_CANNON = 5
const PIECE_PAWN = 6

const RANK_TOP = 3
const RANK_BOTTOM = 12
const FILE_LEFT = 3
const FILE_RIGHT = 11

const ADD_PIECE = false
const DEL_PIECE = true

const IN_BOARD_ = new Uint8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
])

const IN_FORT_ = new Uint8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
])

const LEGAL_SPAN = new Uint8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
])

const KNIGHT_PIN_ = new Int16Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -16, 0, -16, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 16, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
])

const KING_DELTA = [-16, -1, 1, 16]
const ADVISOR_DELTA = [-17, -15, 15, 17]
const KNIGHT_DELTA = [
  [-33, -31],
  [-18, 14],
  [-14, 18],
  [31, 33],
]
const KNIGHT_CHECK_DELTA = [
  [-33, -18],
  [-31, -14],
  [14, 31],
  [18, 33],
]
const MVV_VALUE = [50, 10, 10, 30, 40, 30, 20, 0]

const PIECE_VALUE = [
  new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 9, 9, 9, 11, 13, 11, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 19, 24, 34, 42, 44,
    42, 34, 24, 19, 0, 0, 0, 0, 0, 0, 0, 19, 24, 32, 37, 37, 37, 32, 24, 19, 0,
    0, 0, 0, 0, 0, 0, 19, 23, 27, 29, 30, 29, 27, 23, 19, 0, 0, 0, 0, 0, 0, 0,
    14, 18, 20, 27, 29, 27, 20, 18, 14, 0, 0, 0, 0, 0, 0, 0, 7, 0, 13, 0, 16, 0,
    13, 0, 7, 0, 0, 0, 0, 0, 0, 0, 7, 0, 7, 0, 15, 0, 7, 0, 7, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 15, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
  new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 20, 23, 20, 0, 0, 18, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20,
    20, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
  new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 20, 23, 20, 0, 0, 18, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20,
    20, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
  new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 90, 90, 90, 96, 90, 96, 90, 90, 90, 0, 0, 0, 0, 0, 0, 0, 90, 96, 103, 97,
    94, 97, 103, 96, 90, 0, 0, 0, 0, 0, 0, 0, 92, 98, 99, 103, 99, 103, 99, 98,
    92, 0, 0, 0, 0, 0, 0, 0, 93, 108, 100, 107, 100, 107, 100, 108, 93, 0, 0, 0,
    0, 0, 0, 0, 90, 100, 99, 103, 104, 103, 99, 100, 90, 0, 0, 0, 0, 0, 0, 0,
    90, 98, 101, 102, 103, 102, 101, 98, 90, 0, 0, 0, 0, 0, 0, 0, 92, 94, 98,
    95, 98, 95, 98, 94, 92, 0, 0, 0, 0, 0, 0, 0, 93, 92, 94, 95, 92, 95, 94, 92,
    93, 0, 0, 0, 0, 0, 0, 0, 85, 90, 92, 93, 78, 93, 92, 90, 85, 0, 0, 0, 0, 0,
    0, 0, 88, 85, 90, 88, 90, 88, 90, 85, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
  new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 206, 208, 207, 213, 214, 213, 207, 208, 206, 0, 0, 0, 0, 0, 0, 0, 206,
    212, 209, 216, 233, 216, 209, 212, 206, 0, 0, 0, 0, 0, 0, 0, 206, 208, 207,
    214, 216, 214, 207, 208, 206, 0, 0, 0, 0, 0, 0, 0, 206, 213, 213, 216, 216,
    216, 213, 213, 206, 0, 0, 0, 0, 0, 0, 0, 208, 211, 211, 214, 215, 214, 211,
    211, 208, 0, 0, 0, 0, 0, 0, 0, 208, 212, 212, 214, 215, 214, 212, 212, 208,
    0, 0, 0, 0, 0, 0, 0, 204, 209, 204, 212, 214, 212, 204, 209, 204, 0, 0, 0,
    0, 0, 0, 0, 198, 208, 204, 212, 212, 212, 204, 208, 198, 0, 0, 0, 0, 0, 0,
    0, 200, 208, 206, 212, 200, 212, 206, 208, 200, 0, 0, 0, 0, 0, 0, 0, 194,
    206, 204, 212, 200, 212, 204, 206, 194, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
  new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 100, 100, 96, 91, 90, 91, 96, 100, 100, 0, 0, 0, 0, 0, 0, 0, 98, 98, 96,
    92, 89, 92, 96, 98, 98, 0, 0, 0, 0, 0, 0, 0, 97, 97, 96, 91, 92, 91, 96, 97,
    97, 0, 0, 0, 0, 0, 0, 0, 96, 99, 99, 98, 100, 98, 99, 99, 96, 0, 0, 0, 0, 0,
    0, 0, 96, 96, 96, 96, 100, 96, 96, 96, 96, 0, 0, 0, 0, 0, 0, 0, 95, 96, 99,
    96, 100, 96, 99, 96, 95, 0, 0, 0, 0, 0, 0, 0, 96, 96, 96, 96, 96, 96, 96,
    96, 96, 0, 0, 0, 0, 0, 0, 0, 97, 96, 100, 99, 101, 99, 100, 96, 97, 0, 0, 0,
    0, 0, 0, 0, 96, 97, 98, 98, 98, 98, 98, 97, 96, 0, 0, 0, 0, 0, 0, 0, 96, 96,
    97, 99, 99, 99, 97, 96, 96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
  new Uint16Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 9, 9, 9, 11, 13, 11, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 19, 24, 34, 42, 44,
    42, 34, 24, 19, 0, 0, 0, 0, 0, 0, 0, 19, 24, 32, 37, 37, 37, 32, 24, 19, 0,
    0, 0, 0, 0, 0, 0, 19, 23, 27, 29, 30, 29, 27, 23, 19, 0, 0, 0, 0, 0, 0, 0,
    14, 18, 20, 27, 29, 27, 20, 18, 14, 0, 0, 0, 0, 0, 0, 0, 7, 0, 13, 0, 16, 0,
    13, 0, 7, 0, 0, 0, 0, 0, 0, 0, 7, 0, 7, 0, 15, 0, 7, 0, 7, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 15, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]),
]

function IN_BOARD(sq) {
  return IN_BOARD_[sq]
}

function IN_FORT(sq) {
  return IN_FORT_[sq]
}

function RANK_Y(sq) {
  return sq >> 4
}

function FILE_X(sq) {
  return sq & 15
}

function COORD_XY(x, y) {
  return x + (y << 4)
}

function TEXTTOMOVE(move) {
  return move
}

function SQUARE_FLIP(sq) {
  return 254 - sq
}

function FILE_FLIP(x) {
  return 14 - x
}

function RANK_FLIP(y) {
  return 15 - y
}

function MIRROR_SQUARE(sq) {
  return COORD_XY(FILE_FLIP(FILE_X(sq)), RANK_Y(sq))
}

function SQUARE_FORWARD(sq, sd) {
  return sq - 16 + (sd << 5)
}

function KING_SPAN(sqSrc, sqDst) {
  return LEGAL_SPAN[sqDst - sqSrc + 256] === 1
}

function ADVISOR_SPAN(sqSrc, sqDst) {
  return LEGAL_SPAN[sqDst - sqSrc + 256] === 2
}

function BISHOP_SPAN(sqSrc, sqDst) {
  return LEGAL_SPAN[sqDst - sqSrc + 256] === 3
}

function BISHOP_PIN(sqSrc, sqDst) {
  return (sqSrc + sqDst) >> 1
}

function KNIGHT_PIN(sqSrc, sqDst) {
  return sqSrc + KNIGHT_PIN_[sqDst - sqSrc + 256]
}

function HOME_HALF(sq, sd) {
  return (sq & 0x80) !== sd << 7
}

function AWAY_HALF(sq, sd) {
  return (sq & 0x80) === sd << 7
}

function SAME_HALF(sqSrc, sqDst) {
  return ((sqSrc ^ sqDst) & 0x80) === 0
}

function SAME_RANK(sqSrc, sqDst) {
  return ((sqSrc ^ sqDst) & 0xf0) === 0
}

function SAME_FILE(sqSrc, sqDst) {
  return ((sqSrc ^ sqDst) & 0x0f) === 0
}

function SIDE_TAG(sd) {
  return 8 + (sd << 3)
}

function OPP_SIDE_TAG(sd) {
  return 16 - (sd << 3)
}

function SRC(mv) {
  return mv & 255
}

function DST(mv) {
  return mv >> 8
}

function MOVE(sqSrc, sqDst) {
  return sqSrc + (sqDst << 8)
}

function MIRROR_MOVE(mv) {
  return MOVE(MIRROR_SQUARE(SRC(mv)), MIRROR_SQUARE(DST(mv)))
}

function MVV_LVA(pc, lva) {
  return MVV_VALUE[pc & 7] - lva
}

function CHR(n) {
  return String.fromCharCode(n)
}

function ASC(c) {
  return c.charCodeAt(0)
}

const FEN_PIECE = "        KABNRCP kabnrcp "

function CHAR_TO_PIECE(c) {
  switch (c) {
    case "K":
      return PIECE_KING
    case "A":
      return PIECE_ADVISOR
    case "B":
    case "E":
      return PIECE_BISHOP
    case "H":
    case "N":
      return PIECE_KNIGHT
    case "R":
      return PIECE_ROOK
    case "C":
      return PIECE_CANNON
    case "P":
      return PIECE_PAWN
    default:
      return -1
  }
}

function RC4(key) {
  this.x = this.y = 0
  this.state = []
  for (let i = 0; i < 256; ++i) {
    this.state.push(i)
  }
  let j = 0
  for (let i = 0; i < 256; ++i) {
    j = (j + this.state[i] + key[i % key.length]) & 0xff
    this.swap(i, j)
  }
}

RC4.prototype.swap = function (i, j) {
  let t = this.state[i]
  this.state[i] = this.state[j]
  this.state[j] = t
}

RC4.prototype.nextByte = function () {
  this.x = (this.x + 1) & 0xff
  this.y = (this.y + this.state[this.x]) & 0xff
  this.swap(this.x, this.y)
  let t = (this.state[this.x] + this.state[this.y]) & 0xff
  return this.state[t]
}

RC4.prototype.nextLong = function () {
  let n0 = this.nextByte()
  let n1 = this.nextByte()
  let n2 = this.nextByte()
  let n3 = this.nextByte()
  return n0 + (n1 << 8) + (n2 << 16) + ((n3 << 24) & 0xffffffff)
}

let rc4 = new RC4([0])

const PreGen_zobristKeyPlayer = rc4.nextLong()
rc4.nextLong()
const PreGen_zobristLockPlayer = rc4.nextLong()

const PreGen_zobristKeyTable = [],
  PreGen_zobristLockTable = []
for (let i = 0; i < 14; ++i) {
  let keys = new Int32Array(256)
  let locks = new Int32Array(256)
  for (let j = 0; j < 256; ++j) {
    keys[j] = rc4.nextLong()
    rc4.nextLong()
    locks[j] = rc4.nextLong()
  }
  PreGen_zobristKeyTable.push(keys)
  PreGen_zobristLockTable.push(locks)
}

function Position() {
  // sdPlayer, zobristKey, zobristLock, vlWhite, vlBlack, distance;
  // squares, mvList, pcList, keyList, chkList;
}

Position.prototype.clearBoard = function () {
  this.sdPlayer = 0
  this.squares = []
  for (let sq = 0; sq < 256; ++sq) {
    this.squares.push(0)
  }
  this.zobristKey = this.zobristLock = 0
  this.vlWhite = this.vlBlack = 0
}

Position.prototype.setIrrev = function () {
  this.mvList = [0]
  this.pcList = [0]
  this.keyList = [0]
  this.chkList = [this.checked()]
  this.distance = 0
}

Position.prototype.addPiece = function (sq, pc, bDel) {
  let pcAdjust
  this.squares[sq] = bDel ? 0 : pc
  if (pc < 16) {
    pcAdjust = pc - 8
    this.vlWhite += bDel
      ? -PIECE_VALUE[pcAdjust][sq]
      : PIECE_VALUE[pcAdjust][sq]
  } else {
    pcAdjust = pc - 16
    this.vlBlack += bDel
      ? -PIECE_VALUE[pcAdjust][SQUARE_FLIP(sq)]
      : PIECE_VALUE[pcAdjust][SQUARE_FLIP(sq)]
    pcAdjust += 7
  }
  this.zobristKey ^= PreGen_zobristKeyTable[pcAdjust][sq]
  this.zobristLock ^= PreGen_zobristLockTable[pcAdjust][sq]
}

Position.prototype.movePiece = function (mv) {
  let sqSrc = SRC(mv)
  let sqDst = DST(mv)
  let pc = this.squares[sqDst]
  this.pcList.push(pc)
  if (pc > 0) {
    this.addPiece(sqDst, pc, DEL_PIECE)
  }
  pc = this.squares[sqSrc]
  this.addPiece(sqSrc, pc, DEL_PIECE)
  this.addPiece(sqDst, pc, ADD_PIECE)
  this.mvList.push(mv)
}

Position.prototype.undoMovePiece = function () {
  let mv = this.mvList.pop()
  let sqSrc = SRC(mv)
  let sqDst = DST(mv)
  let pc = this.squares[sqDst]
  this.addPiece(sqDst, pc, DEL_PIECE)
  this.addPiece(sqSrc, pc, ADD_PIECE)
  pc = this.pcList.pop()
  if (pc > 0) {
    this.addPiece(sqDst, pc, ADD_PIECE)
  }
}

Position.prototype.changeSide = function () {
  this.sdPlayer = 1 - this.sdPlayer
  this.zobristKey ^= PreGen_zobristKeyPlayer
  this.zobristLock ^= PreGen_zobristLockPlayer
}

Position.prototype.makeMove = function (mv) {
  let zobristKey = this.zobristKey
  this.movePiece(mv)
  if (this.checked()) {
    console.log("checked")
    this.undoMovePiece(mv)
    return false
  }
  this.keyList.push(zobristKey)
  this.changeSide()
  this.chkList.push(this.checked())
  ++this.distance
  return true
}

Position.prototype.undoMakeMove = function () {
  this.distance--
  this.chkList.pop()
  this.changeSide()
  this.keyList.pop()
  this.undoMovePiece()
}

Position.prototype.nullMove = function () {
  this.mvList.push(0)
  this.pcList.push(0)
  this.keyList.push(this.zobristKey)
  this.changeSide()
  this.chkList.push(false)
  ++this.distance
}

Position.prototype.undoNullMove = function () {
  this.distance--
  this.chkList.pop()
  this.changeSide()
  this.keyList.pop()
  this.pcList.pop()
  this.mvList.pop()
}

Position.prototype.fromFen = function (fen) {
  this.clearBoard()
  let y = RANK_TOP
  let x = FILE_LEFT
  let index = 0
  if (!fen.length) {
    this.setIrrev()
    return
  }
  let c = fen.charAt(index)
  while (c !== " ") {
    if (c === "/") {
      x = FILE_LEFT
      ++y
      if (y > RANK_BOTTOM) {
        break
      }
    } else if (c >= "1" && c <= "9") {
      x += ASC(c) - ASC("0")
    } else if (c >= "A" && c <= "Z") {
      if (x <= FILE_RIGHT) {
        let pt = CHAR_TO_PIECE(c)
        if (pt >= 0) {
          this.addPiece(COORD_XY(x, y), pt + 8)
        }
        ++x
      }
    } else if (c >= "a" && c <= "z") {
      if (x <= FILE_RIGHT) {
        let pt = CHAR_TO_PIECE(CHR(ASC(c) + ASC("A") - ASC("a")))
        if (pt >= 0) {
          this.addPiece(COORD_XY(x, y), pt + 16)
        }
        ++x
      }
    }
    ++index
    if (index === fen.length) {
      this.setIrrev()
      return
    }
    c = fen.charAt(index)
  }
  ++index
  if (index === fen.length) {
    this.setIrrev()
    return
  }
  if (this.sdPlayer === (fen.charAt(index) === "b" ? 0 : 1)) {
    this.changeSide()
  }
  this.setIrrev()
}

Position.prototype.toFen = function () {
  let fen = ""
  for (let y = RANK_TOP; y <= RANK_BOTTOM; ++y) {
    let k = 0
    for (let x = FILE_LEFT; x <= FILE_RIGHT; ++x) {
      let pc = this.squares[COORD_XY(x, y)]
      if (pc > 0) {
        if (k > 0) {
          fen += CHR(ASC("0") + k)
          k = 0
        }
        fen += FEN_PIECE.charAt(pc)
      } else {
        ++k
      }
    }
    if (k > 0) {
      fen += CHR(ASC("0") + k)
    }
    fen += "/"
  }
  return fen.substring(0, fen.length - 1) + (this.sdPlayer === 0 ? " w" : " b")
}

Position.prototype.generateMoves = function (vls) {
  let mvs = []
  let pcSelfSide = SIDE_TAG(this.sdPlayer)
  let pcOppSide = OPP_SIDE_TAG(this.sdPlayer)
  for (let sqSrc = 0; sqSrc < 256; ++sqSrc) {
    let pcSrc = this.squares[sqSrc]
    if ((pcSrc & pcSelfSide) === 0) {
      continue
    }
    switch (pcSrc - pcSelfSide) {
      case PIECE_KING:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + KING_DELTA[i]
          if (!IN_FORT(sqDst)) {
            continue
          }
          let pcDst = this.squares[sqDst]
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst))
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst))
            vls.push(MVV_LVA(pcDst, 5))
          }
        }
        break
      case PIECE_ADVISOR:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + ADVISOR_DELTA[i]
          if (!IN_FORT(sqDst)) {
            continue
          }
          let pcDst = this.squares[sqDst]
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst))
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst))
            vls.push(MVV_LVA(pcDst, 1))
          }
        }
        break
      case PIECE_BISHOP:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + ADVISOR_DELTA[i]
          if (
            !(
              IN_BOARD(sqDst) &&
              HOME_HALF(sqDst, this.sdPlayer) &&
              this.squares[sqDst] === 0
            )
          ) {
            continue
          }
          sqDst += ADVISOR_DELTA[i]
          let pcDst = this.squares[sqDst]
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst))
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst))
            vls.push(MVV_LVA(pcDst, 1))
          }
        }
        break
      case PIECE_KNIGHT:
        for (let i = 0; i < 4; ++i) {
          let sqDst = sqSrc + KING_DELTA[i]
          if (this.squares[sqDst] > 0) {
            continue
          }
          for (let j = 0; j < 2; ++j) {
            sqDst = sqSrc + KNIGHT_DELTA[i][j]
            if (!IN_BOARD(sqDst)) {
              continue
            }
            let pcDst = this.squares[sqDst]
            if (vls === null) {
              if ((pcDst & pcSelfSide) === 0) {
                mvs.push(MOVE(sqSrc, sqDst))
              }
            } else if ((pcDst & pcOppSide) !== 0) {
              mvs.push(MOVE(sqSrc, sqDst))
              vls.push(MVV_LVA(pcDst, 1))
            }
          }
        }
        break
      case PIECE_ROOK:
        for (let i = 0; i < 4; ++i) {
          let delta = KING_DELTA[i]
          let sqDst = sqSrc + delta
          while (IN_BOARD(sqDst)) {
            let pcDst = this.squares[sqDst]
            if (pcDst === 0) {
              if (vls === null) {
                mvs.push(MOVE(sqSrc, sqDst))
              }
            } else {
              if ((pcDst & pcOppSide) !== 0) {
                mvs.push(MOVE(sqSrc, sqDst))
                if (vls !== null) {
                  vls.push(MVV_LVA(pcDst, 4))
                }
              }
              break
            }
            sqDst += delta
          }
        }
        break
      case PIECE_CANNON:
        for (let i = 0; i < 4; ++i) {
          let delta = KING_DELTA[i]
          let sqDst = sqSrc + delta
          while (IN_BOARD(sqDst)) {
            let pcDst = this.squares[sqDst]
            if (pcDst === 0) {
              if (vls === null) {
                mvs.push(MOVE(sqSrc, sqDst))
              }
            } else {
              break
            }
            sqDst += delta
          }
          sqDst += delta
          while (IN_BOARD(sqDst)) {
            let pcDst = this.squares[sqDst]
            if (pcDst > 0) {
              if ((pcDst & pcOppSide) !== 0) {
                mvs.push(MOVE(sqSrc, sqDst))
                if (vls !== null) {
                  vls.push(MVV_LVA(pcDst, 4))
                }
              }
              break
            }
            sqDst += delta
          }
        }
        break
      case PIECE_PAWN:
        // eslint-disable-next-line no-case-declarations
        let sqDst = SQUARE_FORWARD(sqSrc, this.sdPlayer)
        if (IN_BOARD(sqDst)) {
          let pcDst = this.squares[sqDst]
          if (vls === null) {
            if ((pcDst & pcSelfSide) === 0) {
              mvs.push(MOVE(sqSrc, sqDst))
            }
          } else if ((pcDst & pcOppSide) !== 0) {
            mvs.push(MOVE(sqSrc, sqDst))
            vls.push(MVV_LVA(pcDst, 2))
          }
        }
        if (AWAY_HALF(sqSrc, this.sdPlayer)) {
          for (let delta = -1; delta <= 1; delta += 2) {
            sqDst = sqSrc + delta
            if (IN_BOARD(sqDst)) {
              let pcDst = this.squares[sqDst]
              if (vls === null) {
                if ((pcDst & pcSelfSide) === 0) {
                  mvs.push(MOVE(sqSrc, sqDst))
                }
              } else if ((pcDst & pcOppSide) !== 0) {
                mvs.push(MOVE(sqSrc, sqDst))
                vls.push(MVV_LVA(pcDst, 2))
              }
            }
          }
        }
        break
    }
  }
  return mvs
}

Position.prototype.legalMove = function (mv) {
  let sqSrc = SRC(mv)
  let pcSrc = this.squares[sqSrc]
  let pcSelfSide = SIDE_TAG(this.sdPlayer)
  if ((pcSrc & pcSelfSide) === 0) {
    return false
  }

  let sqDst = DST(mv)
  let pcDst = this.squares[sqDst]
  if ((pcDst & pcSelfSide) !== 0) {
    return false
  }

  let sqPin
  switch (pcSrc - pcSelfSide) {
    case PIECE_KING:
      return IN_FORT(sqDst) && KING_SPAN(sqSrc, sqDst)
    case PIECE_ADVISOR:
      return IN_FORT(sqDst) && ADVISOR_SPAN(sqSrc, sqDst)
    case PIECE_BISHOP:
      return (
        SAME_HALF(sqSrc, sqDst) &&
        BISHOP_SPAN(sqSrc, sqDst) &&
        this.squares[BISHOP_PIN(sqSrc, sqDst)] === 0
      )
    case PIECE_KNIGHT:
      sqPin = KNIGHT_PIN(sqSrc, sqDst)
      return sqPin !== sqSrc && this.squares[sqPin] === 0
    case PIECE_ROOK:
    case PIECE_CANNON:
      // eslint-disable-next-line no-case-declarations
      let delta
      if (SAME_RANK(sqSrc, sqDst)) {
        delta = sqDst < sqSrc ? -1 : 1
      } else if (SAME_FILE(sqSrc, sqDst)) {
        delta = sqDst < sqSrc ? -16 : 16
      } else {
        return false
      }
      sqPin = sqSrc + delta
      while (sqPin !== sqDst && this.squares[sqPin] === 0) {
        sqPin += delta
      }
      if (sqPin === sqDst) {
        return pcDst === 0 || pcSrc - pcSelfSide === PIECE_ROOK
      }
      if (pcDst === 0 || pcSrc - pcSelfSide !== PIECE_CANNON) {
        return false
      }
      sqPin += delta
      while (sqPin !== sqDst && this.squares[sqPin] === 0) {
        sqPin += delta
      }
      return sqPin === sqDst
    case PIECE_PAWN:
      if (
        AWAY_HALF(sqDst, this.sdPlayer) &&
        (sqDst === sqSrc - 1 || sqDst === sqSrc + 1)
      ) {
        return true
      }
      return sqDst === SQUARE_FORWARD(sqSrc, this.sdPlayer)
    default:
      return false
  }
}

Position.prototype.checked = function () {
  let pcSelfSide = SIDE_TAG(this.sdPlayer)
  let pcOppSide = OPP_SIDE_TAG(this.sdPlayer)
  for (let sqSrc = 0; sqSrc < 256; ++sqSrc) {
    if (this.squares[sqSrc] !== pcSelfSide + PIECE_KING) {
      continue
    }
    if (
      this.squares[SQUARE_FORWARD(sqSrc, this.sdPlayer)] ===
      pcOppSide + PIECE_PAWN
    ) {
      return true
    }
    for (let delta = -1; delta <= 1; delta += 2) {
      if (this.squares[sqSrc + delta] === pcOppSide + PIECE_PAWN) {
        return true
      }
    }
    for (let i = 0; i < 4; ++i) {
      if (this.squares[sqSrc + ADVISOR_DELTA[i]] !== 0) {
        continue
      }
      for (let j = 0; j < 2; j++) {
        let pcDst = this.squares[sqSrc + KNIGHT_CHECK_DELTA[i][j]]
        if (pcDst === pcOppSide + PIECE_KNIGHT) {
          return true
        }
      }
    }
    for (let i = 0; i < 4; ++i) {
      let delta = KING_DELTA[i]
      let sqDst = sqSrc + delta
      while (IN_BOARD(sqDst)) {
        let pcDst = this.squares[sqDst]
        if (pcDst > 0) {
          if (
            pcDst === pcOppSide + PIECE_ROOK ||
            pcDst === pcOppSide + PIECE_KING
          ) {
            return true
          }
          break
        }
        sqDst += delta
      }
      sqDst += delta
      while (IN_BOARD(sqDst)) {
        let pcDst = this.squares[sqDst]
        if (pcDst > 0) {
          if (pcDst === pcOppSide + PIECE_CANNON) {
            return true
          }
          break
        }
        sqDst += delta
      }
    }
    return false
  }
  return false
}

Position.prototype.isMate = function () {
  let mvs = this.generateMoves(null)
  for (let i = 0; i < mvs.length; ++i) {
    if (this.makeMove(mvs[i])) {
      this.undoMakeMove()
      return false
    }
  }
  return true
}

Position.prototype.mateValue = function () {
  return this.distance - MATE_VALUE
}

Position.prototype.banValue = function () {
  return this.distance - BAN_VALUE
}

Position.prototype.drawValue = function () {
  return (this.distance & 1) === 0 ? -DRAW_VALUE : DRAW_VALUE
}

Position.prototype.evaluate = function () {
  let vl =
    (this.sdPlayer === 0
      ? this.vlWhite - this.vlBlack
      : this.vlBlack - this.vlWhite) + ADVANCED_VALUE
  return vl === this.drawValue() ? vl - 1 : vl
}

Position.prototype.nullOkay = function () {
  return (this.sdPlayer === 0 ? this.vlWhite : this.vlBlack) > NULL_OKAY_MARGIN
}

Position.prototype.nullSafe = function () {
  return (this.sdPlayer === 0 ? this.vlWhite : this.vlBlack) > NULL_SAFE_MARGIN
}

Position.prototype.inCheck = function () {
  return this.chkList[this.chkList.length - 1]
}

Position.prototype.captured = function () {
  return this.pcList[this.pcList.length - 1] > 0
}

Position.prototype.repValue = function (vlRep) {
  let vlReturn =
    ((vlRep & 2) === 0 ? 0 : this.banValue()) +
    ((vlRep & 4) === 0 ? 0 : -this.banValue())
  return vlReturn === 0 ? this.drawValue() : vlReturn
}

Position.prototype.repStatus = function (recur_) {
  let recur = recur_
  let selfSide = false
  let perpCheck = true
  let oppPerpCheck = true
  let index = this.mvList.length - 1
  while (this.mvList[index] > 0 && this.pcList[index] === 0) {
    if (selfSide) {
      perpCheck = perpCheck && this.chkList[index]
      if (this.keyList[index] === this.zobristKey) {
        recur--
        if (recur === 0) {
          return 1 + (perpCheck ? 2 : 0) + (oppPerpCheck ? 4 : 0)
        }
      }
    } else {
      oppPerpCheck = oppPerpCheck && this.chkList[index]
    }
    selfSide = !selfSide
    index--
  }
  return 0
}

Position.prototype.mirror = function () {
  let pos = new Position()
  pos.clearBoard()
  for (let sq = 0; sq < 256; ++sq) {
    let pc = this.squares[sq]
    if (pc > 0) {
      pos.addPiece(MIRROR_SQUARE(sq), pc)
    }
  }
  if (this.sdPlayer === 1) {
    pos.changeSide()
  }
  return pos
}

Position.prototype.bookMove = function () {
  if (typeof book_dat !== "function" || !DAT_LEN) {
    return 0
  }
  let mirror = false
  let lock = this.zobristLock >>> 1 // Convert into Unsigned
  let index = binarySearch(book_dat, lock)
  if (index < 0) {
    mirror = true
    lock = this.mirror().zobristLock >>> 1 // Convert into Unsigned
    index = binarySearch(book_dat, lock)
  }
  if (index < 0) {
    return 0
  }
  index--
  while (index >= 0 && book_dat(index, 0) === lock) {
    index--
  }
  let mvs = [],
    vls = []
  let value = 0
  ++index
  while (index < DAT_LEN && book_dat(index, 0) === lock) {
    let mv = book_dat(index, 1)
    mv = mirror ? MIRROR_MOVE(mv) : mv
    if (this.legalMove(mv)) {
      mvs.push(mv)
      let vl = book_dat(index, 2)
      vls.push(vl)
      value += vl
    }
    ++index
  }
  if (value === 0) {
    return 0
  }
  value = Math.floor(Math.random() * value)
  for (index = 0; index < mvs.length; ++index) {
    value -= vls[index]
    if (value < 0) {
      break
    }
  }
  return mvs[index]
}

Position.prototype.historyIndex = function (mv) {
  return ((this.squares[SRC(mv)] - 8) << 8) + DST(mv)
}

/*
search.js - Source Code for XiangQi Wizard Light, Part II

XiangQi Wizard Light - a Chinese Chess Program for JavaScript
Designed by Morning Yellow, Version: 1.0, Last Modified: Sep. 2012
Copyright (C) 2004-2012 www.xqbase.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
const SHELL_STEP = [0, 1, 4, 13, 40, 121, 364, 1093]

function shellSort(mvs, vls) {
  let stepLevel = 1
  while (SHELL_STEP[stepLevel] < mvs.length) {
    ++stepLevel
  }
  stepLevel--
  while (stepLevel > 0) {
    let step = SHELL_STEP[stepLevel]
    for (let i = step; i < mvs.length; ++i) {
      let mvBest = mvs[i]
      let vlBest = vls[i]
      let j = i - step
      while (j >= 0 && vlBest > vls[j]) {
        mvs[j + step] = mvs[j]
        vls[j + step] = vls[j]
        j -= step
      }
      mvs[j + step] = mvBest
      vls[j + step] = vlBest
    }
    stepLevel--
  }
}

const PHASE_HASH = 0
const PHASE_KILLER_1 = 1
const PHASE_KILLER_2 = 2
const PHASE_GEN_MOVES = 3
const PHASE_REST = 4

function MoveSort(mvHash, pos, killerTable, historyTable) {
  this.mvs = []
  this.vls = []
  this.mvHash = this.mvKiller1 = this.mvKiller2 = 0
  this.pos = pos
  this.historyTable = historyTable
  this.phase = PHASE_HASH
  this.index = 0
  this.singleReply = false

  if (pos.inCheck()) {
    this.phase = PHASE_REST
    let mvsAll = pos.generateMoves(null)
    for (let i = 0; i < mvsAll.length; ++i) {
      let mv = mvsAll[i]
      if (!pos.makeMove(mv)) {
        continue
      }
      pos.undoMakeMove()
      this.mvs.push(mv)
      this.vls.push(
        mv === mvHash ? 0x7fffffff : historyTable[pos.historyIndex(mv)]
      )
    }
    shellSort(this.mvs, this.vls)
    this.singleReply = this.mvs.length === 1
  } else {
    this.mvHash = mvHash
    this.mvKiller1 = killerTable[pos.distance][0]
    this.mvKiller2 = killerTable[pos.distance][1]
  }
}

MoveSort.prototype.next = function () {
  switch (this.phase) {
    case PHASE_HASH:
      this.phase = PHASE_KILLER_1
      if (this.mvHash > 0) {
        return this.mvHash
      }
    // No Break
    // eslint-disable-next-line no-fallthrough
    case PHASE_KILLER_1:
      this.phase = PHASE_KILLER_2
      if (
        this.mvKiller1 !== this.mvHash &&
        this.mvKiller1 > 0 &&
        this.pos.legalMove(this.mvKiller1)
      ) {
        return this.mvKiller1
      }
    // No Break
    // eslint-disable-next-line no-fallthrough
    case PHASE_KILLER_2:
      this.phase = PHASE_GEN_MOVES
      if (
        this.mvKiller2 !== this.mvHash &&
        this.mvKiller2 > 0 &&
        this.pos.legalMove(this.mvKiller2)
      ) {
        return this.mvKiller2
      }
    // No Break
    // eslint-disable-next-line no-fallthrough
    case PHASE_GEN_MOVES:
      this.phase = PHASE_REST
      this.mvs = this.pos.generateMoves(null)
      this.vls = []
      for (let i = 0; i < this.mvs.length; ++i) {
        this.vls.push(this.historyTable[this.pos.historyIndex(this.mvs[i])])
      }
      shellSort(this.mvs, this.vls)
      this.index = 0
    // No Break
    // eslint-disable-next-line no-fallthrough
    default:
      while (this.index < this.mvs.length) {
        let mv = this.mvs[this.index]
        ++this.index
        if (
          mv !== this.mvHash &&
          mv !== this.mvKiller1 &&
          mv !== this.mvKiller2
        ) {
          return mv
        }
      }
  }
  return 0
}

const LIMIT_DEPTH = 64
const NULL_DEPTH = 2
const RANDOMNESS = 8

const HASH_ALPHA = 1
const HASH_BETA = 2
const HASH_PV = 3

function Search(pos, hashLevel) {
  this.hashMask = (1 << hashLevel) - 1
  this.pos = pos
}

Search.prototype.getHashItem = function () {
  return this.hashTable[this.pos.zobristKey & this.hashMask]
}

Search.prototype.probeHash = function (vlAlpha, vlBeta, depth, mv) {
  let hash = this.getHashItem()
  if (hash.zobristLock !== this.pos.zobristLock) {
    mv[0] = 0
    return -MATE_VALUE
  }
  mv[0] = hash.mv
  let mate = false
  if (hash.vl > WIN_VALUE) {
    if (hash.vl <= BAN_VALUE) {
      return -MATE_VALUE
    }
    hash.vl -= this.pos.distance
    mate = true
  } else if (hash.vl < -WIN_VALUE) {
    if (hash.vl >= -BAN_VALUE) {
      return -MATE_VALUE
    }
    hash.vl += this.pos.distance
    mate = true
  } else if (hash.vl === this.pos.drawValue()) {
    return -MATE_VALUE
  }
  if (hash.depth < depth && !mate) {
    return -MATE_VALUE
  }
  if (hash.flag === HASH_BETA) {
    return hash.vl >= vlBeta ? hash.vl : -MATE_VALUE
  }
  if (hash.flag === HASH_ALPHA) {
    return hash.vl <= vlAlpha ? hash.vl : -MATE_VALUE
  }
  return hash.vl
}

Search.prototype.recordHash = function (flag, vl, depth, mv) {
  let hash = this.getHashItem()
  if (hash.depth > depth) {
    return
  }
  hash.flag = flag
  hash.depth = depth
  if (vl > WIN_VALUE) {
    if (mv === 0 && vl <= BAN_VALUE) {
      return
    }
    hash.vl = vl + this.pos.distance
  } else if (vl < -WIN_VALUE) {
    if (mv === 0 && vl >= -BAN_VALUE) {
      return
    }
    hash.vl = vl - this.pos.distance
  } else if (vl === this.pos.drawValue() && mv === 0) {
    return
  } else {
    hash.vl = vl
  }
  hash.mv = mv
  hash.zobristLock = this.pos.zobristLock
}

Search.prototype.setBestMove = function (mv, depth) {
  this.historyTable[this.pos.historyIndex(mv)] += depth * depth
  let mvsKiller = this.killerTable[this.pos.distance]
  if (mvsKiller[0] !== mv) {
    mvsKiller[1] = mvsKiller[0]
    mvsKiller[0] = mv
  }
}

Search.prototype.searchQuiesc = function (vlAlpha_, vlBeta) {
  let vlAlpha = vlAlpha_
  ++this.allNodes
  let vl = this.pos.mateValue()
  if (vl >= vlBeta) {
    return vl
  }
  let vlRep = this.pos.repStatus(1)
  if (vlRep > 0) {
    return this.pos.repValue(vlRep)
  }
  if (this.pos.distance === LIMIT_DEPTH) {
    return this.pos.evaluate()
  }
  let vlBest = -MATE_VALUE
  let mvs = [],
    vls = []
  if (this.pos.inCheck()) {
    mvs = this.pos.generateMoves(null)
    for (let i = 0; i < mvs.length; ++i) {
      vls.push(this.historyTable[this.pos.historyIndex(mvs[i])])
    }
    shellSort(mvs, vls)
  } else {
    vl = this.pos.evaluate()
    if (vl > vlBest) {
      if (vl >= vlBeta) {
        return vl
      }
      vlBest = vl
      vlAlpha = Math.max(vl, vlAlpha)
    }
    mvs = this.pos.generateMoves(vls)
    shellSort(mvs, vls)
    for (let i = 0; i < mvs.length; ++i) {
      if (
        vls[i] < 10 ||
        (vls[i] < 20 && HOME_HALF(DST(mvs[i]), this.pos.sdPlayer))
      ) {
        mvs.length = i
        break
      }
    }
  }
  for (let i = 0; i < mvs.length; ++i) {
    if (!this.pos.makeMove(mvs[i])) {
      continue
    }
    vl = -this.searchQuiesc(-vlBeta, -vlAlpha)
    this.pos.undoMakeMove()
    if (vl > vlBest) {
      if (vl >= vlBeta) {
        return vl
      }
      vlBest = vl
      vlAlpha = Math.max(vl, vlAlpha)
    }
  }
  return vlBest === -MATE_VALUE ? this.pos.mateValue() : vlBest
}

Search.prototype.searchFull = function (vlAlpha_, vlBeta, depth, noNull) {
  let vlAlpha = vlAlpha_
  if (depth <= 0) {
    return this.searchQuiesc(vlAlpha, vlBeta)
  }
  ++this.allNodes
  let vl = this.pos.mateValue()
  if (vl >= vlBeta) {
    return vl
  }
  let vlRep = this.pos.repStatus(1)
  if (vlRep > 0) {
    return this.pos.repValue(vlRep)
  }
  let mvHash = [0]
  vl = this.probeHash(vlAlpha, vlBeta, depth, mvHash)
  if (vl > -MATE_VALUE) {
    return vl
  }
  if (this.pos.distance === LIMIT_DEPTH) {
    return this.pos.evaluate()
  }
  if (!noNull && !this.pos.inCheck() && this.pos.nullOkay()) {
    this.pos.nullMove()
    vl = -this.searchFull(-vlBeta, 1 - vlBeta, depth - NULL_DEPTH - 1, true)
    this.pos.undoNullMove()
    if (
      vl >= vlBeta &&
      (this.pos.nullSafe() ||
        this.searchFull(vlAlpha, vlBeta, depth - NULL_DEPTH, true) >= vlBeta)
    ) {
      return vl
    }
  }
  let hashFlag = HASH_ALPHA
  let vlBest = -MATE_VALUE
  let mvBest = 0
  let sort = new MoveSort(
    mvHash[0],
    this.pos,
    this.killerTable,
    this.historyTable
  )
  let mv
  while ((mv = sort.next()) > 0) {
    if (!this.pos.makeMove(mv)) {
      continue
    }
    let newDepth = this.pos.inCheck() || sort.singleReply ? depth : depth - 1
    if (vlBest === -MATE_VALUE) {
      vl = -this.searchFull(-vlBeta, -vlAlpha, newDepth, false)
    } else {
      vl = -this.searchFull(-vlAlpha - 1, -vlAlpha, newDepth, false)
      if (vl > vlAlpha && vl < vlBeta) {
        vl = -this.searchFull(-vlBeta, -vlAlpha, newDepth, false)
      }
    }
    this.pos.undoMakeMove()
    if (vl > vlBest) {
      vlBest = vl
      if (vl >= vlBeta) {
        hashFlag = HASH_BETA
        mvBest = mv
        break
      }
      if (vl > vlAlpha) {
        vlAlpha = vl
        hashFlag = HASH_PV
        mvBest = mv
      }
    }
  }
  if (vlBest === -MATE_VALUE) {
    return this.pos.mateValue()
  }
  this.recordHash(hashFlag, vlBest, depth, mvBest)
  if (mvBest > 0) {
    this.setBestMove(mvBest, depth)
  }
  return vlBest
}

Search.prototype.searchRoot = function (depth) {
  let vlBest = -MATE_VALUE
  let sort = new MoveSort(
    this.mvResult,
    this.pos,
    this.killerTable,
    this.historyTable
  )
  let mv
  while ((mv = sort.next()) > 0) {
    if (!this.pos.makeMove(mv)) {
      continue
    }
    let newDepth = this.pos.inCheck() ? depth : depth - 1
    let vl
    if (vlBest === -MATE_VALUE) {
      vl = -this.searchFull(-MATE_VALUE, MATE_VALUE, newDepth, true)
    } else {
      vl = -this.searchFull(-vlBest - 1, -vlBest, newDepth, false)
      if (vl > vlBest) {
        vl = -this.searchFull(-MATE_VALUE, -vlBest, newDepth, true)
      }
    }
    this.pos.undoMakeMove()
    if (vl > vlBest) {
      vlBest = vl
      this.mvResult = mv
      if (vlBest > -WIN_VALUE && vlBest < WIN_VALUE) {
        vlBest +=
          Math.floor(Math.random() * RANDOMNESS) -
          Math.floor(Math.random() * RANDOMNESS)
        vlBest = vlBest === this.pos.drawValue() ? vlBest - 1 : vlBest
      }
    }
  }
  this.setBestMove(this.mvResult, depth)
  return vlBest
}

Search.prototype.searchUnique = function (vlBeta, depth) {
  let sort = new MoveSort(
    this.mvResult,
    this.pos,
    this.killerTable,
    this.historyTable
  )
  sort.next()
  let mv
  while ((mv = sort.next()) > 0) {
    if (!this.pos.makeMove(mv)) {
      continue
    }
    let vl = -this.searchFull(
      -vlBeta,
      1 - vlBeta,
      this.pos.inCheck() ? depth : depth - 1,
      false
    )
    this.pos.undoMakeMove()
    if (vl >= vlBeta) {
      return false
    }
  }
  return true
}

Search.prototype.searchMain = function (depth, millis) {
  this.mvResult = this.pos.bookMove()
  if (this.mvResult > 0) {
    this.pos.makeMove(this.mvResult)
    if (this.pos.repStatus(3) === 0) {
      this.pos.undoMakeMove()
      return this.mvResult
    }
    this.pos.undoMakeMove()
  }
  this.hashTable = []
  for (let i = 0; i <= this.hashMask; ++i) {
    this.hashTable.push({ depth: 0, flag: 0, vl: 0, mv: 0, zobristLock: 0 })
  }
  this.killerTable = []
  for (let i = 0; i < LIMIT_DEPTH; ++i) {
    this.killerTable.push([0, 0])
  }
  this.historyTable = []
  for (let i = 0; i < 4096; ++i) {
    this.historyTable.push(0)
  }
  this.mvResult = 0
  this.allNodes = 0
  this.pos.distance = 0
  let t = new Date().getTime()
  for (let i = 1; i <= depth; ++i) {
    let vl = this.searchRoot(i)
    this.allMillis = new Date().getTime() - t
    if (this.allMillis > millis) {
      break
    }
    //console.log('');
    if (vl > WIN_VALUE || vl < -WIN_VALUE) {
      break
    }
    if (this.searchUnique(1 - WIN_VALUE, i)) {
      break
    }
  }
  return this.mvResult
}

Search.prototype.getKNPS = function () {
  return this.allNodes / this.allMillis
}

/*
EVENT TARGET
 */

var EventTarget = function () {
  this.listeners = {}
}

EventTarget.prototype.listeners = null
EventTarget.prototype.addEventListener = function (type, callback) {
  if (!(type in this.listeners)) {
    this.listeners[type] = []
  }
  this.listeners[type].push(callback)
}

EventTarget.prototype.removeEventListener = function (type, callback) {
  if (!(type in this.listeners)) {
    return
  }
  var stack = this.listeners[type]
  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback) {
      stack.splice(i, 1)
      return
    }
  }
}

EventTarget.prototype.dispatchEvent = function (event) {
  if (!(event.type in this.listeners)) {
    return true
  }
  var stack = this.listeners[event.type].slice()

  for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event)
  }
  return !event.defaultPrevented
}

/*
board.js - Source Code for XiangQi Wizard Light, Part IV

XiangQi Wizard Light - a Chinese Chess Program for JavaScript
Designed by Morning Yellow, Version: 1.0, Last Modified: Sep. 2012
Copyright (C) 2004-2012 www.xqbase.com

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

const RESOURCES = "/chess/assets/"

const THINKING_WIDTH_MOBILE = 24
const THINKING_HEIGHT_MOBILE = 24
const THINKING_WIDTH = 43
const THINKING_HEIGHT = 11

const ROWS = 9
const COLS = 8
const RIVER = 4

const RESULT_UNKNOWN = 0
const RESULT_WIN = 1
const RESULT_DRAW = 2
const RESULT_LOSS = 3

const ANIM_STEP = 8
const MAX_STEPS = 12

const PIECE_NAME = [
  "oo",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  "rk",
  "ra",
  "rb",
  "rn",
  "rr",
  "rc",
  "rp",
  null,
  "bk",
  "ba",
  "bb",
  "bn",
  "br",
  "bc",
  "bp",
  null,
]
const STARTUP_FEN = [
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKAB1R w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/R1BAKAB1R w",
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/9/1C5C1/9/RN2K2NR w",
]

function SQ_X(sq) {
  return FILE_X(sq) - 3
}

function SQ_Y(sq) {
  return RANK_Y(sq) - 3
}

export default class Board extends EventTarget {
  constructor(
    element,
    computer,
    online,
    fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w"
  ) {
    super()
    this.element = element

    this.computer = computer
    this.online = online

    this.pos = new Position()
    this.pos.fromFen(fen)

    this.animated = false
    this.search = null
    this.sqSelected = 0
    this.mvLast = 0
    this.millis = 0
    this.result = RESULT_UNKNOWN
    this.busy = false
    this.gameover = false

    this.element.style.position = "relative"

    // Table
    this.table = document.createElement("table")
    this.table.style.position = "absolute"
    this.table.style.tableLayout = "fixed"
    this.table.style.borderCollapse = "collapse"
    this.table.style.borderSpacing = "0"
    this.cells = []
    for (let j = 0; j < ROWS; ++j) {
      let row = document.createElement("tr")
      for (let i = 0; i < COLS; ++i) {
        let cell = document.createElement("td")
        let border = "1px solid #000"
        if (j !== RIVER) {
          cell.style.border = border
        } else if (i === 0) {
          cell.style.borderLeft = border
        } else if (i === COLS - 1) {
          cell.style.borderRight = border
        }
        if (
          (j === 0 && i === 3) ||
          (j === 1 && i === 4) ||
          (j === ROWS - 1 && i === 4) ||
          (j === ROWS - 2 && i === 3)
        ) {
          cell.classList.add("diagtb")
        } else if (
          (j === 1 && i === 3) ||
          (j === 0 && i === 4) ||
          (j === ROWS - 1 && i === 3) ||
          (j === ROWS - 2 && i === 4)
        ) {
          cell.classList.add("diagbt")
        }
        row.append(cell)
        this.cells.push(cell)
      }
      this.table.append(row)
    }
    this.element.append(this.table)

    // Pieces
    let pieceMouseDown = function (evt) {
      // console.log(evt)
      this.clickSquare(evt.target.XiSqr)
    }.bind(this)
    let pieceDragStart = function (evt) {
      console.log(
        "🚀 ~ file: board.js:13858 ~ Board ~ pieceDragStart ~ evt:",
        evt
      )
      evt.target.style.opacity = 0
      this.clickSquare(evt.target.XiSqr)
    }.bind(this)
    let pieceDragEnd = function (evt) {
      evt.target.style.opacity = 1
    }
    let pieceDragOver = function (evt) {
      evt.preventDefault()
    }
    let pieceDrop = function (evt) {
      console.log(
        "🚀 ~ file: board.js:13858 ~ Board ~ pieceDragStart ~ evt:",
        evt
      )
      evt.preventDefault()
      let saveAnimate = this.animated
      this.animated = false
      this.clickSquare(evt.target.XiSqr)
      this.animated = saveAnimate
    }.bind(this)

    this.imgSquares = []
    let elImgs = document.createElement("div")
    for (let sq = 0; sq < 256; ++sq) {
      if (!IN_BOARD(sq)) {
        this.imgSquares.push(null)
        continue
      }
      let img = document.createElement("img")
      img.XiSqr = sq
      img.setAttribute("XiSqr", sq)
      // img.setAttribute("draggable", true)
      img.style.position = "absolute"
      img.addEventListener("mousedown", pieceMouseDown)
      // img.addEventListener("dragstart", pieceDragStart)
      // img.addEventListener("dragend", pieceDragEnd)
      // img.addEventListener("dragover", pieceDragOver)
      img.addEventListener("drop", pieceDrop)
      elImgs.appendChild(img)
      this.imgSquares.push(img)
    }
    element.appendChild(elImgs)

    if (window.innerWidth > 800) {
      this.thinking = new Image(43, 11)
      this.thinking.alt = "Thinking..."
      this.thinking.src = RESOURCES + "thinking.gif"
      this.thinking.style.opacity = "0.5"
    } else {
      this.thinking = document.createElement("div")
      this.thinking.className = "sbl-circ-ripple"
      this.thinking.style.position = "absolute"
    }
    this.thinking.style.position = "absolute"
    this.thinking.style.display = "none"
    element.appendChild(this.thinking)

    this.flushBoard()
    this.resize()
  }

  resize() {
    let width = this.element.clientWidth
    let height = this.element.clientHeight

    // Thinking
    if (window.innerWidth > 800) {
      this.thinking.style.left = ~~((width - THINKING_WIDTH) / 2) + "px"
      this.thinking.style.top = ~~((height - THINKING_HEIGHT) / 2) + "px"
    } else {
      this.thinking.style.left = ~~((width - THINKING_WIDTH_MOBILE) / 2) + "px"
      this.thinking.style.top = ~~((height - THINKING_HEIGHT_MOBILE) / 2) + "px"
    }

    // Table
    let cWidth = ~~(width / (COLS + 1) - 1) // -1 account for border
    let cHeight = ~~(height / (ROWS + 1) - 1) // -1 account for border
    let cWidthStr = cWidth + "px"
    let cHeightStr = cHeight + "px"
    for (let i = 0, len = this.cells.length; i < len; ++i) {
      let cell = this.cells[i]
      cell.style.width = cWidthStr
      cell.style.height = cHeightStr
    }
    let tOffTop = ~~((height - this.table.clientHeight) / 2)
    let tOffLeft = ~~((width - this.table.clientWidth) / 2)
    this.table.style.top = tOffTop + "px"
    this.table.style.left = tOffLeft + "px"

    cWidth = (this.table.clientWidth - 1) / COLS // Use actual table cell width/height
    cHeight = (this.table.clientHeight - 1) / ROWS

    // Points
    let pSize = ~~cHeight
    pSize = pSize & 1 ? pSize : pSize - 1 // force odd
    let pSizeStr = pSize + "px"
    let pOffTop = tOffTop - ~~(pSize / 2)
    let pOffLeft = tOffLeft - ~~(pSize / 2)
    for (let i = 0, len = this.imgSquares.length; i < len; ++i) {
      let img = this.imgSquares[i]
      if (!img) {
        continue
      }
      let sq = img.XiSqr
      img.style.width = pSizeStr
      img.style.height = pSizeStr
      img.style.top = pOffTop + cHeight * SQ_Y(sq) + "px"
      img.style.left = pOffLeft + cWidth * SQ_X(sq) + "px"
    }
  }

  setSearch(hashLevel) {
    this.search = hashLevel == 0 ? null : new Search(this.pos, hashLevel)
    //console.log(this.search);
  }

  flipped(sq) {
    return this.computer == 0 ? SQUARE_FLIP(sq) : sq
  }

  computerMove() {
    return this.pos.sdPlayer == this.computer
  }

  computerLastMove() {
    return 1 - this.pos.sdPlayer == this.computer
  }

  addMove(mv, computerMove) {
    // console.log("%cboard.js line:1946 mv", "color: #007acc;", mv)
    // console.log(`addMove`)
    if (!this.pos.legalMove(mv) || !this.pos.makeMove(mv)) {
      // console.log("Not Illegal move")
      return
    }
    this.busy = true

    // console.log("===========", "this.busy = true", (this.busy = true))
    if (!this.animated) {
      // console.log("0000000000")
      this.postAddMove(mv, computerMove)
      return
    }
    // console.log(1111111111)

    let srcStyle = this.imgSquares[this.flipped(SRC(mv))].style
    let dstStyle = this.imgSquares[this.flipped(DST(mv))].style
    let srcX = parseInt(srcStyle.left, 10)
    let srcY = parseInt(srcStyle.top, 10)
    let dstX = parseInt(dstStyle.left, 10)
    let dstY = parseInt(dstStyle.top, 10)
    let a = dstX - srcX
    let b = dstY - srcY
    let dist = Math.sqrt(a * a + b * b)
    let steps = ~~(dist / ANIM_STEP)
    if (steps > MAX_STEPS) {
      steps = MAX_STEPS
    }
    // console.log(22222222222)
    srcStyle.zIndex = 256
    let anim = function () {
      if (!steps) {
        this.postAddMove(mv, computerMove)
        srcStyle.left = srcX + "px"
        srcStyle.top = srcY + "px"
        srcStyle.zIndex = 0
      } else {
        let goalX = parseInt(dstStyle.left, 10)
        let goalY = parseInt(dstStyle.top, 10)
        let atX = parseInt(srcStyle.left, 10)
        let atY = parseInt(srcStyle.top, 10)
        let stepX = (goalX - atX) / steps
        let stepY = (goalY - atY) / steps
        srcStyle.left = atX + stepX + "px"
        srcStyle.top = atY + stepY + "px"
        --steps
        requestAnimationFrame(anim)
      }
    }.bind(this)
    requestAnimationFrame(anim)
    this.busy = false
  }

  postAddMove(mv, computerMove) {
    if (this.mvLast > 0) {
      this.drawSquare(SRC(this.mvLast), false)
      this.drawSquare(DST(this.mvLast), false)
    }
    this.drawSquare(SRC(mv), true)
    this.drawSquare(DST(mv), true)
    this.sqSelected = 0
    this.mvLast = mv

    let moveDetails = {
      move: mv,
      isComputer: computerMove,
      check: false,
      capture: false,
    }

    if (this.pos.isMate()) {
      this.result = computerMove ? RESULT_LOSS : RESULT_WIN
      this.gameover = true

      let pc = SIDE_TAG(this.pos.sdPlayer) + PIECE_KING
      let sqMate = 0
      for (let sq = 0; sq < 256; ++sq) {
        if (this.pos.squares[sq] === pc) {
          sqMate = sq
          break
        }
      }

      if (computerMove || this.computer === -1) {
        moveDetails.check = true
      }
      this.dispatchEvent(new CustomEvent("move", { detail: moveDetails }))
      // dispatchEvent 'gameover' is in postMate()

      if (!sqMate) {
        this.postMate(computerMove)
        return
      } else if (!this.animated) {
        // Choose to animate king
        sqMate = this.flipped(sqMate)
        this.imgSquares[sqMate].src =
          RESOURCES + (this.pos.sdPlayer == 0 ? "r" : "b") + "km.svg"
        this.postMate(computerMove)
        return
      }
      sqMate = this.flipped(sqMate)
      let style = this.imgSquares[sqMate].style
      let x = parseInt(style.left, 10)
      let steps = ANIM_STEP - 1

      style.zIndex = 256
      let anim = function () {
        if (steps === 0) {
          style.left = x + "px"
          style.zIndex = 0
          this.imgSquares[sqMate].src =
            RESOURCES + (this.pos.sdPlayer == 0 ? "r" : "b") + "km.svg"
          setTimeout(this.postMate(computerMove), 250)
        } else {
          style.left = x + ((steps & 1) == 0 ? steps : -steps) * 2 + "px"
          --steps
          requestAnimationFrame(anim)
        }
      }.bind(this)
      requestAnimationFrame(anim)
      return
    }

    let vlRep = this.pos.repStatus(30)
    if (vlRep > 0) {
      let msg
      vlRep = this.pos.repValue(vlRep)
      if (vlRep > -WIN_VALUE && vlRep < WIN_VALUE) {
        this.result = RESULT_DRAW
        msg = "Draw from repetition!"
      } else if (computerMove == vlRep < 0) {
        this.result = RESULT_LOSS
        msg = "You lose, but please don't give up!"
      } else {
        this.result = RESULT_WIN
        msg = "Congratulations on your win!"
      }
      let gameoverDetails = {
        checkmate: false,
        result: this.result,
        message: msg,
      }
      this.dispatchEvent(new CustomEvent("move", { detail: moveDetails }))
      this.dispatchEvent(
        new CustomEvent("gameover", { detail: gameoverDetails })
      )
      this.busy = false
      return
    }

    if (this.pos.captured()) {
      let hasMaterial = false
      for (let sq = 0; sq < 256; ++sq) {
        if (IN_BOARD(sq) && (this.pos.squares[sq] & 7) > 2) {
          hasMaterial = true
          break
        }
      }
      if (!hasMaterial) {
        this.result = RESULT_DRAW
        let gameoverDetails = {
          checkmate: false,
          result: this.result,
          message: "Draw! Neither side has any offensive pieces.",
        }
        this.dispatchEvent(new CustomEvent("move", { detail: moveDetails }))
        this.dispatchEvent(
          new CustomEvent("gameover", { detail: gameoverDetails })
        )
        this.busy = false
        return
      }
    } else if (this.pos.pcList.length > 100) {
      let captured = false
      for (let i = 2; i <= 100; ++i) {
        if (this.pos.pcList[this.pos.pcList.length - i] > 0) {
          captured = true
          break
        }
      }
      if (!captured) {
        this.result = RESULT_DRAW
        let gameoverDetails = {
          checkmate: false,
          result: this.result,
          message: "Draw!",
        }
        this.dispatchEvent(new CustomEvent("move", { detail: moveDetails }))
        this.dispatchEvent(
          new CustomEvent("gameover", { detail: gameoverDetails })
        )
        this.busy = false
        return
      }
    }

    if (this.pos.inCheck() && (computerMove || this.computer === -1)) {
      moveDetails.check = true
    } else {
      if (this.pos.captured()) {
        moveDetails.capture = true
      }
    }

    this.dispatchEvent(new CustomEvent("move", { detail: moveDetails }))

    // this.response()
  }

  postMate(computerMove) {
    let gameoverDetails = {
      checkmate: true,
      result: computerMove ? RESULT_LOSS : RESULT_WIN,
      message: computerMove
        ? "You lose, but please don't give up!"
        : "Congratulations on your win!",
    }
    this.dispatchEvent(new CustomEvent("gameover", { detail: gameoverDetails }))
    this.busy = false
  }

  response() {
    // console.log`response`
    if (!this.computerMove()) {
      // player's move
      this.busy = false
      return
    } else if (this.online) {
      // online game, opponent's move
      this.busy = true
      return
    } else if (!this.search) {
      // local game
      this.busy = false
      return
    }
    // Computer game, computer's move
    this.busy = true // Should have already happened, but stay busy until computer makes a move
    this.thinking.style.display = "inline-block"
    let think = function () {
      this.addMove(this.search.searchMain(LIMIT_DEPTH, this.millis), true)
      this.thinking.style.display = "none"
    }.bind(this)
    setTimeout(think, 250)
  }

  triggerBusy(busy = null) {
    if (busy == null) {
      this.busy = !this.busy
    } else {
      this.busy = busy
    }

    if (this.busy) {
      this.thinking.style.display = "inline-block"
    } else {
      this.thinking.style.display = "none"
    }
  }

  genNextMove() {
    console.log`genNextMove`
    this.triggerBusy(true)
    let think = function () {
      this.addMove(this.search.searchMain(LIMIT_DEPTH, this.millis), true)
      this.triggerBusy()
    }.bind(this)
    setTimeout(think, 100)
  }

  clickSquare(sq_) {
    console.log(sq_)
    // console.log`clickSquare`
    if (this.busy || this.result !== RESULT_UNKNOWN) {
      return
    }
    let sq = this.flipped(sq_)
    let pc = this.pos.squares[sq]
    if ((pc & SIDE_TAG(this.pos.sdPlayer)) !== 0) {
      if (this.mvLast !== 0) {
        this.drawSquare(SRC(this.mvLast), false)
        this.drawSquare(DST(this.mvLast), false)
      }
      if (this.sqSelected) {
        this.drawSquare(this.sqSelected, false)
      }
      this.drawSquare(sq, true)
      this.sqSelected = sq

      this.dispatchEvent(
        new CustomEvent("choosePeice", { detail: { square: sq } })
      )
    } else if (this.sqSelected > 0) {
      this.addMove(MOVE(this.sqSelected, sq), false)
    }
  }

  getSquareName(sq) {
    return PIECE_NAME[this.pos.squares[sq]]
  }

  drawSquare(sq, selected) {
    let img = this.imgSquares[this.flipped(sq)]
    let name = PIECE_NAME[this.pos.squares[sq]]
    if (name === "oo") {
      img.src = RESOURCES + name + ".gif"
    } else {
      img.src = RESOURCES + name + ".svg"
    }
    img.style.backgroundImage = selected ? "url(" + RESOURCES + "oos.svg)" : ""
  }

  flushBoard() {
    this.mvLast = this.pos.mvList[this.pos.mvList.length - 1]
    for (let sq = 0; sq < 256; ++sq) {
      if (IN_BOARD(sq)) {
        this.drawSquare(sq, sq == SRC(this.mvLast) || sq == DST(this.mvLast))
      }
    }
  }

  restart(fen = null) {
    if (this.busy) {
      return
    }
    if (fen === null) {
      fen = STARTUP_FEN[0]
    }
    this.result = RESULT_UNKNOWN
    this.pos.fromFen(fen)
    this.flushBoard()
    // this.response()
  }

  retract() {
    if (this.busy) {
      return
    }
    this.result = RESULT_UNKNOWN
    if (this.pos.mvList.length > 1) {
      this.pos.undoMakeMove()
    }
    if (this.pos.mvList.length > 1 && this.computerMove()) {
      console.log(this.computer, this.computerMove())
      this.pos.undoMakeMove()
    }
    this.flushBoard()
    this.response()
  }
}
