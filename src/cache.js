export const cache = {
  clear: () => {
    chrome.storage.local.clear()
  },
  getSchoolID: async () => {
    return await chrome.storage.local.get('schoolID').then((obj) => obj.schoolID)
  },
  updateSchoolID: async (newID) => {
    await chrome.storage.local.set({ schoolID: newID })
  },
  updateProfessorList: async (newList) => {
    await chrome.storage.local.set({ professorList: newList })
  }
}