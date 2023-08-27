// look into mutationObserver for changing webpages
import {createRating, createPopup} from './components.js'

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

// https://stackoverflow.com/questions/31275446/how-to-wrap-part-of-a-text-in-a-node-with-javascript
const highlightPage = (profList, format = 'lastName, firstName') => {
  if (!profList || profList.length === 0) return
  const profNames = formatNames(profList, format)
  const regex = new RegExp(`(${profNames.join('|')})`, 'g')
  let nodes = [],
    text = "",
    node,
    nodeIterator = document.createNodeIterator(document, NodeFilter.SHOW_TEXT, null, false);

  while (node = nodeIterator.nextNode()) {
    if (node.parentNode.className.includes('rmp-helper')) continue
    nodes.push({
      textNode: node,
      start: text.length
    });
    text += node.nodeValue
  }

  if (!nodes.length)
    return;

  let match;
  while (match = regex.exec(text)) {
    let ratingInserted = false
    let matchLength = match[0].length;
    const matchContainer = document.createElement('div')
    matchContainer.className = 'rmp-helper-match'

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
      let spanNode = document.createElement("span");
      spanNode.className = "rmp-helper rmp-helper-highlight";

      if (!ratingInserted) {
        // current node is first in match
        // obtain professor data
        const name = match[0]
        const profIndex = profNames.indexOf(name)
        const profData = profList[profIndex]

        const ratingNode = createRating(profData)
        matchContainer.appendChild(ratingNode)

        const popup = createPopup(profData)
        ratingNode.appendChild(popup)
        node.textNode.parentNode.replaceChild(matchContainer, node.textNode);
        ratingInserted = true
      }
      
      spanNode.appendChild(node.textNode);
      matchContainer.appendChild(spanNode)
    }
  }
}