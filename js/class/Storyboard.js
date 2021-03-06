"use strict";
// 故事板
const Storyboard = {
  list: [],
  isVisible: true, // 隐藏真实的 ui 元素逻辑
  show: function ({ pic, title, content }) {
    if (ui.elements.storyboard.hidden === false) {
      this.list.push(arguments[0])
      return
    }
    if (pic !== undefined) ui.elements.storypic.src = pic
    if (title !== undefined) ui.elements.title.innerHTML = title
    if (content !== undefined) ui.elements.storycontent.innerHTML = content
    ui.elements.storyboard.hidden = false
    this.isVisible = true
  },
  hide: function () {
    ui.elements.storyboard.hidden = true
    this.isVisible = false
    if (this.list.length > 0) {
      this.show(this.list.shift())
    }
  },
}