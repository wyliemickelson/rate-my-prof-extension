chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => scanPage(profList))

const scanPage = (profList) => {
  const profNames = ['Display', 'Western']
  const documentText = document.body.innerHTML
  console.log(documentText)
  let regex = new RegExp(profNames.join("|"), 'gi')
  let replaced = documentText.replaceAll(regex, '<working>$&<working>')
  // console.log(replaced)
  // console.log(document)
  // console.log(profList)
}



// TOMORROW: find way to scan page for professor last names and retrieve their html tag