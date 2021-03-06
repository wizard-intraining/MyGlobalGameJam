"use strict";
// 玩家类定义
class Player {
  /**
   * 初始化玩家，可指定位置，左上角为 (1, 1)
   * @param {number} x 横坐标：从左向右增大
   * @param {number} y 纵坐标：从上向下增大
   */
  constructor(x = 1, y = 1) {
    this.x = x
    this.y = y
    this.uiUpdateLocation()
    this.mode = OperationMode.MOVE // 玩家控制模式
    this.uiUpdateMode()
    this.noteList = [] // 玩家上次演奏的音符列表
    this.instrumentIndex = 0 // 玩家当前的乐器索引
    this.valid = false // 玩家当前是否可由用户控制
  }
  /**
   * 演奏结束后的检查
   * 每关的检查逻辑不同，在 levelN.js 中定义
   */
  checkNoteList() {
    console.log('请在 levelN.js 中定义演奏结果检查方法')
  }
  /**
   * 移动结束后的检查
   * 每关的检查逻辑不同，在 levelN.js 中定义
   * @param {Orientation} orientation 移动到此位置的方向
   */
  endMove(orientation) {
    console.log('请在 levelN.js 中定义移动结束后的检查')
  }
  /**
   * 更换乐器
   */
  changeInstrument() {
    this.instrumentIndex =
      (this.instrumentIndex + 1) % Hint.instrumentList.length
    console.log(`current instrument: ${Hint.instrumentList[this.instrumentIndex]}`)
  }
  /**
   * 使用当前所持乐器演奏指定的音符
   * @param {string} noteNoInstrument 音符名称，例如 low1/mid7/tall1
   */
  play(noteNoInstrument) {
    if (this.mode === OperationMode.PLAY) {
      const note = Hint[
        Hint.instrumentList[this.instrumentIndex]
      ][noteNoInstrument]
      note.play()
      this.noteList.push(note)
    }
  }
  /**
   * 切换当前的模式
   */
  changeMode() {
    switch (this.mode) {
      case OperationMode.MOVE:
        this.mode = OperationMode.PLAY
        this.uiUpdateMode()
        // 开始演奏，清空列表
        this.noteList = []
        break
      case OperationMode.PLAY:
        this.mode = OperationMode.MOVE
        this.uiUpdateMode()
        // 演奏结束，检查
        this.checkNoteList()
        break
      default:
        break
    }
    console.log(`current operation mode: ${this.mode}`)
  }
  /**
   * 尝试向某个方向移动
   * @param {Orientation} orientation 移动的方向
   */
  move(orientation) {
    if (this.mode === OperationMode.MOVE) {
      let nextLocation = this.getNextLocation(orientation)
      if (scene.canStay(nextLocation)) {
        this.moveTo(nextLocation)
      }
      // 不管能不能走过去，都要提示下一个位置有什么
      scene.hintToPlayer(nextLocation)
      this.endMove(orientation)
      console.log(`x ${this.x} y ${this.y}`)
    }
  }
  /**
   * 直接移动到指定位置
   * @param {x, y} location 指定的位置
   */
  moveTo({ x, y }) {
    this.x = x
    this.y = y
    this.uiUpdateLocation()
  }
  /**
   * 根据方向获取下一个位置
   * @param {Orientation} orientation 方向
   */
  getNextLocation(orientation) {
    let nextLocation = { x: this.x, y: this.y }
    switch (orientation) {
      case Orientation.UP:
        nextLocation.y -= 1
        break;
      case Orientation.DOWN:
        nextLocation.y += 1
        break;
      case Orientation.LEFT:
        nextLocation.x -= 1
        break;
      case Orientation.RIGHT:
        nextLocation.x += 1
        break;
      default:
        break;
    }
    return nextLocation
  }

  /**
   * 更新界面上玩家的位置
   */
  uiUpdateLocation() {
    ui.elements.player.style.top = `${(this.y - 1) * 50}px`
    ui.elements.player.style.left = `${(this.x - 1) * 50}px`
  }
  /**
   * 更新界面上玩家的状态
   */
  uiUpdateMode() {
    ui.elements.player.style.backgroundImage =
      `url('./src/pics/${this.mode === OperationMode.MOVE ? 'player-walking.gif' : this.mode === OperationMode.PLAY ? 'player-playing.gif' :
        undefined}')`
  }
}