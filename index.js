import { lintRule } from 'unified-lint-rule'
import { visit } from 'unist-util-visit'

import lowerCaseWords from './lib/lowerCaseWords.js'
import { capitalizeWord, isUpperCase, isWordExcluded } from './lib/utils.js'

const cache = {}

export function fixTitle(title, options) {
  // Split the title into words by spaces
  const correctTitle = title.replace(/[^\s]+/g, (word, wordPositionInTitle) => {
    if (isWordExcluded(word, options)) {
      return word
    }

    // Split hyphenated word to words by hyphens
    // Applies word correction base on position in the title and position in the hyphenated word
    return word.replace(/[^-]+/g, (hyphenatedWord, hyphenatedWordPosition) =>
      correctWord(
        hyphenatedWord,
        hyphenatedWordPosition + wordPositionInTitle,
        options
      )
    )
  })

  // Putting correct title in the cache to prevent handling the same titles in other docs.
  cache[correctTitle] = correctTitle

  return correctTitle
}

function correctWord(word, wordPosition, options = {}) {
  // If the word is already in uppercase, return it as is.
  if (isUpperCase(word)) {
    return word
  }

  // If the word is not the first word in the title and should be lowercase, return it in lowercase.
  const lowerCaseWord = word.toLowerCase()
  if (
    wordPosition !== 0 &&
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
}

function headingCapitalization(tree, file, options = {}) {
  const { ignorePattern, lowerCaseWords = [] } = options
  let ignorePatterns = []

  // Process ignorePattern to create an array of regular expressions
  if (Array.isArray(ignorePattern)) {
    ignorePatterns = ignorePattern.map(pattern => new RegExp(pattern, 'g'))
  } else if (ignorePattern) {
    ignorePatterns = [new RegExp(ignorePattern, 'g')]
  }

  visit(tree, 'heading', node => {
    let processedTitle = node.children.reduce((acc, child) => acc + (child.type === 'inlineCode' ? `\`${child.value}\`` : child.value), '')

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
