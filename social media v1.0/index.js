(function () {
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const data = []

  const dataPanel = document.getElementById('data-panel')
  const refresh = document.getElementById('refresh')

  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    displayDataList (data)
  }).catch((err) => console.log(err))


  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-outline-light')) {
      showProfile(event.target.dataset.id)
    }
  })
 
 // find new friends
  refresh.addEventListener('click', (event) => {
      axios.get(INDEX_URL).then((response) => {
        data.push(...response.data.results)
        displayDataList (data)
      }).catch((err) => console.log(err))
  })
  
  function getRandom() {
    return Math.floor(Math.random()*199)
  }

  function displayDataList (data) {
    let randomData = []
    for (i = 0; i < 40; i++) {
      randomData.push(data[getRandom()])
    }

    let htmlContent = ''
    randomData.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card bg-dark text-white mb-2">
            <img class="card-img lazyload" data-src="${item.avatar}" alt="no photos">
            <div class="card-img-overlay movie-item-body">
              <div class ="ribbon" id="mottoText">${item.name}</div>
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
})()