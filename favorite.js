// 宣告變數
const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'

// 宣告變數(當作容器)放置陣列
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

// 宣告節點變數
const dataPanel = document.querySelector('#data-panel')

// 宣告表單節點變數
const searchForm = document.querySelector('#search-form')

//宣告search-form input節點變數
const searchInput = document.querySelector('#search-input')



// 產生HTML架構的函式-1 
function renderMovieList(data) {
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
              <button type="button" class="btn btn-danger btn-remove-favorite" data-id="${items.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

// 監聽器-Modal
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // 執行函式 -2
    showMovieModal(event.target.dataset.id)
    // favorite清單功能，新增以下
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(event.target.dataset.id))
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


// 加入喜愛清單 函式-3
// 將喜愛電影推送到localStorage
function removeFavorite(id) {
  // 防呆機制
  if (!movies || !movies.length) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  // 防呆機制
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1) // 依據該電影在清單內的index將資料刪除
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  // 重新渲染畫面
  renderMovieList(movies)
}

renderMovieList(movies)