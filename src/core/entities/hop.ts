import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { convertFromWei } from '../utils'
import { TradeType } from '../constants'
import { Pair } from './pair'
import { Token } from './token'
import { TokenAmount } from './tokenAmount'

type OptimizedHop = { pair: Pair; percent: number }

export class Hop {
  private readonly tokens: [Token, Token]
  private pairs: Pair[]

  public constructor(token0: Token, token1: Token, pairs: Pair[]) {
    invariant(
      pairs.every(pair => pair.involvesToken(token0) && pair.involvesToken(token1)),
      'Token does not exist in pair',
    )

    this.tokens = token0.sortsBefore(token1) ? [token0, token1] : [token1, token0]
    this.pairs = pairs
  }

  public get token0(): Token {
    return this.tokens[0]
  }

  public get token1(): Token {
    return this.tokens[1]
  }

  public get pair(): Pair[] {
    return this.pairs
  }

  public addPair(pair: Pair | Pair[]): void {
    if (Array.isArray(pair)) {
      invariant(
        pair.every(pair => pair.involvesToken(this.token0) && pair.involvesToken(this.token1)),
        'Token does not exist in pair',
      )
      this.pairs = [...this.pairs, ...(pair as Pair[])]
    } else {
      invariant(
        pair.involvesToken(this.token0) && pair.involvesToken(this.token1),
        'Token does not exist in pair',
      )
      this.pairs = [...this.pairs, pair]
    }
  }

  public getOptimizedHop(input: TokenAmount, tradeType: TradeType): OptimizedHop[] {
    invariant(
      this.token0.equals(input.token) || this.token1.equals(input.token),
      'Token does not exist',
    )
    invariant(this.pairs.length > 0, 'There must be at least one pair')

    const baseToken = input.token
    const orderedPairs = this.pairs.sort((pairA, pairB) =>
      JSBI.toNumber(pairB.reserveOf(baseToken).subtract(pairA.reserveOf(baseToken).amount).amount),
    )
    const criteria = JSBI.multiply(input.amount, JSBI.BigInt(300))

    // 스왑할 토큰 수량의 300배 이상을 가진 페어에 대해 스왑 결과 계산
    if (JSBI.greaterThanOrEqual(orderedPairs[0].reserveOf(baseToken).amount, criteria)) {
      const filteredPairs = orderedPairs
        .filter(pair => JSBI.greaterThanOrEqual(pair.reserveOf(baseToken).amount, criteria))
        .map(pair => ({
          pair,
          result:
            tradeType === TradeType.EXACT_IN
              ? pair.getOutputAmount(input)[0].amount
              : pair.getInputAmount(input)[0].amount,
        }))
        .sort((pairA, pairB) =>
          JSBI.toNumber(
            tradeType === TradeType.EXACT_IN
              ? JSBI.subtract(pairB.result, pairA.result)
              : JSBI.subtract(pairA.result, pairB.result),
          ),
        )

      return [{ pair: filteredPairs[0].pair, percent: 1 }]
    }

    // 그 외의 경우에는 스왑할 토큰 수량의 500배가 될 때까지 유동성이 많은 순서대로 페어를 계속 추가
    const filteredPairs = this.pairs.reduce<Pair[]>((list, pair) => {
      const sumOfReserve = list.reduce<JSBI>(
        (result, selectedPair) => selectedPair.reserveOf(baseToken).add(result).amount,
        JSBI.BigInt(0),
      )

      if (JSBI.greaterThanOrEqual(sumOfReserve, input.multiply(300).amount)) return list
      else return [...list, pair]
    }, [])

    // 각 페어의 비율을 구하기 위해 전체 Reserve 합 계산
    const totalReserve = filteredPairs.reduce(
      (sum, pair) => pair.reserveOf(baseToken).add(sum).amount,
      JSBI.BigInt(0),
    )
    const convertedTotalReserve = parseFloat(
      convertFromWei(totalReserve.toString(), baseToken.decimals),
    )

    // 각 페어별 비율 계산
    const percentEachPairs = filteredPairs
      .map<OptimizedHop>(pair => {
        const convertedAmount = parseFloat(
          convertFromWei(pair.reserveOf(baseToken).amount.toString(), baseToken.decimals),
        )
        const percent = Math.round((convertedAmount / convertedTotalReserve) * 100) / 100

        return { pair, percent }
      })
      .filter(pairWithPercent => pairWithPercent.percent !== 0)

    return percentEachPairs
  }

  public getOptimizedResult(input: TokenAmount, tradeType: TradeType) {
    try {
      const hops = this.getOptimizedHop(input, tradeType)

      return hops.reduce((result, { pair, percent }) => {
        const funcByTradeType =
          tradeType === TradeType.EXACT_IN
            ? pair.getOutputAmount.bind(pair)
            : pair.getInputAmount.bind(pair)

        return JSBI.add(funcByTradeType(input.divide(percent))[0].amount, result)
      }, JSBI.BigInt(0))
    } catch {
      return null
    }
  }

  public static convertHopsFromPairs(pairs: Pair[]): Hop[] {
    invariant(pairs.length > 0, 'Pair does not exist')

    const hopsWithKey: { [address: string]: Hop } = {}

    for (let index = 0; index < pairs.length; index++) {
      const pair = pairs[index]
      const key = `${pair.token0.address}-${pair.token1.address}`

      if (!hopsWithKey[key]) hopsWithKey[key] = new Hop(pair.token0, pair.token1, [pair])
      else hopsWithKey[key].addPair(pair)
    }

    return Object.values(hopsWithKey)
  }
}
