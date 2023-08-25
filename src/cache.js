export const cache = {
  clear: () => {
    chrome.storage.local.clear()
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