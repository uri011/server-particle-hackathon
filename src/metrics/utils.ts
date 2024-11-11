import { formatUnits, isAddressEqual, parseUnits } from 'viem'
import { CsvRow, type EventData } from '../utils/types/index.js'

export const getUniqueSortedBlockNumbers = (...arrays: EventData[][]): bigint[] => {
    const blockNumbersSet = new Set<bigint>()

    for (const events of arrays) for (const event of events) blockNumbersSet.add(event.blockNumber)

    return Array.from(blockNumbersSet).sort((a, b) => (a < b ? -1 : 1))
}

export const convertTimestampsToUnix = (dataArray: CsvRow[]): CsvRow[] => {
    return dataArray.map(item => ({
        ...item,
        timestamp: Math.floor(new Date(item.timestamp).getTime() / 1000).toString(),
    }))
}

const sta = {
    WBTC: '0x54E18fa639d8D9a0A5686Ae1570C4f07234f3bA4',
    WETH: '0x1599C83aaa685Ec033EB91a0B8758FB47a3377b1',
    USDT: '0x6fdE724344917FD1CB3BA970AB2BE0ba12aB2fC6',
    ARB: '0xfffDBe748Cb9fa628947633Bc16A30c630BDd999',
    UNI: '0x8951299547375f45A0B1D139Dc852bc5Df6612c5',
    AAVE: '0x9079d7e4D29230683115Bba7280E12f795bbB17A',
    FIL: '0x5a1339B5fBC6353A7466139c9592Af3D2192cCAA',
    LINK: '0x647cb2087d65C590cEDCbdA996292BCC2b50955D',
}

export const computeIndexPrice = (
    priceData: CsvRow[],
    componentUnits: { [key: string]: any },
): {
    indexPrice: { timestamp: number; indexPrice: string }[]
    indexDist: {
        timestamp: number
        indexDist: {
            address: string[]
            percent: number[]
        }
    }[]
    componentsData: {
        timestamp: string
        address: any
        price: string
        quantity: any
        quantityUsd: bigint
    }[]
} => {
    const tokenQuantitiesInUsd = []

    for (let i = 0; i < priceData.length; i++) {
        for (let k = 0; k < componentUnits.tokenAddresses.length; k++) {
            const addr =
                priceData[i].symbol in sta
                    ? sta[priceData[i].symbol as keyof typeof sta]
                    : '0x0000000000000000000000000000000000000000'

            if (isAddressEqual(addr as `0x${string}`, componentUnits.tokenAddresses[k])) {
                const p = parseUnits(priceData[i].price, 18)
                const q = parseUnits(componentUnits.quantity[k], 18)

                // const qUsd = p * q
                tokenQuantitiesInUsd.push({
                    timestamp: priceData[i].timestamp,
                    address: componentUnits.tokenAddresses[k],
                    price: priceData[i].price,
                    quantity: componentUnits.quantity[k],
                    quantityUsd: p * q,
                })
            }
        }
    }

    const sums = new Map<number, bigint>()

    for (const item of tokenQuantitiesInUsd) {
        const currentSum = sums.get(Number(item.timestamp)) || 0n
        sums.set(Number(item.timestamp), currentSum + item.quantityUsd)
    }

    const indexPrice = Array.from(sums)
        .sort(([timestampA], [timestampB]) => timestampA - timestampB)
        .map(([timestamp, indexPrice]) => ({
            timestamp,
            indexPrice: formatUnits(indexPrice, 36),
        }))

    const dists = new Map<number, { address: string[]; percent: number[] }>()

    for (const item of tokenQuantitiesInUsd) {
        const currentDist = dists.get(Number(item.timestamp)) || { address: [], percent: [] }
        const idxPrice = indexPrice.find(e => e.timestamp === Number(item.timestamp))
        if (idxPrice == null) throw new Error('idx not found')
        const q = Number(formatUnits(item.quantityUsd, 36))
        const p = Number(idxPrice.indexPrice)
        const r = q / p
        currentDist.address.push(item.address)
        currentDist.percent.push(r)
        dists.set(Number(item.timestamp), currentDist)
    }

    const indexDist = Array.from(dists)
        .sort(([timestampA], [timestampB]) => timestampA - timestampB)
        .map(([timestamp, indexDist]) => ({
            timestamp,
            indexDist: indexDist,
        }))

    return {
        indexPrice: indexPrice,
        indexDist: indexDist,
        componentsData: tokenQuantitiesInUsd,
    }
}
