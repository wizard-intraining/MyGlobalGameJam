'use strict';
for (const level2Item of
  Array.from(ui.elements.mapcontainer.getElementsByClassName('level2'))) {
  level2Item.remove()
}
player = new Player()
scene = new Scene()
ui.elements.mapcontainer.style.backgroundImage =
  `url('./src/pics/mapBackground/3.jpg')`
Storyboard.show({
  pic: './src/pics/storyImage/3.gif',
  title: '第3/5关：热恋',
  content: '我想起来了，就是这样的，<br>她情不自禁地被我的音乐吸引，<br>我也越来越觉得她的舞姿曼妙动人，<br>纵然有许许多多的障碍和阻隔横在我们之间，<br>我们无所畏惧，<br>我们越来越靠近彼此，<br>我用我的音乐演奏了我深切的爱意，<br>自此，我们之间再无隔阂。'
})
