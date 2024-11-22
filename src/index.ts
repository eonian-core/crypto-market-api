import 'reflect-metadata'
import 'dotenv/config'

import express from 'express';
import * as fs from 'node:fs'
import * as showdown from 'showdown'

import {Md2NotionProvider} from './Md2NotionProvider'
import {Notion2MdProvider} from './Notion2MdProvider'

// set up express web server
const app = express()
// set up static content
app.use(express.static('public'))
// Use express.json() middleware to parse JSON bodies
app.use(express.json())

const md = new showdown.Converter()
// Main page
app.get('/', async(_request, response) => {
  const readme = fs.readFileSync('README.md', 'utf-8')

  console.log(`Received request. Sending readme content.`)

  // render HTML response
  try {
    response.set('Content-Type', 'text/html')

    const content = fs.readFileSync('views/index.tmpl', 'utf-8')
      .replace('@@MAIN@@', md.makeHtml(readme.toString()))
    response.send(content)
  } catch (error) {
    response.send()
  }
})

/**
 * POST /api/md/to-notion-blocks
 * Parses Markdown content into Notion Blocks.
 *
 * @param body.markdown Any Markdown or GFM content
 * @param body.options Any additional option
 */
app.post('/api/md/to-notion-blocks', async (request, response) => {
  const provider = new Md2NotionProvider()
  const blocks = await provider.toBlocks(request.body.markdown, request.body.options)

  console.log(`Received request. ${request.body.markdown}\n Sending Notion Blocks. ${blocks}`)
  response.json(blocks)
})

/**
 * POST /api/md/to-notion-rich-text
 * Parses Markdown content into Notion Blocks.
 *
 * @param body.markdown Any Markdown or GFM content
 * @param body.options Any additional option
 */
app.post('/api/md/to-notion-rich-text', async (request, response) => {
  const provider = new Md2NotionProvider()
  const richText = await provider.toRichText(request.body.markdown, request.body.options)

  console.log(`Received request. ${request.body.markdown}\n Sending Notion Rich Text. ${richText}`)

  response.json(richText)
})

/**
 * POST /api/notion/to-md
 * Converts list of Notion Blocks to Markdown string
 * @param {ListBlockChildrenResponseResults | undefined} body.blocks - List of notion blocks
 * @param {number} body.totalPage - Retrieve block children request number, page_size Maximum = totalPage * 100
 * @param {MdBlock[]} body.mdBlocks - Defines max depth of nesting
 * @param {number} body.nestingLevel - Defines max depth of nesting
 * @returns {MdStringObject} - Returns markdown string with child pages separated
 */
app.post('/api/notion/to-md', async (request, response) => {
  const provider = new Notion2MdProvider()
  const md = await provider.toMd(request.body.blocks, request.body.totalPage, request.body.mdBlocks, request.body.pageIdentifier, request.body.nestingLevel)

  console.log(`Received request. ${request.body.blocks}\n Sending Markdown. ${md}`)

  response.json(md)
})

// Start web server on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
