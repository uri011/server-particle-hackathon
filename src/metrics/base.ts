import { contracts } from '../utils/contracts/index.js'

import { extractBlocks, extractEvents, extractReads } from '../services/rpc/index.js'
import { formatUnits, isAddressEqual, parseUnits } from 'viem'
import { computeIndexPrice, getUniqueSortedBlockNumbers } from './utils.js'

import { mainnetClient } from '../services/rpc/client.js'
import { CsvRow } from '../utils/types/index.js'

const getBaseAnalytics = async (contractAddr: string) => {
    // console.log(`\nCompute Base Analytics Initialized\n`)

    contracts.set.token.address = contractAddr

    //
    //
    // Data Extraction
    //
    //

    // console.log(`\nData Extraction Initialized\n`)

    //
    // Extract Price Data
    //

    // const rawPriceData = await extractQuery(4264777)

    // // console.log(rawPriceData[0])
    // // console.log(rawPriceData[1])
    // // console.log(rawPriceData[2])
    // // console.log(`\n`)

    // const priceData = convertTimestampsToUnix(rawPriceData)

    // // console.log(priceData[0])
    // // console.log(priceData[1])
    // // console.log(priceData[2])
    // // console.log(`\n`)

    const latestBlock = await mainnetClient.getBlock()

    const yesterdayBlockNumber = latestBlock.number - BigInt((24 * 60 * 60) / 12)

    const yesterdayBlock = await mainnetClient.getBlock({ blockNumber: yesterdayBlockNumber })

    const wBlockNumber = latestBlock.number - BigInt((7 * 24 * 60 * 60) / 12)

    const wBlock = await mainnetClient.getBlock({ blockNumber: wBlockNumber })

    const xBlockNumber = latestBlock.number - BigInt((30 * 24 * 60 * 60) / 12)

    const xBlock = await mainnetClient.getBlock({ blockNumber: xBlockNumber })

    const yBlockNumber = latestBlock.number - BigInt((90 * 24 * 60 * 60) / 12)

    const yBlock = await mainnetClient.getBlock({ blockNumber: yBlockNumber })

    const zBlockNumber = latestBlock.number - BigInt((180 * 24 * 60 * 60) / 12)

    const zBlock = await mainnetClient.getBlock({ blockNumber: zBlockNumber })

    const priceBlocks = [latestBlock, yesterdayBlock, wBlock, xBlock, yBlock, zBlock]

    const priceData: CsvRow[] = []

    // for (let i = 0; i < priceBlocks.length; i++)
    //     console.log(`${i} - PriceBlocks `, {
    //         number: priceBlocks[i].number,
    //         timestamp: priceBlocks[i].timestamp,
    //     })

    const pBtc = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.btc,
        function: 'latestAnswer',
        blocks: priceBlocks.map(b => b.number),
        outputs: ['price'],
    })

    const dBtc = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.btc,
        function: 'decimals',
        blocks: undefined,
        outputs: ['decimals'],
    })

    for (let i = 0; i < pBtc.length; i++)
        priceData.push({
            timestamp: priceBlocks[i].timestamp.toString(),
            contract_address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
            price: formatUnits(pBtc[i].outputs.price, dBtc[0].outputs.decimals),
            symbol: 'BTC',
        })

    const pEth = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.eth,
        function: 'latestAnswer',
        blocks: priceBlocks.map(b => b.number),
        outputs: ['price'],
    })

    const dEth = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.eth,
        function: 'decimals',
        blocks: undefined,
        outputs: ['decimals'],
    })

    for (let i = 0; i < pEth.length; i++)
        priceData.push({
            timestamp: priceBlocks[i].timestamp.toString(),
            contract_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            price: formatUnits(pEth[i].outputs.price, dEth[0].outputs.decimals),
            symbol: 'WETH',
        })

    const pAave = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.aave,
        function: 'latestAnswer',
        blocks: priceBlocks.map(b => b.number),
        outputs: ['price'],
    })

    const dAave = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.aave,
        function: 'decimals',
        blocks: undefined,
        outputs: ['decimals'],
    })

    for (let i = 0; i < pAave.length; i++)
        priceData.push({
            timestamp: priceBlocks[i].timestamp.toString(),
            contract_address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
            price: formatUnits(pAave[i].outputs.price, dAave[0].outputs.decimals),
            symbol: 'AAVE',
        })

    const pArb = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.arb,
        function: 'latestAnswer',
        blocks: priceBlocks.map(b => b.number),
        outputs: ['price'],
    })

    const dArb = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.arb,
        function: 'decimals',
        blocks: undefined,
        outputs: ['decimals'],
    })

    for (let i = 0; i < pArb.length; i++)
        priceData.push({
            timestamp: priceBlocks[i].timestamp.toString(),
            contract_address: '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1',
            price: formatUnits(pArb[i].outputs.price, dArb[0].outputs.decimals),
            symbol: 'ARB',
        })

    const pLink = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.link,
        function: 'latestAnswer',
        blocks: priceBlocks.map(b => b.number),
        outputs: ['price'],
    })

    const dLink = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.link,
        function: 'decimals',
        blocks: undefined,
        outputs: ['decimals'],
    })

    for (let i = 0; i < pLink.length; i++)
        priceData.push({
            timestamp: priceBlocks[i].timestamp.toString(),
            contract_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
            price: formatUnits(pLink[i].outputs.price, dLink[0].outputs.decimals),
            symbol: 'LINK',
        })

    // const pUsdc = await extractReads({
    //     network: 'mainnet',
    //     contract: contracts.oracle.usdc,
    //     function: 'latestAnswer',
    //     blocks: priceBlocks.map(b => b.number),
    //     outputs: ['price'],
    // })

    // const dUsdc = await extractReads({
    //     network: 'mainnet',
    //     contract: contracts.oracle.usdc,
    //     function: 'decimals',
    //     blocks: undefined,
    //     outputs: ['decimals'],
    // })

    // for (let i = 0; i < pLink.length; i++)
    //     priceData.push({timestamp: priceBlocks[i].timestamp, contract_address: '0x514910771af9ca656af840dff83e8264ecf986ca', price: formatUnits(pLink[i].outputs.price,dLink[0].outputs.decimals), symbol: 'LINK'})

    const pUsdt = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.usdt,
        function: 'latestAnswer',
        blocks: priceBlocks.map(b => b.number),
        outputs: ['price'],
    })

    const dUsdt = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.usdt,
        function: 'decimals',
        blocks: undefined,
        outputs: ['decimals'],
    })

    for (let i = 0; i < pUsdt.length; i++)
        priceData.push({
            timestamp: priceBlocks[i].timestamp.toString(),
            contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            price: formatUnits(pUsdt[i].outputs.price, dUsdt[0].outputs.decimals),
            symbol: 'USDT',
        })

    const pUni = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.uni,
        function: 'latestAnswer',
        blocks: priceBlocks.map(b => b.number),
        outputs: ['price'],
    })

    const dUni = await extractReads({
        network: 'mainnet',
        contract: contracts.oracle.uni,
        function: 'decimals',
        blocks: undefined,
        outputs: ['decimals'],
    })

    for (let i = 0; i < pUni.length; i++)
        priceData.push({
            timestamp: priceBlocks[i].timestamp.toString(),
            contract_address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
            price: formatUnits(pUni[i].outputs.price, dUni[0].outputs.decimals),
            symbol: 'UNI',
        })

    //
    // Extract Events
    //

    // event SetTokenCreated(address indexed _setToken, address _manager, string _name, string _symbol);
    const setTokenCreated = await extractEvents({
        contract: contracts.core.stc,
        event: 'SetTokenCreated',
        fromBlock: contracts.core.stc.deployBlock,
        toBlock: undefined,
    })

    // for (let i = 0; i < setTokenCreated.length; i++)
    //     console.log(`${i} - SetTokenCreated `, setTokenCreated[i])

    // event SetTokenIssued(address indexed _setToken, address indexed _issuer, address indexed _to, address _hookContract, uint256 _quantity);
    const setTokenIssued = await extractEvents({
        contract: contracts.modules.biss,
        event: 'SetTokenIssued',
        fromBlock: contracts.modules.biss.deployBlock,
        toBlock: undefined,
    })

    const issuesFiltered = setTokenIssued.filter(e =>
        isAddressEqual(e.inputs._setToken, contractAddr as `0x${string}`),
    )

    // for (let i = 0; i < setTokenIssued.length; i++)
    //     console.log(`${i} - SetTokenIssued `, setTokenIssued[i])

    // event SetTokenRedeemed(address indexed _setToken, address indexed _redeemer, address indexed _to, uint256 _quantity);
    const setTokenRedeemed = await extractEvents({
        contract: contracts.modules.biss,
        event: 'SetTokenRedeemed',
        fromBlock: contracts.modules.biss.deployBlock,
        toBlock: undefined,
    })

    const redeemsFiltered = setTokenRedeemed.filter(e =>
        isAddressEqual(e.inputs._setToken, contractAddr as `0x${string}`),
    )

    // for (let i = 0; i < setTokenRedeemed.length; i++)
    //     console.log(`${i} - SetTokenRedeemed `, setTokenRedeemed[i])

    // event FeeActualized(address indexed _setToken, uint256 _managerFee, uint256 _protocolFee)
    const feeActualized = await extractEvents({
        contract: contracts.modules.sfee,
        event: 'FeeActualized',
        fromBlock: contracts.modules.sfee.deployBlock,
        toBlock: undefined,
    })

    // for (let i = 0; i < feeActualized.length; i++)
    //     console.log(`${i} - FeeActualized `, feeActualized[i])

    // event ModuleAdded(address indexed _module);
    const moduleAdded = await extractEvents({
        contract: contracts.set.token,
        event: 'ModuleAdded',
        fromBlock: contracts.set.token.deployBlock,
        toBlock: undefined,
    })

    // for (let i = 0; i < moduleAdded.length; i++) console.log(`${i} - ModuleAdded `, moduleAdded[i])

    // event ModuleRemoved(address indexed _module)
    const moduleRemoved = await extractEvents({
        contract: contracts.set.token,
        event: 'ModuleRemoved',
        fromBlock: contracts.set.token.deployBlock,
        toBlock: undefined,
    })

    // for (let i = 0; i < moduleRemoved.length; i++)
    //     console.log(`${i} - ModuleRemoved `, moduleRemoved[i])

    // event ModuleInitialized(address indexed _module)
    const moduleInitialized = await extractEvents({
        contract: contracts.set.token,
        event: 'ModuleInitialized',
        fromBlock: contracts.set.token.deployBlock,
        toBlock: undefined,
    })

    // for (let i = 0; i < moduleInitialized.length; i++)
    //     console.log(`${i} - ModuleInitialized `, moduleInitialized[i])

    //
    // Extract Reads
    //

    // supply change events
    const supplyChangeBlocks = getUniqueSortedBlockNumbers(issuesFiltered, redeemsFiltered)

    // function totalSupply() external view returns (uint256);
    const totalSupply = await extractReads({
        network: 'baseSepolia',
        contract: contracts.set.token,
        function: 'totalSupply',
        blocks: supplyChangeBlocks,
        outputs: ['totalSupply'],
    })

    // for (let i = 0; i < totalSupply.length; i++) console.log(`${i} - TotalSupply `, totalSupply[i])

    const basicIssuanceInitEvent = moduleInitialized.find(e =>
        isAddressEqual('0xeC9e3fa330645F7069923D0feF2c05Ef64411c11', e.inputs._module),
    )
    if (basicIssuanceInitEvent == null) throw new Error('module not init')
    const basicIssuanceInitBlock = basicIssuanceInitEvent.blockNumber

    // function getRequiredComponentUnitsForIssue(ISetToken _setToken,uint256 _quantity) external returns(address[] memory, uint256[] memory)
    const getRequiredComponentUnitsForIssue = await extractReads({
        network: 'baseSepolia',
        contract: contracts.modules.biss,
        function: 'getRequiredComponentUnitsForIssue',
        blocks: [basicIssuanceInitBlock],
        inputs: ['_setToken', '_quantity'],
        inputsData: [{ setToken: contracts.set.token.address, quantity: 1000000000000000000 }],
        outputs: ['tokenAddresses', 'quantity'],
    })

    // for (let i = 0; i < getRequiredComponentUnitsForIssue.length; i++)
    //     console.log(
    //         `${i} - GetRequiredComponentUnitsForIssue `,
    //         getRequiredComponentUnitsForIssue[i],
    //     )

    //
    // Extract Blocks
    //

    const eventsBlocksNumbers = getUniqueSortedBlockNumbers(
        setTokenCreated,
        setTokenIssued,
        setTokenRedeemed,
        feeActualized,
        moduleAdded,
        moduleRemoved,
        moduleInitialized,
    )

    const eventsBlocks = await extractBlocks(eventsBlocksNumbers)

    // for (let i = 0; i < eventsBlocks.length; i++)
    //     console.log(`${i} - EventsBlocks `, {
    //         number: eventsBlocks[i].number,
    //         timestamp: eventsBlocks[i].timestamp,
    //     })

    //
    // METRICS
    //

    //
    // COMPUTE INDEX TOKEN PRICE & INDEX COMPONENTS DISTRIBUTION
    //

    const tokenDeployTime = eventsBlocks.find(
        block => block.number === contracts.set.token.deployBlock,
    )?.timestamp

    if (tokenDeployTime == null) throw new Error('token deploy time not found')

    const componentUnitsToken = getRequiredComponentUnitsForIssue.find(event =>
        isAddressEqual(event.inputs._setToken, contracts.set.token.address as `0x${string}`),
    )?.outputs

    if (componentUnitsToken == null) throw new Error('componentUnitsToken not found')

    for (let i = 0; i < componentUnitsToken.tokenAddresses.length; i++)
        componentUnitsToken.quantity[i] = formatUnits(componentUnitsToken.quantity[i], 18)

    // console.log(componentUnitsToken)

    const result = computeIndexPrice(priceData, componentUnitsToken)

    // console.log(result.indexPrice[0])
    // console.log(result.indexPrice[1])
    // console.log(result.indexPrice[3])
    // console.log(`\n`)

    // console.log(result.indexDist[0])
    // console.log(result.indexDist[1])
    // console.log(result.indexDist[3])
    // console.log(`\n`)

    // console.log(result.componentsData[0])
    // console.log(result.componentsData[1])
    // console.log(result.componentsData[3])
    // console.log(`\n`)

    //
    // COMPUTE MARKET CAPITALIZATION
    //

    const totalSupplyWithTime = []

    for (const supply of totalSupply)
        for (const block of eventsBlocks)
            if (block.number === supply.blockNumber)
                totalSupplyWithTime.push({
                    timestamp: block.timestamp,
                    blockNumber: supply.blockNumber,
                    totalSupply: supply.outputs.totalSupply,
                })

    // console.log(totalSupplyWithTime[0])
    // console.log(totalSupplyWithTime[1])
    // console.log(`\n`)

    let s0 = totalSupplyWithTime[0]
    let s1 = totalSupplyWithTime[1]
    let idx = 1

    const indexMarketCap = []

    for (let i = 0; i < result.indexPrice.length; i++) {
        if (result.indexPrice[i].timestamp < Number(s0.timestamp)) {
            indexMarketCap.push({ timestamp: result.indexPrice[i].timestamp, mcap: '0' })
        } else if (
            result.indexPrice[i].timestamp >= Number(s0.timestamp) &&
            result.indexPrice[i].timestamp < Number(s1.timestamp)
        ) {
            indexMarketCap.push({
                timestamp: result.indexPrice[i].timestamp,
                mcap: formatUnits(
                    parseUnits(result.indexPrice[i].indexPrice, 18) * s0.totalSupply,
                    36,
                ),
            })
        } else {
            indexMarketCap.push({
                timestamp: result.indexPrice[i].timestamp,
                mcap: formatUnits(
                    parseUnits(result.indexPrice[i].indexPrice, 18) * s0.totalSupply,
                    36,
                ),
            })
            if (idx < totalSupplyWithTime.length - 1) {
                s0 = s1
                s1 = totalSupplyWithTime[idx + 1]
            }
        }
    }

    // console.log(indexMarketCap[0])
    // console.log(indexMarketCap[1])
    // console.log(indexMarketCap[3])
    // console.log(`\n`)

    // console.log(indexMarketCap[indexMarketCap.length - 1])
    // console.log(indexMarketCap[indexMarketCap.length - 2])
    // console.log(indexMarketCap[indexMarketCap.length - 3])
    // console.log(`\n`)

    return {
        price: result.indexPrice,
        dist: result.indexDist,
        mcap: indexMarketCap,
        supply: totalSupplyWithTime[totalSupplyWithTime.length - 1].totalSupply,
    }
}

export default getBaseAnalytics
