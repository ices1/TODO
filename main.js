let store = localStorage
let aryStore = JSON.parse(store['TODO'] || '[]')

// 增加到store
function add2store(val) {

  aryStore.push({
    id: list.childElementCount - 1,
    title: val,
    completed: false
  })

  saveStore()
}

// 改变 store 内 item 状态
function changeSts2Store(el, all = false, completed) {
  if (all) {
    aryStore.forEach(x => x['completed'] = completed)
  } else {
    let idx = [].indexOf.call(el.parentNode.children, el)
    aryStore[idx]['completed'] = aryStore[idx]['completed'] ? false : true
  }

  saveStore()
}

// 改变 store 内 item value
function changeVal2Store(el, val) {
  let idx = [].indexOf.call(el.parentNode.children, el)
  aryStore[idx]['title'] = val

  saveStore()
}

// 删除 store 内 item
function deleteItem2Stroe(el) {
  let idx = [].indexOf.call(el.parentNode.children, el)
  aryStore.splice(idx, 1)
  aryStore.forEach((x, i) => {
    if (i >= idx) {
      --aryStore[i]['id']
    }
  })

  saveStore()
}

// 序列化保存到store
function saveStore() {
  store['TODO'] = JSON.stringify(aryStore)
}

// 初始化
let onloadNow = function () {
  debugger
  // let aryStore = JSON.parse(store['todos'])

  // 初始化dom
  aryStore.forEach(x => {
    addItems(x['title'])
    if (x['completed']) {
      let item = list.lastChild
      item.className = 'itemCompleted'
      item.children[0].children[0].checked = true
    }
  })

  // 初始化计数
  refreshCount()
  // 初始化 全选样式
  allSelectStyle()
  // 初始化 clearCompleted样式
  showClearCompleted()
}()





// 监听 input 输入
userInput.addEventListener('keypress', event => {
  let val = userInput.value.trim()

  if (event.keyCode == 13) {
    if (val == '') return
    // 增加 list
    addItems(val)
    // 写入 store
    add2store(val)
    // 刷新计算
    refreshCount('add')
    console.log('---' + userInput.value + '-----')
    //刷新全选样式
    allSelectStyle()
    //清空 输入栏
    console.log('well done, userInput: ', val)
    userInput.value = ''
  }
})

// 监听 todos 点击
document.querySelector('.todos').addEventListener('click', event => {
  // debugger
  let targetClass = event.target.className
  let targetId = event.target.id
  let targetName = event.target.nodeName
  console.log('\nclick at: targetClass: ' + targetClass +
    '\nclick at: targetId: ' + targetId +
    '\nclick at: targetName: ' + targetName)

  switch (targetClass) {
    case 'selectAllInner':
      selectAll()
      routeHash()
      showClearCompleted()
      break
    case 'item':
      changeSts2Store(event.target.parentNode.parentNode)
      changeItemStatus(event.target)
      allSelectStyle()
      routeHash()
      showClearCompleted()
      break
    case 'delete':
      deleteItem2Stroe(event.target.parentNode)
      deleteItem(event.target)
      allSelectStyle()
      showClearCompleted()
      break
    case 'showAll':
      showAll()
      break
    case 'showActive':
      showActive()
      break
    case 'showCompleted':
      showCompleted()
      break
    case 'clearCompleted':
      clearCompleted()
      break
  }

})

// 监听 selectAll 点击
list.addEventListener('dblclick', event => {
  let item = event.target
  if (item.nodeName == 'LABEL') return
  if (item.nodeName == 'P') item = item.parentElement
  // debugger
  let changeText = document.createElement('input')
  changeText.value = item.children[1].innerText
  changeText.className = 'changeText'
  item.appendChild(changeText)

  let inputText = document.querySelector('.changeText')
  inputText.focus()
  // 监听 输入值
  listenChangeInput(inputText, item.children[1])
})

// 监听 双击后 输入事件
function listenChangeInput(el, goal) {

  function helper() {
    let val = el.value.trim()
    if (val == '') return

    goal.innerText = val
    el.parentElement.removeChild(el)
    // 存入 store
    changeVal2Store(goal.parentNode, val)
  }
  // 失去焦点
  el.addEventListener('blur', helper)

  // 回车
  el.addEventListener('keypress', () => {
    if (event.keyCode == 13) {
      el.removeEventListener('blur', helper)
      helper()
    }
  })

}

// 动态生成 html  
function t(parts, ...interpolations) {
  var node = document.createElement('li')

  node.innerHTML = parts.reduce((result, part, i) => {
    return result + interpolations[i - 1] + part
  })

  return node
  // return node.firstElementChild
}

// 写入到 list
function addItems(value) {
  let item = t`
    <label><input class='item' type="checkbox"></label><p class="content">${value}</p>
    <span class="delete"> X </span>
  `

  if (routeHash()) {
    item.style.display = 'none'
  }
  debugger
  list.appendChild(item)
}

// 移除 item
function deleteItem(elNode) {
  let item = elNode.parentElement
  item.parentElement.removeChild(item)
  refreshCount()
}

// 改变 item 状态
function changeItemStatus(elNode) {
  let allSelectStatus
  let status, item

  status = elNode.checked ? 'rm' : 'add'
  refreshCount(status)
  console.log('checked: ', status)
  item = elNode.parentElement.parentElement
  item.className = elNode.checked ? 'itemCompleted' : ''
}

// 根据 hash 该校 item 显示状态 
function routeHash() {
  let path = window.location.hash

  if (path == '#All') {
    showAll()
  } else if (path == '#Active') {
    showActive()
  } else if (path == '#Completed') {
    showCompleted()
  }

  return path == '#Completed'
}

// 全选样式 
function allSelectStyle() {
  let itemsStatus = allItemsStatus()
  let allSelectStatus = itemsStatus.every(x => x)
  let allSelect = document.querySelector('.selectAll')

  if (itemsStatus.length == 0) {
    allSelect.style.display = 'none';
  } else {
    allSelect.style.display = 'block';

    if (allSelectStatus) {
      document.querySelector('.selectAll').classList.add('allCompleted')
    } else {
      document.querySelector('.selectAll').classList.remove('allCompleted')
    }

  }

}

// 刷新总数
function refreshCount(oper) {
  // debugger  
  let count = 0
  let items = document.querySelectorAll('li input')

  if (items.length) {
    items.forEach(it => it.checked ? 0 : count++)
  } else {
    count = 0
  }

  document.querySelector('.itemsLeft').innerHTML = count
}

// 辅助函数，判断 items 状态
function allItemsStatus() {
  let status = []
  let items = document.querySelectorAll('li input')
  items.forEach(x => status.push(x.checked))
  return status
}

// 辅助函数，根据 status 导出所有 items 
function itemsFilter(status, f) {
  let allItems = document.querySelectorAll('li')

  if (status == 'active') {
    let turn = false

    allItems.forEach((x, i) => f(x, i, turn))
  } else if (status == 'completed') {
    let turn = true

    allItems.forEach((x, i) => f(x, i, turn))
  } else if (status == 'all') {

    return allItems
  }

  // return items
}

// 辅助函数， 根据


// 全选
// allCompleted
function selectAll() {
  // debugger
  let status = allItemsStatus().every(x => x)
  let items = itemsFilter('all')

  if (status) {
    items.forEach(x => x.className = '')
    document.querySelectorAll('li input').forEach(x => x.checked = false)
    refreshCount()
    changeSts2Store('', true, false)
    document.querySelector('.selectAll').classList.remove('allCompleted')
  } else {
    items.forEach(x => x.className = 'itemCompleted')
    document.querySelectorAll('li input').forEach(x => x.checked = true)
    refreshCount('rmAll')
    changeSts2Store('', true, true)
    document.querySelector('.selectAll').classList.add('allCompleted')
  }
  // debugger

}

// 部分 显示 
function showItems(item, idx, turn) {
  let inputStatus = allItemsStatus()

  if (turn) {
    inputStatus = inputStatus.map(x => !x)
  }
  if (inputStatus[idx]) {
    item.style.display = 'none'
  } else {
    item.style.display = 'block'
  }
}
// clearCompleted 显示样式
function showClearCompleted() {
  debugger
  let coms = document.querySelectorAll('.itemCompleted')

  if (coms.length == 0) {
    document.querySelector('.clearCompleted').style.display = 'none'
  } else {
    document.querySelector('.clearCompleted').style.display = 'inline-block'
  }
}
// 进行中的 items
function showActive() {
  window.location.hash = 'Active'
  itemsFilter('active', showItems)
}

// 完成的 items
function showCompleted() {
  window.location.hash = 'Completed'
  itemsFilter('completed', showItems)
}

// 全部的 items
function showAll() {
  let items
  window.location.hash = 'All'

  items = itemsFilter('all')
  items.forEach(x => x.style.display = 'block')
}

// 清除完成 items
function clearCompleted() {
  let items = document.querySelectorAll('.itemCompleted')
  debugger
  items.forEach(el => {
    deleteItem2Stroe(el)
    deleteItem(el.children[0])
    allSelectStyle()
  })

  document.querySelector('.clearCompleted').style.display = 'none'
}











