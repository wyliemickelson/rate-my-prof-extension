import { FetchAllProfessors, FetchSchoolNames } from "./fetching.js"
import { cache } from "./cache.js"

const schoolInput = document.getElementById('schoolQuery')
const searchSchoolBtn = document.getElementById('searchSchoolBtn')
const confirmBtn = document.getElementById('confirmBtn')
const shownSchools = document.getElementById('shownSchools')
const chosenSchool = document.getElementById('currentSchool')

const displaySavedSchool = async () => {
  const cachedSchool = await cache.getSchool()
  chosenSchool.innerText = cachedSchool?.name ?? 'None'
}
displaySavedSchool()

const updateResults = async () => {
  shownSchools.innerHTML = ''
  const searchQuery = schoolInput.value
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
  console.log(currentSchool?.id, newSchool.id)

  const oldProfessorList = await chrome.storage.local.get('professorList')
  console.log(oldProfessorList)
  if (currentSchool?.id === newSchool.id) return
  cache.clear()
  const newProfessorList = await FetchAllProfessors(newSchool.id)

  await cache.updateSchool(newSchool)
  await cache.updateProfessorList(newProfessorList)
}

searchSchoolBtn.addEventListener('click', updateResults)
confirmBtn.addEventListener('click', retrieveProfessors)
