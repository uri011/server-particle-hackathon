import { readFileSync } from 'fs'

import { abisDirPath } from '../system.js'

export const controller = {
    network: 'baseSepolia',
    address: '0x73EB9E7aFfa2a3f1D7dBE7a99cef2db91B318928',
    deployBlock: 17574769n,
    deployTxHash: '0x395443fec0d2315f27d8892dcd817208fc759d470c1a1ef9063820460fb2b5dd',
    abi: JSON.parse(readFileSync(`${abisDirPath}/controller.json`, 'utf8')),
}

export const setTokenCreator = {
    network: 'baseSepolia',
    address: '0xAbE8278A7ad15Ceb26CC2046Da9c57039e089641',
    deployBlock: 17574772n,
    deployTxHash: '0x9a4ad4fa111c75c9283138dd5e97ee1435c93d15527e268126857f2295df080c',
    abi: JSON.parse(readFileSync(`${abisDirPath}/settokencreator.json`, 'utf8')),
}
