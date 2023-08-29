import { FetchSchoolNames } from "./fetching.js"
import { cache } from "./cache.js"
import { debounce } from "./utils.js"

const schoolInput = document.getElementById('schoolQuery')
const loadProfBtn = document.getElementById('loadProfBtn')
const shownSchools = document.getElementById('shownSchools')
const chosenSchool = document.getElementById('currentSchool')
const scanPageBtn = document.getElementById('scan')
const loading = document.getElementById('loading')

const initialize = (async () => {
  // get stored school
  const cachedSchool = await cache.getSchool()
  chosenSchool.innerText = cachedSchool?.name ?? 'None'
  chosenSchool.setAttribute('data-id', cachedSchool?.id ?? '')

  schoolInput.addEventListener('keydown', debouncedUpdateResults)
  loadProfBtn.addEventListener('click', handleConfirm)
  scanPageBtn.addEventListener('click', startScanner)
})()

const updateResults = async () => {
  shownSchools.innerHTML = ''
  const searchQuery = schoolInput.value
  if (searchQuery === '') return
  const schoolList = await FetchSchoolNames(searchQuery)
  console.log(schoolList)
  schoolList.forEach(school => {
    const li = document.createElement('li')
    li.setAttribute('data-id', school.id)
    li.innerText = school.name
    li.addEventListener('click', (e) => {
      chosenSchool.innerText = e.target.innerText
      chosenSchool.setAttribute('data-id', e.target.getAttribute('data-id'))
    })
    shownSchools.appendChild(li)
  })
}

const debouncedUpdateResults = debounce(() => updateResults());

const startScanner = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: 'scan page' }
    );
  });
}

const downloadProfessors = async () => {
  // get OLD schoolId from storage
  const currentSchool = await cache.getSchool()
  const newSchool = {
    name: chosenSchool.innerText,
    id: chosenSchool.getAttribute('data-id')
  }
  
  // if id is not the same, clear cache and retrieve new professors
  if (currentSchool?.id === newSchool.id) return
  cache.clear()
  await cache.updateSchool(newSchool)
  toggleLoadingUI()
  chrome.runtime.sendMessage({ 
    message: 'fetch professors',
    schoolId: newSchool.id,
  }).then((res) => {if (res === 'completed') toggleLoadingUI() } )
}

const toggleLoadingUI = () => {
  loading.classList.toggle('rmp-helper-hidden')
}

const handleConfirm = () => {
  shownSchools.innerHTML = ''
  schoolInput.value = ''
  downloadProfessors()
}