import './css/style.css'
import { fetchImages } from './js/fetch-images'
import { renderGallery } from './js/render-gallery'
import Notiflix from 'notiflix'
import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css'

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.btn-load-more');
let simpleLightBox;

searchForm.addEventListener('submit', onSearchForm)
moreBtn.addEventListener('click', loadMoreBtn)

let query = '';
let page = 1;
const perPage = 40;

function onSearchForm(e) {
  e.preventDefault();
  page = 1
  query = e.currentTarget.searchQuery.value.trim()
  gallery.innerHTML = ''
  moreBtn.classList.add('is-hidden')

  if (query === '') {
     Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.')
    return
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      } else {
        renderGallery(data.hits)
        simpleLightBox = new SimpleLightbox('.gallery a').refresh()
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)

        if (data.totalHits > perPage) {
          moreBtn.classList.remove('is-hidden')
        }
      }
    })
    .catch(error => console.log(error))
}

function loadMoreBtn() {
  page += 1
  simpleLightBox.destroy()

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits)
      simpleLightBox = new SimpleLightbox('.gallery a').refresh()

      const lastPages = Math.ceil(data.totalHits / perPage)

      if (page > lastPages) {
        moreBtn.classList.add('is-hidden')
         Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
      }
    })
    .catch(error => console.log(error))
}
