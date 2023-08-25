import { FetchAllProfessors, FetchSchoolNames } from "./fetching.js"
import { cache } from "./cache.js"

const schoolInput = document.getElementById('schoolQuery')
const confirmBtn = document.getElementById('confirmBtn')
const shownSchools = document.getElementById('shownSchools')
const chosenSchool = document.getElementById('currentSchool')

const initialize = async () => {
  const cachedSchool = await cache.getSchool()
  chosenSchool.innerText = cachedSchool?.name ?? 'None'
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

  FetchAllProfessors(newSchool.id).then(newProfessorList => {
    cache.updateSchool(newSchool)
    cache.updateProfessorList(newProfessorList)
  })
}

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const debouncedUpdateResults = debounce(() => updateResults());

schoolInput.addEventListener('keydown', debouncedUpdateResults)
confirmBtn.addEventListener('click', retrieveProfessors)

initialize()