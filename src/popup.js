import { FetchSchoolNames } from "./fetching.js"
import { cache } from "./cache.js"
import { debounce, debounceLeading } from "./utils.js"

const schoolInput = document.getElementById('schoolQuery')
const loadProfBtn = document.getElementById('loadProfBtn')
const shownSchools = document.getElementById('shownSchools')
const chosenSchool = document.getElementById('currentSchool')
const loading = document.getElementById('loading')
const lastSaved = document.getElementById('lastSaved')

const initialize = (async () => {
  const cachedSchool = await cache.getSchool()
  const cachedLastSaved = await cache.getLastSaved()
  lastSaved.classList.remove('green')
  lastSaved.innerText = cachedLastSaved ?? 'N/A'
  chosenSchool.innerText = cachedSchool?.name ?? 'None'
  chosenSchool.setAttribute('data-id', cachedSchool?.id ?? '')
  schoolInput.addEventListener('keydown', debouncedUpdateResults)
  loadProfBtn.addEventListener('click', handleConfirm)
})()

const updateResults = async () => {
  shownSchools.innerHTML = ''
  const searchQuery = schoolInput.value
  if (searchQuery === '') return
  const schoolList = await FetchSchoolNames(searchQuery)
  schoolList.forEach(school => {
    const li = document.createElement('li')
    li.setAttribute('data-id', school.id)
    li.innerText = `${school.name} | ${school.city}, ${school.state}`
    li.addEventListener('click', (e) => {
      chosenSchool.innerText = e.target.innerText
      chosenSchool.setAttribute('data-id', e.target.getAttribute('data-id'))
    })
    shownSchools.appendChild(li)
  })
}

const debouncedUpdateResults = debounce(() => updateResults());

const downloadProfessors = async () => {
  const newSchool = {
    name: chosenSchool.innerText,
    id: chosenSchool.getAttribute('data-id')
  }

  await cache.updateProfessorList(null)
  await cache.updateSchool(newSchool)
  await cache.updateLastSaved('N/A')
  toggleLoadingUI(true)
  chrome.runtime.sendMessage({
    message: 'fetch professors',
    schoolId: newSchool.id,
  }).then((res) => {
    if (res === 'completed') {
      toggleLoadingUI(false)
      setLastSaved()
    }
  }).catch(e => {})
}

const debouncedDownloadProfessors = debounceLeading(() => downloadProfessors(), 10000)

const toggleLoadingUI = (on) => {
  loading.classList[on ? 'remove' : 'add']('hidden')
}

const setLastSaved = async () => {
  lastSaved.classList.add('green')
  lastSaved.innerText = await cache.getLastSaved()
}

const handleConfirm = () => {
  shownSchools.innerHTML = ''
  schoolInput.value = ''
  lastSaved.innerText = 'N/A'
  debouncedDownloadProfessors()
}