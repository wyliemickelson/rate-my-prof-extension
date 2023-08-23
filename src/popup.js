import { FetchAllProfessors, FetchSchoolNames } from "./fetching.js"
import { WWUID } from "./constants.js"

// FetchAllProfessors(WWUID)
// FetchSchoolNames('western wa')

const schoolInput = document.getElementById('schoolQuery')
const searchSchoolBtn = document.getElementById('searchSchoolBtn')
const confirmBtn = document.getElementById('confirmBtn')
const shownSchools = document.getElementById('shownSchools')
const currentSchool = document.getElementById('currentSchool')
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
      currentSchool.innerText = e.target.innerText
      currentSchool.setAttribute('data-id', e.target.getAttribute('data-id'))
    })
    shownSchools.appendChild(li)
  })
}

const retrieveProfessors = async () => {
  // get OLD schoolId from storage
  let oldSchoolID = await chrome.storage.local.get('currentSchoolID').then((obj) => obj.currentSchoolID)
  const newSchoolID = currentSchool.getAttribute('data-id')
  // if id is not the same, clear cache and retrieve new professors
  console.log(oldSchoolID, newSchoolID)

  const oldProfessorList = await chrome.storage.local.get('professorList')
  console.log(oldProfessorList)
  if (!newSchoolID || (oldSchoolID === newSchoolID)) return
  chrome.storage.local.clear()
  await chrome.storage.local.set({ currentSchoolID: newSchoolID })

  const newProfessorList = await FetchAllProfessors(newSchoolID)
  await chrome.storage.local.set({ professorList: newProfessorList })

  // console.log(professorList)
}

searchSchoolBtn.addEventListener('click', updateResults)
confirmBtn.addEventListener('click', retrieveProfessors)
// schoolInput.addEventListener('keydown', () => {

// })
