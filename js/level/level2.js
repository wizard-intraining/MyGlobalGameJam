'use strict';
player = new Player()
scene = new Scene()
ui.elements.mapcontainer.style.backgroundImage =
  `url('./src/pics/mapBackground/2.jpg')`
Storyboard.show({
  pic: './src/pics/storyImage/2.gif',
  title: '第2/5关：陪伴',
  content: '过去的记忆在我眼前越来越清晰，<br>后来，我们一起去了舞会……'
})
{
  // 新的元素
  const playerDiv = document.createElement('div')
  const loverDiv = document.createElement('div')
  const goblinDiv = document.createElement('div')
  // 增加 level2 标记从而在下一关删除
  playerDiv.className = 'level2'
  loverDiv.className = 'level2'
  goblinDiv.className = 'level2'
  playerDiv.style = `
    width: 350px;
    height: 350px;
    left: 150px;
    top: 50px;
    position: absolute;
    background-image: url('./src/pics/player.png');
    background-color: transparent;
    background-size: cover;`
  loverDiv.style = `
      width: 350px;
      height: 350px;
      left: 700px;
      top: 50px;
      position: absolute;
      background-image: url('./src/pics/lover.png');
      background-color: transparent;
      background-size: cover;`
  goblinDiv.style = `
    width: 200px;
    height: 200px;
    left: 500px;
    top: 150px;
    position: absolute;
    background-image: url('./src/pics/goblin.gif');
    background-color: transparent;
    background-size: cover;`
  ui.elements.mapcontainer.appendChild(playerDiv)
  ui.elements.mapcontainer.appendChild(loverDiv)
  ui.elements.mapcontainer.appendChild(goblinDiv)
  // paper
  {
    const getPaper = (interactAction) => {
      return {
        hint: typeof (interactAction) === 'function'
          ? Hint.PAPER : Hint.PAPERWEAK,
        canStay: true,
        interact: interactAction,
      }
    }
    const words = {
      1: '舞会上我弹琴，她伴舞，',
      2: '大家都非常，非常快乐，<br>他们都说我们心有灵犀，',
      3: '她总有办法让舞步跟上我的节奏。',
      4: '后来我们都很累了，<br>大家说：只要给我们再来一场最精彩的表演，就让你们回家休息。<br>',
    }
    for (const [paperX, paperY, flag] of [
      [12, 12, 1], [15, 12, 2], [18, 12, 3], [21, 12, 4],
    ]) {
      scene[paperX][paperY] = getPaper(function () {
        // 根据 flag 的值确定四个卷轴的声音
        Hint.violin[`mid${flag}`].play()
        Storyboard.show({
          content: words[flag]
        })
      })
      const aroundIndex = [[-1, -1], [-1, 0], [-1, 1],
      [0, -1],/* [0, 0], */[0, 1],
      [1, -1], [1, 0], [1, 1]]
      aroundIndex.forEach(element => {
        const [x, y] = [element[0] + paperX, element[1] + paperY]
        if (x >= 1 && x <= scene.width &&
          y >= 1 && y <= scene.height)
          scene[x][y] = getPaper()
      })
    }
  }
  // wall
  {
    const wall = {
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
  }
  // player
  {
    const [stageX, stageY] = [5, 12]
    player.moveTo({ x: stageX, y: stageY })
    const noteToDance = new Map()
    // 音符与恋人动作的对应关系
    noteToDance.set(Hint.violin.mid1,
      './src/pics/figures/lover-downDance.gif')
    noteToDance.set(Hint.violin.mid2,
      './src/pics/figures/lover-leftDance.gif')
    noteToDance.set(Hint.violin.mid3,
      './src/pics/figures/lover-rightDance.gif')
    noteToDance.set(Hint.violin.mid4,
      './src/pics/figures/lover-upDance.gif')
    player.play = function () {
      Player.prototype.play.apply(this, arguments)
      // 当站在演奏台上时才播放动作
      if (this.x === stageX && this.y === stageY) {
        const lastNote = this.noteList[this.noteList.length - 1]
        if (noteToDance.has(lastNote))
          loverDiv.style.backgroundImage =
            `url('${noteToDance.get(lastNote)}')`
      }
    }
    player.endMove = function () {
      // 当站在演奏台上时才播放提示
      goblinDiv.hidden = !(this.x === stageX && this.y === stageY)
    }
    player.checkNoteList = function () {
      if (this.x === stageX && this.y === stageY) {
        console.log('检查第二关弹奏的音符')
        loverDiv.style.backgroundImage = `url('./src/pics/lover.png')`
        Level.win()
      }
    }
  }
}