import { DAI, USDC, WBTC } from '../../mocks'
import { getDistributedAmounts } from '../../../src/router'
import { convertToWei } from '../../../src/core/utils'
import { TokenAmount } from '../../../src'

describe('getDistributedAmounts', () => {
  describe('Success with valid parameters', () => {
    it('baseToken: USDC, amount: 1500, distributePercent: 5', () => {
      const { percents, amounts } = getDistributedAmounts(
        USDC,
        convertToWei('1500', USDC.decimals),
        5,
      )

      const expectedPercents = [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
      ]

      expect(percents.length).toEqual(20)
      expect(amounts.length).toEqual(20)

      expect(percents).toStrictEqual(expectedPercents)
      expect(amounts).toStrictEqual(
        expectedPercents.map(percent =>
          new TokenAmount(USDC, convertToWei('1500', USDC.decimals)).multiply(percent).divide(100),
        ),
      )
    })

    it('baseToken: DAI, amount: 30000, distributePercent: 10', () => {
      const { percents, amounts } = getDistributedAmounts(
        DAI,
        convertToWei('30000', DAI.decimals),
        10,
      )

      const expectedPercents = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

      expect(percents.length).toEqual(10)
      expect(amounts.length).toEqual(10)

      expect(percents).toStrictEqual(expectedPercents)
      expect(amounts).toStrictEqual(
        expectedPercents.map(percent =>
          new TokenAmount(DAI, convertToWei('30000', DAI.decimals)).multiply(percent).divide(100),
        ),
      )
    })

    it('baseToken: WBTC, amount: 1300, distributePercent: 20', () => {
      const { percents, amounts } = getDistributedAmounts(
        WBTC,
        convertToWei('1300', WBTC.decimals),
        20,
      )

      const expectedPercents = [20, 40, 60, 80, 100]

      expect(percents.length).toEqual(5)
      expect(amounts.length).toEqual(5)

      expect(percents).toStrictEqual(expectedPercents)
      expect(amounts).toStrictEqual(
        expectedPercents.map(percent =>
          new TokenAmount(WBTC, convertToWei('1300', WBTC.decimals)).multiply(percent).divide(100),
        ),
      )
    })
  })

  describe('Failure with invalid parameters', () => {
    it('With out of range distributePercent: -1', () =>
      expect(() => getDistributedAmounts(USDC, convertToWei('1000', USDC.decimals), -1)).toThrow(
        'Distribute Percent is invalid',
      ))

    it('With out of range distributePercent: 102', () =>
      expect(() => getDistributedAmounts(USDC, convertToWei('1000', USDC.decimals), 102)).toThrow(
        'Distribute Percent is invalid',
      ))
  })
})
