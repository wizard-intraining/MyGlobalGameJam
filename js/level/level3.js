'use strict';
Storyboard.show({
  pic: './src/pics/storyImage/3.gif',
  title: '第3/5关：热恋',
  content: '我想起来了，就是这样的，<br>她情不自禁地被我的音乐吸引，<br>我也越来越觉得她的舞姿曼妙动人，'
})
Storyboard.show({
  content: '纵然有许许多多的障碍和阻隔横在我们之间，<br>我们无所畏惧，<br>我们越来越靠近彼此，<br>我用我的音乐演奏了我深切的爱意，<br>自此，我们之间再无隔阂。'
})
ui.level3 = {
  loverDiv: document.createElement('div'),
}
ui.level3.loverDiv.style = `
  width: 50px;
  height: 50px;
  left: 1150px;
  top: 0px;
  position: absolute;
  background-image: url('./src/pics/lover.png');
  background-color: transparent;
  background-size: cover;`
ui.elements.mapcontainer.appendChild(ui.level3.loverDiv)
// scene
{
  scene = new Scene(Level.n)
  // 因为此关墙多路少，所以将默认元素改成墙
  const path = scene.defaultElement
  scene.setDefaultElement({
    hint: Hint.NORMALBUMP,
    canStay: false,
  })
  // path
  // 镜像的路径
  const mirrorInit = (x, y) => {
    scene[x][y] = path
    scene[scene.width - x + 1][scene.height - y + 1] = path
  }
  for (let i = 1; i <= 15; i++) mirrorInit(i, 12)
  for (let i = 15; i <= 19; i++) mirrorInit(i, 11)
  for (let j = 10; j >= 4; j--) mirrorInit(19, j)
  for (let i = 18; i >= 9; i--) mirrorInit(i, 4)
  for (let i = 9; i >= 8; i--) mirrorInit(i, 5)
  for (let j = 6; j <= 7; j++) mirrorInit(8, j)
  for (let i = 8; i <= 12; i++) mirrorInit(i, 7)
  scene[13][7] = path
  
  // door
  const door = {
    __proto__: scene.defaultElement,
    hint: Hint.DOORBUMP,
  }
  scene[13][6] = door
  // paper
  scene.openDoorNoteList = [
    // 甜蜜蜜乐谱，仅修改此处可同时导致卷轴和开门判定发生变化
    Hint.guitar.mid3,
    Hint.guitar.mid5,
    Hint.guitar.mid6,
    Hint.guitar.mid3,
    Hint.guitar.mid1,
    Hint.guitar.mid2,
    Hint.guitar.mid1,
    Hint.guitar.mid2,
    Hint.guitar.mid5,
    Hint.guitar.mid3,
  ]
  const centerPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.PAPER,
    canStay: true,
    interact: function () {
      scene.openDoorNoteList.forEach((h, i) => {
        setTimeout(() => h.play(), 800 * i)
      })
    },
  }
  const aroundPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.PAPERWEAK,
    canStay: true,
  }
  scene[19][5] = centerPaper
  scene[19][4] = aroundPaper
  scene[19][6] = aroundPaper
  scene.valid = true
}
// player
{
  player = new Player(1, scene.height) // 主角左下
  player.lover = { // 恋人右上
    __proto__: Player.prototype,
    x: scene.width,
    y: 1,
    mode: OperationMode.MOVE,
    move: function (orientation) {
      if (this.x === 14 && this.y === 6 &&
        orientation === Orientation.LEFT)
        // 恋人可移动到门上
        this.moveTo({ x: this.x - 1, y: this.y })
      else if (this.x === 13 && this.y === 6 &&
        orientation === Orientation.DOWN)
        // 在门上向下移动就撞门
        Hint.DOORBUMP.play()
      else
        this.__proto__.move.apply(this, arguments)
    },
    uiUpdateLocation: function () {
      ui.level3.loverDiv.style.top = `${(this.y - 1) * 50}px`
      ui.level3.loverDiv.style.left = `${(this.x - 1) * 50}px`
    },
    endMove: function () { },
  }
  const loverMoveMap = new Map()
  loverMoveMap.set(Hint.violin.low2, Orientation.UP)
  loverMoveMap.set(Hint.violin.mid2, Orientation.DOWN)
  loverMoveMap.set(Hint.violin.mid1, Orientation.LEFT)
  loverMoveMap.set(Hint.violin.mid3, Orientation.RIGHT)
  player.play = function () {
    Player.prototype.play.apply(this, arguments)
    const lastNote = this.noteList[this.noteList.length - 1]
    if (loverMoveMap.has(lastNote))
      player.lover.move(loverMoveMap.get(lastNote))
  }
  player.endMove = function () { }
  player.checkNoteList = function () {
    if (this.x === 13 && this.y === 7 &&
      player.lover.x === 13 && player.lover.y === 6 &&
      this.noteList.length === scene.openDoorNoteList.length) {
      for (let i = 0; i < this.noteList.length; i++) {
        if (this.noteList[i] !== scene.openDoorNoteList[i]) return
      }
      // 乐谱检查通过，先开门再胜利
      this.valid = false
      scene.valid = false
      Hint.DOOROPEN.play()
      setTimeout(() => {
        Level.win(() => {
          // dispose
          for (const element in ui.level3)
            ui.level3[element].remove()
        })
      }, 1000)
    }
  }
  player.valid = true
}