## Polygon L2 domain service

`Links`

[Deployment](https://polygon-l2-domain-service.vercel.app/) • [Contract Address](https://mumbai.polygonscan.com/address/0x343670BF183c30cFF7C793bBe84a73201ed22CD5) • [NFT on Opensea](https://testnets.opensea.io/collection/scooter-name-service) • [Domain Name Minted](https://mumbai.polygonscan.com/tx/0xc4ed71997342fe996aaebf824cb9bd8bfb6919f40f6f6c2a11d6d6acf0418946) • [Records Set](https://mumbai.polygonscan.com/tx/0x1b20149f843cae22095c2c2dbc2570b128b5212bbd7f64fde9041c73b7a084b4)

---

- Requires to be on Polygon Network: to add to metamask:
- Network Name: Mumbai Testnet
- New RPC URL: https://rpc-mumbai.maticvigil.com
- Chain ID: 80001
- Currency Symbol: MATIC
- Block Explorer URL: https://polygonscan.com/

- Get Testnet funds here [MATIC-faucet](https://faucet.polygon.technology/)

<hr />

## Getting started

##### Follow the steps below to run the project locally:

- Install dependencies: `npm install`
- List test accounts from your local hardhat node: `npx hardhat accounts`
- Compile smart contracts: `npx hardhat compile`
- Test contract: `npx hardhat run scripts/run.js`

### Local deployment

- Start your local hardhat node: `npx hardhat node`
- Deploy contract to local hardhat node: `npx hardhat run scripts/deploy.js --network localhost`

### Testnet deployment

- Deploy contract to rinkeby testnet: `npx hardhat run scripts/deploy.js --network mumbai`

<hr />

# Steps to implement domain on chain with an NFT

- Use a contract from OpenZeppelin to easily mint ERC721 tokens
- Create SVGs for our NFT and use on chain storage
- Setup token metadata (the data the NFT will hold)
- Mint it!

<p align='right'>
<a href="https://github.com/ScooterMcgavin21/polygonL2-domain-service/tree/main/client"> Head To The Client Side</a>  
</p>
