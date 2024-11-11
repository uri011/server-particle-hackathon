import { controller, setTokenCreator } from './core.js'
import { basicIssuanceModule, streamingFeesModule } from './modules.js'
import {
    priceAave,
    priceArb,
    priceBtc,
    priceEth,
    priceLink,
    priceUni,
    priceUsdc,
    priceUsdt,
} from './oracle.js'
import { setToken } from './set.js'

export const contracts = {
    core: {
        ctrl: controller,
        stc: setTokenCreator,
    },
    modules: {
        biss: basicIssuanceModule,
        sfee: streamingFeesModule,
    },
    set: {
        token: setToken,
    },
    oracle: {
        btc: priceBtc,
        eth: priceEth,
        aave: priceAave,
        arb: priceArb,
        link: priceLink,
        usdc: priceUsdc,
        usdt: priceUsdt,
        uni: priceUni,
    },
}
