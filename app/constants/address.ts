import lottery from "../abi/Lottery.json"

export const LOTTERY_ADDRESS: string = "0x99142D8E2384FED1FC18b4a292F9eE6082eD2ab8"

export const BLOCK_EXPLORER_URL: string = "https://mumbai.polygonscan.com/"

export const LOTTERY_EXPLORER_URL: string = BLOCK_EXPLORER_URL + "address/" + LOTTERY_ADDRESS;

export const LOTTERY_CONFIG = {
	addressOrName: LOTTERY_ADDRESS,
  contractInterface: lottery.abi,
}
