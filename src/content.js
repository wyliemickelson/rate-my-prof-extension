// look into mutationObserver for changing webpages
import { createRating, createPopup } from './components.js'
import { cache } from './cache.js'

const formatNames = (profList, format) => {
  return profList.map(prof => format.replace('lastName', prof.lastName).replace('firstName', prof.firstName))
}

// https://stackoverflow.com/questions/31275446/how-to-wrap-part-of-a-text-in-a-node-with-javascript
export const highlightPage = async () => {
  const profList = await cache.getProfessorList()
  const format = await cache.getNameFormat()

  if (!profList || profList.length === 0) return
  const profNames = formatNames(profList, format)
  const regex = new RegExp(`(${profNames.join('|')})`, 'g')
  let nodes = [],
    text = "",
    node,
    nodeIterator = document.createNodeIterator(document, NodeFilter.SHOW_TEXT, null, false);

  while (node = nodeIterator.nextNode()) {
    if (node.parentNode.classList.contains('rmp-helper') || node.parentNode.classList.contains('rmp-helper-highlight')) continue
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
      spanNode.className = "rmp-helper-highlight";

      if (!ratingInserted) {
        // current node is first in match
        // obtain professor data
        const name = match[0]
        const profIndex = profNames.indexOf(name)
        const profData = profList[profIndex]
        sessionStorage.setItem(profData.id, JSON.stringify(profData))

        const ratingNode = createRating(profData)
        matchContainer.appendChild(ratingNode)

        node.textNode.parentNode.replaceChild(matchContainer, node.textNode);
        ratingInserted = true
      }

      spanNode.appendChild(node.textNode);
      matchContainer.appendChild(spanNode)
    }
  }
}

const initialize = (() => {
  if (!document.getElementById('rmp-helper-popup')) createPopup()
  document.getElementById('rmp-helper-nav-update').addEventListener('click', highlightPage)
})()