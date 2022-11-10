import { Hop, Pair, TokenAmount, TradeType } from '../../src'
import { convertFromWei, convertToWei } from '../../src/core/utils'
import {
  USDC,
  DAI,
  WETH,
  USDT,
  WBTC,
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
  TEST_ADDRESS,
} from '../mocks'

describe('Hop', () => {
  describe('constructor', () => {
    it('success sorting tokens', () => {
      const hop = new Hop(USDC, DAI, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

      expect(hop.token0.equals(DAI)).toEqual(true)
      expect(hop.token1.equals(USDC)).toEqual(true)
    })

    it('failure with token which is not USDC or DAI', () => {
      expect(() => new Hop(USDC, WBTC, [DAI_USDC_1, DAI_USDC_2])).toThrow(
        'Token does not exist in pair',
      )
    })
  })

  describe('#addPair', () => {
    it('success adding one pair', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1])
      hop.addPair(DAI_USDC_2)

      expect(hop.pair).toStrictEqual([DAI_USDC_1, DAI_USDC_2])
    })

    it('success adding multiple pairs', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1])
      hop.addPair([DAI_USDC_2, DAI_USDC_3])

      expect(hop.pair).toStrictEqual([DAI_USDC_1, DAI_USDC_2, DAI_USDC_3])
    })

    it('failure with pair contained dummy token', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1])
      const pair = new Pair(
        TEST_ADDRESS,
        new TokenAmount(WBTC, 10000),
        new TokenAmount(USDC, 10000),
        0.01,
        'Uniswap V2',
      )

      expect(() => hop.addPair(pair)).toThrow('Token does not exist in pair')
    })

    it('failure with pairs contained dummy token', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1])

      const DUMMY_USDC_1 = new Pair(
        TEST_ADDRESS,
        new TokenAmount(WBTC, 10000),
        new TokenAmount(USDC, 10000),
        0.01,
        'Uniswap V2',
      )
      const DUMMY_USDC_2 = new Pair(
        TEST_ADDRESS,
        new TokenAmount(WBTC, 10000),
        new TokenAmount(DAI, 10000),
        0.01,
        'Uniswap V2',
      )

      expect(() => hop.addPair([DUMMY_USDC_1, DUMMY_USDC_2])).toThrow(
        'Token does not exist in pair',
      )
    })
  })

  describe('#getOptimizedHop', () => {
    describe('Trade Type: EXACT_IN', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

      it('find best hop with 10 DAI input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(DAI, convertToWei('10', DAI.decimals)),
          TradeType.EXACT_IN,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_4, percent: 1 }])
      })

      it('find best hop with 100 DAI input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(DAI, convertToWei('100', DAI.decimals)),
          TradeType.EXACT_IN,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_4, percent: 1 }])
      })

      it('find best hop with 500 DAI input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(DAI, convertToWei('500', DAI.decimals)),
          TradeType.EXACT_IN,
        )

        expect(result).toStrictEqual([
          { pair: DAI_USDC_1, percent: 0.6 },
          { pair: DAI_USDC_4, percent: 0.4 },
        ])
      })

      it('find best hop with 150 USDC input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(USDC, convertToWei('150', USDC.decimals)),
          TradeType.EXACT_IN,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_3, percent: 1 }])
      })

      it('find best hop with 300 USDC input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(USDC, convertToWei('300', USDC.decimals)),
          TradeType.EXACT_IN,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_1, percent: 1 }])
      })

      it('find best hop with 1000 USDC input amount', () => {
        const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

        const result = hop.getOptimizedHop(
          new TokenAmount(USDC, convertToWei('1000', USDC.decimals)),
          TradeType.EXACT_IN,
        )

        expect(result).toStrictEqual([
          { pair: DAI_USDC_1, percent: 0.43 },
          { pair: DAI_USDC_4, percent: 0.3 },
          { pair: DAI_USDC_3, percent: 0.22 },
          { pair: DAI_USDC_2, percent: 0.04 },
        ])
      })
    })

    describe('Trade Type: EXACT_OUT', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

      it('find best hop with 10 DAI input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(DAI, convertToWei('10', DAI.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_3, percent: 1 }])
      })

      it('find best hop with 100 DAI input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(DAI, convertToWei('100', DAI.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_3, percent: 1 }])
      })

      it('find best hop with 500 DAI input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(DAI, convertToWei('500', DAI.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(result).toStrictEqual([
          { pair: DAI_USDC_1, percent: 0.6 },
          { pair: DAI_USDC_4, percent: 0.4 },
        ])
      })

      it('find best hop with 150 USDC input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(USDC, convertToWei('150', USDC.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_4, percent: 1 }])
      })

      it('find best hop with 300 USDC input amount', () => {
        const result = hop.getOptimizedHop(
          new TokenAmount(USDC, convertToWei('300', USDC.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(result).toStrictEqual([{ pair: DAI_USDC_1, percent: 1 }])
      })

      it('find best hop with 1000 USDC input amount', () => {
        const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

        const result = hop.getOptimizedHop(
          new TokenAmount(USDC, convertToWei('1000', USDC.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(result).toStrictEqual([
          { pair: DAI_USDC_1, percent: 0.43 },
          { pair: DAI_USDC_4, percent: 0.3 },
          { pair: DAI_USDC_3, percent: 0.22 },
          { pair: DAI_USDC_2, percent: 0.04 },
        ])
      })
    })

    describe('Error', () => {
      it('failure with token which is not USDC or DAI', () => {
        const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2])

        expect(() => hop.getOptimizedHop(new TokenAmount(WBTC, 100), TradeType.EXACT_IN)).toThrow(
          'Token does not exist',
        )
      })

      it('failure with empty pair list', () => {
        const hop = new Hop(DAI, USDC, [])

        expect(() => hop.getOptimizedHop(new TokenAmount(DAI, 100), TradeType.EXACT_OUT)).toThrow(
          'There must be at least one pair',
        )
      })
    })
  })

  describe('#getOptimizedResult', () => {
    describe('Trade Type: EXACT_IN', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

      it('find best hop with 10 DAI input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(DAI, convertToWei('10', DAI.decimals)),
          TradeType.EXACT_IN,
        )

        expect(parseFloat(convertFromWei(result!.toString(), USDC.decimals))).toBeCloseTo(10, 0)
      })

      it('find best hop with 100 DAI input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(DAI, convertToWei('100', DAI.decimals)),
          TradeType.EXACT_IN,
        )

        expect(parseFloat(convertFromWei(result!.toString(), USDC.decimals))).toBeCloseTo(102, 0)
      })

      it('find best hop with 500 DAI input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(DAI, convertToWei('500', DAI.decimals)),
          TradeType.EXACT_IN,
        )

        expect(parseFloat(convertFromWei(result!.toString(), USDC.decimals))).toBeCloseTo(501, 0)
      })

      it('find best hop with 150 USDC input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(USDC, convertToWei('150', USDC.decimals)),
          TradeType.EXACT_IN,
        )

        expect(parseFloat(convertFromWei(result!.toString(), DAI.decimals))).toBeCloseTo(152, 0)
      })

      it('find best hop with 300 USDC input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(USDC, convertToWei('300', USDC.decimals)),
          TradeType.EXACT_IN,
        )

        expect(parseFloat(convertFromWei(result!.toString(), DAI.decimals))).toBeCloseTo(298, 0)
      })

      it('find best hop with 1000 USDC input amount', () => {
        const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

        const result = hop.getOptimizedResult(
          new TokenAmount(USDC, convertToWei('1000', USDC.decimals)),
          TradeType.EXACT_IN,
        )

        expect(parseFloat(convertFromWei(result!.toString(), DAI.decimals))).toBeCloseTo(978, 0)
      })
    })

    describe('Trade Type: EXACT_OUT', () => {
      const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

      it('find best hop with 10 DAI input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(DAI, convertToWei('10', DAI.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(parseFloat(convertFromWei(result!.toString(), USDC.decimals))).toBeCloseTo(10, 0)
      })

      it('find best hop with 100 DAI input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(DAI, convertToWei('100', DAI.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(parseFloat(convertFromWei(result!.toString(), USDC.decimals))).toBeCloseTo(98, 0)
      })

      it('find best hop with 500 DAI input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(DAI, convertToWei('500', DAI.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(parseFloat(convertFromWei(result!.toString(), USDC.decimals))).toBeCloseTo(510, 0)
      })

      it('find best hop with 150 USDC input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(USDC, convertToWei('150', USDC.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(parseFloat(convertFromWei(result!.toString(), DAI.decimals))).toBeCloseTo(148, 0)
      })

      it('find best hop with 300 USDC input amount', () => {
        const result = hop.getOptimizedResult(
          new TokenAmount(USDC, convertToWei('300', USDC.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(parseFloat(convertFromWei(result!.toString(), DAI.decimals))).toBeCloseTo(302, 0)
      })

      it('find best hop with 1000 USDC input amount', () => {
        const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

        const result = hop.getOptimizedResult(
          new TokenAmount(USDC, convertToWei('1000', USDC.decimals)),
          TradeType.EXACT_OUT,
        )

        expect(parseFloat(convertFromWei(result!.toString(), DAI.decimals))).toBeCloseTo(995, 0)
      })
    })

    describe('Error', () => {
      it('failure with token which is not USDC or DAI', () => {
        const hop = new Hop(DAI, USDC, [DAI_USDC_1, DAI_USDC_2])

        expect(() => hop.getOptimizedHop(new TokenAmount(WBTC, 100), TradeType.EXACT_IN)).toThrow(
          'Token does not exist',
        )
      })

      it('failure with empty pair list', () => {
        const hop = new Hop(DAI, USDC, [])

        expect(() => hop.getOptimizedHop(new TokenAmount(DAI, 100), TradeType.EXACT_OUT)).toThrow(
          'There must be at least one pair',
        )
      })
    })
  })

  describe('#convertHopsFromPairs', () => {
    it('success with one kind of pairs', () => {
      const hops = Hop.convertHopsFromPairs([DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4])

      expect(hops.length).toEqual(1)

      expect(hops[0].token0).toEqual(DAI)
      expect(hops[0].token1).toEqual(USDC)
      expect(hops[0].pair.length).toEqual(4)
    })

    it('success with two kinds of pairs', () => {
      const hops = Hop.convertHopsFromPairs([
        DAI_USDC_1,
        DAI_USDC_2,
        DAI_USDC_3,
        DAI_USDC_4,
        DAI_WETH_1,
        DAI_WETH_2,
        DAI_WETH_3,
      ])

      expect(hops.length).toEqual(2)

      expect(hops[0].token0).toEqual(DAI)
      expect(hops[0].token1).toEqual(USDC)
      expect(hops[0].pair.length).toEqual(4)

      expect(hops[1].token0).toEqual(DAI)
      expect(hops[1].token1).toEqual(WETH)
      expect(hops[1].pair.length).toEqual(3)
    })

    it('success with three kinds of pairs', () => {
      const hops = Hop.convertHopsFromPairs([
        DAI_USDC_1,
        DAI_USDC_2,
        DAI_USDC_3,
        DAI_WETH_1,
        DAI_WETH_2,
        DAI_WETH_3,
        DAI_WETH_4,
        USDT_WETH_1,
        USDT_WETH_2,
        USDT_WETH_3,
      ])

      expect(hops.length).toEqual(3)

      expect(hops[0].token0).toEqual(DAI)
      expect(hops[0].token1).toEqual(USDC)
      expect(hops[0].pair.length).toEqual(3)

      expect(hops[1].token0).toEqual(DAI)
      expect(hops[1].token1).toEqual(WETH)
      expect(hops[1].pair.length).toEqual(4)

      expect(hops[2].token0).toEqual(WETH)
      expect(hops[2].token1).toEqual(USDT)
      expect(hops[2].pair.length).toEqual(3)
    })
  })
})
