import { templates } from "./constants"
import { getRatingColor, getDifficultyColor } from "./utils"
// import { highlightPage } from "./content"

const ratingHoverEvent = (e) => {
  const profId = e.target.getAttribute('data-rmp-helper-id')
  const profData = JSON.parse(sessionStorage.getItem(profId))
  const dataCard = document.getElementById('rmp-helper-popup')
  dataCard.querySelector('.rmp-helper-popup-name').innerText = `${profData.firstName} ${profData.lastName}`
  dataCard.querySelector('.rmp-helper-popup-name').setAttribute('href', `https://www.ratemyprofessors.com/professor/${profData.legacyId}`)
  dataCard.querySelector('.rmp-helper-popup-department').innerText = profData.department

  const ratingText = dataCard.querySelector('.rmp-helper-popup-score')
  ratingText.innerText = formatRating(profData.avgRating)
  clearColorClasses(ratingText)
  ratingText.classList.add(getRatingColor(profData))

  dataCard.querySelector('.rmp-helper-popup-reviews').innerText = `${profData.numRatings} review(s)`
  dataCard.querySelector('.rmp-helper-difficulty-text').innerText = `${profData.avgDifficulty} / 5.0`

  const difficultyBarInner = dataCard.querySelector('.rmp-helper-bar-inner')
  difficultyBarInner.style.width = `${profData.avgDifficulty * 20}%`
  clearColorClasses(difficultyBarInner)
  difficultyBarInner.classList.add(getDifficultyColor(profData))
}

const clearColorClasses = (ele) => {ele.classList.remove('rmp-helper-green', 'rmp-helper-yellow', 'rmp-helper-red')}
const formatRating = (rating) => rating.toString().includes('.') ? rating : `${rating}.0`

export const createRating = (profData) => {
  let ratingDiv = document.createElement("div");
  let ratingText = document.createElement("p")
  ratingText.className = 'rmp-helper rmp-helper-rating-text'
  ratingText.classList.add(getRatingColor(profData))
  ratingText.innerText = formatRating(profData.avgRating)
  ratingDiv.className = 'rmp-helper rmp-helper-rating'

  ratingText.setAttribute('data-rmp-helper-id', `${profData.id}`)

  ratingText.addEventListener('mouseenter', (e) => ratingHoverEvent(e))
  ratingDiv.appendChild(ratingText)
  return ratingDiv
}

const togglePopup = () => {
  const popup = document.getElementById('rmp-helper-popup')
  const maximizeBtn = document.getElementById('rmp-helper-maximize')
  if (popup.classList.contains('rmp-helper-closed')) {
    popup.classList.remove('rmp-helper-closed', 'rmp-helper-hidden')
    popup.classList.add('rmp-helper-open')
    maximizeBtn.classList.add('rmp-helper-hidden')
  } else {
    maximizeBtn.classList.remove('rmp-helper-hidden')
    popup.classList.add('rmp-helper-closed', 'rmp-helper-hidden')
    popup.classList.remove('rmp-helper-open')
  }
}

export const createPopup = () => {
  // add button to toggle minimize
  const popup = document.createElement('div')
  popup.id = 'rmp-helper-popup'
  popup.className = 'rmp-helper rmp-helper-hidden rmp-helper-closed'

  const popupNav = document.createElement('div')
  popupNav.innerHTML = templates.popupNavInnerHTML
  popupNav.className = 'rmp-helper rmp-helper-popup-nav'
  // popupNav.querySelector('#rmp-helper-nav-update').addEventListener('click', highlightPage)
  popupNav.querySelector('#rmp-helper-nav-toggle').addEventListener('click', togglePopup)

  const popupProfData = document.createElement('div')
  popupProfData.className = 'rmp-helper'
  popupProfData.innerHTML = templates.popupInnerHTML

  const maximizeBtn = document.createElement('button')
  maximizeBtn.addEventListener('click', togglePopup)
  maximizeBtn.innerText = 'RMP-Helper'
  maximizeBtn.classList.add('rmp-helper')
  maximizeBtn.id = 'rmp-helper-maximize'
  document.body.appendChild(maximizeBtn)

  popup.appendChild(popupNav)
  popup.appendChild(popupProfData)
  document.body.appendChild(popup)
}