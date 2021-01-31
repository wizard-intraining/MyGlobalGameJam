'use strict';
Storyboard.show({
  pic: './src/pics/storyImage/1.gif',
  title: '第1/5关：心锁',
  content: '这旋律，这自然的律动，似乎有种魔力。<br>如果以正确的排列演奏，就有感化人心的效果。'
})
// scene
{
  scene = new Scene(Level.n)
  // wall
  const wall = {
    __proto__: scene.defaultElement,
    hint: Hint.NORMALBUMP,
    canStay: false,
  }
  for (let i = 0; i <= scene.width + 1; i++) {
    scene[i][0] = wall // 上边
    scene[i][scene.height + 1] = wall // 下边
  }
  for (let i = 0; i <= scene.height + 1; i++) {
    scene[0][i] = wall // 左边
    scene[scene.width + 1][i] = wall // 右边
    scene[13][i] = wall // 中间的墙
  }
  // paper
  const [paperX, paperY] = [5, 3]
  const centerPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.PAPER,
    interact: function () {
      [
        Hint.piano.low1,
        Hint.piano.low2,
        Hint.piano.low3,
        Hint.piano.low4,
      ].forEach((h, i) => {
        setTimeout(() => h.play(), 800 * i)
      })
      Storyboard.show({
        content: '我好像也慢慢记起了什么，<br>最开始时，她似乎无法触及。<br>她的心门宛如上了一道厚重的锁。<br>该怎样，才能跟她亲近呢？'
      })
    },
  }
  const aroundPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.PAPERWEAK,
  }
  const aroundIndex = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],/* [0, 0], */[0, 1],
    [1, -1], [1, 0], [1, 1],
  ]
  scene[paperX][paperY] = centerPaper
  aroundIndex.forEach(element => {
    const [x, y] = [element[0] + paperX, element[1] + paperY]
    if (x >= 1 && x <= scene.width &&
      y >= 1 && y <= scene.height)
      scene[x][y] = aroundPaper
  })
  // door
  const door = {
    __proto__: scene.defaultElement,
    hint: Hint.DOORBUMP,
    canStay: false
  }
  for (let i = 1; i <= 3; i++) {
    scene[13][6 + i] = door // 共用一个对象，门要开一起开
  }
  scene.doorOpen = function () {
    delete door.hint
    delete door.canStay
    Hint.DOOROPEN.play()
  }
  scene.valid = true
}
// player
{
  player = new Player(1, 1)
  const openDoorNoteList = [
    Hint.piano.low1,
    Hint.piano.low2,
    Hint.piano.low3,
    Hint.piano.low4,
  ]
  player.checkNoteList = function () {
    if (this.x === 12 &&
      this.y >= 7 && this.y <= 9) {
      if (this.noteList.length === openDoorNoteList.length) {
        for (let i = 0; i < this.noteList.length; i++) {
          if (this.noteList[i] !== openDoorNoteList[i])
            return
        }
        scene.doorOpen()
      }
    }
  }
  player.endMove = function () {
    if (this.x === scene.width && this.y === scene.height)
      Level.win()
  }
  player.valid = true
}