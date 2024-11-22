import 'reflect-metadata'
import 'dotenv/config'

import express from 'express';
import * as fs from 'node:fs'
import * as showdown from 'showdown'

import * as config from './config';
import { CoinrankingAdapter } from './CoinrankingAdapter';
import { TokenStatsService } from './TokensStatsService';

// set up express web server
const app = express()
// set up static content
app.use(express.static('public'))
// Use express.json() middleware to parse JSON bodies
app.use(express.json())

const coinranking = new CoinrankingAdapter()
const tokensService = new TokenStatsService(coinranking)
/**
 * GET /api/tokens
 * Returns a list of the best and least performing cryptocurrencies in the last 24 hours.
 *
 * @param query.limit - (number) Amount of tokens to retrieve, default is 5
 * @param query.category - (string) Tokens category, default undefined, which means all
 * @param query.orderBy - ('price' | 'marketCap' | '24hVolume' | 'change' | 'listedAt') Order tokens by price change, volume or market capitalization, default is `change`
 * @param query.timeframe - ('1h' | '3h' | '12h' | '24h' | '7d' | '30d' | '3m' | '1y' | '3y' | '5y') Timeframe for price change, default is `24h`
 */
app.get('/api/tokens', async (request, response) => {
  const { limit = 5, category, orderBy = 'change', timeframe = '24h' } = request.query
  console.log(`Trying to get top tokens by price change...`)

  const tokens = await tokensService.getTokens({
    limit: limit as number,
    timePeriod: timeframe as any,
    orderBy: orderBy as any,
    ...(category ? { tags: [category as any] } : {})
  })

  response.json({tokens})
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