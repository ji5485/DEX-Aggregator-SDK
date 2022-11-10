import JSBI from 'jsbi'
import { TokenAmount } from '../../src'
import { MaxUint256, _1 } from '../../src/core/constants'
import { WBTC } from '../mocks'

describe('TokenAmount', () => {
  describe('constructor', () => {
    it('constructor works', () => {
      const tokenAmount = new TokenAmount(WBTC, 100)

      expect(tokenAmount.amount).toEqual(JSBI.BigInt(100))
    })

    it('constructor works with max uint256', () => {
      const tokenAmount = new TokenAmount(WBTC, MaxUint256)

      expect(tokenAmount.amount).toEqual(MaxUint256)
    })

    it('failure with exceed max uint256', () =>
      expect(() => new TokenAmount(WBTC, JSBI.add(MaxUint256, _1))).toThrow(
        'amount must be under the max integer',
      ))
  })

  describe('#add', () => {
    const tokenAmount = new TokenAmount(WBTC, 100)

    it('success adding with string type value', () => {
      const newTokenAmount = tokenAmount.add('1000')

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(1100))
    })

    it('success adding with number type value', () => {
      const newTokenAmount = tokenAmount.add(2000)

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(2100))
    })

    it('success adding with BigInt type value', () => {
      const newTokenAmount = tokenAmount.add(JSBI.BigInt(3000))

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(3100))
    })
  })

  describe('#subtract', () => {
    const tokenAmount = new TokenAmount(WBTC, 1000)

    it('success subtracting with string type value', () => {
      const newTokenAmount = tokenAmount.subtract('100')

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(900))
    })

    it('success subtracting with number type value', () => {
      const newTokenAmount = tokenAmount.subtract(200)

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(800))
    })

    it('success subtracting with BigInt type value', () => {
      const newTokenAmount = tokenAmount.subtract(JSBI.BigInt(300))

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(700))
    })
  })

  describe('#multiply', () => {
    const tokenAmount = new TokenAmount(WBTC, 100)

    it('success multiplying with string type value', () => {
      const newTokenAmount = tokenAmount.multiply('200')

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(20000))
    })

    it('success multiplying with number type value', () => {
      const newTokenAmount = tokenAmount.multiply(300)

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(30000))
    })

    it('success multiplying with BigInt type value', () => {
      const newTokenAmount = tokenAmount.multiply(JSBI.BigInt(400))

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(40000))
    })
  })

  describe('#divide', () => {
    const tokenAmount = new TokenAmount(WBTC, 10000)

    it('success dividing with string type value', () => {
      const newTokenAmount = tokenAmount.divide('20')

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(500))
    })

    it('success dividing with number type value', () => {
      const newTokenAmount = tokenAmount.divide(30)

      // Abandoning the decimal point
      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(333))
    })

    it('success dividing with BigInt type value', () => {
      const newTokenAmount = tokenAmount.divide(JSBI.BigInt(40))

      expect(newTokenAmount.amount).toEqual(JSBI.BigInt(250))
    })
  })
})
