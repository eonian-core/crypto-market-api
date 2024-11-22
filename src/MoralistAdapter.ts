// import Moralis from 'moralis';
import {EvmMarketDataERC20TokensByPriceMoversJSON} from '@moralisweb3/common-evm-utils'
import * as config from './config';

export class MoralistAdapter {
    
    public async getTopERC20TokensByPriceMovers(){
        return await this.fetch<EvmMarketDataERC20TokensByPriceMoversJSON>(`https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-movers`)
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
                'X-API-Key': config.MORALIS_API_KEY!,
            }
        })

        return await response.json() as Result;
    }
}