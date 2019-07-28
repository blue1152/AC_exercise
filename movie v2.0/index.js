(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const favoriteData = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 20

  const dataPanel = document.getElementById('data-panel')
  const homeLink = document.getElementById('home')
  const favoriteLink = document.getElementById('favorite-movie')
  const cardList = document.getElementById('card-view')
  const simpleList = document.getElementById('simple-view')

  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      //console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)
    }
      else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  //listen to card list button
  cardList.addEventListener('click', (event) => {
    if (event.target.matches('.fa-th')) {
        getTotalPages(data)
        getPageData(1, data)
    }
  })

  //listen to simple list button
  simpleList.addEventListener('click', (event) => {
    if (event.target.matches('.fa-bars')) {
      getSimplePages(data)
      getSimplePageData(1, data)
    }
  })

  //listen to favorite movie list link
  favoriteLink.addEventListener('click', (event) => {
    if (event.target.matches('.nav-link')) {
      getTotalPages(favoriteData)
      getPageData(1, favoriteData)
    }
  })

  //listen to index blink
  homeLink.addEventListener('click', (event) => {
    if (event.target.matches('.nav-link')) {
        getTotalPages(data)
        getPageData(1, data)
    }
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    if (event.target.matches('.card-page')) {
      getPageData(event.target.dataset.page)
    }
    else if (event.target.matches('.simple-page')) {
      getSimplePageData(event.target.dataset.page)
    }
  })

  // listen to search btn click event
  searchBtn.addEventListener('click', event => {
    event.preventDefault()

    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    getTotalPages(results)
    getPageData(1, results)
  })

  function displayDataList (data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function displaySimpleList (data) {
    let htmlContent = ''
    htmlContent += `
    <table class="table table-hover">
      <tbody>
    `
    data.forEach(function (item, index) {
      htmlContent += `
        <tr>
          <td><h6 class="card-title">${item.title}</h5></td>
          <td align="right">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </td>
        </tr>
      `
    })
    htmlContent += `
      </tbody>
    </table>
    `
    dataPanel.innerHTML = htmlContent
  }

    function displayFavoriteList (data) {
    let htmlContent = ''
    favoriteData.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  function showMovie (id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  function addFavoriteItem (id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

    function removeFavoriteItem (id) {
    // find movie by id
    const index = favoriteData.findIndex(item => item.id === Number(id))
    if (index === -1) return

    // removie movie and update localStorage
    favoriteData.splice(index, 1)
    localStorage.setItem('favoriteMovie', JSON.stringify(favoriteData))

    // repaint dataList
    getTotalPages(favoriteData)
    getPageData(1, favoriteData)
  }

  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link card-page" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getSimplePages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link simple-page" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
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

  function getSimplePageData (pageNum, data) {
    paginationData = data || paginationData
    let totalPages = Math.ceil(paginationData.length / ITEM_PER_PAGE) || 1
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displaySimpleList(pageData)

    // reset pagination class
    for (let i = 0; i < totalPages; i++) {
      pagination.children[i].classList.remove('active')
    }
    // add active class
    pagination.children[pageNum - 1].className = "page-item active"
  }

})()