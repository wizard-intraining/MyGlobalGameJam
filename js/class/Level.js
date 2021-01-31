"use strict";
// 关卡控制
const Level = {
  n: 0,
  load: function (n, dispose = () => { }) {
    this.n = n
    dispose()
    loadScript(`./js/level/level${n}.js`)
  },
  win: function (dispose) {
    player.valid = false
    scene.valid = false
    Hint.VICTORY.play()
    // 播放完胜利声音后再载入下一关
    setTimeout(() => { this.load(this.n + 1, dispose) }, 3000)
  },
  lose: function (dispose) {
    player.valid = false
    scene.valid = false
    this.load(this.n, dispose)
  }
}