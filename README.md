# remark-lint-heading-capitalization

[remark-lint](https://github.com/remarkjs/remark-lint) plugin to ensure that your Markdown headings capitalization is correct.

1. Capitalize the first word, as well as all nouns, pronouns, verbs, adjectives, and adverbs.
2. Articles, conjunctions, and prepositions should remain lowercase.
3. Capitalize the first element in a hyphenated compound. The other elements are generally capitalized unless they are articles, conjunctions, or prepositions.

Some additional points to note:

- The plugin only checks the first letter of words that require capitalization.
- Words written in uppercase are automatically skipped by the plugin.

## Install

```sh
npm install remark-lint-heading-capitalization
```

## Usage

Use like any other [remark-lint](https://github.com/remarkjs/remark-lint) plugin.
Check out the [remark-lint](https://github.com/remarkjs/remark-lint) documentation for details.

### `Options`

Configuration (TypeScript type).

###### Fields

- `lowerCaseWords` (`string[]`, optional, example: `['die', 'der', 'und']`)
  — extends the default list of lowercase words.

- `exclude` (`string[]`, optional, example: `['remark-lint', 'remark']`)
  — exclude the words from capitalization.

- `ignorePattern` (`string` || `string[]`, optional, example: `'package-[a-z]+'` or `['package-[a-z]+', 'node-[0-9]+']`)
  — an array of or string regular expression pattern to ignore things that match the pattern.

## Examples

When this rule is turned on, the following `valid.md` is ok:

```md
## Where to Ask Questions
## An Apple
## Enable 2FA on GitHub
## Flight-or-Fight
```

When this rule is turned on, the following `invalid.md` is **not** ok:

```md
## Where To Ask questions
## an Apple
## Enable 2FA On GitHub
## Flight-Or-fight
```

```text
1:1-1:26 warning Heading capitalization error. Expected: 'Where to Ask Questions' found: 'Where To Ask questions' heading-capitalization remark-lint

2:1-2:12 warning Heading capitalization error. Expected: 'An Apple' found: 'an Apple'                             heading-capitalization remark-lint

3:1-3:24 warning Heading capitalization error. Expected: 'Enable 2FA on GitHub' found: 'Enable 2FA On GitHub'     heading-capitalization remark-lint

4:1-4:19 warning Heading capitalization error. Expected: 'Flight-or-Fight' found: 'Flight-Or-fight'               heading-capitalization remark-lint
```
