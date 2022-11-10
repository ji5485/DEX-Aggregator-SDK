import { TokenAmount, Pair } from '../../src'
import { convertFromWei, convertToWei } from '../../src/core/utils'
import { USDC, DAI, WBTC, TEST_ADDRESS } from '../mocks'

function convertFloatFromWei(value: string, decimal: number) {
  return parseFloat(convertFromWei(value, decimal))
}

describe('Pair', () => {
  describe('constructor', () => {
    it('success sorting tokenAmounts', () => {
      const DAI_USDC_1 = new Pair(
        TEST_ADDRESS,
        new TokenAmount(USDC, 100),
        new TokenAmount(DAI, 1000),
        0.3,
        'Uniswap V2',
      )
      const DAI_USDC_2 = new Pair(
        TEST_ADDRESS,
        new TokenAmount(DAI, 200),
        new TokenAmount(USDC, 800),
        0.3,
        'Uniswap V2',
      )

      expect(DAI_USDC_1.token0.equals(DAI_USDC_2.token0)).toBe(true)
      expect(DAI_USDC_1.token1.equals(DAI_USDC_2.token1)).toBe(true)
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(USDC, 100),
          new TokenAmount(DAI, 1000),
          0.3,
          'Uniswap V2',
        ).token0,
      ).toEqual(DAI)
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 300),
          new TokenAmount(USDC, 800),
          0.3,
          'Uniswap V2',
        ).token0,
      ).toEqual(DAI)
    })
  })

  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(USDC, 100),
          new TokenAmount(DAI, 1000),
          0.3,
          'Uniswap V2',
        ).token1,
      ).toEqual(USDC)
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 300),
          new TokenAmount(USDC, 800),
          0.3,
          'Uniswap V2',
        ).token1,
      ).toEqual(USDC)
    })
  })

  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(USDC, 100),
          new TokenAmount(DAI, 1000),
          0.3,
          'Uniswap V2',
        ).reserve0,
      ).toEqual(new TokenAmount(DAI, 1000))
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 1000),
          new TokenAmount(USDC, 100),
          0.3,
          'Uniswap V2',
        ).reserve0,
      ).toEqual(new TokenAmount(DAI, 1000))
    })
  })

  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(USDC, 100),
          new TokenAmount(DAI, 1000),
          0.3,
          'Uniswap V2',
        ).reserve1,
      ).toEqual(new TokenAmount(USDC, 100))
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 1000),
          new TokenAmount(USDC, 100),
          0.3,
          'Uniswap V2',
        ).reserve1,
      ).toEqual(new TokenAmount(USDC, 100))
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(USDC, convertToWei('1000', USDC.decimals)),
          new TokenAmount(DAI, convertToWei('100', DAI.decimals)),
          0.3,
          'Uniswap V2',
        ).token0Price,
      ).toEqual(10)
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, convertToWei('100', DAI.decimals)),
          new TokenAmount(USDC, convertToWei('1000', USDC.decimals)),
          0.3,
          'Uniswap V2',
        ).token0Price,
      ).toEqual(10)
    })

    it('failure with no token0', () => {
      expect(
        () =>
          new Pair(
            TEST_ADDRESS,
            new TokenAmount(USDC, 1000),
            new TokenAmount(DAI, 0),
            0.3,
            'Uniswap V2',
          ).token0Price,
      ).toThrow('Denominator must be non-zero')
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(USDC, convertToWei('100', USDC.decimals)),
          new TokenAmount(DAI, convertToWei('300', DAI.decimals)),
          0.3,
          'Uniswap V2',
        ).token1Price,
      ).toEqual(3)
      expect(
        new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, convertToWei('300', DAI.decimals)),
          new TokenAmount(USDC, convertToWei('100', USDC.decimals)),
          0.3,
          'Uniswap V2',
        ).token1Price,
      ).toEqual(3)
    })

    it('failure with no token1', () => {
      expect(
        () =>
          new Pair(
            TEST_ADDRESS,
            new TokenAmount(USDC, 0),
            new TokenAmount(DAI, 100),
            0.3,
            'Uniswap V2',
          ).token1Price,
      ).toThrow('Denominator must be non-zero')
    })
  })

  describe('#setTokenAmounts', () => {
    const pair = new Pair(
      TEST_ADDRESS,
      new TokenAmount(USDC, 0),
      new TokenAmount(DAI, 0),
      0.3,
      'Uniswap V2',
    )

    it('success with correct tokens', () => {
      pair.setTokenAmounts(new TokenAmount(USDC, 1000), new TokenAmount(DAI, 1000))

      expect(pair.reserve0).toEqual(pair.reserveOf(DAI))
      expect(pair.reserve1).toEqual(pair.reserveOf(USDC))
    })

    it('failure with different tokens', () => {
      expect(() =>
        pair.setTokenAmounts(new TokenAmount(USDC, 1000), new TokenAmount(WBTC, 1000)),
      ).toThrow('Tokens are different')
    })
  })

  describe('#reserveOf', () => {
    const pair = new Pair(
      TEST_ADDRESS,
      new TokenAmount(USDC, 100),
      new TokenAmount(DAI, 300),
      0.3,
      'Uniswap V2',
    )

    it('returns reserves of the given token', () => {
      expect(pair.reserveOf(DAI)).toEqual(pair.reserve0)
      expect(pair.reserveOf(USDC)).toEqual(pair.reserve1)
    })

    it('throws if not in a pair', () => {
      expect(() => pair.priceOf(WBTC)).toThrow('Token does not exist')
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(
      TEST_ADDRESS,
      new TokenAmount(USDC, 100),
      new TokenAmount(DAI, 300),
      0.3,
      'Uniswap V2',
    )

    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if not in a pair', () => {
      expect(() => pair.priceOf(WBTC)).toThrow('Token does not exist')
    })
  })

  describe('#involvesToken', () => {
    const pair = new Pair(
      TEST_ADDRESS,
      new TokenAmount(USDC, 100),
      new TokenAmount(DAI, 300),
      0.3,
      'Uniswap V2',
    )

    expect(pair.involvesToken(USDC)).toEqual(true)
    expect(pair.involvesToken(DAI)).toEqual(true)
    expect(pair.involvesToken(WBTC)).toEqual(false)
  })

  describe('#getOutputAmount', () => {
    describe('10000 DAI, 10000 USDC, 0.01% Fee Pair', () => {
      const pair = new Pair(
        TEST_ADDRESS,
        new TokenAmount(DAI, convertToWei('10000', DAI.decimals)),
        new TokenAmount(USDC, convertToWei('10000', USDC.decimals)),
        0.01,
        'Uniswap V2',
      )

      it('calculate output when input is 10 DAI', () => {
        const tokenAmount = new TokenAmount(DAI, convertToWei('10', DAI.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), USDC.decimals)).toBeCloseTo(
          10,
          0,
        )
        expect(convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals)).toEqual(
          10010,
        )
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toBeCloseTo(9990, 0)
      })

      it('calculate output when input is 100 USDC', () => {
        const tokenAmount = new TokenAmount(USDC, convertToWei('100', USDC.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), DAI.decimals)).toBeCloseTo(99, 0)
        expect(
          convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals),
        ).toBeCloseTo(9901, 0)
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toEqual(10100)
      })
    })

    describe('10000 DAI, 15000 USDC, 1% Fee Pair', () => {
      const pair = new Pair(
        TEST_ADDRESS,
        new TokenAmount(DAI, convertToWei('10000', DAI.decimals)),
        new TokenAmount(USDC, convertToWei('15000', USDC.decimals)),
        1,
        'Uniswap V2',
      )

      it('calculate output when input is 100 DAI', () => {
        const tokenAmount = new TokenAmount(DAI, convertToWei('100', DAI.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), USDC.decimals)).toBeCloseTo(
          147,
          0,
        )
        expect(convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals)).toEqual(
          10100,
        )
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toBeCloseTo(14853, 0)
      })

      it('calculate output when input is 10 USDC', () => {
        const tokenAmount = new TokenAmount(USDC, convertToWei('10', USDC.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), DAI.decimals)).toBeCloseTo(7, 0)
        expect(
          convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals),
        ).toBeCloseTo(9993, 0)
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toEqual(15010)
      })
    })

    describe('Insufficient Input Amount Error', () => {
      const pair = new Pair(
        TEST_ADDRESS,
        new TokenAmount(DAI, 100),
        new TokenAmount(USDC, 300),
        1,
        'Uniswap V2',
      )

      it('Error when input is 0 DAI', () => {
        const tokenAmount = new TokenAmount(DAI, 0)
        expect(() => pair.getOutputAmount(tokenAmount)).toThrow('InsufficientInputAmount')
      })

      it('Error when input is 0 USDC', () => {
        const tokenAmount = new TokenAmount(USDC, 0)
        expect(() => pair.getOutputAmount(tokenAmount)).toThrow('InsufficientInputAmount')
      })
    })

    describe('Insufficient Reserves Error', () => {
      it('Error when DAI reserve is 0', () => {
        const pair = new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 0),
          new TokenAmount(USDC, 300),
          1,
          'Uniswap V2',
        )
        const tokenAmount = new TokenAmount(DAI, 10)
        expect(() => pair.getOutputAmount(tokenAmount)).toThrow('InsufficientReserves')
      })

      it('Error when USDC reserve is 0', () => {
        const pair = new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 100),
          new TokenAmount(USDC, 0),
          1,
          'Uniswap V2',
        )
        const tokenAmount = new TokenAmount(DAI, 10)
        expect(() => pair.getOutputAmount(tokenAmount)).toThrow('InsufficientReserves')
      })
    })
  })

  describe('#getInputAmount', () => {
    describe('100000 DAI, 100000 USDC, 0.05% Fee Pair', () => {
      const pair = new Pair(
        TEST_ADDRESS,
        new TokenAmount(DAI, convertToWei('100000', DAI.decimals)),
        new TokenAmount(USDC, convertToWei('100000', USDC.decimals)),
        0.05,
        'Uniswap V2',
      )

      it('calculate output when input is 10 DAI', () => {
        const tokenAmount = new TokenAmount(DAI, convertToWei('10', DAI.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), USDC.decimals)).toBeCloseTo(
          10,
          0,
        )
        expect(convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals)).toEqual(
          100010,
        )
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toBeCloseTo(99990, 0)
      })

      it('calculate output when input is 100 USDC', () => {
        const tokenAmount = new TokenAmount(USDC, convertToWei('100', USDC.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), DAI.decimals)).toBeCloseTo(
          100,
          0,
        )
        expect(
          convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals),
        ).toBeCloseTo(99900, 0)
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toEqual(100100)
      })
    })

    describe('100000 DAI, 150000 USDC, 0.3% Fee Pair', () => {
      const pair = new Pair(
        TEST_ADDRESS,
        new TokenAmount(DAI, convertToWei('100000', DAI.decimals)),
        new TokenAmount(USDC, convertToWei('150000', USDC.decimals)),
        0.3,
        'Uniswap V2',
      )

      it('calculate output when input is 100 DAI', () => {
        const tokenAmount = new TokenAmount(DAI, convertToWei('100', DAI.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), USDC.decimals)).toBeCloseTo(
          149,
          0,
        )
        expect(convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals)).toEqual(
          100100,
        )
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toBeCloseTo(149851, 0)
      })

      it('calculate output when input is 10 USDC', () => {
        const tokenAmount = new TokenAmount(USDC, convertToWei('100', USDC.decimals))
        const [outputAmount, newPair] = pair.getOutputAmount(tokenAmount)

        expect(convertFloatFromWei(outputAmount.amount.toString(), DAI.decimals)).toBeCloseTo(66, 0)
        expect(
          convertFloatFromWei(newPair.reserveOf(DAI).amount.toString(), DAI.decimals),
        ).toBeCloseTo(99934, 0)
        expect(
          convertFloatFromWei(newPair.reserveOf(USDC).amount.toString(), USDC.decimals),
        ).toEqual(150100)
      })
    })

    describe('Insufficient Reserves Error', () => {
      it('Error when DAI reserve is 0', () => {
        const pair = new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 0),
          new TokenAmount(USDC, 300),
          1,
          'Uniswap V2',
        )
        const tokenAmount = new TokenAmount(DAI, 10)
        expect(() => pair.getInputAmount(tokenAmount)).toThrow('InsufficientReserves')
      })

      it('Error when USDC reserve is 0', () => {
        const pair = new Pair(
          TEST_ADDRESS,
          new TokenAmount(DAI, 100),
          new TokenAmount(USDC, 0),
          1,
          'Uniswap V2',
        )
        const tokenAmount = new TokenAmount(DAI, 10)
        expect(() => pair.getInputAmount(tokenAmount)).toThrow('InsufficientReserves')
      })
    })
  })
})
