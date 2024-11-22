import 'reflect-metadata'
import 'dotenv/config'

import express from 'express';
import * as fs from 'node:fs'
import * as showdown from 'showdown'

import * as config from './config';
import { MoralistAdapter } from './MoralistAdapter';

// set up express web server
const app = express()
// set up static content
app.use(express.static('public'))
// Use express.json() middleware to parse JSON bodies
app.use(express.json())

const moralis = new MoralistAdapter()

/**
 * GET /api/tokens/by-price-change
 * Returns a list of the best and least performing cryptocurrencies in the last 24 hours.
 *
 * @param query.limit - (number) Amount of tokens to retrieve, default is 5
 * @param query.category - (string) Tokens category, default is `all`
 * * @param query.timeframe - (24h|7d) Timeframe for price change, default is `24h`
 */
app.get('/api/tokens/by-price-change', async (request, response) => {
  console.log(`Trying to get top tokens by price change...`)

  const tokens = await moralis.getTopERC20TokensByPriceMovers()
  const gainers = tokens.gainers.map((token) => ({
    name: token.token_name, 
    symbol: token.token_symbol,
    priceChange24h: token.price_24h_percent_change,
    priceChange7d: token.price_7d_percent_change
  }))
  console.log(`Received tokens`, gainers)

  response.json(gainers)
})

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



async function main(){
  app.listen(config.port, () => {
    console.log(`🚀 Server ready at: https://localhost:${config.port}`)
  }) 
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })