export const cache = {
  clear: () => {
    chrome.storage.local.clear()
  },
  getSchoolID: async () => {
    return await chrome.storage.local.get('schoolID').then(obj => obj.schoolID)
  },
  updateSchoolID: async (newID) => {
    await chrome.storage.local.set({ schoolID: newID })
  },
  getProfessorList: async () => {
    return await chrome.storage.local.get('professorList').then(obj => obj.professorList)
  },
  updateProfessorList: async (newList) => {
    await chrome.storage.local.set({ professorList: newList })
  }
}