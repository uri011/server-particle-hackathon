import { createPublicClient, http } from 'viem'
import { baseSepolia, mainnet } from 'viem/chains'

import dotenv from 'dotenv'

dotenv.config()

export const publicClient = createPublicClient({
    chain: baseSepolia,
    key: process.env.INFURA_API_KEY_SECRET,
    transport: http(process.env.ALCHEMY_BASE_SEPOLIA_URL),
})

export const mainnetClient = createPublicClient({
    chain: mainnet,
    key: process.env.INFURA_API_KEY_SECRET,
    transport: http(process.env.ALCHEMY_MAINNET_URL),
})
