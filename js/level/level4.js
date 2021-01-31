'use strict';
for (const level3Item of
    Array.from(ui.elements.mapcontainer.getElementsByClassName('level3'))) {
    level3Item.remove()
}
player = new Player()
scene = new Scene()
ui.elements.mapcontainer.style.backgroundImage =
  `url('./src/pics/mapBackground/4.jpg')`
Storyboard.show({
  pic: './src/pics/storyImage/4.gif',
  title: '第4/5关：背道',
  content: `可是，为什么想到她会很痛苦，
  明明，都是美好的回忆，
  一点一点地，平息她的怒火，
  一遍不行就再来一遍，直到无能为力，
  难道，我应该，离开了吗？`
})

{
    // 新的元素：lover
    const loverDiv = document.createElement('div')
    const loverloc={
        x:22,
        y:7
    }

    // 增加 level4 标记从而在下一关删除
    playerDiv.className = 'level4'

    loverDiv.style = `
      width: 50px;
      height: 50px;
      left: 1100px;
      top: 300px;
      position: absolute;
      background-image: url('./src/pics/lover.png');
      background-color: transparent;
      background-size: cover;`

      ui.elements.mapcontainer.appendChild(loverDiv)
}

//wall
{
    const wall = {
      hint: Hint.NORMALBUMP,
      canStay: false,
    }
    for (let i = 0; i <= scene.width + 1; i++) {
      scene[i][0] = wall // 上边
      scene[i][13] = wall // 下边
    }
    for (let i = 0; i <= scene.height+1; i++) {
      scene[0][i] = wall // 左边
      scene[scene.width + 1][i] = wall //右边
    }
}
//fire
{
    const fire = {
    hint: Hint.FIREBURN,
    canStay: true
  }
  for (let i = 1; i <= scene.width; i++) {
    scene[5][i] = fire
    scene[6][i] = fire
    scene[7][i] = fire
  }
  scene[6][scene.width]=null
  scene.fireDie = function () {
    scene[player.x-1][player.y]=null
    Hint.WATEROUT.play()
  }
}

// player
{
    const fireDieNoteList1 = [
        Hint.piano.low1,
        Hint.piano.low2,
        Hint.piano.low3,
        Hint.piano.low4,
      ]
    const fireDieNoteList2 = [
        Hint.piano.low1,
        Hint.piano.low2,
        Hint.piano.low3,
        Hint.piano.low4,
        Hint.piano.low1,
        Hint.piano.low2,
        Hint.piano.low3,
        Hint.piano.low4,
    ]
    let destination={
      x:0,
      y:0
    }
    player.moveTo({ x: 24, y: 6 })
    player.checkNoteList = function () {
      if (this.x >=12) {
        if (this.noteList.length === fireDieNoteList1.length) {
          for (let i = 0; i < this.noteList.length; i++) {
            if (this.noteList[i] !== fireDieNoteList1[i])
              return
          }
          scene.fireDie()
        }
      }else{
        if (this.noteList.length === fireDieNoteList2.length) {
            for (let i = 0; i < this.noteList.length; i++) {
              if (this.noteList[i] !== fireDieNoteList2[i])
                return
            }
            scene.fireDie()
        }
      }
    }
    player.endMove = function(){
          //lover的位移：到顶后不能再被浇灭火
        if(scene[player.x][player.y]==fire){
            level.lose()
            return 
        }
        if(this.x-loverloc.x<=1 &&loverloc.x>1){
            loverloc.x-=1
            lover.style.left=loverloc.x*50+'px'
        }
        else if(loverloc.x==1){
          scene.fireDie=()=>{}
          destination={
              x:24,
              y:6
          }
        }
            // 是否到达win的终点
      if(this.x==destination.x && this.y==destination.y){
          Level.win()
      }
    }
}

