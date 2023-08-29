export const API_URL = "https://www.ratemyprofessors.com/graphql"
export const AUTHORIZATION_TOKEN = "Basic dGVzdDp0ZXN0"

export const templates = {
  popupInnerHTML: `
  <h3 class="rmp-helper rmp-helper-popup-name"></h3>
  <p class="rmp-helper rmp-helper-popup-department"></p>
  <div class="rmp-helper rmp-helper-popup-rating">
    <div class="rmp-helper rmp-helper-popup-score"></div>
    <div class="rmp-helper rmp-divider"></div>
    <p class="rmp-helper rmp-helper-popup-reviews"></p>
  </div>
  <div class="rmp-helper rmp-helper-popup-difficulty">
    <p class="rmp-helper">Level of Difficulty</p>
    <div class="rmp-helper rmp-helper-difficulty-wrapper">
      <div class="rmp-helper rmp-helper-bar-outer">
        <div class="rmp-helper rmp-helper-bar-inner"></div>
      </div>
      <p class="rmp-helper rmp-helper-difficulty-text"></p>
    </div>
  </div>`
}