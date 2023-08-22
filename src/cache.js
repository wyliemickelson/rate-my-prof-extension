import fs from 'fs';

export const cacheProfessorList = (professors) => {
  fs.truncate('professors.json', 0, () => console.log('cleared cache'))
  let jsonList = JSON.stringify(professors)
  fs.writeFile('professors.json', jsonList, 'utf8', () => console.log('saved professors to cache'))
}