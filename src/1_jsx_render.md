# 创建vnode, 并渲染至界面

- createText: 创建text
- createElement: 创建vnode
- render: 渲染真实DOM至浏览器 (创建dom -> 挂载属性 -> appendChild)

- /** @jsx SelfReact.createElement */ 使用我们自建的方法, babel该节点

# 问题
递归创建, 无法中断
```js
    element.props.children.forEach(child => 
        render(child, dom)
    )
```
