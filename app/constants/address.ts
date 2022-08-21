import lottery from "../abi/Lottery.json"

export const LOTTERY_ADDRESS: string = "0x9514e01Aa45A2bF39e97Ca392FD51A6500B52038"

export const BLOCK_EXPLORER_URL: string = "https://mumbai.polygonscan.com/"

export const LOTTERY_EXPLORER_URL: string = BLOCK_EXPLORER_URL + "address/" + LOTTERY_ADDRESS;

export const LOTTERY_CONFIG = {
	addressOrName: LOTTERY_ADDRESS,
  contractInterface: lottery.abi,
}
