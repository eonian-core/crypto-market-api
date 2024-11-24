import { Request, Response } from 'express';
import { TokenService } from './TokensService';

export class TokensController {
    constructor(
        private service: TokenService
    ){}

    public async getTokens(request: Request, response: Response){
        const { limit = 5, category, orderBy = 'change', timeframe = '24h' } = request.query
        console.log(`Trying to get top tokens by price change...`, { limit, category, orderBy, timeframe })

        try {
            const tokens = await this.service.getTokens({
                limit: limit as number,
                timePeriod: timeframe as any,
                orderBy: orderBy as any,
                ...(category ? { tags: [category as any] } : {})
              })
              
            response.json(tokens)
        } catch (error: any) {
            console.error(`Failed to get tokens`, error)
            response.status(500).json({error: 'Failed to get tokens', internalError: error?.message})
        }
    }
}