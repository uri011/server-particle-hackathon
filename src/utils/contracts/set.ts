import { readFileSync } from 'fs'

import { abisDirPath } from '../system.js'

export const setToken = {
    network: 'baseSepolia',
    address: '0x4137D762a154CB639aaa7d1cE9bC2141D3d2f8D3',
    deployBlock: 17605237n,
    deployTxHash: '0xb98080e90109fc09aeb6b0e21349a4bace7072b962d756f8f527e08b42099237',
    abi: JSON.parse(readFileSync(`${abisDirPath}/settoken.json`, 'utf8')),
}
