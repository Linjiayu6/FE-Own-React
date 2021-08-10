// 下一个工作
let nextUnitOfWork = null


function performUnitOfWork () {
    // 执行工作, 并返回下一个工作
}

/**
 * timeRemaining(): 当前帧还剩下多少时间
 * didTimeout: 是否超时
 */
function workloop (deadline) {
    let shouldYield = false;

    // 还有工作 且 不用中断
    while (nextUnitOfWork && !shouldYield) {
        // 执行工作, 并返回下一个工作
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        // 是否需要中断
        shouldYield = deadline.timeRemaining() > 0
    }
    
    // 等待未来帧继续工作
    if (nextUnitOfWork) {
        requestIdleCallback(workloop)
    }
}

// 进入干活
requestIdleCallback(workloop)
