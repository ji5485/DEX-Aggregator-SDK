import { TokenGraph, Hop } from '../../src'
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
  USDT_WETH_4,
  DAI_USDT_1,
  DAI_USDT_2,
  DAI_USDT_3,
  DAI_USDT_4,
  USDC_WBTC_1,
  USDC_WBTC_2,
  USDC_WBTC_3,
  USDC_WBTC_4,
  USDT_WBTC_1,
  USDT_WBTC_2,
  USDT_WBTC_3,
  USDT_WBTC_4,
} from '../mocks'

describe('TokenGraph', () => {
  const DAI_USDC_PAIRS = [DAI_USDC_1, DAI_USDC_2, DAI_USDC_3, DAI_USDC_4]
  const DAI_WETH_PAIRS = [DAI_WETH_1, DAI_WETH_2, DAI_WETH_3, DAI_WETH_4]
  const USDT_WETH_PAIRS = [USDT_WETH_1, USDT_WETH_2, USDT_WETH_3, USDT_WETH_4]
  const DAI_USDT_PAIRS = [DAI_USDT_1, DAI_USDT_2, DAI_USDT_3, DAI_USDT_4]
  const USDC_WBTC_PAIRS = [USDC_WBTC_1, USDC_WBTC_2, USDC_WBTC_3, USDC_WBTC_4]
  const USDT_WBTC_PAIRS = [USDT_WBTC_1, USDT_WBTC_2, USDT_WBTC_3, USDT_WBTC_4]

  const DAI_USDC_HOP = new Hop(DAI, USDC, DAI_USDC_PAIRS)
  const DAI_WETH_HOP = new Hop(DAI, WETH, DAI_WETH_PAIRS)
  const USDT_WETH_HOP = new Hop(USDT, WETH, USDT_WETH_PAIRS)
  const DAI_USDT_HOP = new Hop(DAI, USDT, DAI_USDT_PAIRS)
  const USDC_WBTC_HOP = new Hop(USDC, WBTC, USDC_WBTC_PAIRS)
  const USDT_WBTC_HOP = new Hop(USDT, WBTC, USDT_WBTC_PAIRS)

  describe('constructor', () => {
    it('success creating graph from hops', () => {
      const hops = Hop.convertHopsFromPairs([
        ...DAI_USDC_PAIRS,
        ...DAI_WETH_PAIRS,
        ...USDT_WETH_PAIRS,
      ])
      const graph = new TokenGraph(hops)

      expect(graph.graph).toStrictEqual(
        [DAI, USDC, WETH, USDT].reduce(
          (graph, token) =>
            Object.assign(graph, {
              [token.address]: hops.filter(
                hop => token.equals(hop.token0) || token.equals(hop.token1),
              ),
            }),
          {},
        ),
      )
    })

    it('failure with empty hops', () => {
      expect(() => new TokenGraph([])).toThrow('Pair does not exist')
    })
  })

  describe('#computeAllPaths', () => {
    describe('find path in a single route (DAI-USDC, DAI-WETH, USDT-WETH)', () => {
      const hops = Hop.convertHopsFromPairs([
        ...DAI_USDC_PAIRS,
        ...DAI_WETH_PAIRS,
        ...USDT_WETH_PAIRS,
      ])
      const graph = new TokenGraph(hops)

      it('find DAI to WETH path', () => {
        const routes = graph.computeAllPaths(DAI, WETH, 3)

        expect(routes.length).toEqual(1)

        expect(routes[0].input).toEqual(DAI)
        expect(routes[0].output).toEqual(WETH)
        expect(routes[0].hops).toEqual([expect.objectContaining(DAI_WETH_HOP)])
        expect(routes[0].path).toEqual([DAI, WETH])
      })

      it('find USDT to DAI path', () => {
        const routes = graph.computeAllPaths(USDT, DAI, 3)

        expect(routes.length).toEqual(1)

        expect(routes[0].input).toEqual(USDT)
        expect(routes[0].output).toEqual(DAI)
        expect(routes[0].hops).toEqual([
          expect.objectContaining(USDT_WETH_HOP),
          expect.objectContaining(DAI_WETH_HOP),
        ])
        expect(routes[0].path).toEqual([USDT, WETH, DAI])
      })

      it('find USDC to USDT path', () => {
        const routes = graph.computeAllPaths(USDC, USDT, 3)

        expect(routes.length).toEqual(1)

        expect(routes[0].input).toEqual(USDC)
        expect(routes[0].output).toEqual(USDT)
        expect(routes[0].hops).toEqual([
          expect.objectContaining(DAI_USDC_HOP),
          expect.objectContaining(DAI_WETH_HOP),
          expect.objectContaining(USDT_WETH_HOP),
        ])
        expect(routes[0].path).toEqual([USDC, DAI, WETH, USDT])
      })
    })

    describe('find path in a single route (DAI-USDC, DAI-USDT, USDT-WBTC, USDC-WBTC)', () => {
      const hops = Hop.convertHopsFromPairs([
        ...DAI_USDC_PAIRS,
        ...DAI_USDT_PAIRS,
        ...USDT_WBTC_PAIRS,
        ...USDC_WBTC_PAIRS,
      ])
      const graph = new TokenGraph(hops)

      it('find USDT to DAI path', () => {
        const routes = graph.computeAllPaths(USDT, DAI, 3)

        expect(routes.length).toEqual(2)

        expect(routes[0].input).toEqual(USDT)
        expect(routes[0].output).toEqual(DAI)
        expect(routes[0].hops).toEqual([expect.objectContaining(DAI_USDT_HOP)])
        expect(routes[0].path).toEqual([USDT, DAI])

        expect(routes[1].input).toEqual(USDT)
        expect(routes[1].output).toEqual(DAI)
        expect(routes[1].hops).toEqual([
          expect.objectContaining(USDT_WBTC_HOP),
          expect.objectContaining(USDC_WBTC_HOP),
          expect.objectContaining(DAI_USDC_HOP),
        ])
        expect(routes[1].path).toEqual([USDT, WBTC, USDC, DAI])
      })

      it('find DAI to WBTC path', () => {
        const routes = graph.computeAllPaths(DAI, WBTC, 3)

        expect(routes.length).toEqual(2)

        expect(routes[0].input).toEqual(DAI)
        expect(routes[0].output).toEqual(WBTC)
        expect(routes[0].hops).toEqual([
          expect.objectContaining(DAI_USDC_HOP),
          expect.objectContaining(USDC_WBTC_HOP),
        ])
        expect(routes[0].path).toEqual([DAI, USDC, WBTC])

        expect(routes[1].input).toEqual(DAI)
        expect(routes[1].output).toEqual(WBTC)
        expect(routes[1].hops).toEqual([
          expect.objectContaining(DAI_USDT_HOP),
          expect.objectContaining(USDT_WBTC_HOP),
        ])
        expect(routes[1].path).toEqual([DAI, USDT, WBTC])
      })
    })

    describe('find path in multiple routes', () => {
      const hops = Hop.convertHopsFromPairs([
        ...DAI_USDC_PAIRS,
        ...DAI_WETH_PAIRS,
        ...USDT_WETH_PAIRS,
        ...DAI_USDT_PAIRS,
        ...USDC_WBTC_PAIRS,
        ...USDT_WBTC_PAIRS,
      ])
      const graph = new TokenGraph(hops)

      it('find USDT to DAI path', () => {
        const routes = graph.computeAllPaths(USDT, DAI, 3)

        expect(routes.length).toEqual(3)

        expect(routes[0].input).toEqual(USDT)
        expect(routes[0].output).toEqual(DAI)
        expect(routes[0].hops).toEqual([expect.objectContaining(DAI_USDT_HOP)])
        expect(routes[0].path).toEqual([USDT, DAI])

        expect(routes[1].input).toEqual(USDT)
        expect(routes[1].output).toEqual(DAI)
        expect(routes[1].hops).toEqual([
          expect.objectContaining(USDT_WETH_HOP),
          expect.objectContaining(DAI_WETH_HOP),
        ])
        expect(routes[1].path).toEqual([USDT, WETH, DAI])

        expect(routes[2].input).toEqual(USDT)
        expect(routes[2].output).toEqual(DAI)
        expect(routes[2].hops).toEqual([
          expect.objectContaining(USDT_WBTC_HOP),
          expect.objectContaining(USDC_WBTC_HOP),
          expect.objectContaining(DAI_USDC_HOP),
        ])
        expect(routes[2].path).toEqual([USDT, WBTC, USDC, DAI])
      })

      it('find USDC to USDT path', () => {
        const routes = graph.computeAllPaths(USDC, USDT, 3)

        expect(routes.length).toEqual(3)

        expect(routes[0].input).toEqual(USDC)
        expect(routes[0].output).toEqual(USDT)
        expect(routes[0].hops).toEqual([
          expect.objectContaining(DAI_USDC_HOP),
          expect.objectContaining(DAI_USDT_HOP),
        ])
        expect(routes[0].path).toEqual([USDC, DAI, USDT])

        expect(routes[1].input).toEqual(USDC)
        expect(routes[1].output).toEqual(USDT)
        expect(routes[1].hops).toEqual([
          expect.objectContaining(USDC_WBTC_HOP),
          expect.objectContaining(USDT_WBTC_HOP),
        ])
        expect(routes[1].path).toEqual([USDC, WBTC, USDT])

        expect(routes[2].input).toEqual(USDC)
        expect(routes[2].output).toEqual(USDT)
        expect(routes[2].hops).toEqual([
          expect.objectContaining(DAI_USDC_HOP),
          expect.objectContaining(DAI_WETH_HOP),
          expect.objectContaining(USDT_WETH_HOP),
        ])
        expect(routes[2].path).toEqual([USDC, DAI, WETH, USDT])
      })

      it('find DAI to WETH path', () => {
        const routes = graph.computeAllPaths(DAI, WETH, 3)

        expect(routes.length).toEqual(2)

        expect(routes[0].input).toEqual(DAI)
        expect(routes[0].output).toEqual(WETH)
        expect(routes[0].hops).toEqual([expect.objectContaining(DAI_WETH_HOP)])
        expect(routes[0].path).toEqual([DAI, WETH])

        expect(routes[1].input).toEqual(DAI)
        expect(routes[1].output).toEqual(WETH)
        expect(routes[1].hops).toEqual([
          expect.objectContaining(DAI_USDT_HOP),
          expect.objectContaining(USDT_WETH_HOP),
        ])
        expect(routes[1].path).toEqual([DAI, USDT, WETH])
      })
    })
  })
})
