export const cache = {
  clear: () => {
    chrome.storage.local.clear()
  },
  getIsLoading: async () => {
    return await chrome.storage.local.get('isLoading').then(obj => obj.isLoading)
  },
  updateIsLoading: async (bool) => {
    await chrome.storage.local.set({ isLoading: bool })
  },
  getSchool: async () => {
    return await chrome.storage.local.get('currentSchool').then(obj => obj.currentSchool)
  },
  updateSchool: async (newSchool) => {
    await chrome.storage.local.set({ currentSchool: newSchool })
  },
  getProfessorList: async () => {
    return await chrome.storage.local.get('professorList').then(obj => obj.professorList)
  },
  updateProfessorList: async (newList) => {
    await chrome.storage.local.set({ professorList: newList })
  }
}