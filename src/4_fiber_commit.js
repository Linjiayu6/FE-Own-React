// 返回真实DOM节点: 某fiber转为DOM节点
function createDOM (fiber) {
    // 创建节点
    const dom = fiber.type === 'TEXT_VDOM'
        ? document.createTextNode("")
        : document.createElement(fiber.type)

    // 属性挂载
    const isProperty = key => key !== "children"
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name]
        })

    // 返回DOM
    return dom
}


// 下一个工作 (用真实dom节点, 去挂载下面的孩子们, 也可以理解为一个fiber节点)
let nextUnitOfWork = null
let rootUnitOfWork = null

// 1. 节点创建
// 2. fiber.children小弟们, 创建fiber, 并同层构建关系
// 3. 深度优先遍历, 当关系创建好了后, 再返回下一个工作节点(创建DOM 和 child 同层的fiber关系)
function performUnitOfWork (fiber) {
    // 1. DOM: 执行当前工作(创建DOM节点) ===== 
    if (!fiber.dom) {
        // 没有创建真实DOM节点, 就先去创建
        fiber.dom = createDOM(fiber);
    }

    // if (fiber.return) {
    //     fiber.return.dom.appendChild(fiber.dom)
    // }

    const children = fiber.props.children;

    let i = 0;
    let prevSibling = null;

    // 2. Fiber: 孩子们创建fiber, 并连接关系 ===== 
    while (i < children.length) {
        const _element = children[i];
        const newFiber = {
            type: _element.type,
            props: _element.props,
            return: fiber, // 当前节点的爹是fiber
            silbing: null,
            child: null,
            dom: null
        }
        // 第一个节点, 父亲的孩子连接新的节点
        if (i === 0) {
            fiber.child = newFiber;
        } else {
            // 否则, 将前一个兄弟的silbing 和 该节点连接
            prevSibling.silbing = newFiber;
        }
        
        prevSibling = newFiber;
        i++;
    }

    console.log(fiber.child)

    // 3. nextUnitOfWork: 返回下一个工作单元 ===== 
    if (fiber.child) {
        // 下一个是child去工作
        return fiber.child;
    }

    let nextFiber = fiber
    let _nextFiber = null
    while (nextFiber) {
        if (nextFiber.silbing) {
            _nextFiber = nextFiber.silbing
            break;
        }
        // 回溯
        nextFiber = nextFiber.return
    }

    return _nextFiber;
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
        const currentUnitOfWork = nextUnitOfWork;
        
        console.log('当前工作单元', currentUnitOfWork);
        // 根据已经创建好的DOM节点, 去挂载他们的兄弟姐妹 或 孩子们
        nextUnitOfWork = performUnitOfWork(currentUnitOfWork);
        console.log('');
        console.log('下一个工作单元', nextUnitOfWork)

        // 是否需要中断
        shouldYield = deadline.timeRemaining() > 0
    }
    
    // 等待未来帧继续工作
    if (nextUnitOfWork) {
        requestIdleCallback(workloop)
        return
    }

    // 没有其他工作, 去commit
    commit(rootUnitOfWork)
    rootUnitOfWork = null
}

function commit (unitOfWork) {
    if (!unitOfWork) {
        return;
    }

    if (unitOfWork.child) {
        unitOfWork.dom.append(unitOfWork.child.dom)
    }
    
    if (unitOfWork.silbing) {
        unitOfWork.dom.append(unitOfWork.silbing.dom)
    }
    commit(unitOfWork.child)
    commit(unitOfWork.silbing)
}

/**
 * element = { type: 'div', props: {}, children: [...] }
 * container = 真实DOM
 */
function render (element, container) {
    // 去创建fiber节点
    rootUnitOfWork = {
        dom: container,
        props: {
            children: [element],
        },
        return: null,
        sibling: null, 
        child: null, // 下面的子节点
    };

    nextUnitOfWork = rootUnitOfWork
}

// 进入干活
requestIdleCallback(workloop)


window.render = render;