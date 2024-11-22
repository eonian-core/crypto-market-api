import { CoinrankingAdapter, GetCoinsOptions } from "./CoinrankingAdapter";

export interface TokensResult {
    uuid: string;
    symbol: string;
    color: string;
    icon: string;
    name: string;
    change: string;
    price: string;
    twitterLink:  {url: string, handle: string} | undefined;
    website: string;
    rank: number;
    tier: number;
}

export class TokenStatsService {
    constructor(
        private api: CoinrankingAdapter
    ){}

    public async getTokens(options?: GetCoinsOptions): Promise<Array<TokensResult>>{
        const tokens = await this.api.getCoins(options)
        const details = await Promise.all(tokens.data.coins.map((coin) => 
            this.api.getCoinDetails(coin.uuid)
        ))
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
