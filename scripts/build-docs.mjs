const pathFromUrl = (url) => decodeURIComponent(url.pathname)

const typedocConfigUrl = new URL('../typedoc.json', import.meta.url)
const typedocOutDirUrl = new URL('../docs/typedoc/', import.meta.url)
const typedocOutputUrl = new URL('./README.md', typedocOutDirUrl)
const templateUrl = new URL('../docs/README.template.md', import.meta.url)
const readmeUrl = new URL('../README.md', import.meta.url)

const typedocConfigPath = pathFromUrl(typedocConfigUrl)
const typedocOutDirPath = pathFromUrl(typedocOutDirUrl)

const typedocRun = Bun.spawnSync({
  cmd: ['bunx', 'typedoc', '--options', typedocConfigPath, '--out', typedocOutDirPath],
  stdout: 'inherit',
  stderr: 'inherit',
})

if (typedocRun.exitCode !== 0) {
  throw new Error(`TypeDoc failed with exit code ${typedocRun.exitCode}.`)
}

const typedocContent = await Bun.file(typedocOutputUrl).text()
const functionsMarker = '## Functions'
const functionsIndex = typedocContent.indexOf(functionsMarker)

if (functionsIndex === -1) {
  throw new Error('TypeDoc output does not include a Functions section.')
}

const functionsSection = typedocContent.slice(functionsIndex).trimEnd()
const template = await Bun.file(templateUrl).text()

if (!template.includes('{{template}}')) {
  throw new Error('README.template.md missing {{template}} placeholder.')
}

const stripThrows = (content) =>
  content.replace(/\n#### Throws\n(?:.|\n)*?(?=\n#### |\n\*\*\*|\n### |\n## |\n$)/g, '\n')

const demoteSubheadings = (content) =>
  content
    .replace(/\n#### Parameters\n/g, '\n**Parameters**\n')
    .replace(/\n#### Returns\n/g, '\n**Returns**\n')
    .replace(/\n#### Example\n/g, '\n**Example**\n')

const reverseFunctions = (content) => {
  const header = '## Functions\n'
  if (!content.startsWith(header)) {
    return content
  }

  const rest = content.slice(header.length)
  const parts = rest.split('\n### ')
  const blocks = parts.map((part, index) => (index === 0 ? part : `### ${part}`))
  return blocks.reverse().join('\n').trimEnd()
}

const rendered = template.replace(
  '{{template}}',
  reverseFunctions(demoteSubheadings(stripThrows(functionsSection))),
)
await Bun.write(readmeUrl, `${rendered}`)
