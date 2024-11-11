import { Block } from 'viem'

import { publicClient } from './client.js'

const extractBlocks = async (blockNumbers: bigint[]): Promise<Block[]> => {
    console.log(`\nExtraction of Blocks Initialized\n`)

    const blockPromises = blockNumbers.map(blockNumber => publicClient.getBlock({ blockNumber }))

    const blocks = await Promise.all(blockPromises)
    return blocks
}

export default extractBlocks
