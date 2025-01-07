import { lintRule } from 'unified-lint-rule'
import { visit } from 'unist-util-visit'

import lowerCaseWords from './lib/lowerCaseWords.js'
import { capitalizeWord, isUpperCase } from './lib/utils.js'

const cache = {}

export function extractContent(node) {
  // If the node is a text node, return the value
  if (node.type === 'text') {
    return node.value || ''
  }

  // If the node is an inlineCode node, return the value wrapped in backticks
  if (node.type === 'inlineCode') {
    return node.value ? `\`${node.value}\`` : ''
  }

  // If the node has children, return the concatenated value of all children
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractContent).join('')
  }

  return node.value || ''
}

export function fixTitle(title, options) {
  const correctTitle = title.replace(/[^\s-]+/g, (word, index) => {
    // If the word is already in uppercase, return it as is.
    if (isUpperCase(word)) {
      return word
    }

    // If the word is not the first word in the title and should be lowercase, return it in lowercase.
    const lowerCaseWord = word.toLowerCase()
    if (
      index !== 0 &&
      [...lowerCaseWords, ...(options.lowerCaseWords ?? [])].includes(
        lowerCaseWord
      )
    ) {
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

function headingCapitalization(tree, file, options = {}) {
  const { ignorePattern } = options
  let ignorePatterns = []

  // Process ignorePattern to create an array of regular expressions
  if (Array.isArray(ignorePattern)) {
    ignorePatterns = ignorePattern.map(pattern => new RegExp(pattern, 'g'))
  } else if (ignorePattern) {
    ignorePatterns = [new RegExp(ignorePattern, 'g')]
  }

  visit(tree, 'heading', node => {
    let processedTitle = extractContent(node)

    // Create a processed version of the title by removing ignored patterns
    for (const regex of ignorePatterns) {
      processedTitle = processedTitle.replace(regex, '')
    }

    // If the processed title is found among the correct titles, skip further processing
    if (cache[processedTitle]) {
      return
    }

    const correctTitle = fixTitle(processedTitle, options)

    if (correctTitle !== processedTitle) {
      file.message(
        `Heading capitalization error. Expected: '${correctTitle}' found: '${processedTitle}'`,
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
