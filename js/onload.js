'use strict';
// 窗口加载后执行的操作，该脚本必须位于 html 中最后一个
// 所有的全局变量
let player = { valid: false } // 全局变量：场景
let scene = { valid: false } // 全局变量：场景
// 全局变量：包含所有指定的 id 的 ui 元素
let ui = {
  elements: {},
  getAllIdElement: function (r) {
    if (r.nodeName == "SCRIPT") { return } // 跳过脚本
    if (r.id != "") { this.elements[r.id] = r }
    for (let i = 0; i < r.children.length; i++) {
      this.getAllIdElement(r.children[i])
    }
  }
}
// 执行指定的 js 脚本
function loadScript(path, onload) {
  let script = document.createElement('script')
  script.src = path
  script.onload = () => {
    if (onload !== undefined)
      onload()
    document.head.removeChild(script)
    console.log(`load ${path}`)
  }
  document.head.appendChild(script)
}
let test = function (n) { }
window.onload = function () {
  // 加载类定义
  for (const className of
    ['Level', 'Hint', 'Orientation', 'Player', 'Scene', 'OperationMode', 'StoryBoard']) {
    loadScript(`./js/class/${className}.js`)
  }
  ui.getAllIdElement(document.body)
  // 点击开始后进入第 0 关
  const load0 = () => {
    Level.load(0)
    Storyboard.hide()
    ui.elements.storyboard.removeEventListener('click', load0)
  }
  ui.elements.storyboard.addEventListener('click', load0)
  test = function (n) {
    ui.elements.storyboard.removeEventListener('click', load0)
    Storyboard.hide()
    Level.load(n)
  }
}