import 'reflect-metadata'
import 'dotenv/config'


import {EvmMarketDataERC20TokensByPriceMovers} from '@moralisweb3/common-evm-utils'
import express from 'express';
import * as fs from 'node:fs'
import * as showdown from 'showdown'

import * as config from './config';

// set up express web server
const app = express()
// set up static content
app.use(express.static('public'))
// Use express.json() middleware to parse JSON bodies
app.use(express.json())

const md = new showdown.Converter()

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

  // Moralis NodeJS SDK not working, will use raw API
  const tokensReponse = await fetch(`https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-movers`, {
    headers: {
      'accept': 'application/json',
      'X-API-Key': config.MORALIS_API_KEY!,
    }
  })

  const tokens = await tokensReponse.json() as EvmMarketDataERC20TokensByPriceMovers
  console.log(`Received tokens`, tokens.gainers[0])

  response.json(tokens.gainers[0])
})

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