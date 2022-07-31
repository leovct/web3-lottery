# Lottery Smart Contracts

This Hardhat project contains the contract, tests, deployment and verification script on the blockchain (local or on Polygon Mumbai) as well as CI/CD pipelines to test, audit and deploy the contract.

## Latest deployment (Polygon Mumbai)
https://mumbai.polygonscan.com/address/0x99142D8E2384FED1FC18b4a292F9eE6082eD2ab8

## Getting started
```
$ npm install
$ mv .env.example .env // fill in the requested values
```

## Compile the contracts
```
$ npx hardhat compile

Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 6 typings!
Compiled 1 Solidity file successfully
```

## Test the contracts
```
$ npx hardhat test

  Lottery
    Enter
      ✓ Should buy tickets
      ✓ Should fail to buy tickets when not sending enough money
      ✓ Should fail to buy more tickets than what's available
    Draw
      ✓ Should draw a winner, start a new round and send the money
      ✓ Should fail to draw a winner when using another account than the keeper
      ✓ Should fail to draw a winner when the round has not ended
    SetKeeper
      ✓ Should update the keeper's address
      ✓ Should fail to update the keeper's address using another account than the owner

·--------------------------|---------------------------|-------------|-----------------------------·
|   Solc version: 0.8.9    ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···························|···························|·············|······························
|  Methods                 ·               4 gwei/gas                ·       1713.94 usd/eth       │
·············|·············|·············|·············|·············|···············|··············
|  Contract  ·  Method     ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·············|·············|·············|·············|·············|···············|··············
|  Lottery   ·  draw       ·          -  ·          -  ·      87525  ·            3  ·       0.60  │
·············|·············|·············|·············|·············|···············|··············
|  Lottery   ·  enter      ·      80406  ·     114606  ·      97506  ·            8  ·       0.67  │
·············|·············|·············|·············|·············|···············|··············
|  Lottery   ·  setKeeper  ·          -  ·          -  ·      29994  ·            2  ·       0.21  │
·············|·············|·············|·············|·············|···············|··············
|  Deployments             ·                                         ·  % of limit   ·             │
···························|·············|·············|·············|···············|··············
|  Lottery                 ·          -  ·          -  ·     748566  ·        2.5 %  ·       5.13  │
·--------------------------|-------------|-------------|-------------|---------------|-------------·

  8 passing (877ms
```

## Deploy the contract locally
```
$ npx hardhat run scripts/deploy.ts

Lottery contract deployed to the hardhat blockchain: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Deploy and verify the contract on Polygon Mumbai (testnet)
```
$ npx hardhat run scripts/deploy.ts --network polygonMumbai

Lottery contract deployed to the polygonMumbai blockchain: 0x5e2D1C57301Cc823CbBCe3AA0dF6169F0EfEcD41
Waiting for 5 block confirmations before verifying the contract
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Lottery.sol:Lottery at 0x5e2D1C57301Cc823CbBCe3AA0dF6169F0EfEcD41
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Lottery on Etherscan.
https://mumbai.polygonscan.com/address/0x5e2D1C57301Cc823CbBCe3AA0dF6169F0EfEcD41#code
```