<a name="readme-top"></a>

<h1 align="center">Data & Analytics System Architecture</h1>

<!-- ARCHITECTURE OVERVIEW -->

<h2>Architecture Design Overview</h2>
The system is composed by 2 databases:
<br/>

<!-- STATIC DATABASE -->

<h3>Static Database</h3>
Contains all system information that is constant and does not change over time.
<br/>
It is composed by information on contracts, wallets, networks and entities.
<br/>
<br/>

<b>DB Structure Design</b>
<br/>
The information is structured in directories (category and type) and stored in JSON files.
<br/>
<br/>
Static DB Directory
<br/>
&nbsp;&nbsp;&nbsp;- Category Directory
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Type Directory
<br/>
<br/>

<b>Categories & Types</b>
<br/>
<br/>
<b>1.1 - Contract</b>
<br/>
Static information that defines a contract.
<br/>

-   <b>CDP</b> [Collaterised Debt Protocol] - Contracts related to DeFi debt protocols core functionalities.
-   <b>DEX</b> [Decentralised Exchange] - Contracts related to decentralised exchange of assets core functionalities.
-   <b>ERC20</b> [Fungible Token] - Contracts related to the implementation of tokens following the ERC-20 standard.
-   <b>Info</b> [Information Aggregator] - Contracts related to aggregating blockchain network data.
-   <b>Multisig</b> [Multi-Signature Wallets] - Contracts related to the implementation of multi-signature wallets.
-   <b>Oracle</b> [Oracle] - Contracts related to the implementation of blockchain data oracles.
-   <b>VE</b> [Vote Escrow] - Contracts related to the implementation of governance and staking systems.

<br/>

<b>1.2 - Wallet</b>
<br/>
Static information that defines a wallet.
<br/>

-   <b>EOA</b> [Externally Owned Account] - Wallets that operate with a single signature system.
-   <b>Multisig</b> [Multi-Signature Wallets] - Wallets that operate with a multi-signature system.

<br/>

<b>1.3 - Network</b>
<br/>
Static information that defines a blockchain network.
<br/>

<b>1.4 - Entity</b>
<br/>
Static information that defines a blockchain related entity - person or organisation.
<br/>

<!-- DYNAMIC DATABASE -->

<h3>Dynamic Database</h3>
Contains all system information that is grows over time.
<br/>
It is composed by information on network, contracts and metrics. Additionally it contains database system information.
<br/>
<br/>

Network Schema

-   networkName_blocks
-   networkName_txs

Contract Schema

-   contractType_contract_instance_logName_logs
-   contractType_contract_instance_readFunctionName_reads
-   contractType_contract_instance_writeFunctionName_txs

Note: No need to specify network as contract_instance is already unique

RPC Data Source Type - Log - https://github.com/wevm/viem/blob/main/src/types/log.ts
RPC Data Source Type - Read - Type Inferred from ABI
RPC Data Source Type - Tx - https://github.com/wevm/viem/blob/main/src/types/transaction.ts
RPC Data Source Type - Block - https://github.com/wevm/viem/blob/main/src/types/block.ts

CONSIDERATIONS

IN STATIC DB: ID's could be replaced by readable ID's (the attribute that has the same name as the object it represents must be unique, so would serve as an ID) (it has the downside that renaming requires lots of changes)

Naming may be applied as kebab-case instead of kamel-case, and later on, when conversion is Applied from JSON to TS Type, convert to kamel-case
