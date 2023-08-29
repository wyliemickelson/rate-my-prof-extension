import { templates } from "./constants"
import { getRatingColor } from "./utils"

const ratingHoverEvent = (e) => {
  const profId = e.target.getAttribute('data-rmp-helper-id')
  const profData = JSON.parse(sessionStorage.getItem(profId))
  const dataCard = document.getElementById('rmp-helper-popup')
  dataCard.querySelector('.rmp-helper-popup-name').innerText = `${profData.firstName} ${profData.lastName}`
  dataCard.querySelector('.rmp-helper-popup-department').innerText = profData.department
  dataCard.querySelector('.rmp-helper-popup-score').innerText = profData.avgRating
  dataCard.querySelector('.rmp-helper-popup-reviews').innerText = `${profData.numRatings} review(s)`
  dataCard.querySelector('.rmp-helper-difficulty-text').innerText = `${profData.avgDifficulty} / 5.0`
}

export const createRating = (profData) => {
  let ratingDiv = document.createElement("div");
  let ratingText = document.createElement("p")
  ratingText.className = 'rmp-helper rmp-helper-rating-text'
  ratingText.classList.add(getRatingColor(profData))
  ratingText.innerText = profData.avgRating
  ratingDiv.className = 'rmp-helper rmp-helper-rating'

  ratingText.setAttribute('data-rmp-helper-id', `${profData.id}`)

  ratingText.addEventListener('mouseenter', (e) => ratingHoverEvent(e))
  ratingDiv.appendChild(ratingText)
  return ratingDiv
}

export const createPopup = () => {
  // add button to toggle minimize
  const popup = document.createElement('div')
  popup.id = 'rmp-helper-popup'
  popup.className = 'rmp-helper'
  popup.innerHTML = templates.popupInnerHTML
  return popup
}