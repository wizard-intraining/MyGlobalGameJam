本文件夹存放各 level 的逻辑

注意事项：
1. 请勿在脚本全局作用域定义变量，以防 level 之间冲突
2. scene 和 player 定义好后都要将 valid 设为 true 否则不接收键盘控制
3. 仅本关使用到的 ui 元素可存放到 ui.levelN 中