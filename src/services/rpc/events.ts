import { type AbiEvent, getAbiItem } from 'viem'

import type { EventData } from '../../utils/types/index.js'

import { publicClient } from './client.js'

interface EventsRequest {
    contract: any
    event: string
    fromBlock?: bigint
    toBlock?: bigint
    inputs?: string[]
}

const reqSize = 25000000n

const extractEvents = async (req: EventsRequest): Promise<EventData[]> => {
    const item = getAbiItem({ abi: req.contract.abi, name: req.event })

    // Validate Event
    if (item == undefined) throw new Error(`Contract Event Not Found`)
    if (item.type != 'event') throw new Error(`Contract Item Not Supported`)

    // Validate Extraction Block Limits
    if (req.fromBlock != undefined && req.toBlock != undefined && req.fromBlock > req.toBlock)
        throw new Error(`Invalid Extract From Block - To Block Values`)

    if (req.toBlock != undefined && req.toBlock < req.contract.deployBlock)
        throw new Error(`Invalid Extract To Block Value`)

    // Validate Event Request Inputs - ABI Item
    if (req.inputs != undefined && req.inputs.length !== item.inputs.length)
        throw new Error(`Request Inputs & Contract Event Inputs Do Not Match`)

    const lastBlockNumber = await publicClient.getBlockNumber()

    let fromBlock =
        req.fromBlock == undefined || req.fromBlock < req.contract.deployBlock
            ? req.contract.deployBlock
            : req.fromBlock

    if (req.toBlock == undefined || req.toBlock > lastBlockNumber) req.toBlock = lastBlockNumber

    // console.log(`\nExtraction of ${req.event} Initialized\n`)

    const res: EventData[] = []

    while (fromBlock <= req.toBlock) {
        const toBlock = req.toBlock - fromBlock <= reqSize ? req.toBlock : fromBlock + reqSize

        const logs = await publicClient.getLogs({
            address: req.contract.address,
            event: item as AbiEvent,
            fromBlock,
            toBlock,
        })

        for (let i = 0; i < logs.length; i++) {
            const event: EventData = {
                blockNumber: logs[i].blockNumber as bigint,
                inputs: {},
            }

            if (req.inputs != undefined) {
                // @ts-ignore-next-line
                logs[i].args.forEach((value: any, idx: number) => {
                    // @ts-ignore-next-line
                    event.inputs[req.inputs[idx]] = value
                })
            } else {
                if (Array.isArray(logs[i].args)) {
                    // @ts-ignore-next-line
                    logs[i].args.forEach((value: any, idx: number) => {
                        event.inputs[`unnamed${idx}`] = value
                    })
                } else {
                    for (const key in logs[i].args) {
                        if (Object.prototype.hasOwnProperty.call(logs[i].args, key)) {
                            // @ts-ignore-next-line
                            event.inputs[key] = logs[i].args[key]
                        }
                    }
                }
            }

            res.push(event)
        }
        // console.log(`Extracted from Block ${fromBlock} to ${toBlock}`)

        fromBlock = toBlock + 1n
    }
    // console.log(`Extracted a Total of ${res.length} Events`)

    return res
}

export default extractEvents
