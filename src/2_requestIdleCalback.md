# 可中断诉求
> [requestIdleCallback](https://zhuanlan.zhihu.com/p/60189423)

```js
var tasksNum = 10000

requestIdleCallback(unImportWork)

function unImportWork(deadline) {
  while (deadline.timeRemaining() && tasksNum > 0) {
    console.log(`执行了${10000 - tasksNum + 1}个任务`)
    tasksNum--
  }

  if (tasksNum > 0) { // 在未来的帧中继续执行
    requestIdleCallback(unImportWork)
  }
}
```

- 需要有任务队列
- 任务没有完成, 则下一帧或未来空闲执行
