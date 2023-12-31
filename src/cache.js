export const cache = {
  clear: () => {
    chrome.storage.local.clear()
  },
  getLastSaved: async () => {
    return await chrome.storage.local.get('LastSaved').then(obj => obj.LastSaved)
  },
  updateLastSaved: async (timeStr) => {
    await chrome.storage.local.set({ LastSaved: timeStr })
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