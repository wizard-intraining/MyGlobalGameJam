"use strict";
// 关卡控制
const Level = {
  n: 0,
  load: function (n) {
    this.n = n
    loadScript(`./js/level/level${n}.js`)
  },
  win: function () {
    player = null
    scene = null
    Hint.VICTORY.play()
    setTimeout(() => { this.load(this.n + 1) }, 3000)
  },
  lose: function () {
    this.load(this.n)
  }
}