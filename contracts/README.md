# Avocado Smart Contracts

This Hardhat project contains the contract, tests, deployment and verification script on the blockchain (local or on Polygon Mumbai) as well as CI/CD pipelines to test, audit and deploy the contract.

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

Avocado
    Bet
      ✓ Should place a bet
      ✓ Should fail when betting with less than the minimal amount
      ✓ Should fail when trying to place 2 (or more) bets in the same round
    Draw
      ✓ Should fail to draw a winner when using another account than the keeper
      ✓ Should fail to draw a winner when the round has not ended
      ✓ Should draw a winner and send the money to the winner and the team
    SetKeeper
      ✓ Should update the keeper's address
      ✓ Should fail when trying to update the keeper's address using another account than the owner

·--------------------------|---------------------------|-------------|-----------------------------·
|   Solc version: 0.8.9    ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···························|···························|·············|······························
|  Methods                 ·               8 gwei/gas                ·       1527.18 usd/eth       │
·············|·············|·············|·············|·············|···············|··············
|  Contract  ·  Method     ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·············|·············|·············|·············|·············|···············|··············
|  Avocado   ·  bet        ·          -  ·          -  ·     115114  ·            6  ·       1.41  │
·············|·············|·············|·············|·············|···············|··············
|  Avocado   ·  draw       ·          -  ·          -  ·      86685  ·            3  ·       1.06  │
·············|·············|·············|·············|·············|···············|··············
|  Avocado   ·  setKeeper  ·          -  ·          -  ·      30073  ·            2  ·       0.37  │
·············|·············|·············|·············|·············|···············|··············
|  Deployments             ·                                         ·  % of limit   ·             │
···························|·············|·············|·············|···············|··············
|  Avocado                 ·          -  ·          -  ·     694489  ·        2.3 %  ·       8.48  │
·--------------------------|-------------|-------------|-------------|---------------|-------------·

  8 passing (453ms)
```

## Deploy the contract locally
```
$ npx hardhat run scripts/deploy.ts
Avocado contract deployed to the hardhat blockchain: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Deploy and verify the contract on Polygon Mumbai (testnet)
```
$ npx hardhat run scripts/deploy.ts --network polygonMumbai
Avocado contract deployed to the polygonMumbai blockchain: 0x22e4B51519A2C37d1a3024d2333aA494ea2759E4
Waiting for 5 block confirmations before verifying the contract
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Avocado.sol:Avocado at 0x22e4B51519A2C37d1a3024d2333aA494ea2759E4
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Avocado on Etherscan.
https://mumbai.polygonscan.com/address/0x22e4B51519A2C37d1a3024d2333aA494ea2759E4#code
```