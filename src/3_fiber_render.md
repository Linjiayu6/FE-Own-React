# 可中断数据结构 (链表 工作能力)

- 由VDOM转换为链表模式 (silbings, child, return)
- 重构render方法, 即让VDOM 转换一层Fiber结构

## 核心
- JSX -> VNODE -> 转换为fiber结构
- 并递归改为循环处理
- 每一层结构, 先去创建好fiber结构(fiber节点间的关系), 再去深度优先遍历处理DOM关系
