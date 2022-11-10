import { utils } from 'ethers'

export function checkAddress(address: string): boolean {
  return utils.isAddress(address)
}

export function compareAddress(addressA: string, addressB: string): boolean {
  return utils.getAddress(addressA) === utils.getAddress(addressB)
}

export function convertChecksumAddress(address: string): string {
  return utils.getAddress(address)
}

export const convertFromWei = (value: string, decimal: number): string => {
  return utils.formatUnits(value, decimal)
}

export const convertToWei = (value: string, decimal: number): string => {
  return utils.parseUnits(value, decimal).toString()
}
