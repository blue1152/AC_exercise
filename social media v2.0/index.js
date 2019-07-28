(function () {
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const dataFriend = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const data = []
  let paginationData = []

  const dataPanel = document.getElementById('data-panel')
  const myFriend = document.getElementById('friend-list')
  const home = document.getElementById('index-page')
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 40

  const searchBtn = document.getElementById('refresh')
  const searchGender = document.getElementById('gender-choose')
  const searchAge = document.getElementById('ageRange')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    //displayDataList (data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))


  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-outline-light')) {
      showProfile(event.target.dataset.id)
    }
    else if (event.target.matches('.add-favorite')) {
      event.target.classList.remove('far')
      event.target.classList.add('fas')
      addFavoriteItem(event.target.dataset.id)
    }
    else if (event.target.matches('.remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  //listen to friend list button
  myFriend.addEventListener('click', (event) => {
    if (event.target.matches('.fa-gratipay')) {
      getTotalPages(dataFriend)
      getPageData(1, dataFriend)
    }
  })

  //listen to index button
  home.addEventListener('click', (event) => {
    if (event.target.matches('.navbar-brand')) {
        getTotalPages(data)
        getPageData(1, data)
    }
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

   // listen to search bar
  const age = document.getElementById('age')
  searchAge.addEventListener('change', (event) => {
    if (event.target.value === '20') {
      age.innerHTML = `Age: < 20`
    }
    else if (event.target.value === '25') {
      age.innerHTML = `Age: 20 - 25`
    }
    else if (event.target.value === '30') {
      age.innerHTML = `Age: 20 - 30`
    }
    else if (event.target.value === '35') {
      age.innerHTML = `Age: 20 - 35`
    }
    else if (event.target.value === '40') {
      age.innerHTML = `Age: 20 - 40`
    }
  })

     // listen to search bar
  searchGender.addEventListener('change', (event) => {
    let age = document.getElementById('ageRange').value
    if (event.target.value === 'option1') {
      let gender = 'male'
      searchResult(age, gender)
    }
    else if (event.target.value === 'option2') {
      let gender = 'female'
      searchResult(age, gender)
    }
  })

  function searchResult(age, gender) {
    searchBtn.addEventListener('click', (event) => {
      if (event.target.matches('.btn-outline-success')) {
          newData = data || newData
          let filterResult = newData.filter(item => item.age >= 20 && item.age <= age && item.gender === gender)
          //console.log(filterResult)
          getTotalPages(filterResult)
          getPageData(1, filterResult)
      }
    })
  }

  function displayDataList (data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card bg-dark text-white mb-2">
            <img class="card-img lazyload" data-src="${item.avatar}" alt="no photos">
            <div class="card-img-overlay movie-item-body">
              <div class ="ribbon" id="mottoText">${item.name}</div>
              <div class ="heart"><i class="far fa-heart add-favorite" data-id="${item.id}"></i></div>
              <div class ="more"><button class="btn btn-outline-light btn-sm" data-toggle="modal" data-target="#show-profile-modal" data-id="${item.id}">More</button></div>
            </div>
          </div>
        </div>
      `
    })

    dataPanel.innerHTML = htmlContent
    let images = document.querySelectorAll('.lazyload');
    lazyload(images)
  }

  function showProfile (id) {
    // get elements
    const modalName = document.getElementById('show-name')
    const modalImage = document.getElementById('show-image')
    const modalDetail = document.getElementById('show-detail')

    // set request url
    const url = INDEX_URL + id

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data

      // insert data into modal ui
      modalName.textContent = `${data.name} ${data.surname}`
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-thumbnail rounded img" alt="Responsive image">`
      modalDetail.innerHTML = `
      <p><i class="fas fa-flag"></i> nationality : ${data.region}</p>
      <p><i class="fas fa-birthday-cake"></i> birthday : ${data.birthday}</p>
      <p><i class="fas fa-user"></i> age : ${data.age}</p>
      <p><i class="fas fa-paper-plane"></i> contact: ${data.email}</p>
      `
    })
  }

  function displayFriendList (data) {
    let htmlContent = ''
    dataFriend.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card bg-dark text-white mb-2">
            <img class="card-img lazyload" data-src="${item.avatar}" alt="no photos">
            <div class="card-img-overlay movie-item-body">
              <div class ="ribbon" id="mottoText">${item.name}</div>
              <div class ="heart"><i class="fas fa-unlink remove-favorite" data-id="${item.id}"></i></div>
              <div class ="more"><button class="btn btn-outline-light btn-sm" data-toggle="modal" data-target="#show-profile-modal" data-id="${item.id}">More</button></div>
            </div>
          </div>
        </div>
      `
    })

    dataPanel.innerHTML = htmlContent
    let images = document.querySelectorAll('.lazyload');
    lazyload(images)
  }

  function removeFavoriteItem (id) {
    // find friend by id
    const index = dataFriend.findIndex(item => item.id === Number(id))
    if (index === -1) return

    // removie friend and update localStorage
    dataFriend.splice(index, 1)
    localStorage.setItem('favoriteFriends', JSON.stringify(dataFriend))

    // repaint dataList
    displayFriendList(dataFriend)
  }

  function addFavoriteItem (id) {
    const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
    const friend = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${friend.name} is already in your friends list.`)
    }
    else {
      list.push(friend)
      alert(`Added ${friend.name} to your friends list!`)
    }
    localStorage.setItem('favoriteFriends', JSON.stringify(list))
  }

  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData (pageNum, data) {
    paginationData = data || paginationData
    let totalPages = Math.ceil(paginationData.length / ITEM_PER_PAGE) || 1
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)

    // reset pagination class
    for (let i = 0; i < totalPages; i++) {
      pagination.children[i].classList.remove('active')
    }
    // add active class
    pagination.children[pageNum - 1].className = "page-item active"
  }

})()