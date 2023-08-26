// look into mutationObserver for changing webpages

chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => highlightPage(profList))
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === 'scan page') {
      console.log('scanning')
      chrome.runtime.sendMessage({ message: 'retrieve professors' }, (profList) => highlightPage(profList))
    }
  }
)

const formatNames = (profList, format) => {
  return profList.map(prof => format.replace('lastName', prof.lastName).replace('firstName', prof.firstName))
}

const createPopup = (profIndexes, profList) => {
  if (profIndexes.length === 1) {
    // only one professor exists
    const prof = profList[profIndexes[0]]
    console.log(prof)
  } else {
    // there are multiple professors
    console.log('multiple found', profIndexes)
  }
}

const highlightPage = (profList, format = 'firstName lastName') => {
  const profNames = formatNames(profList, format)
  const regex = new RegExp(`(${profNames.join('|')})`, 'g')
  let nodes = [],
    text = "",
    node,
    nodeIterator = document.createNodeIterator(document, NodeFilter.SHOW_TEXT, null, false);

  while (node = nodeIterator.nextNode()) {
    nodes.push({
      textNode: node,
      start: text.length
    });
    text += node.nodeValue
  }
  console.log(nodes)

  if (!nodes.length)
    return;

  let match;
  while (match = regex.exec(text)) {
    let ratingInserted = false
    let matchLength = match[0].length;

    // Prevent empty matches causing infinite loops        
    if (!matchLength) {
      regex.lastIndex++;
      continue;
    }

    for (let i = 0; i < nodes.length; ++i) {
      node = nodes[i];
      let nodeLength = node.textNode.nodeValue.length;

      // Skip nodes before the match
      if (node.start + nodeLength <= match.index)
        continue;

      // Break after the match
      if (node.start >= match.index + matchLength)
        break;

      // Split the start node if required
      if (node.start < match.index) {
        nodes.splice(i + 1, 0, {
          textNode: node.textNode.splitText(match.index - node.start),
          start: match.index
        });
        continue;
      }

      // Split the end node if required
      if (node.start + nodeLength > match.index + matchLength) {
        nodes.splice(i + 1, 0, {
          textNode: node.textNode.splitText(match.index + matchLength - node.start),
          start: match.index + matchLength
        });
      }

      // Highlight the current node
      if (!ratingInserted) {
        let ratingNode = document.createElement("div");
        ratingNode.className = 'rmp-helper-rating'
        node.textNode.parentNode.insertBefore(ratingNode, node.textNode)
        // obtain professor data here
        ratingNode.appendChild(document.createTextNode('Rating'))
        ratingInserted = true
      }

      let spanNode = document.createElement("span");
      spanNode.className = "highlight";
      node.textNode.parentNode.replaceChild(spanNode, node.textNode);
      spanNode.appendChild(node.textNode);
    }
    console.log(node)
  }
}

// const createProfWrapper = () => {
//   const wrapper = document.createElement('span');
//   wrapper.className = 'rmp-helper-prof';
//   wrapper.appendChild(document.createTextNode(''));
//   wrapper.addEventListener('mouseover', () => console.log('hovering'))
//   return wrapper
// }

// // https://stackoverflow.com/questions/57913199/modify-html-while-preserving-the-existing-elements-and-event-listeners
// const scanPage = (profList, format = 'firstName lastName') => {
//   if (!profList) return
//   const profNames = formatNames(profList, format)
//   const profRegex = new RegExp(`(${profNames.join('|')})`, 'gi')

//   // these will display <span> as a literal text per HTML specification
//   const skipTags = ['textarea', 'rp'];
//   for (const ele of document.querySelectorAll('p, a, span')) {
//     const walker = document.createTreeWalker(ele, NodeFilter.SHOW_TEXT);
//     // collect the nodes first because we can't insert new span nodes while walking
//     const textNodes = [];
//     for (let n; (n = walker.nextNode());) {
//       if (n.nodeValue.trim() && !skipTags.includes(n.parentNode.localName) && !n.parentNode.className.includes('rmp-helper-prof')) {
//         textNodes.push(n);
//       }
//     }
//     for (const n of textNodes) {
//       const fragment = document.createDocumentFragment();
//       for (const s of n.nodeValue.split(profRegex)) {
//         if (!s) continue
//         if (s.trim() && profNames.includes(s)) {
//           const wrapper = createProfWrapper()
//           wrapper.firstChild.nodeValue = s;
//           fragment.appendChild(wrapper);

//           // insert element to display professor rating here
//           const profIndexes = getAllIndexes(s)
//           createPopup(profIndexes, profList)
//         } else {
//           fragment.appendChild(document.createTextNode(s));
//         }
//       }
//       n.parentNode.replaceChild(fragment, n);
//     }
//   }
// }

const getAllIndexes = (arr, val) => {
  let indexes = [], i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}