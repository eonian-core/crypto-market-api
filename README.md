# Crypto Market API

Lambda that provides API to retrieve data about crypto market prices and performance

## API Documentation

### `GET /`

Main page. Sends the readme content as an HTML response.

---

### `GET /api/tokens/by-price-change`

Returns a list of the best and least performing cryptocurrencies in the last 24 hours.


**Query Params:**

- `limit`: (number) Amount of tokens to retrieve, default is 5
- `category`: (string) Tokens category, default is `all`
- `timeframe`: (24h|7d) Timeframe for price change, default is `24h`

**Response:**  
Returns a JSON of tokens based on https://docs.moralis.com/market-insights-api/reference/get-top-erc20-tokens-by-price-movers
with additional meta data https://docs.moralis.com/web3-data-api/evm/reference/get-token-metadata-by-symbol

---

## Test API

You can test the API using the following curl commands:

```bash
# api/tokens/by-price-change
curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/tokens/by-price-change


```

## Getting Started

Clone repo

```bash
git clone https://github.com/eonian-core/crypto-market-api.git
```

Install dependencies

```bash
  cd crypto-market-api
  npm i 
```

## Development

Build and start server

```bash
  npm run dev
```

### Commands

- `build` - Build project
- `start` - Start server

### Running Tests

To run tests, run the following command

```bash
  # Unit tests on mocks
  npm run test
  # E2E tests with real requests
  npm run test:e2e
```

### Deployment

To deploy, you need [install flyctl](https://fly.io/docs/hands-on/install-flyctl/) and login using `fly auth login`

To deploy this project run

```bash
  npm run deploy
```

#### Next steps

- Run `fly status` - show the status of the application instances.
- Run `fly apps open` - open your browser and direct it to your app.

## Made by Eonian

[Eonian](https://eonian.finance) internal project. We trying to be as transparent as possible with our users, as part of this practice we publishing this project.
You can also use it for own development. Any contributions and suggestions are welcome!

## Contributing

Contributions are always welcome!

Create new issues or contact us in [Discord](https://discord.gg/8mcUPPYJmj) for any questions!
