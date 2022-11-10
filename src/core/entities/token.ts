import invariant from 'tiny-invariant'
import { checkAddress, compareAddress, convertChecksumAddress } from '../utils'

export class Token {
  public readonly address: string
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  public constructor(address: string, decimals: number, symbol?: string, name?: string) {
    invariant(Number.isSafeInteger(decimals) && 0 <= decimals && decimals < 255, 'Decimals error')
    invariant(checkAddress(address), 'Invalid address')

    this.address = convertChecksumAddress(address)
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }

  public equals(other: Token): boolean {
    return compareAddress(this.address, other.address)
  }

  public sortsBefore(other: Token): boolean {
    invariant(this.address !== other.address, 'Same address')
    return convertChecksumAddress(this.address) < convertChecksumAddress(other.address)
  }
}
