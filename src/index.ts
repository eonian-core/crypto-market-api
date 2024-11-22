import 'reflect-metadata'
import 'dotenv/config'

import express from 'express';
import * as fs from 'node:fs'
import * as showdown from 'showdown'

import * as config from './config';
import { CoinrankingAdapter } from './CoinrankingAdapter';

// set up express web server
const app = express()
// set up static content
app.use(express.static('public'))
// Use express.json() middleware to parse JSON bodies
app.use(express.json())

const coinranking = new CoinrankingAdapter()

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

  const tokens = await coinranking.getCoins({
    limit: 5,
    timePeriod: '24h',
    orderBy: 'change',
  })

  const details = await Promise.all(tokens.data.coins.map((coin) => coinranking.getCoinDetails(coin.uuid)))
  const top = details.map(({data: {coin}}) => ({
    uuid: coin.uuid,
    symbol: coin.symbol,
    name: coin.name,
    change: coin.change,
    price: coin.price,
    links: coin.links.find((link) => link.type === 'twitter'), 
    website: coin.websiteUrl,
    rank: coin.rank,
    tier: coin.tier,
  }))
  console.log(`Received tokens`, top)

  response.json(top)
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