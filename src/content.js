import { createRating, createPopup } from './components.js'
import { cache } from './cache.js'

const formatNames = (profList, format) => {
  return profList.map(prof => {
    return format
    .replace('lName', prof.lastName)
    .replace('fName', prof.firstName)
    .replace('mName', '(?:[a-z]*)?\\.?')
    .replace('middleInitial', '(?:[a-z]*)?\\.?')
  })
}

// https://stackoverflow.com/questions/31275446/how-to-wrap-part-of-a-text-in-a-node-with-javascript
export const highlightPage = async () => {
  console.time("Scanner")
  const profList = await cache.getProfessorList()
  const format = await cache.getNameFormat()

  if (!profList || profList.length === 0) return
  const profNames = formatNames(profList, format)
  const regex = new RegExp(`${profNames.join('|')}`, 'gi')
  console.log(regex)
  let nodes = [],
    text = "",
    node,
    nodeIterator = document.createNodeIterator(document, NodeFilter.SHOW_TEXT, null, false);

  while (node = nodeIterator.nextNode()) {
    if (node.parentNode.classList.contains('rmp-helper') || node.parentNode.classList.contains('rmp-helper-highlight')) continue
    if (node.nodeValue.match(/{|}|\[|\]|<|>/g)) continue // skips unnecessary content, saving multiple seconds
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

        let name = match[0]
        name = name.split(/\W/gi)
        // first and last names should be at either end of the split
        if (name.length > 2) name.splice(1, name.length - 2)
        let [firstName, lastName] = name
        const profData = profList.find(prof => ((prof.firstName === firstName && prof.lastName === lastName) || (prof.firstName === lastName && prof.lastName === firstName)))
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
  console.timeEnd("Scanner")
}

const initialize = (() => {
  if (!document.getElementById('rmp-helper-popup')) createPopup()
  document.getElementById('rmp-helper-nav-update').addEventListener('click', highlightPage)
})()