import { cache } from "./cache.js"

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === 'retrieve professors') {
      console.log(request)
      cache.getProfessorList().then(id => sendResponse(id));
    }
    return true
  }
)

// chrome.tabs.onActivated.addListener(async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
//   console.log(tab)
//   const response = await chrome.tabs.sendMessage(tab.id, {message: "response from background script"})
//   console.log(response)
// })