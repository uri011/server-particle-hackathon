import { readFileSync } from 'fs'

import { abisDirPath } from '../system.js'

export const basicIssuanceModule = {
    network: 'baseSepolia',
    address: '0xeC9e3fa330645F7069923D0feF2c05Ef64411c11',
    deployBlock: 17574774n,
    deployTxHash: '0x3b4ed55f41bc65b6db66c90b9dff6da257df449fc89614b1871f899ae4a2fe34',
    abi: JSON.parse(readFileSync(`${abisDirPath}/basicissuancemodule.json`, 'utf8')),
}

export const streamingFeesModule = {
    network: 'baseSepolia',
    address: '0xE34483aF63bBC81deba89ADF60ECf8842F1e58AF',
    deployBlock: 17574777n,
    deployTxHash: '0xffe3e9f229930cda0fe048d694829ce4fbd5ccc9ec6e7a2c8486ee808f974be7',
    abi: JSON.parse(readFileSync(`${abisDirPath}/streamingfeesmodule.json`, 'utf8')),
}
