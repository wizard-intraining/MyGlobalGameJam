"use strict";
// 场景类
class Scene {
  /**
   * 初始化场景数据，使用 scene[x][y] 访问场景中的元素
   * x 取值范围 [0, width + 1]
   * y 取值范围 [0, height + 1]
   * @param {number} mapNumber 地图编号
   * @param {number} width 场景宽度
   * @param {number} height 场景高度
   */
  constructor(mapNumber, width = 24, height = 12) {
    this.width = width
    this.height = height
    if (mapNumber !== undefined) {
      ui.elements.mapcontainer.style.backgroundImage =
        `url('./src/pics/mapBackground/${mapNumber}.jpg')`
    }
    // 场景中的默认元素
    this.setDefaultElement({
      canStay: true, // 元素可停留
      hint: { play: () => { } }, // 元素默认提示音
      interact: () => { }, // 该元素的互动操作
    })
    this.valid = false // 场景是否可用
  }
  /**
   * 设置默认元素
   */
  setDefaultElement(defaultElement) {
    this.defaultElement = defaultElement
    for (let i = 0; i <= this.width + 1; i++) {
      this[i] = new Array(this.height + 2)
      for (let j = 0; j <= this.height + 1; j++)
        this[i][j] = defaultElement
    }
  }
  /**
   * 检查指定位置可否站立
   * @param {x, y} location 描述位置的对象
   */
  canStay({ x, y }) {
    return scene[x][y].canStay
  }
  /**
   * 播放指定位置的提示
   * @param {x, y} location 描述位置的对象
   */
  hintToPlayer({ x, y }) {
    scene[x][y].hint.play()
  }
  /**
   * 执行玩家当前位置的交互
   */
  interact() {
    scene[player.x][player.y].interact()
  }
}