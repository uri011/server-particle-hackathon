import { getAbiItem } from 'viem'

import type { ReadData } from '../../utils/types/index.js'

import { publicClient as baseClient, mainnetClient } from './client.js'
import { addInputs, addOutputs } from './utils/index.js'

interface ReadsRequest {
    network: 'mainnet' | 'baseSepolia'
    contract: any
    function: string
    blocks?: bigint[]
    inputs?: string[]
    inputsData?: object[]
    outputs?: string[]
}

const extractReads = async (req: ReadsRequest): Promise<ReadData[]> => {
    const publicClient = req.network === 'mainnet' ? mainnetClient : baseClient
    const item = getAbiItem({ abi: req.contract.abi, name: req.function })

    // Validate Read Function
    if (item == undefined) throw new Error(`Contract Read Function Not Found`)
    if (item.type != 'function') throw new Error(`Contract Item Not Supported`)

    // Validate Blocks & Inputs Data
    if (
        req.blocks != undefined &&
        req.inputsData != undefined &&
        req.blocks.length !== req.inputsData.length
    )
        throw new Error(`Request Inputs & Contract Read Function Inputs Do Not Match`)

    // Validate Read Function Request Inputs & Inputs Data
    if (req.inputs != undefined && req.inputsData == undefined)
        throw new Error(`Request Inputs Data Missing`)

    // Validate Read Function Request Inputs - ABI Item
    if (req.inputs != undefined && req.inputs.length !== item.inputs.length)
        throw new Error(`Request Inputs & Contract Read Function Inputs Do Not Match`)

    // Validate Read Function Request Inputs Data - ABI Item
    if (req.inputsData != undefined && Object.keys(req.inputsData[0]).length !== item.inputs.length)
        throw new Error(`Request Inputs Data & Contract Read Function Inputs Do Not Match`)

    // Validate Read Function Request Outputs - ABI Item
    if (req.outputs != undefined && req.outputs.length !== item.outputs.length)
        throw new Error(`Request Outputs & Contract Read Function Outputs Do Not Match`)

    // console.log(`\nExtraction of ${req.function} Initialized\n`)

    const res: ReadData[] = []

    if (req.blocks == undefined) {
        const lastBlockNumber = await publicClient.getBlockNumber()

        let r: ReadData = {
            blockNumber: lastBlockNumber,
            inputs: {},
            outputs: {},
        }

        if (req.inputsData == undefined) {
            // @ts-expect-error
            const data = await publicClient.readContract({
                address: req.contract.address,
                abi: req.contract.abi,
                functionName: req.function,
                blockNumber: lastBlockNumber,
            })

            r = addOutputs(r, item, data, req.outputs)

            res.push(r)
        } else {
            for (let i = 0; i < req.inputsData.length; i++) {
                const args = Object.values(req.inputsData[i])
                // TODO: OPTIMIZE WITH MULTICALL
                const data = await publicClient.readContract({
                    address: req.contract.address,
                    abi: req.contract.abi,
                    functionName: req.function,
                    args,
                    blockNumber: lastBlockNumber,
                })

                r = {
                    blockNumber: lastBlockNumber,
                    inputs: {},
                    outputs: {},
                }

                r = addInputs(r, item, args, req.inputs)
                r = addOutputs(r, item, data, req.outputs)

                res.push(r)
            }
        }
    } else {
        for (let b = 0; b < req.blocks.length; b++) {
            let r: ReadData = {
                blockNumber: req.blocks[b],
                inputs: {},
                outputs: {},
            }

            if (req.inputsData == undefined) {
                // TODO: OPTIMIZE WITH MULTICALL
                // @ts-expect-error
                const data = await publicClient.readContract({
                    address: req.contract.address,
                    abi: req.contract.abi,
                    functionName: req.function,
                    blockNumber: req.blocks[b],
                })

                r = addOutputs(r, item, data, req.outputs)
            } else {
                const args = Object.values(req.inputsData[b])
                // TODO: OPTIMIZE WITH MULTICALL
                const data = await publicClient.readContract({
                    address: req.contract.address,
                    abi: req.contract.abi,
                    functionName: req.function,
                    args,
                    blockNumber: req.blocks[b],
                })

                r = addInputs(r, item, args, req.inputs)
                r = addOutputs(r, item, data, req.outputs)
            }
            res.push(r)
        }
    }
    // console.log(`Extracted a Total of ${res.length} Reads`)

    return res
}

export default extractReads
