'use strict';
Storyboard.show({
  pic: './src/pics/storyImage/4.gif',
  title: '第4/5关：背道',
  content: `可是，为什么想到她会很痛苦，<br>明明，都是美好的回忆，<br>一点一点地，平息她的怒火，<br>一遍不行就再来一遍，直到无能为力，<br>难道，我应该，离开了吗？`
})
// 新的元素
ui.level4 = { loverDiv: document.createElement('div') }
ui.level4.loverDiv.style = `
    width: 50px;
    height: 50px;
    left: 1050px;
    top: 250px;
    position: absolute;
    background-image: url('./src/pics/lover.png');
    background-color: transparent;
    background-size: cover;`
ui.elements.mapcontainer.appendChild(ui.level4.loverDiv)
// scene
{
  scene = new Scene(Level.n)
  //wall
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
  }
  // paper
  scene.fireDieList = [
    // 灭火乐谱，仅修改此处可同时导致卷轴和判定发生变化
    Hint.piano.low4,
    Hint.piano.low3,
    Hint.piano.low2,
    Hint.piano.low1,
  ]
  const centerPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.PAPER,
    interact: function () {
      scene.fireDieList.forEach((h, i) => {
        setTimeout(() => h.play(), 800 * i)
      })
    },
  }
  const aroundPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.PAPERWEAK,
  }
  scene[scene.width][4] = aroundPaper
  scene[scene.width][5] = centerPaper // 卷轴在这里
  scene[scene.width][6] = aroundPaper
  //fire
  scene.fire = {
    __proto__: scene.defaultElement,
    hint: Hint.FIREBURN,
  }
  scene.fireWeak = {
    __proto__: scene.defaultElement,
    hint: Hint.FIREBURN,
  }
  scene.fireAlways = {
    __proto__: scene.defaultElement,
    hint: Hint.FIREBURN,
  }
  for (let i = 1; i <= 2; i++) {
    scene[i][5] = scene.fireAlways
    scene[i][6] = scene.fireAlways
    scene[i][7] = scene.fireAlways
  }
  for (let i = 3; i <= 11; i++) {
    scene[i][5] = scene.fire
    scene[i][6] = scene.fire
    scene[i][7] = scene.fire
  }
  for (let i = 12; i <= scene.width - 1; i++) {
    scene[i][5] = scene.fireWeak
    scene[i][6] = scene.fireWeak
    scene[i][7] = scene.fireWeak
  }
  scene.fireDie = function (f) {
    delete f.hint
    Hint.WATEROUT.play()
    if (f === this.fireWeak) {
      player.lover.x = 10
      // 这部分卷轴被火挡住了
      scene[scene.width - 1][4] = aroundPaper
      scene[scene.width - 1][5] = aroundPaper
      scene[scene.width - 1][6] = aroundPaper
    }
    else if (f === this.fire)
      player.lover.x = 1
  }
  scene.valid = true
}
// player
{
  player = new Player(scene.width, 6)
  player.lover = {
    _x: scene.width - 2, // 开始就隔一道火
    _y: 6,
    get x() { return this._x },
    set x(value) {
      this._x = value
      ui.level4.loverDiv.style.left = `${(value - 1) * 50}px`
    },
    get y() { return this._y },
    set y(value) {
      this._y = value
      ui.level4.loverDiv.style.top = `${(value - 1) * 50}px`
    },
  }
  player.checkNoteList = function () {
    if (scene[this.x][this.y] === scene.fireWeak) {
      console.log('fireWeak')
      if (this.noteList.length === scene.fireDieList.length) {
        for (let i = 0; i < this.noteList.length; i++) {
          if (this.noteList[i] !== scene.fireDieList[i])
            return
        }
        scene.fireDie(scene.fireWeak)
      }
    } else if (scene[this.x][this.y] === scene.fire) {
      console.log('fire')
      if (this.noteList.length === 2 * scene.fireDieList.length) {
        for (let i = 0; i < scene.fireDieList.length; i++) {
          if (this.noteList[i] !== scene.fireDieList[i])
            return
        }
        for (let i = 0; i < scene.fireDieList.length; i++) {
          if (this.noteList[i + scene.fireDieList.length] !== scene.fireDieList[i])
            return
        }
        scene.fireDie(scene.fire)
      }
    }
  }
  const dispose = () => {
    for (const element in ui.level4)
      ui.level4[element].remove()
  }
  player.endMove = function () {
    //lover的位移：到顶后不能再被浇灭火
    if (this.x === this.lover.x && this.y === this.lover.y) {
      Level.lose(dispose)
    } else if (this.lover.x === 1 &&
      this.x === scene.width && this.y === 6) {
      Level.win(dispose)
    }
  }
  player.valid = true
}
