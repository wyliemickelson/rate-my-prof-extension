import { cache } from "./cache.js"
import { FetchAllProfessors, FetchSchoolNames } from "./fetching.js"

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === 'fetch professors') {
      console.log(request)
      FetchAllProfessors(request.schoolId)
        .then(newProfessorList => {
          cache.updateProfessorList(newProfessorList)
        })
        .then(() => sendResponse('completed'))
    }
    return true
  }
)