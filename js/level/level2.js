'use strict';
Storyboard.show({
  pic: './src/pics/storyImage/2.gif',
  title: '第2/5关：陪伴',
  content: '过去的记忆在我眼前越来越清晰，<br>后来，我们一起去了舞会……'
})
// 新的 ui 元素加入到 ui.levelN 中
ui.level2 = {
  playerDiv: document.createElement('div'),
  loverDiv: document.createElement('div'),
  goblinDiv: document.createElement('div'),
}
ui.level2.playerDiv.style = `
  width: 350px;
  height: 350px;
  left: 150px;
  top: 50px;
  position: absolute;
  background-image: url('./src/pics/player.png');
  background-color: transparent;
  background-size: cover;`
ui.level2.loverDiv.style = `
  width: 350px;
  height: 350px;
  left: 700px;
  top: 50px;
  position: absolute;
  background-image: url('./src/pics/lover.png');
  background-color: transparent;
  background-size: cover;`
ui.level2.goblinDiv.style = `
  width: 200px;
  height: 200px;
  left: 500px;
  top: 150px;
  position: absolute;
  background-image: url('./src/pics/goblin.gif');
  background-color: transparent;
  background-size: cover;`
ui.elements.mapcontainer.appendChild(ui.level2.playerDiv)
ui.elements.mapcontainer.appendChild(ui.level2.loverDiv)
ui.elements.mapcontainer.appendChild(ui.level2.goblinDiv)
// scene
{
  scene = new Scene(Level.n)
  // paper
  const centerPaperList = [
    // 第一个卷轴
    [12, 12, {
      __proto__: scene.defaultElement,
      hint: Hint.PAPER,
      interact: function () {
        [
          Hint.violin.mid1,
        ].forEach((h, i) => {
          setTimeout(() => h.play(), 800 * i)
        })
        Storyboard.show({
          content: '舞会上我弹琴，她伴舞，'
        })
      },
    }],
    // 第二个卷轴
    [15, 12, {
      __proto__: scene.defaultElement,
      hint: Hint.PAPER,
      interact: function () {
        [
          Hint.violin.mid2,
        ].forEach((h, i) => {
          setTimeout(() => h.play(), 800 * i)
        })
        Storyboard.show({
          content: '大家都非常，非常快乐，<br>他们都说我们心有灵犀，'
        })
      },
    }],
    // 第三个卷轴
    [18, 12, {
      __proto__: scene.defaultElement,
      hint: Hint.PAPER,
      interact: function () {
        [
          Hint.violin.mid3,
        ].forEach((h, i) => {
          setTimeout(() => h.play(), 800 * i)
        })
        Storyboard.show({
          content: '她总有办法让舞步跟上我的节奏。'
        })
      },
    }],
    // 第四个卷轴
    [21, 12, {
      __proto__: scene.defaultElement,
      hint: Hint.PAPER,
      interact: function () {
        [
          Hint.violin.mid4,
        ].forEach((h, i) => {
          setTimeout(() => h.play(), 800 * i)
        })
        Storyboard.show({
          content: '后来我们都很累了，<br>大家说：只要给我们再来一场最精彩的表演，就让你们回家休息。'
        })
      },
    }],
  ]
  const aroundPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.PAPERWEAK,
  }
  const aroundIndex = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],/* [0, 0], */[0, 1],
    [1, -1], [1, 0], [1, 1],
  ]
  for (const [paperX, paperY, centerPaper] of centerPaperList) {
    scene[paperX][paperY] = centerPaper
    aroundIndex.forEach(element => {
      const [x, y] = [element[0] + paperX, element[1] + paperY]
      if (x >= 1 && x <= scene.width &&
        y >= 1 && y <= scene.height)
        scene[x][y] = aroundPaper
    })
  }
  // wall
  const wall = {
    __proto__: scene.defaultElement,
    hint: Hint.NORMALBUMP,
    canStay: false,
  }
  for (let i = 0; i <= scene.width + 1; i++) {
    scene[i][0] = wall // 上边
    scene[i][scene.height + 1] = wall // 下边
    scene[i][8] = wall // 吧台
  }
  for (let i = 0; i <= scene.height + 1; i++) {
    scene[0][i] = wall // 左边
    scene[scene.width + 1][i] = wall // 右边
  }
  scene.valid = true
}
// player
{
  const [stageX, stageY] = [5, 12]
  player = new Player(stageX, stageY)
  const noteToDance = new Map()
  // 音符与恋人动作的对应关系
  noteToDance.set(Hint.violin.mid1,
    './src/pics/figures/lover-upDance.gif')
  noteToDance.set(Hint.violin.mid2,
    './src/pics/figures/lover-downDance.gif')
  noteToDance.set(Hint.violin.mid3,
    './src/pics/figures/lover-leftDance.gif')
  noteToDance.set(Hint.violin.mid4,
    './src/pics/figures/lover-rightDance.gif')
  player.play = function () {
    Player.prototype.play.apply(this, arguments)
    // 当站在演奏台上时才播放动作
    if (this.x === stageX && this.y === stageY) {
      const lastNote = this.noteList[this.noteList.length - 1]
      if (noteToDance.has(lastNote))
        ui.level2.loverDiv.style.backgroundImage =
          `url('${noteToDance.get(lastNote)}')`
    }
  }
  player.endMove = function () {
    // 当站在演奏台上时才播放提示
    ui.level2.goblinDiv.hidden =
      !(this.x === stageX && this.y === stageY)
  }
  player.checkNoteList = function () {
    if (this.x === stageX && this.y === stageY) {
      console.log('检查第二关弹奏的音符')
      ui.level2.loverDiv.style.backgroundImage =
        `url('./src/pics/lover.png')`
      Level.win(() => {
        for (const element in ui.level2) ui.level2[element].remove()
      })
    }
  }
  player.valid = true
}
