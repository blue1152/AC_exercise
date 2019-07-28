// init
let list = document.querySelector('#my-todo')
const todos = ['Hit the gym', 'Read a book', 'Buy eggs', 'Organize office', 'Pay bills']
for (let todo of todos) {   //default 
  addItem(todo)
}

function addItem (text) {
  let newItem = document.createElement('li')
  newItem.innerHTML = `
    <label for="todo">${text}</label>
    <i class="delete fa fa-trash"></i>
  `
  list.appendChild(newItem)
}

function doneItem (text) {
  let doneItem = document.createElement('li')
  doneItem.innerHTML = `
    <label for="done" class="checked">${text}</label>
    <i class="delete fa fa-trash"></i>
  `
  done.appendChild(doneItem)
}

function addInput () {
  let addInput = document.createElement('div')
  addInput.innerHTML = `
    <input type="text" placeholder="add item" id="newTodo" class="form-control mr-2 new">
    <span id ="addInput" class="fa fa-minus-circle"></span>
  `
  newInput.appendChild(addInput)
}

//add new input column listener
let newInput = document.querySelector('#newInput')
const addInputBtn = document.querySelector('#addInput') 
addInputBtn.addEventListener('click', function () {
  addInput()
})

//remove input column listener
const removeInput = document.querySelector('#newInput')
removeInput.addEventListener('click', function (event) {
  if (event.target.classList.contains('fa-minus-circle')) {
    let div = event.target.parentElement  
    div.remove()  //delete
  }
})

//click event listener
const addBtn = document.querySelector('#addBtn')
addBtn.addEventListener('click', function () {
  let input = document.querySelectorAll('#newTodo')
  for (let i = 0; i < input.length; i++) {
    if (input[i].value.length === 0) {
      alert('空白欄位記得填寫喔!')
      continue;
    }
    else {
      addItem(input[i].value)
    }
  }
})

//keypress event listener
const addEtn = document.querySelector('.mb-3')
addEtn.addEventListener('keypress', function () {
  let input = document.querySelectorAll('#newTodo')
  let firstValue = document.querySelector('#newTodo').value
  if (event.keyCode === 13) {
    for (let i = 0; i < input.length; i++) {
      if (input[i].value.length === 0) {
        alert('空白欄位記得填寫喔!')
        continue;
      }
      else {
        addItem(input[i].value)
      }
    }
  }
  else {
    return false
  }
})

// Todo area: Delete and check
list.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete')) {
    let li = event.target.parentElement  
    li.remove()  //delete
  } 
  else if (event.target.tagName === 'LABEL') { 
    let done = document.querySelector('#done')
    let li = event.target.parentElement
    li.remove()  //delele and check
    doneItem(event.target.textContent)
  }
})

// Done area: Delete
done.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete')) {
    let li = event.target.parentElement  
    li.remove() 
  }
  else if (event.target.tagName === 'LABEL') {
    let li = event.target.parentElement
    li.remove()
    addItem(event.target.textContent)
  }
})