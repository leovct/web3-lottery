import lottery from "../abi/Lottery.json"

export const LOTTERY_ADDRESS = "0x5e2D1C57301Cc823CbBCe3AA0dF6169F0EfEcD41"

export const LOTTERY_EXPLORER_URL = "https://mumbai.polygonscan.com/address/" + LOTTERY_ADDRESS;

export const LOTTERY_CONFIG = {
	addressOrName: LOTTERY_ADDRESS,
  contractInterface: lottery.abi,
}
