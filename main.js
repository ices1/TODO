let unCompletedCount = 0

// 监听 input 输入
userInput.addEventListener('keypress', event => {
  if(event.keyCode == 13) {
    // 增加 list
    addItems(userInput.value)
    // 刷新计算
    refreshCount('add')
    console.log('well done! ',userInput.value)
    userInput.value = ''
  }
})

// // 监听 list 点击
// list.addEventListener('click', event => {
//   // debugger
//   let targetName = event.target.nodeName
//   console.log('click at: ' + targetName)
//   if (targetName == 'INPUT') {
//     changeItemStatus(event.target)
//   } else if (targetName == 'SPAN') {
//     deleteItem(event.target)
//   }
// })

// 监听 todos 点击
document.querySelector('.todos').addEventListener('click', event => {
  // debugger
  let targetClass = event.target.className
  let targetId = event.target.id
  let targetName = event.target.nodeName
  console.log('\nclick at: targetClass: ' + targetClass + 
      '\nclick at: targetId: ' + targetId + 
      '\nclick at: targetName: ' + targetName )

  switch (targetClass) {
    case 'selectAllInner': 
      selectAll()
      break
    case 'item':
      changeItemStatus(event.target)
      break
    case 'delete':
      deleteItem(event.target)
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
  }

  // if (targetClass == 'selectAllInner') {
  //   selectAll()
  // } else if (targetClass == 'item') {
  //   changeItemStatus(event.target)
  // } else if (targetClass == 'delete') {
  //   deleteItem(event.target)
  // }
})

// 监听 selectAll 点击
document.querySelector('.selectAll input').addEventListener('click', event => {
  // debugger
  selectAll()
})

// 监听 selectAll 点击
document.querySelector('.todos').addEventListener('click', event => {
  // debugger
  console.log(event.target.className)
  console.log(event.target.id)
})






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
    <label> <input class='item' type="checkbox"> </label> 
    <p class="content">${value}</p>
    <span class="delete"> X </span>
  `
  // let li = document.createElement('li')
  // li.innerText = value

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
  let status , item

  status = elNode.checked ? 'rm' : 'add'
  refreshCount(status)
  console.log('checked: ', status)
  item = elNode.parentElement.parentElement
  item.className = elNode.checked ? 'itemCompleted' : ''

  allSelectStatus = allItemsStatus().every(x => x)
  if (allSelectStatus) {
    document.querySelector('.selectAll').classList.add('allCompleted')
  } else {
    document.querySelector('.selectAll').classList.remove('allCompleted')
  }
}

// 刷新总数
refreshCount()

// function refreshCount(oper) {
// // debugger  
// let count = 0

//   if(oper == 'add') {
//     count = ++unCompletedCount
//   } else if (oper == 'rm') {
//     count = --unCompletedCount
//   } else if (oper == 'rmAll') {
//     count = 0
//   } else {
//     let items = document.querySelectorAll('li input')
//     if(items.length) {
//       items.forEach(it => it.checked ? 0 : count++)
//       unCompletedCount = count
//     } else {
//       unCompletedCount = count = 0
//     }
//   }

//   document.querySelector('.itemsLeft').innerHTML = count
// }

function refreshCount(oper) {
// debugger  
  let count = 0

  let items = document.querySelectorAll('li input')
  if(items.length) {
    items.forEach(it => it.checked ? 0 : count++)
    unCompletedCount = count
  } else {
    unCompletedCount = count = 0
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
  } else if(status == 'completed') {
    let turn = true

    allItems.forEach((x, i) => f(x, i, turn))
  } else if (status == 'all'){

    return allItems
  }

  // return items
}

// 辅助函数， 根据


// 全选
// allCompleted
function selectAll(){
  let status = allItemsStatus().every(x => x)
  let items = itemsFilter('all')

  if(status) {
    items.forEach(x => x.className = '')
    document.querySelectorAll('li input').forEach(x => x.checked = false)
    refreshCount()
    document.querySelector('.selectAll').classList.remove('allCompleted')
  } else {
    items.forEach(x => x.className = 'itemCompleted')
    document.querySelectorAll('li input').forEach(x => x.checked = true)
    refreshCount('rmAll')
    document.querySelector('.selectAll').classList.add('allCompleted')
  }
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

// 进行中的 items
function showActive(){

  itemsFilter('active', showItems)
}

// 完成的 items
function showCompleted(){

  itemsFilter('completed', showItems)
}

// 全部的 items
function showAll(){
  let items

  items = itemsFilter('all')
  items.forEach(x => x.style.display = 'block')
}

