import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { BigIntish, TradeType } from '../constants'
import { Hop } from './hop'
import { Token } from './token'
import { TokenAmount } from './tokenAmount'

export class Route {
  public readonly hops: Hop[]
  public readonly path: Token[]
  public readonly input: Token
  public readonly output: Token

  public constructor(input: Token, output: Token, hops: Hop[]) {
    invariant(hops.length > 0, 'Hop does not exist')
    invariant(
      hops[0].pair.every(pair => pair.involvesToken(input)),
      'Does not start with input token',
    )
    invariant(
      hops[hops.length - 1].pair.every(pair => pair.involvesToken(output)),
      'Does not end with output token',
    )

    // Route Parameter Check
    if (hops.length > 1)
      hops.forEach((hop, index) => {
        invariant(hop.pair.length > 0, 'Pair does not exist')

        // Input Token Existance Check
        invariant(
          hop.pair.every(pair => {
            return (
              index === 0 ||
              pair.involvesToken(hops[index - 1].token0) ||
              pair.involvesToken(hops[index - 1].token1)
            )
          }),
          'Pair does not connected',
        )

        // Output Token Existance Check
        invariant(
          hop.pair.every(pair => {
            return (
              index === hops.length - 1 ||
              pair.involvesToken(hops[index + 1].token0) ||
              pair.involvesToken(hops[index + 1].token1)
            )
          }),
          'Pair does not connected',
        )
      })

    const path = hops.reduce(
      (path, hop) => {
        invariant(hop.pair.length > 0, 'Does not exist pairs in hop')
        invariant(
          hop.pair.every(pair => pair.involvesToken(path[path.length - 1])),
          'Token does not exist',
        )
        const output = path[path.length - 1].equals(hop.pair[0].token0)
          ? hop.pair[0].token1
          : hop.pair[0].token0
        return [...path, output]
      },
      [input],
    )

    this.hops = hops
    this.path = path
    this.input = input
    this.output = output
  }

  public get midPrice(): number {
    return this.hops.reduce((price, hop, index) => {
      const hopMidPrice =
        hop.pair.reduce<number>(
          (midPriceInHop, pair) => midPriceInHop + pair.priceOf(this.path[index]),
          0,
        ) / hop.pair.length

      return price * hopMidPrice
    }, 1)
  }

  public getExpectedSwapAmount(amount: BigIntish, tradeType: TradeType): JSBI | null {
    return this.hops.reduce<JSBI | null>((value, hop, index) => {
      if (value === null) return null

      const result = hop.getOptimizedResult(new TokenAmount(this.path[index], value), tradeType)
      return result ?? null
    }, JSBI.BigInt(amount))
  }
}
