import { lintRule } from 'unified-lint-rule'
import { visit } from 'unist-util-visit'

import lowerCaseWords from './lib/lowerCaseWords.js'
import { capitalizeWord, isUpperCase } from './lib/utils.js'


const cache = {}

export function fixTitle(title) {
  const correctTitle = title.replace(/[^\s-]\w+/g, (word, index) => {
    // If the word is already in uppercase, return it as is.
    if (isUpperCase(word)) {
      return word
    }

    // If the word is not the first word in the title and should be lowercase, return it in lowercase.
    const lowerCaseWord = word.toLowerCase()
    if (index !== 0 && lowerCaseWords[lowerCaseWord]) {
      return lowerCaseWord
    }

    // Checking the first letter of a word is not capitalized.
    if (!isUpperCase(word.charAt(0))) {
      return capitalizeWord(word)
    }

    return word
  })

  // Putting correct title in the cache for prevent handling the same titles in other docs.
  cache[correctTitle] = correctTitle

  return correctTitle
}

function headingCapitalization(tree, file) {
  visit(tree, 'heading', node => {
    const title = node.children.map(child => child.value).join('')

    // If the title is found among the correct titles - no calculations are performed.
    if (cache[title]) {
      return
    }

    const correctTitle = fixTitle(title)

    if (correctTitle !== title) {
      file.message(
        `Heading capitalization error. Expected: '${correctTitle}' found: '${title}'`,
        node
      )
    }
  })
}

const remarkLintHeadingCapitalization = lintRule(
  'remark-lint:heading-capitalization',
  headingCapitalization
)

export default remarkLintHeadingCapitalization
