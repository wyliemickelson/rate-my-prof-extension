import { FetchSchoolNames } from "./fetching.js"
import { cache } from "./cache.js"
import { debounce, debounceLeading } from "./utils.js"

const schoolInput = document.getElementById('schoolQuery')
const loadProfBtn = document.getElementById('loadProfBtn')
const shownSchools = document.getElementById('shownSchools')
const chosenSchool = document.getElementById('currentSchool')
const loading = document.getElementById('loading')
const nameFormatInput = document.getElementById('nameFormat')
const saveFormatBtn = document.getElementById('saveFormatBtn')
const lastSaved = document.getElementById('lastSaved')

const initialize = (async () => {
  // get stored school
  const cachedSchool = await cache.getSchool()
  const cachedNameFormat = await cache.getNameFormat()
  const cachedLastSaved = await cache.getLastSaved()
  lastSaved.innerText = cachedLastSaved ?? 'N/A'
  chosenSchool.innerText = cachedSchool?.name ?? 'None'
  chosenSchool.setAttribute('data-id', cachedSchool?.id ?? '')
  

  nameFormatInput.value = cachedNameFormat ?? 'lastName, firstName'

  saveFormatBtn.addEventListener('click', (e) => {
    const isValidFormat = checkFormat()
    insertInfoTag(isValidFormat, e.target)
    if (!isValidFormat) return
    cache.updateNameFormat(nameFormatInput.value)
  })
  schoolInput.addEventListener('keydown', debouncedUpdateResults)
  loadProfBtn.addEventListener('click', handleConfirm)
})()

const checkFormat = () => {
  const formatText = nameFormatInput.value
  if (!formatText.includes('firstName') || !formatText.includes('lastName')) return false
  return true
}

const insertInfoTag = (isValidFormat, siblingBefore) => {
  const infoTag = document.getElementById('formatInfoTag')
  infoTag.innerText = isValidFormat  ? 'Saved.' : 'Invalid Format.'
  infoTag.classList.remove(!isValidFormat  ? 'saveText' : 'errorText')
  infoTag.classList.add(isValidFormat  ? 'saveText' : 'errorText')
  siblingBefore.after(infoTag)
}

const updateResults = async () => {
  shownSchools.innerHTML = ''
  const searchQuery = schoolInput.value
  if (searchQuery === '') return
  const schoolList = await FetchSchoolNames(searchQuery)
  console.log(schoolList)
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
  // get OLD schoolId from storage
  const currentSchool = await cache.getSchool()
  const newSchool = {
    name: chosenSchool.innerText,
    id: chosenSchool.getAttribute('data-id')
  }

  // if id is not the same, clear cache and retrieve new professors
  // if (currentSchool?.id === newSchool.id) return
  await cache.updateProfessorList(null)
  await cache.updateSchool(newSchool)
  await cache.updateLastSaved('N/A')
  toggleLoadingUI()
  chrome.runtime.sendMessage({
    message: 'fetch professors',
    schoolId: newSchool.id,
  }).then((res) => {
    if (res === 'completed') {
      toggleLoadingUI()
      setLastSaved()
    }
  })
}

const setLastSaved = async () => {
  lastSaved.classList.add('green')
  lastSaved.innerText = await cache.getLastSaved()
}

const debouncedDownloadProfessors = debounceLeading(() => downloadProfessors(), 10000)

const toggleLoadingUI = () => {
  loading.classList.toggle('hidden')
}

const handleConfirm = () => {
  shownSchools.innerHTML = ''
  schoolInput.value = ''
  lastSaved.innerText = 'N/A'
  debouncedDownloadProfessors()
}