chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => scanPage(profList))
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === 'scan page') {
      console.log('scanning')
      scanPage()
    }
  }
)
// look into mutationObserver for changing webpages

const scanPage = (profList) => {
  const profNames = ['Glimm']
  // let regex = new RegExp(`${profNames.join("|")}(?![^<]*>)`, 'gi')
  // let replaced = documentText.replaceAll(regex, '<span style="color:red">$&</span>')


  const span = document.createElement('span');
  span.className = 'rmp-helper-prof';
  span.appendChild(document.createTextNode(''));

  // these will display <span> as a literal text per HTML specification
  const skipTags = ['textarea', 'rp'];
  // * symbol obtains all elements
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
      for (const s of n.nodeValue.split(/(\s+)/)) {
        if (s.trim() && s.includes('Glimm')) {
          span.firstChild.nodeValue = s;
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