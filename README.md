# Polygon L2 domain service

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

## Contract Address

[0x17225579DB82d4D6EA560641E877C576c1141594](https://mumbai.polygonscan.com/address/0x17225579DB82d4D6EA560641E877C576c1141594)

## NFT Displayed on Opensea

[Opensea](https://testnets.opensea.io/collection/scooter-name-service)

## Deployment

[Deployment](https://polygon-l2-domain-service.vercel.app/)

<p align='right'>
<a href="https://github.com/ScooterMcgavin21/polygonL2-domain-service/tree/main/client"> Head To The Client Side</a>  
</p>
