'use strict';
Storyboard.show({
  pic: './src/pics/storyImage/5.gif',
  title: '第5/5关：离去',
  content: `当离开她的那一刻，我似乎回到了原点，<br>我似乎，在这里的码头跳海，并失忆了，<br>如今再回到这个地方，我只想等一条船来码头，接我走，<br>只是我的心结，能被打开吗？`
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
  }
  // paper in wall
  scene.boatNoteList = [
    // 开船乐谱，仅修改此处可同时导致卷轴和判定发生变化
    Hint.piano.low6,
    Hint.piano.mid1,
    Hint.piano.mid2,
    Hint.piano.mid3,
    Hint.piano.mid5,
    Hint.piano.mid3,
    Hint.piano.mid1,
    Hint.piano.mid2,
    Hint.piano.low6,
  ]
  scene.openDoorNoteList = [
    Hint.piano.low1,
    Hint.piano.low2,
    Hint.piano.low3,
    Hint.piano.low4,
  ]
  const [paperX, paperY] = [18, 2]
  const centerPaper = {
    __proto__: scene.defaultElement,
    hint: Hint.NORMALBUMP,
    canStay: false,
    interact: function () {
      scene.boatNoteList.forEach((h, i) => {
        setTimeout(() => h.play(), 800 * i)
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
  scene[paperX][paperY] = centerPaper // 卷轴在这里
  aroundIndex.forEach(element => {
    const [x, y] = [element[0] + paperX, element[1] + paperY]
    if (x >= 1 && x <= scene.width &&
      y >= 1 && y <= scene.height)
      scene[x][y] = aroundPaper
  })
  // door
  const [doorX, doorY] = [17, 2]
  const door = {
    __proto__: scene.defaultElement,
    hint: Hint.DOORBUMP,
    canStay: false
  }
  scene[doorX][doorY] = door
  scene.doorOpen = function () {
    scene[paperX][paperY].hint = Hint.PAPER
    scene[paperX][paperY].canStay = true
    scene[doorX][doorY] = aroundPaper
    Hint.DOOROPEN.play()
  }
  // sea
  const sea = {
    __proto__: scene.defaultElement,
    hint: Hint.WATERWAVE,
    canStay: false
  }
  for (let i = 1; i <= scene.width; i++)
    for (let j = 5; j <= scene.height; j++)
      scene[i][j] = sea
  scene.goOnBoat = function () {
    sea.hint = Hint.BOATMOVE
    sea.canStay = true
    delete wall.hint
    scene.defaultElement.canStay = false
    Hint.BOATMOVE.play()
    player.moveTo({ x: 2, y: 6 })
  }
  // port
  scene[2][5] = scene.defaultElement
  scene.valid = true
}
// player
{
  player = new Player(2, 5)
  player.checkNoteList = function () {
    if (this.x === 16 && this.y === 2 ||
      this.x === 17 && this.y === 1 ||
      this.x === 17 && this.y === 3) {
      if (this.noteList.length === scene.openDoorNoteList.length) {
        for (let i = 0; i < this.noteList.length; i++) {
          if (this.noteList[i] !== scene.openDoorNoteList[i])
            return
        }
        scene.doorOpen()
      }
    } else if (this.x === 2 && this.y === 5) {
      if (this.noteList.length === scene.boatNoteList.length) {
        for (let i = 0; i < this.noteList.length; i++) {
          if (this.noteList[i] !== scene.boatNoteList[i])
            return
        }
        scene.goOnBoat()
      }
    }
  }
  player.endMove = function () {
    if (this.x === 24 && this.y === 12) {
      Storyboard.show({
        pic: './src/pics/storyImage/6.gif',
        title: '离去',
        content: `我也曾迷失在一段看得不是很清晰的迷宫里，
                  也许人与人之间就是如此，
                  如果把亲密关系的建立看作是关系的起点，那么每一次冷漠对待，都是在失去；
                  但是如果陌生的彼此看作是关系的起点，那么每一次交流，都是在得到。`
      })
      setTimeout(Storyboard.hide,1900)
      setTimeout(Storyboard.show,2000,{
        pic: './src/pics/storyImage/6.gif',
        title: '再见了',
        content: `在千变万化的人生中，我们只能摸黑走路，一点点摸索正确的路，
                   但是有什么是绝对正确的呢？
                   失去自由，得到爱情；
                   失去爱情，得到自由。`
      })
      setTimeout(Storyboard.hide,3900)
      setTimeout(Storyboard.show,4000,{
        pic: './src/pics/storyImage/logo.jpg',
        title: '谢谢欣赏，游玩愉快',
        content: `如果有什么是我们真正得到的，
                  那一定是回忆，
                  化作美妙的旋律，飘上云端，
                  然后消散`
      })
      setTimeout(Level.win,5000)
      
    }
  }
  player.valid = true
}
