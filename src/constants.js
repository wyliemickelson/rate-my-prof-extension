export const API_URL = "https://www.ratemyprofessors.com/graphql"
export const AUTHORIZATION_TOKEN = "Basic dGVzdDp0ZXN0"

export const templates = {
  popupInnerHTML: `
  <div class="rmp-helper rmp-helper-popup-data rmp-helper-hidden">
    <div class="rmp-helper">
      <a class="rmp-helper rmp-helper-popup-name" href="" target="_blank"></a>
      <p class="rmp-helper rmp-helper-popup-department"></p>
    </div>
    <div class="rmp-helper rmp-helper-popup-rating">
      <div class="rmp-helper rmp-helper-popup-score">
      </div>
      <div class="rmp-helper rmp-divider"></div>
      <p class="rmp-helper rmp-helper-popup-reviews"></p>
    </div>
    <div class="rmp-helper rmp-helper-popup-difficulty">
      <p class="rmp-helper">Level of Difficulty</p>
      <div class="rmp-helper rmp-helper-difficulty-wrapper">
        <div class="rmp-helper rmp-helper-bar-outer">
          <div class="rmp-helper rmp-helper-bar-inner"></div>
        </div>
        <p class="rmp-helper rmp-helper-difficulty-text">/ 5.0</p>
      </div>
    </div>
  </div>
  </div>`,

  popupNavInnerHTML: `
  <div class="rmp-helper rmp-helper-hidden rmp-loading" id="rmp-scanner-loading"></div>
  <button class="rmp-helper" id="rmp-helper-nav-update">
    Update Page
  </button>
  <button class="rmp-helper" id="rmp-helper-nav-toggle">X</button>
  `
}