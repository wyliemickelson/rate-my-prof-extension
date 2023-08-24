import { cache } from "./cache.js"

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log(request)
    fetchSchool().then(id => sendResponse(id));
    return true
  }
)

const fetchSchool = async () => {
  return await cache.getSchoolID()
}

// chrome.tabs.onActivated.addListener(async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
//   console.log(tab)
//   const response = await chrome.tabs.sendMessage(tab.id, {message: "response from background script"})
//   console.log(response)
// })