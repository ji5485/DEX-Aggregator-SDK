import JSBI from 'jsbi'
import { Hop, Route, getRoutesWithPercent, TradeType, getBestSwapRoute } from '../../../src'
import { convertFromWei, convertToWei } from '../../../src/core/utils'
import {
  DAI,
  USDC,
  USDT,
  WBTC,
  WETH,
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
  DAI_WETH_1,
  DAI_WETH_2,
  DAI_WETH_3,
  DAI_WETH_4,
  USDT_WETH_1,
  USDT_WETH_2,
  USDT_WETH_3,
  USDT_WETH_4,
  WETH_WBTC_1,
  WETH_WBTC_2,
  WETH_WBTC_3,
  WETH_WBTC_4,
  DAI_WBTC_1,
  DAI_WBTC_2,
  DAI_WBTC_3,
  DAI_WBTC_4,
} from '../../mocks'

describe('getBestSwapRoute (DAI -> WBTC)', () => {
  const DAI_WBTC_PAIRS = [DAI_WBTC_1, DAI_WBTC_2, DAI_WBTC_3, DAI_WBTC_4]
  const DAI_USDC_PAIRS = [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4]
  const DAI_USDT_PAIRS = [DAI_USDT_1, DAI_USDT_2, DAI_USDT_3, DAI_USDT_4]
  const DAI_WETH_PAIRS = [DAI_WETH_1, DAI_WETH_2, DAI_WETH_3, DAI_WETH_4]
  const USDC_USDT_PAIRS = [USDC_USDT_1, USDC_USDT_2, USDC_USDT_3, USDC_USDT_4]
  const USDC_WBTC_PAIRS = [USDC_WBTC_1, USDC_WBTC_2, USDC_WBTC_3, USDC_WBTC_4]
  const USDT_WETH_PAIRS = [USDT_WETH_1, USDT_WETH_2, USDT_WETH_3, USDT_WETH_4]
  const USDT_WBTC_PAIRS = [USDT_WBTC_1, USDT_WBTC_2, USDT_WBTC_3, USDT_WBTC_4]
  const WETH_WBTC_PAIRS = [WETH_WBTC_1, WETH_WBTC_2, WETH_WBTC_3, WETH_WBTC_4]

  const DAI_WBTC_HOP = new Hop(DAI, WBTC, DAI_WBTC_PAIRS)
  const DAI_USDC_HOP = new Hop(DAI, USDC, DAI_USDC_PAIRS)
  const DAI_USDT_HOP = new Hop(DAI, USDT, DAI_USDT_PAIRS)
  const DAI_WETH_HOP = new Hop(DAI, WETH, DAI_WETH_PAIRS)
  const USDC_USDT_HOP = new Hop(USDC, USDT, USDC_USDT_PAIRS)
  const USDC_WBTC_HOP = new Hop(USDC, WBTC, USDC_WBTC_PAIRS)
  const USDT_WETH_HOP = new Hop(USDT, WETH, USDT_WETH_PAIRS)
  const USDT_WBTC_HOP = new Hop(USDT, WBTC, USDT_WBTC_PAIRS)
  const WETH_WBTC_HOP = new Hop(WETH, WBTC, WETH_WBTC_PAIRS)

  const DAI_WBTC_ROUTE_1 = new Route(DAI, WBTC, [DAI_WBTC_HOP]) // DAI - WBTC
  const DAI_WBTC_ROUTE_2 = new Route(DAI, WBTC, [DAI_USDC_HOP, USDC_WBTC_HOP]) // DAI - USDC - WBTC
  const DAI_WBTC_ROUTE_3 = new Route(DAI, WBTC, [DAI_USDT_HOP, USDT_WBTC_HOP]) // DAI - USDT - WBTC
  const DAI_WBTC_ROUTE_4 = new Route(DAI, WBTC, [DAI_WETH_HOP, WETH_WBTC_HOP]) // DAI - WETH - WBTC
  const DAI_WBTC_ROUTE_5 = new Route(DAI, WBTC, [DAI_USDC_HOP, USDC_USDT_HOP, USDT_WBTC_HOP]) // DAI - USDC - USDT - WBTC
  const DAI_WBTC_ROUTE_6 = new Route(DAI, WBTC, [DAI_USDT_HOP, USDC_USDT_HOP, USDC_WBTC_HOP]) // DAI - USDT - USDC - WBTC
  const DAI_WBTC_ROUTE_7 = new Route(DAI, WBTC, [DAI_WETH_HOP, USDT_WETH_HOP, USDT_WBTC_HOP]) // DAI - WETH - USDT - WBTC

  describe('Get best swap route from one route', () => {
    it(`DAI - USDC - WBTC
        1500 DAI, 10 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_2],
        convertToWei('1500', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
          convertToWei('1500', DAI.decimals),
          TradeType.EXACT_IN,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[100][0]])
    })

    it(`DAI - USDT - WBTC
        2000 DAI, 5 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_3],
        convertToWei('2000', DAI.decimals),
        5,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
          convertToWei('2000', DAI.decimals),
          TradeType.EXACT_IN,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[100][0]])
    })

    it(`DAI - USDC - USDT - WBTC
        5000 DAI, 20 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_5],
        convertToWei('5000', DAI.decimals),
        20,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        DAI_WBTC_ROUTE_5.getExpectedSwapAmount(
          convertToWei('5000', DAI.decimals),
          TradeType.EXACT_IN,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[100][0]])
    })
  })

  describe('Get best swap route from two distinct routes', () => {
    it(`DAI - USDC - WBTC / DAI - USDT - WBTC
        2000 DAI, 10 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3],
        convertToWei('2000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            convertToWei('1000', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
          DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
            convertToWei('1000', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[50][0], routesWithPercent[50][1]])
    })

    it(`DAI - USDC - WBTC / DAI - WETH - USDT - WBTC
        4000 DAI, 5 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_7],
        convertToWei('4000', DAI.decimals),
        5,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            convertToWei('2400', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
          DAI_WBTC_ROUTE_7.getExpectedSwapAmount(
            convertToWei('1600', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[60][0], routesWithPercent[40][0]])
    })
  })

  describe('Get best swap route from two overlapping routes', () => {
    it(`DAI - USDC - WBTC / DAI - USDT - USDC - WBTC
        3000 DAI, 10 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_6],
        convertToWei('3000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
          convertToWei('3000', DAI.decimals),
          TradeType.EXACT_IN,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[100][0]])
    })

    it(`DAI - USDT - WBTC / DAI - WETH - USDT - WBTC
        5000 DAI, 20 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_7],
        convertToWei('5000', DAI.decimals),
        20,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
          convertToWei('5000', DAI.decimals),
          TradeType.EXACT_IN,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[100][0]])
    })
  })

  describe('Get best swap route from three distinct routes', () => {
    it(`DAI - USDT - WBTC / DAI - USDT - WBTC / DAI - WETH - WBTC
        5000 DAI, 10 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_4],
        convertToWei('5000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          JSBI.add(
            DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
              convertToWei('2000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
            DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
              convertToWei('1500', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
          ),
          DAI_WBTC_ROUTE_4.getExpectedSwapAmount(
            convertToWei('1500', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([
        routesWithPercent[40][1],
        routesWithPercent[30][0],
        routesWithPercent[30][1],
      ])
    })
  })

  describe('Get best swap route from three overlapping routes', () => {
    it(`DAI - USDC - WBTC / DAI - USDT - WBTC / DAI - WETH - USDT - WBTC
        7000 DAI, 10 distributePercent with two partially overlapping routes`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_7],
        convertToWei('7000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            convertToWei('3500', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
          DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
            convertToWei('3500', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[50][0], routesWithPercent[50][1]])
    })

    it(`DAI - USDT - WBTC / DAI - USDC - USDT - WBTC / DAI - WETH - USDT - WBTC
        4000 DAI, 10 distributePercent with three partially overlapping routes`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_5, DAI_WBTC_ROUTE_7],
        convertToWei('4000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
          convertToWei('4000', DAI.decimals),
          TradeType.EXACT_IN,
        )!,
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[100][0]])
    })
  })

  describe('Get best swap route from four distinct routes', () => {
    it(`DAI - WBTC / DAI - USDC - WBTC
        DAI - USDT - WBTC / DAI - WETH - WBTC
        100000 DAI, 10 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_4],
        convertToWei('100000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          JSBI.add(
            DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
              convertToWei('50000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
            DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
              convertToWei('10000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
          ),
          JSBI.add(
            DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
              convertToWei('20000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
            DAI_WBTC_ROUTE_4.getExpectedSwapAmount(
              convertToWei('20000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
          ),
        ),
      )
      expect(bestSwapRoute!.route).toEqual([
        routesWithPercent[50][0],
        routesWithPercent[20][1],
        routesWithPercent[20][2],
        routesWithPercent[10][3],
      ])
    })
  })

  describe('Get best swap route from four overlapping routes', () => {
    it(`DAI - WBTC / DAI - USDC - WBTC
        DAI - WETH - WBTC / DAI - WETH - USDT - WBTC
        40000 DAI, 10 distributePercent with two partially overlapping routes only`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_4, DAI_WBTC_ROUTE_7],
        convertToWei('40000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          JSBI.add(
            DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
              convertToWei('32000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
            DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
              convertToWei('4000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
          ),
          DAI_WBTC_ROUTE_4.getExpectedSwapAmount(
            convertToWei('4000', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([
        routesWithPercent[80][0],
        routesWithPercent[10][1],
        routesWithPercent[10][2],
      ])
    })

    it(`DAI - USDC - WBTC / DAI - WETH - WBTC
        DAI - USDT - USDC - WBTC / DAI - WETH - USDT - WBTC
        8000 DAI, 10 distributePercent with two partially overlapping routes each`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_4, DAI_WBTC_ROUTE_6, DAI_WBTC_ROUTE_7],
        convertToWei('8000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
            convertToWei('3200', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
          DAI_WBTC_ROUTE_4.getExpectedSwapAmount(
            convertToWei('4800', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[60][0], routesWithPercent[40][1]])
    })

    it(`DAI - WBTC / DAI - USDT - WBTC
        DAI - USDC - USDT - WBTC / DAI - WETH - USDT - WBTC
        30000 DAI, 5 distributePercent with three partially overlapping routes`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_5, DAI_WBTC_ROUTE_7],
        convertToWei('30000', DAI.decimals),
        5,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
            convertToWei('28500', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
          DAI_WBTC_ROUTE_7.getExpectedSwapAmount(
            convertToWei('1500', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([routesWithPercent[95][0], routesWithPercent[5][1]])
    })
  })

  describe('Get best swap route from five overlapping routes', () => {
    it(`DAI - WBTC / DAI - USDC - WBTC / DAI - USDT - WBTC
        DAI - WETH - WBTC / DAI - WETH - USDT - WBTC
        150000 DAI, 10 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_4, DAI_WBTC_ROUTE_7],
        convertToWei('150000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          JSBI.add(
            DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
              convertToWei('75000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
            DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
              convertToWei('15000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
          ),
          JSBI.add(
            DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
              convertToWei('30000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
            DAI_WBTC_ROUTE_4.getExpectedSwapAmount(
              convertToWei('30000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
          ),
        ),
      )
      expect(bestSwapRoute!.route).toEqual([
        routesWithPercent[50][0],
        routesWithPercent[20][1],
        routesWithPercent[20][2],
        routesWithPercent[10][3],
      ])
    })

    it(`DAI - WBTC / DAI - USDC - WBTC / DAI - USDT - WBTC
        DAI - USDC - USDT - WBTC / DAI - WETH - USDT - WBTC
        200000 DAI, 10 distributePercent`, () => {
      const routesWithPercent = getRoutesWithPercent(
        [DAI_WBTC_ROUTE_1, DAI_WBTC_ROUTE_2, DAI_WBTC_ROUTE_3, DAI_WBTC_ROUTE_5, DAI_WBTC_ROUTE_7],
        convertToWei('200000', DAI.decimals),
        10,
        TradeType.EXACT_IN,
      )
      const bestSwapRoute = getBestSwapRoute(routesWithPercent, TradeType.EXACT_IN)

      expect(bestSwapRoute).not.toEqual(null)
      expect(bestSwapRoute!.amount).toEqual(
        JSBI.add(
          JSBI.add(
            DAI_WBTC_ROUTE_1.getExpectedSwapAmount(
              convertToWei('100000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
            DAI_WBTC_ROUTE_2.getExpectedSwapAmount(
              convertToWei('40000', DAI.decimals),
              TradeType.EXACT_IN,
            )!,
          ),
          DAI_WBTC_ROUTE_3.getExpectedSwapAmount(
            convertToWei('60000', DAI.decimals),
            TradeType.EXACT_IN,
          )!,
        ),
      )
      expect(bestSwapRoute!.route).toEqual([
        routesWithPercent[50][0],
        routesWithPercent[30][1],
        routesWithPercent[20][2],
      ])
    })
  })
})
