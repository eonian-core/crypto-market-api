
export const isProduction = process.env.NODE_ENV !== 'development'
console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode`)

export const port = +(process.env.PORT || "3000")

export const MORALIS_API_KEY = process.env.MORALIS_API_KEY

export const COINRANKING_API_KEY = process.env.COINRANKING_API_KEY
if(!COINRANKING_API_KEY) {
    throw new Error('COINRANKING_API_KEY is not provided')
}