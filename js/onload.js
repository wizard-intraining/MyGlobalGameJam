'use strict';
// 窗口加载后执行的操作，该脚本必须位于 html 中最后一个
let player = null
let scene = null
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
window.onload = function () {
  for (const className of
    ['Level', 'Hint', 'Orientation', 'Player', 'Scene', 'OperationMode', 'StoryBoard']) {
    loadScript(`./js/class/${className}.js`)
  }
  ui.getAllIdElement(document.body)
  const load0 = () => {
    Level.load(0)
    Storyboard.hide()
    ui.elements.storyboard.removeEventListener('click', load0)
  }
  ui.elements.storyboard.addEventListener('click', load0)
}