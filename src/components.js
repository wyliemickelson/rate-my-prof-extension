export const createRating = (profData) => {
  let ratingDiv = document.createElement("div");
  let ratingText = document.createElement("p")
  ratingText.className = 'rmp-helper rmp-helper-rating-text'
  ratingText.innerText = profData.avgRating
  ratingDiv.className = 'rmp-helper rmp-helper-rating'
  ratingText.addEventListener('mouseenter', (e) => {
    const oldPopup = document.querySelector('.rmp-helper-popup-current')
    console.log(oldPopup)
    oldPopup?.classList.add('rmp-helper-hidden')
    oldPopup?.classList.remove('rmp-helper-popup-current')
    const newPopup = e.target.parentNode.querySelector('.rmp-helper-popup')
    newPopup?.classList.remove('rmp-helper-hidden')
    newPopup?.classList.add('rmp-helper-popup-current')
  })
  // ratingText.addEventListener('mouseleave', (e) => e.target.parentNode.querySelector('.rmp-helper-popup')?.classList.add('rmp-helper-hidden'))
  ratingDiv.appendChild(ratingText)
  return ratingDiv
}
export const createPopup = (profData) => {
  const popupInnerHTML = `
    <h3 class="rmp-helper rmp-helper-popup-name">${profData.firstName} ${profData.lastName}</h3>
    <p class="rmp-helper rmp-helper-popup-department">${profData.department}</p>
    <div class="rmp-helper rmp-helper-popup-rating">
      <div class="rmp-helper rmp-helper-popup-score">${profData.avgRating}</div>
      <div class="rmp-helper rmp-divider"></div>
      <p class="rmp-helper rmp-helper-popup-reviews">${profData.numRatings} review(s)</p>
    </div>
    <div class="rmp-helper rmp-helper-popup-difficulty">
      <p class="rmp-helper">Level of Difficulty</p>
      <div class="rmp-helper rmp-helper-difficulty-wrapper">
        <div class="rmp-helper rmp-helper-bar-outer">
          <div class="rmp-helper rmp-helper-bar-inner"></div>
        </div>
        <p class="rmp-helper">${profData.avgDifficulty} / 5.0</p>
      </div>
    </div>`

  const popup = document.createElement('div')
  popup.className = 'rmp-helper rmp-helper-popup rmp-helper-hidden'
  popup.innerHTML = popupInnerHTML
  return popup
}