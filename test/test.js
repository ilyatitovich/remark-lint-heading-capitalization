import fs from 'fs'
import path from 'path'
import assert from 'node:assert/strict'
import test from 'node:test'
import { remark } from 'remark'
import { compareMessage } from 'vfile-sort'
import remarkLintHeadingCapitalization from '../index.js'

const invalidMdPath = path.join(import.meta.dirname, 'docs', 'invalid.md')
const validMdPath = path.join(import.meta.dirname, 'docs', 'valid.md')

const invalidMd = fs.readFileSync(invalidMdPath, 'utf-8')
const validMd = fs.readFileSync(validMdPath, 'utf-8')

test('find wrong capitalizations in headings', async () => {
  const result = await remark()
    .use(remarkLintHeadingCapitalization)
    .process(invalidMd)

  result.messages.sort(compareMessage)

  assert.deepEqual(
    result.messages.map(d => d.reason),
    [
      "Heading capitalization error. Expected: 'Where to Ask Questions' found: 'Where To Ask questions'",
      "Heading capitalization error. Expected: 'An Apple' found: 'an Apple'",
      "Heading capitalization error. Expected: 'Яблоко' found: 'яблоко'",
      "Heading capitalization error. Expected: 'À La Carte' found: 'À la carte'",
      "Heading capitalization error. Expected: 'Enable 2FA on GitHub' found: 'Enable 2FA On GitHub'",
      "Heading capitalization error. Expected: 'Flight-or-Fight' found: 'Flight-Or-fight'"
    ]
  )
})

test('no errors found', async () => {
  const result = await remark()
    .use(remarkLintHeadingCapitalization)
    .process(validMd)

  assert.strictEqual(result.messages.length, 0)
})

test('custom list of lowercase words', async () => {
  const result1 = await remark()
    .use(remarkLintHeadingCapitalization, {
      lowerCaseWords: ['die', 'der', 'und']
    })
    .process('# Der Wolf und die Sieben Ziegen')

  assert.strictEqual(result1.messages.length, 0)
})
