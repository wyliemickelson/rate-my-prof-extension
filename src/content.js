chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => scanPage(profList))
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === 'scan page') {
      console.log('scanning')
      chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => scanPage(profList))
    }
  }
)
// look into mutationObserver for changing webpages

const scanPage = (profList, format = 'lastName, firstName') => {
  console.log(profList)
  if (!profList) return
  // format prof names
  const profNames = profList.map(prof => format.replace('lastName', prof.lastName).replace('firstName', prof.firstName).toLowerCase())
  console.log(profNames)

  // https://stackoverflow.com/questions/57913199/modify-html-while-preserving-the-existing-elements-and-event-listeners
  const span = document.createElement('span');
  span.className = 'rmp-helper-prof';
  span.appendChild(document.createTextNode(''));

  // these will display <span> as a literal text per HTML specification
  const skipTags = ['textarea', 'rp'];
  // * symbol obtains all elements
  const profRegex = new RegExp(`(${profNames.join('|')})`, 'gi')
  console.log(profRegex)
  for (const ele of document.querySelectorAll('p, a, span')) {
    const walker = document.createTreeWalker(ele, NodeFilter.SHOW_TEXT);
    // collect the nodes first because we can't insert new span nodes while walking
    const textNodes = [];
    for (let n; (n = walker.nextNode());) {
      if (n.nodeValue.trim() && !skipTags.includes(n.parentNode.localName)) {
        textNodes.push(n);
      }
    }
    // check if node contains format
    // find index range of found format and split at that range
    // surround only found format with span
    for (const n of textNodes) {
      const fragment = document.createDocumentFragment();
      console.log(n.nodeValue)
      // console.log(n.nodeValue.split(profRegex))

      for (const s of n.nodeValue.split(profRegex)) {
        console.log(s)
        if (!s) continue
        if (s.trim() && profNames.includes(s.toLowerCase())) {
          span.firstChild.nodeValue = s;
          fragment.appendChild(span.cloneNode(true));
          span.firstChild.nodeValue = 'Professor'
          fragment.appendChild(span.cloneNode(true));
        } else {
          fragment.appendChild(document.createTextNode(s));
        }
      }
      n.parentNode.replaceChild(fragment, n);
    }
  }
}

// TOMORROW: find way to scan page for professor last names and retrieve their html tag