
import * as config from './config';

export interface GetCoinsOptions {
    /** default 50 */
    limit?: number; 
    /** default 0 */
    offset?: number;
    /** default 24h */
    timePeriod?: '1h' | '3h' | '12h' | '24h' | '7d' | '30d' | '3m' | '1y' | '3y' | '5y'
    /** example https://api.coinranking.com/v2/coins?blockchains[]=ethereum&blockchain[]=eos */
    blockchains?: Array<string>;
    /** example https://api.coinranking.com/v2/coins?tiers[]=1&tiers[]=2 */
    tiers?: Array<1 | 2 | 3>;
    /** example https://api.coinranking.com/v2/coins?tags[]=defi */
    tags?: Array<'defi' | 'stablecoin' | 'nft' | 'dex' | 'exchange' | 'staking' | 'dao' | 'meme' | 'privacy' | 'metaverse' | 'gaming' | 'wrapped' | 'layer-1' | 'layer-2' | 'fan-token' | 'football-club' | 'web3' | 'social'>;
    /** default value marketCap */
    orderBy?: 'price' | 'marketCap' | '24hVolume' | 'change' | 'listedAt';
    /** default value desc */
    orderDirection?: 'asc' | 'desc';
}

export interface CoinrankingResponse<T> {
    status: string;
    data: T;
}

export interface BaseCoinData {
    uuid: string;
    symbol: string;
    name:string
    color: string;
    iconUrl: string;
    marketCap: string;
    price: string;
    tier: number;
    change: string;
    rank: number;
    btcPrice: string;
}

export interface GetCoinsResponse {
    stats: Record<string, number | string>;
    coins: Array<BaseCoinData>;
}

export interface CoinDetails extends BaseCoinData {
    websiteUrl: string;
    links: Array<{name: string, url: string, type: string}>;
    tags: Array<string>;
    allTimeHigh: {price: string, timestamp: number};
}

export interface CoinDetailsResponse {
    coin: CoinDetails;
}

export class CoinrankingAdapter {
    
    /** https://developers.coinranking.com/api/documentation/coins/ */
    public async getCoins(options?: GetCoinsOptions): Promise<CoinrankingResponse<GetCoinsResponse>> {
        const params = options ? new URLSearchParams(options as Record<string, string>).toString() : undefined
        const fullUrl = `https://api.coinranking.com/v2/coins` + (params ? `?${params}` : '')
        console.log(`Fetching coins from ${fullUrl}`)
        return await this.fetch(fullUrl)
    }

    /** https://developers.coinranking.com/api/documentation/coins/coin-details */
    public async getCoinDetails(uuid: string): Promise<CoinrankingResponse<CoinDetailsResponse>> {
        const fullUrl =  `https://api.coinranking.com/v2/coin/${uuid}`
        console.log(`Fetching coin data from ${fullUrl}`)
        return await this.fetch(fullUrl)
    }

    async fetch<Result>(
        input: string | URL | globalThis.Request,
        init: RequestInit = {},
    ) {
        // Moralis NodeJS SDK not working, will use raw API
        const response = await fetch(input, {
            ...init,
            headers: {
                ...(init.headers || {}),
                'accept': 'application/json',
                'x-access-token': config.COINRANKING_API_KEY!,
            }
        })

        return await response.json() as Result;
    }
}