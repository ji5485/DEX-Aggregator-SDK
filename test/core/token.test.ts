import { Token } from '../../src'

describe('Token', () => {
  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  const ADDRESS_ONE = '0x0000000000000000000000000000000000000001'
  const ADDRESS_TWO = '0x0000000000000000000000000000000000000002'
  const INVALID_ADDRESS = '0xhello00000000000000000000000000000000002'

  describe('constructor', () => {
    it('success converting checksum address', () => {
      const token = new Token(USDC.toLowerCase(), 18)
      expect(token.address).toEqual(USDC)
    })

    it('failure with invalid address', () =>
      expect(() => new Token(INVALID_ADDRESS, 18).address).toThrow('Invalid address'))

    it('failure with negative decimals', () =>
      expect(() => new Token(ADDRESS_ONE, -1).address).toThrow('Decimals error'))

    it('failure with 256 decimals', () => {
      expect(() => new Token(ADDRESS_ONE, 256).address).toThrow('Decimals error')
    })

    it('failure with non-integer decimals', () => {
      expect(() => new Token(ADDRESS_ONE, 1.5).address).toThrow('Decimals error')
    })
  })

  describe('#equals', () => {
    it('addresses are not equal', () => {
      const tokenA = new Token(ADDRESS_ONE, 18)
      const tokenB = new Token(ADDRESS_TWO, 18)

      expect(tokenA.equals(tokenB)).toBe(false)
    })

    it('true if only decimals differs', () => {
      const tokenA = new Token(ADDRESS_ONE, 9)
      const tokenB = new Token(ADDRESS_ONE, 18)

      expect(tokenA.equals(tokenB)).toBe(true)
    })

    it('true if address is the same', () => {
      const tokenA = new Token(ADDRESS_ONE, 18)
      const tokenB = new Token(ADDRESS_ONE, 18)

      expect(tokenA.equals(tokenB)).toBe(true)
    })

    it('true on reference equality', () => {
      const token = new Token(ADDRESS_ONE, 18)

      expect(token.equals(token)).toBe(true)
    })

    it('true even if name/symbol/decimals differ', () => {
      const tokenA = new Token(ADDRESS_ONE, 9, 'abc', 'def')
      const tokenB = new Token(ADDRESS_ONE, 18, 'ghi', 'jkl')

      expect(tokenA.equals(tokenB)).toBe(true)
    })
  })
})
