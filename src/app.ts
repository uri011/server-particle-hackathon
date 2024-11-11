// Import necessary modules
import { config } from 'dotenv'
import express from 'express'
import NodeCache from 'node-cache'
import { Contract, JsonRpcProvider } from 'ethers'
import cors from 'cors'
import { getBaseAnalytics } from './metrics/index.js' // Ensure correct path
import { contracts } from './utils/contracts/index.js' // Ensure correct path
import { extractEvents } from './services/index.js' // Ensure correct path
import { isAddress } from 'viem'
// Load environment variables
config()
// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000
// Enable CORS for all routes
app.use(cors())
// Initialize cache with a TTL of 60 seconds
const cache = new NodeCache({ stdTTL: 60 })
// Initialize Ethers provider
const provider = new JsonRpcProvider(process.env.ALCHEMY_BASE_SEPOLIA_URL)
// ERC20 ABI Fragment for symbol()
const ERC20_ABI = ['function symbol() view returns (string)']
// Utility function to format numbers as currency
const formatCurrency = (amount: any) => {
    const number = parseFloat(amount)
    if (isNaN(number)) return '$0.00'
    return `$${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
// Utility function to calculate percentage change
const calculateChange = (latest: any, previous: any) => {
    if (previous === 0) return '0.00%' // Avoid division by zero
    const change = ((latest - previous) / previous) * 100
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
}
// Utility function to get symbol from token address
const getSymbol = async (address: any) => {
    try {
        const contract = new Contract(address, ERC20_ABI, provider)
        const symbol = await contract.symbol()
        return symbol
    } catch (error) {
        console.warn(`Unable to fetch symbol for address: ${address}`)
        return 'UNKNOWN'
    }
}

// Function to generate Endpoint 1 JSON data
const generateEndpoint1Data = async () => {
    try {
        // Extract SetTokenCreated events
        const setTokenCreated = await extractEvents({
            contract: contracts.core.stc,
            event: 'SetTokenCreated',
            fromBlock: contracts.core.stc.deployBlock,
            toBlock: undefined,
        })
        // Array to hold all token data
        const tokensData = []
        // Iterate through each SetTokenCreated event
        for (let i = 0; i < setTokenCreated.length; i++) {
            const event = setTokenCreated[i].inputs
            const name = event._name // Extracted directly from event
            const symbol = event._symbol
            const address = event._setToken
            console.log(`SET TOKEN ${symbol} - ${address}`)
            console.log(`Extraction of Blocks Initialized`)
            // Get analytics data
            const analytics = await getBaseAnalytics(address)
            // Extract latest and previous price
            const priceData = analytics.price
            if (!priceData || priceData.length === 0) {
                console.warn(`No price data available for token: ${symbol}`)
                continue // Skip this token if no price data
            }
            const latestPriceObj = priceData[priceData.length - 1]
            const previousPriceObj =
                priceData.length >= 2 ? priceData[priceData.length - 2] : latestPriceObj // Fallback if only one price point
            const latestPrice = parseFloat(latestPriceObj.indexPrice)
            const previousPrice = parseFloat(previousPriceObj.indexPrice)
            const priceFormatted = formatCurrency(latestPrice)
            const change = calculateChange(latestPrice, previousPrice)
            // Extract latest TVL (mcap)
            const mcapData = analytics.mcap
            if (!mcapData || mcapData.length === 0) {
                console.warn(`No mcap data available for token: ${symbol}`)
                continue // Skip this token if no mcap data
            }
            const latestMcapObj = mcapData[mcapData.length - 1]
            const latestMcap = parseFloat(latestMcapObj.mcap)
            const tvlFormatted = formatCurrency(latestMcap)
            // Push the formatted data into tokensData array
            tokensData.push({
                name: name,
                symbol: symbol,
                address: address,
                price: priceFormatted,
                change: change,
                tvl: tvlFormatted,
            })
            // Optional: Logging for debugging
            console.log(`SUPPLY RESULT ${analytics.supply}`)
            console.log(`PRICE RESULT`)
            priceData.forEach(p => console.log(p))
            console.log(`\nDISTRIBUTION RESULT`)
            analytics.dist.forEach(d => console.log(d))
            console.log(`\nMARKET CAP RESULT`)
            mcapData.forEach(m => console.log(m))
        }
        return tokensData
    } catch (error) {
        console.error('Error generating Endpoint 1 data:', error)
        throw error // Propagate the error to be handled by the caller
    }
}

// Endpoint 1: Get all tokens
app.get('/api/tokens', async (_req, res) => {
    try {
        const data = await generateEndpoint1Data()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
// Function to process a single token for Endpoint 2
const processTokenForEndpoint2 = async (event: any) => {
    const name = event.inputs._name
    const symbol = event.inputs._symbol
    const address = event.inputs._setToken
    const deployBlock = event.blockNumber
    console.log(`Processing Token ${symbol} - ${address} for Endpoint 2`)
    // Get analytics data
    const analytics = await getBaseAnalytics(address)
    // Extract price data and calculate deltas
    const priceData = analytics.price
    if (!priceData || priceData.length === 0) {
        console.warn(`No price data available for token: ${symbol}`)
        return null // Skip this token if no price data
    }
    // Ensure there are enough data points for deltas
    const requiredDataPoints = 6 // Latest and 5 previous for 24h, 7d, 1m, 3m, 6m deltas
    if (priceData.length < requiredDataPoints) {
        console.warn(`Insufficient price data for token: ${symbol}`)
        // Handle by filling missing deltas with "0.00%" or similar
    }
    // Helper to get price at a specific index from the end
    const getPriceAtIndex = (indexFromEnd: any) => {
        const index = priceData.length - 1 - indexFromEnd
        if (index < 0 || index >= priceData.length) {
            // If not enough data, return the latest price to avoid errors
            return parseFloat(priceData[priceData.length - 1].indexPrice)
        }
        return parseFloat(priceData[index].indexPrice)
    }
    const latestPrice = getPriceAtIndex(0)
    const price24hAgo = getPriceAtIndex(1)
    const price7dAgo = getPriceAtIndex(2)
    const price1mAgo = getPriceAtIndex(3)
    const price3mAgo = getPriceAtIndex(4)
    const price6mAgo = getPriceAtIndex(5)
    const change24h = calculateChange(latestPrice, price24hAgo)
    const change7d = calculateChange(price24hAgo, price7dAgo)
    const change1m = calculateChange(price7dAgo, price1mAgo)
    const change3m = calculateChange(price1mAgo, price3mAgo)
    const change6m = calculateChange(price3mAgo, price6mAgo)
    // Extract latest TVL (mcap)
    const mcapData = analytics.mcap
    if (!mcapData || mcapData.length === 0) {
        console.warn(`No mcap data available for token: ${symbol}`)
        return null // Skip this token if no mcap data
    }
    const latestMcapObj = mcapData[mcapData.length - 1]
    const latestMcap = parseFloat(latestMcapObj.mcap)
    // Extract supply
    const supply = parseFloat(analytics.supply)
    // Extract latest distribution
    const distData = analytics.dist
    if (!distData || distData.length === 0) {
        console.warn(`No distribution data available for token: ${symbol}`)
        return null // Skip this token if no distribution data
    }
    const latestDistObj = distData[distData.length - 1]
    const distribution = []
    for (let i = 0; i < latestDistObj.indexDist.address.length; i++) {
        const distAddress = latestDistObj.indexDist.address[i]
        const portion = latestDistObj.indexDist.percent[i] * 100 // Convert to percentage
        // Fetch symbol for distribution address
        const distSymbol = await getSymbol(distAddress)
        distribution.push({
            symbol: distSymbol,
            address: distAddress,
            portion: portion.toFixed(2),
        })
    }
    return {
        name: name,
        symbol: symbol,
        address: address,
        'deploy-timestamp': deployBlock.toString(),
        'price-data': {
            price: latestPrice.toString(),
            '24h-delta': change24h,
            '7d-delta': change7d,
            '1m-delta': change1m,
            '3m-delta': change3m,
            '6m-delta': change6m,
        },
        'token-data': {
            supply: supply.toString(),
            mcap: latestMcap.toString(),
            distribution: distribution,
        },
    }
}
// Endpoint 2: Get detailed token info by address
app.get('/api/token/:address', async (req: any, res: any) => {
    try {
        const tokenAddress = req.params.address
        console.log(req.params)
        // Validate Ethereum address
        if (!isAddress(tokenAddress)) {
            return res.status(400).json({ error: 'Invalid Ethereum address.' })
        }
        // Check cache first
        const cacheKey = `tokenData_${tokenAddress.toLowerCase()}`
        const cachedData = cache.get(cacheKey)
        if (cachedData) {
            console.log(`Serving data for ${tokenAddress} from cache.`)
            return res.json(cachedData)
        }
        // Extract SetTokenCreated events
        const setTokenCreated = await extractEvents({
            contract: contracts.core.stc,
            event: 'SetTokenCreated',
            fromBlock: contracts.core.stc.deployBlock,
            toBlock: undefined,
        })
        // Find the event with the given address
        const tokenEvent = setTokenCreated.find(
            event => event.inputs._setToken.toLowerCase() === tokenAddress.toLowerCase(),
        )
        if (!tokenEvent) {
            return res.status(404).json({ error: 'Token not found.' })
        }
        console.log(tokenEvent)
        // Process the token
        const tokenData = await processTokenForEndpoint2(tokenEvent)
        if (!tokenData) {
            return res.status(500).json({ error: 'Unable to retrieve token data.' })
        }
        // Cache the result
        cache.set(cacheKey, tokenData)
        return res.json(tokenData)
    } catch (error) {
        console.error('Error generating Endpoint 2 data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
