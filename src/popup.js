import { FetchAllProfessors, FetchSchoolNames } from "./fetching.js"
import { cache } from "./cache.js"

const schoolInput = document.getElementById('schoolQuery')
const loadProfBtn = document.getElementById('loadProfBtn')
const shownSchools = document.getElementById('shownSchools')
const chosenSchool = document.getElementById('currentSchool')
const scanPageBtn = document.getElementById('scan')
const loading = document.getElementById('loading')

const initialize = async () => {
  // get stored school
  const cachedSchool = await cache.getSchool()
  chosenSchool.innerText = cachedSchool?.name ?? 'None'
  chosenSchool.setAttribute('data-id', cachedSchool?.id ?? '')
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
    li.innerText = school.name
    li.addEventListener('click', (e) => {
      chosenSchool.innerText = e.target.innerText
      chosenSchool.setAttribute('data-id', e.target.getAttribute('data-id'))
    })
    shownSchools.appendChild(li)
  })
}

const startScanner = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: 'scan page' }
    );
  });
}

const retrieveProfessors = async () => {
  // get OLD schoolId from storage
  const currentSchool = await cache.getSchool()
  const newSchool = {
    name: chosenSchool.innerText,
    id: chosenSchool.getAttribute('data-id')
  }
  // if id is not the same, clear cache and retrieve new professors
  console.log(currentSchool, newSchool)
  if (currentSchool?.id === newSchool.id) return
  cache.clear()
  await cache.updateSchool(newSchool)
  await FetchAllProfessors(newSchool.id)
    .then(newProfessorList => {
      cache.updateProfessorList(newProfessorList)
    })
    .then(startScanner)
}

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const debouncedUpdateResults = debounce(() => updateResults());

const toggleLoadingUI = () => {
  loading.classList.toggle('rmp-helper-hidden')
}

const handleConfirm = () => {
  shownSchools.innerHTML = ''
  schoolInput.value = ''
  toggleLoadingUI()
  retrieveProfessors().then(toggleLoadingUI)
}

schoolInput.addEventListener('keydown', debouncedUpdateResults)
loadProfBtn.addEventListener('click', handleConfirm)
scanPageBtn.addEventListener('click', startScanner)

initialize()