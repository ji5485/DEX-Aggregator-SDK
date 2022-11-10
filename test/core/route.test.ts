import { Hop, Route, TradeType } from '../../src'
import { convertFromWei, convertToWei } from '../../src/core/utils'
import {
  USDC,
  DAI,
  WETH,
  USDT,
  DAI_USDC_1,
  DAI_USDC_2,
  DAI_USDC_3,
  DAI_USDC_4,
  DAI_WETH_1,
  DAI_WETH_2,
  DAI_WETH_3,
  DAI_WETH_4,
  USDT_WETH_1,
  USDT_WETH_2,
  USDT_WETH_3,
  USDT_WETH_4,
} from '../mocks'

describe('Route', () => {
  describe('constructor', () => {
    it('constructor works with one hop', () => {
      const hop = new Hop(USDC, DAI, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])
      const route = new Route(USDC, DAI, [hop])

      expect(route.hops).toStrictEqual([hop])
      expect(route.path).toStrictEqual([USDC, DAI])
      expect(route.input).toStrictEqual(USDC)
      expect(route.output).toStrictEqual(DAI)
    })

    it('constructor works with two hops', () => {
      const hop1 = new Hop(USDC, DAI, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])
      const hop2 = new Hop(DAI, WETH, [DAI_WETH_1, DAI_WETH_2, DAI_WETH_3, DAI_WETH_4])
      const route = new Route(USDC, WETH, [hop1, hop2])

      expect(route.hops).toStrictEqual([hop1, hop2])
      expect(route.path).toStrictEqual([USDC, DAI, WETH])
      expect(route.input).toStrictEqual(USDC)
      expect(route.output).toStrictEqual(WETH)
    })

    it('failure with tokens that does not end with input token', () => {
      const hop = new Hop(USDC, DAI, [DAI_USDC_1, DAI_USDC_2])

      expect(() => new Route(WETH, WETH, [hop])).toThrow('Does not start with input token')
    })

    it('failure with tokens that does not end with output token', () => {
      const hop = new Hop(USDC, DAI, [DAI_USDC_1, DAI_USDC_2])

      expect(() => new Route(USDC, WETH, [hop])).toThrow('Does not end with output token')
    })

    it('failure with empty hop', () => {
      const hop1 = new Hop(USDC, DAI, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])
      const hop2 = new Hop(DAI, WETH, [])
      const hop3 = new Hop(WETH, USDT, [USDT_WETH_1, USDT_WETH_2, USDT_WETH_3, USDT_WETH_4])

      expect(() => new Route(USDC, USDT, [hop1, hop2, hop3])).toThrow('Pair does not exist')
    })

    it('failure with hops that does not connected', () => {
      const hop1 = new Hop(USDC, DAI, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])
      const hop2 = new Hop(WETH, USDT, [USDT_WETH_1, USDT_WETH_2, USDT_WETH_3, USDT_WETH_4])

      expect(() => new Route(USDC, WETH, [hop1, hop2])).toThrow('Pair does not connected')
    })
  })

  describe('#midPrice', () => {
    const pairs1 = [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4]
    const pairs2 = [DAI_WETH_1, DAI_WETH_2, DAI_WETH_3, DAI_WETH_4]
    const pairs3 = [USDT_WETH_1, USDT_WETH_2, USDT_WETH_3, USDT_WETH_4]

    const hop1 = new Hop(DAI, USDC, pairs1)
    const hop2 = new Hop(DAI, WETH, pairs2)
    const hop3 = new Hop(USDT, WETH, pairs3)

    it('success with one hop', () => {
      const route = new Route(USDC, DAI, [hop1])

      expect(route.midPrice).toEqual(
        pairs1.reduce((price, pair) => price + pair.priceOf(USDC), 0) / 4,
      )
    })

    it('success with two hops', () => {
      const route = new Route(USDC, WETH, [hop1, hop2])

      expect(route.midPrice).toEqual(
        (pairs1.reduce((price, pair) => price + pair.priceOf(USDC), 0) / 4) *
          (pairs2.reduce((price, pair) => price + pair.priceOf(DAI), 0) / 4),
      )
    })

    it('success with three hops', () => {
      const route = new Route(USDC, USDT, [hop1, hop2, hop3])

      expect(route.midPrice).toEqual(
        (pairs1.reduce((price, pair) => price + pair.priceOf(USDC), 0) / 4) *
          (pairs2.reduce((price, pair) => price + pair.priceOf(DAI), 0) / 4) *
          (pairs3.reduce((price, pair) => price + pair.priceOf(WETH), 0) / 4),
      )
    })
  })

  describe('#getExpectedSwapAmount', () => {
    const pairs1 = [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4]
    const pairs2 = [DAI_WETH_1, DAI_WETH_2, DAI_WETH_3, DAI_WETH_4]
    const pairs3 = [USDT_WETH_1, USDT_WETH_2, USDT_WETH_3, USDT_WETH_4]

    const hop1 = new Hop(DAI, USDC, pairs1)
    const hop2 = new Hop(DAI, WETH, pairs2)
    const hop3 = new Hop(USDT, WETH, pairs3)

    describe('Trade Type: EXACT_IN', () => {
      it('success with one hop', () => {
        const route = new Route(USDC, DAI, [hop1])
        const expected = route
          .getExpectedSwapAmount(convertToWei('100', USDC.decimals), TradeType.EXACT_IN)!
          .toString()

        expect(parseFloat(convertFromWei(expected, DAI.decimals))).toBeCloseTo(101.75, 2)
      })

      it('success with two hops', () => {
        const route = new Route(USDC, WETH, [hop1, hop2])
        const expected = route
          .getExpectedSwapAmount(convertToWei('100', USDC.decimals), TradeType.EXACT_IN)!
          .toString()

        expect(parseFloat(convertFromWei(expected, WETH.decimals))).toBeCloseTo(0.05376, 5)
      })

      it('success with three hops', () => {
        const route = new Route(USDC, USDT, [hop1, hop2, hop3])
        const expected = route
          .getExpectedSwapAmount(convertToWei('100', USDC.decimals), TradeType.EXACT_IN)!
          .toString()

        expect(parseFloat(convertFromWei(expected, USDT.decimals))).toBeCloseTo(102.46, 2)
      })
    })

    describe('Trade Type: EXACT_OUT', () => {
      it('success with one hop', () => {
        const route = new Route(USDC, DAI, [hop1])
        const expected = route
          .getExpectedSwapAmount(convertToWei('100', USDC.decimals), TradeType.EXACT_OUT)!
          .toString()

        expect(parseFloat(convertFromWei(expected, DAI.decimals))).toBeCloseTo(98.26, 2)
      })

      it('success with two hops', () => {
        const route = new Route(USDC, WETH, [hop1, hop2])
        const expected = route
          .getExpectedSwapAmount(convertToWei('100', USDC.decimals), TradeType.EXACT_OUT)!
          .toString()

        expect(parseFloat(convertFromWei(expected, WETH.decimals))).toBeCloseTo(0.0513, 5)
      })

      it('success with three hops', () => {
        const route = new Route(USDC, USDT, [hop1, hop2, hop3])
        const expected = route
          .getExpectedSwapAmount(convertToWei('100', USDC.decimals), TradeType.EXACT_OUT)!
          .toString()

        expect(parseFloat(convertFromWei(expected, USDT.decimals))).toBeCloseTo(97.96, 2)
      })
    })
  })
})
