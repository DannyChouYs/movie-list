// 宣告變數
const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'

// 宣告變數(當作容器)放置陣列
const movies = []
// 宣告喜愛清單 (陣列)
let filteredMovies = []

// 宣告節點變數
const dataPanel = document.querySelector('#data-panel')

// 宣告表單節點變數
const searchForm = document.querySelector('#search-form')

//宣告search-form input節點變數
const searchInput = document.querySelector('#search-input')

// 宣告分頁內容顯示數量
const MOVIES_PER_PAGE = 12

// 宣告分頁器節點
const paginator = document.querySelector('#paginator')

// A14 清單、卡片模式
const listMode = document.querySelector('.fa-bars')
const cardMode = document.querySelector('.fa-th')

// flag

let flag = true

let page = 1




// 透過API取得資料
axios.get(INDEX_URL)
  .then((respones) => {
    let movieList = respones.data.results
    // console.log(movieList)
    // 展開運算子"..."
    movies.push(...movieList)
    // 分頁器渲染函式-5
    renderPaginator(movies.length)
    // 執行函式-1 (一次將所有電影放到陣列)
    // renderMovieList(movies)
    // 執行函式1 + 4 (將部分電影放到陣列) 先放第一頁
    renderMovieList(getMoviesByPage(1))
  })
  .catch((error) => {
    console.error('Error')
  })

// 產生HTML架構的函式-1 
function renderMovieList(data) {
  if (flag) {
    let rawHTML = ''
    data.forEach((items) => {
      rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + items.image}"
              class="card-img-top" alt="Poster">
            <div class="card-body">
              <h5 class="card-title">${items.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id="${items.id}">More</button>
              <button type="button" class="btn btn-info btn-add-favorite" data-id="${items.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
    })
    dataPanel.innerHTML = rawHTML
  } else {
    let rawHTML = `<ul class="list-group">`
    data.forEach((items) => {
      rawHTML += `
        <li class="list-group-item">${items.title}
          <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
            data-bs-target="#movie-modal" data-id="${items.id}">More</button>
          <button type="button" class="btn btn-info btn-add-favorite" data-id="${items.id}">+</button>
        </li>
        `
    })
  dataPanel.innerHTML = rawHTML
  }

}

// 監聽器-Modal
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // 執行函式 -2
    showMovieModal(event.target.dataset.id)
    // favorite清單功能，新增以下
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// modal 修改函式 -2
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster">`
      modalDate.innerText = data.release_date
      modalDescription.innerText = data.description
    })
}

// 監聽器-searchForm
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  // 提取input value 移除空白跟轉成小寫
  let keyword = searchInput.value.trim().toLowerCase()
  console.log(keyword)
  // 防呆空白與提醒
  if (!keyword) {
    renderMovieList(movies)
    return alert('請輸入文字')
  }
  // 比對
  // for of 方式
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }

  //forEach 方式
  // movies.forEach((movie) => {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // })

  // filter 方式  箭頭函式若沒有return不需要加大括弧
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword))

  console.log(filteredMovies)

  if (filteredMovies.length === 0) {
    alert('沒有此關鍵字相關的電影')
    // 渲染分頁器
  }
  // 渲染分頁器
  renderPaginator(filteredMovies.length)
  // render
  renderMovieList(getMoviesByPage(1))
})


// 加入喜愛清單 函式-3
// 將喜愛電影推送到localStorage
function addToFavorite(id) {
  // console.log(id)
  //           兩邊擇一 true執行，若同時都true，則預設左邊
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  // 新增防呆，如果已存在清單內，跳出提醒
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  // early return 如果有return後面不需要接else{}
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 分頁器 函式-4 負責切割總清單的資料，並回傳到切割好的新陣列
function getMoviesByPage(page) {
  // 新增 三元運算子 判斷data來源是filterMovies or movies
  const data = filteredMovies.length ? filteredMovies : movies
  // 開始計算的index位置
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  // 回傳切割後的電影清單陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 分頁器數量渲染 函式-5
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

// 分頁器掛上監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  // console.log(event.target.dataset.page)
  // 防呆--沒有點擊到a標籤就停止
  if (event.target.tagName !== 'A') return
  // a標籤裡面的dataset屬性
  page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})


listMode.addEventListener('click', function displayCardMode(event) {
  flag = false
  renderMovieList(getMoviesByPage(page))
})

cardMode.addEventListener('click', function displayCardMode(event) {
  flag = true
  renderMovieList(getMoviesByPage(page))
})