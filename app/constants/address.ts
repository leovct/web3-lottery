import lottery from "../abi/Lottery.json"

export const LOTTERY_ADDRESS: string = "0x886dd0094f0cEa7a7f1568115AC2181f629D8031"

export const BLOCK_EXPLORER_URL: string = "https://mumbai.polygonscan.com/"

export const LOTTERY_EXPLORER_URL: string = BLOCK_EXPLORER_URL + "address/" + LOTTERY_ADDRESS;

export const LOTTERY_CONFIG = {
	addressOrName: LOTTERY_ADDRESS,
  contractInterface: lottery.abi,
}
