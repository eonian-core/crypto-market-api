import { CoinDetailsResponse, CoinrankingAdapter, CoinrankingResponse, GetCoinsOptions } from "../adapters/CoinrankingAdapter";

export interface TokensResult {
    uuid: string;
    symbol: string;
    color: string;
    icon: string;
    name: string;
    change: string;
    price: string;
    btcPrice: string;
    twitterLink:  {url: string, handle: string} | undefined;
    website: string;
    rank: number;
    tier: number;
    tags: Array<string>;
    allTimeHigh: {price: string, timestamp: number};
    marketCap: string;
    '24hVolume': string;
    links: Array<{name: string, url: string, type: string}>;
    coinrankingUrl: string;
}

export class TokenService {
    constructor(
        private api: CoinrankingAdapter
    ){}

    public async getTokens(options?: GetCoinsOptions): Promise<Array<TokensResult>>{
        const tokens = await this.api.getCoins(options)
        console.log(`Received tokens`, tokens)
        const details = await Promise.all(tokens.data.coins.map((coin) => 
            this.api.getCoinDetails(coin.uuid)
        )) as Array<CoinrankingResponse<CoinDetailsResponse>>
        console.log(`Received tokens details`, details)

        const simplified = details.map(({data: {coin}}) => ({
            uuid: coin.uuid,
            symbol: coin.symbol,
            color: coin.color,
            icon: coin.iconUrl,
            name: coin.name,
            change: coin.change,
            price: coin.price,
            twitterLink: parseTwitterLink(coin.links.find((link) => link.type === 'twitter')?.url), 
            website: coin.websiteUrl,
            rank: coin.rank,
            tier: coin.tier,
            tags: coin.tags,
            allTimeHigh: coin.allTimeHigh,
            btcPrice: coin.btcPrice,
            marketCap: coin.marketCap,
            '24hVolume': coin['24hVolume'],
            links: coin.links,
            coinrankingUrl: coin.coinrankingUrl
          }))
        console.log(`Result tokens`, simplified)

        return simplified
    }
}

export function parseTwitterLink(url?: string): {url: string, handle: string} | undefined {
    if(!url){
        return 
    }

    const handle = url.split('/').pop()!
    return {url, handle}
}
