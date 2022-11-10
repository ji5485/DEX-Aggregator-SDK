import JSBI from 'jsbi'
import { Hop, Route, getRoutesWithPercent, TradeType } from '../../../src'
import { convertToWei } from '../../../src/core/utils'
import {
  DAI,
  USDC,
  USDT,
  WBTC,
  DAI_USDC_1,
  DAI_USDC_2,
  DAI_USDC_3,
  DAI_USDC_4,
  DAI_USDT_1,
  DAI_USDT_2,
  DAI_USDT_3,
  DAI_USDT_4,
  USDC_USDT_1,
  USDC_USDT_2,
  USDC_USDT_3,
  USDC_USDT_4,
  USDC_WBTC_1,
  USDC_WBTC_2,
  USDC_WBTC_3,
  USDC_WBTC_4,
  USDT_WBTC_1,
  USDT_WBTC_2,
  USDT_WBTC_3,
  USDT_WBTC_4,
} from '../../mocks'

describe('getRoutesWithPercent', () => {
  const DAI_USDC_PAIRS = [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4]
  const DAI_USDT_PAIRS = [DAI_USDT_1, DAI_USDT_2, DAI_USDT_3, DAI_USDT_4]
  const USDC_USDT_PAIRS = [USDC_USDT_1, USDC_USDT_2, USDC_USDT_3, USDC_USDT_4]
  const USDC_WBTC_PAIRS = [USDC_WBTC_1, USDC_WBTC_2, USDC_WBTC_3, USDC_WBTC_4]
  const USDT_WBTC_PAIRS = [USDT_WBTC_1, USDT_WBTC_2, USDT_WBTC_3, USDT_WBTC_4]

  const DAI_USDC_HOP = new Hop(DAI, USDC, DAI_USDC_PAIRS)
  const DAI_USDT_HOP = new Hop(DAI, USDT, DAI_USDT_PAIRS)
  const USDC_USDT_HOP = new Hop(USDC, USDT, USDC_USDT_PAIRS)
  const USDC_WBTC_HOP = new Hop(USDC, WBTC, USDC_WBTC_PAIRS)
  const USDT_WBTC_HOP = new Hop(USDT, WBTC, USDT_WBTC_PAIRS)

  const DAI_WBTC_ROUTE_1 = new Route(DAI, WBTC, [DAI_USDC_HOP, USDC_WBTC_HOP])
  const DAI_WBTC_ROUTE_2 = new Route(DAI, WBTC, [DAI_USDT_HOP, USDT_WBTC_HOP])
  const DAI_WBTC_ROUTE_3 = new Route(DAI, WBTC, [DAI_USDC_HOP, USDC_USDT_HOP, USDT_WBTC_HOP])
  const DAI_WBTC_ROUTE_4 = new Route(DAI, WBTC, [DAI_USDT_HOP, USDC_USDT_HOP, USDC_WBTC_HOP])

  describe('Success with valid parameters', () => {
    describe('Get path from one route', () => {
      it(`DAI to WBTC one route (DAI - USDC - WBTC)
          1500 DAI, 10 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_1],
          convertToWei('1500', DAI.decimals),
          10,
          TradeType.EXACT_IN,
        )
        const expectedPercents = Array.from({ length: 100 / 10 }).map(
          (_, index) => (index + 1) * 10,
        )

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmount = DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('1500', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_1)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmount)
        })
      })

      it(`DAI to WBTC one route (DAI - USDT - WBTC)
          3000 DAI, 5 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_2],
          convertToWei('3000', DAI.decimals),
          5,
          TradeType.EXACT_OUT,
        )
        const expectedPercents = Array.from({ length: 100 / 5 }).map((_, index) => (index + 1) * 5)

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmount = DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('3000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_OUT,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_2)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmount)
        })
      })

      it(`DAI to WBTC one route (DAI - USDC - USDT - WBTC)
          5000 DAI, 20 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_3],
          convertToWei('5000', DAI.decimals),
          20,
          TradeType.EXACT_IN,
        )
        const expectedPercents = Array.from({ length: 100 / 20 }).map(
          (_, index) => (index + 1) * 20,
        )

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmount = DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('5000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_3)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmount)
        })
      })
    })

    describe('Get path from two routes', () => {
      it(`DAI to WBTC two route (DAI - USDC - WBTC / DAI - USDT - WBTC)
          2000 DAI, 10 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2],
          convertToWei('2000', DAI.decimals),
          10,
          TradeType.EXACT_IN,
        )
        const expectedPercents = Array.from({ length: 100 / 10 }).map(
          (_, index) => (index + 1) * 10,
        )

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmountRoute1 = DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('2000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_1)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmountRoute1)

          const expectedAmountRoute2 = DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('2000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[1].route).toEqual(DAI_WBTC_ROUTE_2)
          expect(routes[1].percent).toEqual(expectedPercents[index])
          expect(routes[1].amount).toEqual(expectedAmountRoute2)
        })
      })

      it(`DAI to WBTC two route (DAI - USDC - WBTC / DAI - USDT - WBTC)
          5000 DAI, 5 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2],
          convertToWei('5000', DAI.decimals),
          5,
          TradeType.EXACT_IN,
        )
        const expectedPercents = Array.from({ length: 100 / 5 }).map((_, index) => (index + 1) * 5)

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmountRoute1 = DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('5000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_1)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmountRoute1)

          const expectedAmountRoute2 = DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('5000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[1].route).toEqual(DAI_WBTC_ROUTE_2)
          expect(routes[1].percent).toEqual(expectedPercents[index])
          expect(routes[1].amount).toEqual(expectedAmountRoute2)
        })
      })
    })

    describe('Get path from three routes', () => {
      it(`DAI to WBTC two distinct route (DAI - USDC - WBTC / DAI - USDT - WBTC / DAI - USDC - USDT - WBTC)
          2000 DAI, 10 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3],
          convertToWei('2000', DAI.decimals),
          10,
          TradeType.EXACT_IN,
        )
        const expectedPercents = Array.from({ length: 100 / 10 }).map(
          (_, index) => (index + 1) * 10,
        )

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmountRoute1 = DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('2000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_1)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmountRoute1)

          const expectedAmountRoute2 = DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('2000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[1].route).toEqual(DAI_WBTC_ROUTE_2)
          expect(routes[1].percent).toEqual(expectedPercents[index])
          expect(routes[1].amount).toEqual(expectedAmountRoute2)

          const expectedAmountRoute3 = DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('2000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[2].route).toEqual(DAI_WBTC_ROUTE_3)
          expect(routes[2].percent).toEqual(expectedPercents[index])
          expect(routes[2].amount).toEqual(expectedAmountRoute3)
        })
      })

      it(`DAI to WBTC two distinct route (DAI - USDC - WBTC / DAI - USDC - USDT - WBTC / DAI - USDT - USDC - WBTC)
          4000 DAI, 20 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_4],
          convertToWei('4000', DAI.decimals),
          20,
          TradeType.EXACT_IN,
        )
        const expectedPercents = Array.from({ length: 100 / 20 }).map(
          (_, index) => (index + 1) * 20,
        )

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmountRoute1 = DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('4000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_1)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmountRoute1)

          const expectedAmountRoute3 = DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('4000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[1].route).toEqual(DAI_WBTC_ROUTE_3)
          expect(routes[1].percent).toEqual(expectedPercents[index])
          expect(routes[1].amount).toEqual(expectedAmountRoute3)

          const expectedAmountRoute4 = DAI_WBTC_ROUTE_4.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('4000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[2].route).toEqual(DAI_WBTC_ROUTE_4)
          expect(routes[2].percent).toEqual(expectedPercents[index])
          expect(routes[2].amount).toEqual(expectedAmountRoute4)
        })
      })
    })

    describe('Get path from four routes', () => {
      it(`DAI to WBTC two distinct route (DAI - USDC - WBTC / DAI - USDT - WBTC / DAI - USDT - USDC - WBTC / DAI - USDC - USDT - WBTC)
          3000 DAI, 10 distributePercent`, () => {
        const routesWithPercent = getRoutesWithPercent(
          [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_4],
          convertToWei('3000', DAI.decimals),
          10,
          TradeType.EXACT_IN,
        )
        const expectedPercents = Array.from({ length: 100 / 10 }).map(
          (_, index) => (index + 1) * 10,
        )

        expect(Object.keys(routesWithPercent).map(percent => parseFloat(percent))).toEqual(
          expectedPercents,
        )

        Object.values(routesWithPercent).forEach((routes, index) => {
          const expectedAmountRoute1 = DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('3000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[0].route).toEqual(DAI_WBTC_ROUTE_1)
          expect(routes[0].percent).toEqual(expectedPercents[index])
          expect(routes[0].amount).toEqual(expectedAmountRoute1)

          const expectedAmountRoute2 = DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('3000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[1].route).toEqual(DAI_WBTC_ROUTE_2)
          expect(routes[1].percent).toEqual(expectedPercents[index])
          expect(routes[1].amount).toEqual(expectedAmountRoute2)

          const expectedAmountRoute3 = DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('3000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[2].route).toEqual(DAI_WBTC_ROUTE_3)
          expect(routes[2].percent).toEqual(expectedPercents[index])
          expect(routes[2].amount).toEqual(expectedAmountRoute3)

          const expectedAmountRoute4 = DAI_WBTC_ROUTE_4.getExpectedSwapAmount(
            JSBI.divide(
              JSBI.multiply(
                JSBI.BigInt(convertToWei('3000', DAI.decimals)),
                JSBI.BigInt(expectedPercents[index]),
              ),
              JSBI.BigInt(100),
            ),
            TradeType.EXACT_IN,
          )

          expect(routes[3].route).toEqual(DAI_WBTC_ROUTE_4)
          expect(routes[3].percent).toEqual(expectedPercents[index])
          expect(routes[3].amount).toEqual(expectedAmountRoute4)
        })
      })
    })
  })

  describe('Failure with invalid parameters', () => {
    it('With out of range distributePercent: -1', () =>
      expect(() =>
        getRoutesWithPercent(
          [DAI_WBTC_ROUTE_3],
          convertToWei('5000', DAI.decimals),
          -1,
          TradeType.EXACT_IN,
        ),
      ).toThrow('Distribute Percent is invalid'))

    it('With out of range distributePercent: 102', () =>
      expect(() =>
        getRoutesWithPercent(
          [DAI_WBTC_ROUTE_3],
          convertToWei('5000', DAI.decimals),
          102,
          TradeType.EXACT_IN,
        ),
      ).toThrow('Distribute Percent is invalid'))

    it('Without any routes', () =>
      expect(() =>
        getRoutesWithPercent([], convertToWei('5000', DAI.decimals), 10, TradeType.EXACT_IN),
      ).toThrow('There must be at least one route'))
  })
})
