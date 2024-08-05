export function capitalizeWord(word) {
  return word.charAt(0).toLocaleUpperCase() + word.substring(1)
}

export function isUpperCase(word) {
  return word === word.toLocaleUpperCase()
}
