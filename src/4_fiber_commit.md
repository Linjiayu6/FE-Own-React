# commit

问题是: 每次循环迭代都会调用该方法, 故从界面上来看, 会有多次重复渲染
```js
if (fiber.return) {
    fiber.return.dom.appendChild(fiber.dom)
}
```
故该流程放到执行完成后去统一渲染处理

# 以上总结
- jsx -> vdom -> 在scheduler调度 或 requestIdleCallback 下工作 即空闲才去执行
- 工作任务是: 
  - render:
    - 由vdom -> fiber结构的创建 -> fiber结构先创建child和child-sibling的而结构关系
    - 再从fiber入手, 深度优先遍历, dom之间的关系
    - 完成后, 每个fiber就有dom挂载的信息
  - commit:
    - 将节点信息提交给浏览器去DOM的渲染