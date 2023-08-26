// look into mutationObserver for changing webpages

chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => scanPage(profList))
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === 'scan page') {
      console.log('scanning')
      chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => scanPage(profList))
    }
  }
)

const formatNames = (profList, format) => {
  return profList.map(prof => format.replace('lastName', prof.lastName).replace('firstName', prof.firstName).toLowerCase())
}

// https://stackoverflow.com/questions/57913199/modify-html-while-preserving-the-existing-elements-and-event-listeners
const scanPage = (profList, format = 'lastName, firstName') => {
  if (!profList) return
  const profNames = formatNames(profList, format)
  const profRegex = new RegExp(`(${profNames.join('|')})`, 'gi')

  const span = document.createElement('span');
  span.className = 'rmp-helper-prof';
  span.appendChild(document.createTextNode(''));

  // these will display <span> as a literal text per HTML specification
  const skipTags = ['textarea', 'rp'];
  for (const ele of document.querySelectorAll('p, a, span')) {
    const walker = document.createTreeWalker(ele, NodeFilter.SHOW_TEXT);
    // collect the nodes first because we can't insert new span nodes while walking
    const textNodes = [];
    for (let n; (n = walker.nextNode());) {
      if (n.nodeValue.trim() && !skipTags.includes(n.parentNode.localName)) {
        textNodes.push(n);
      }
    }
    for (const n of textNodes) {
      const fragment = document.createDocumentFragment();
      for (const s of n.nodeValue.split(profRegex)) {
        if (!s) continue
        if (s.trim() && profNames.includes(s.toLowerCase())) {
          span.firstChild.nodeValue = s;
          fragment.appendChild(span.cloneNode(true));
          // insert element to display professor rating here
        } else {
          fragment.appendChild(document.createTextNode(s));
        }
      }
      n.parentNode.replaceChild(fragment, n);
    }
  }
}