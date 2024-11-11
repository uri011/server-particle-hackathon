import { readFileSync } from 'fs'

import { abisDirPath } from '../system.js'

export const priceBtc = {
    network: 'mainnet',
    address: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    deployBlock: 10606501n,
    deployTxHash: '0x2735db9062c3ffe942c85a038b6ac213126e6742ef4dd1280b85ead3f6ea66f5',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}

export const priceEth = {
    network: 'mainnet',
    address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    deployBlock: 10606501n,
    deployTxHash: '0x7fee27e7df5f16ba3e5bb5fbcb5103f8984e0cacf31cb84f50def5618a7008f2',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}

export const priceLink = {
    network: 'mainnet',
    address: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c',
    deployBlock: 10606428n,
    deployTxHash: '0x523aea0c820bc09095b2f1ac2c5955be319a4cfef24326a7054742a84a5341c8',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}

export const priceUsdc = {
    network: 'mainnet',
    address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
    deployBlock: 11869355n,
    deployTxHash: '0x5fa8bbe75e797d2b5f161d71f80d59bd72a1ab2e2e98304ac63d06eee548e1ae',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}

export const priceUsdt = {
    network: 'mainnet',
    address: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
    deployBlock: 11870289n,
    deployTxHash: '0x4e761270481e96f2e1f3c8e1a6edb42f69a13e24f12dbf635d88f3a06da39031',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}

export const priceUni = {
    network: 'mainnet',
    address: '0x553303d460EE0afB37EdFf9bE42922D8FF63220e',
    deployBlock: 11317271n,
    deployTxHash: '0xbbcddb427878ca9e2c098d131142a46335830b64c54e5eb5a8ceb300aad6a674',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}

export const priceArb = {
    network: 'mainnet',
    address: '0x31697852a68433DbCc2Ff612c516d69E3D9bd08F',
    deployBlock: 18680167n,
    deployTxHash: '0x18cf62a0d54447f3809c45bfa9c5ec43ae9e0d04b53ced4bc81323bbae77d0bb',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}

export const priceAave = {
    network: 'mainnet',
    address: '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9',
    deployBlock: 11179893n,
    deployTxHash: '0x8064474e83f0e688342668b7190492d05abdd8effcb7b92b61c015b4194214af',
    abi: JSON.parse(readFileSync(`${abisDirPath}/oraclePriceFeed.json`, 'utf8')),
}
