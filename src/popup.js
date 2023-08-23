import { FetchAllProfessors, FetchSchoolNames } from "./fetching.js"
import { cache } from "./cache.js"

const schoolInput = document.getElementById('schoolQuery')
const searchSchoolBtn = document.getElementById('searchSchoolBtn')
const confirmBtn = document.getElementById('confirmBtn')
const shownSchools = document.getElementById('shownSchools')
const chosenSchool = document.getElementById('currentSchool')
let updateable = true

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
  const currentSchoolID = await cache.getSchoolID()
  const newSchoolID = chosenSchool.getAttribute('data-id')
  // if id is not the same, clear cache and retrieve new professors
  console.log(currentSchoolID, newSchoolID)

  const oldProfessorList = await chrome.storage.local.get('professorList')
  console.log(oldProfessorList)
  if (!newSchoolID || (currentSchoolID === newSchoolID)) return
  cache.clear()
  const newProfessorList = await FetchAllProfessors(newSchoolID)

  await cache.updateSchoolID(newSchoolID)
  await cache.updateProfessorList(newProfessorList)
}

searchSchoolBtn.addEventListener('click', updateResults)
confirmBtn.addEventListener('click', retrieveProfessors)
