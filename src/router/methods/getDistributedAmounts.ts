import invariant from 'tiny-invariant'
import { BigIntish, Token, TokenAmount } from '../../core'

type DistributedAmountsType = {
  percents: number[]
  amounts: TokenAmount[]
}

export function getDistributedAmounts(
  baseToken: Token,
  amount: BigIntish,
  distributePercent: number,
) {
  invariant(100 > distributePercent && distributePercent > 0, 'Distribute Percent is invalid')

  const original = new TokenAmount(baseToken, amount)

  return Array.from({ length: 100 / distributePercent }).reduce<DistributedAmountsType>(
    (result, _, index: number) => {
      const percent = distributePercent * (index + 1)

      result.percents.push(percent)
      result.amounts.push(original.multiply(percent).divide(100))

      return result
    },
    {
      percents: [],
      amounts: [],
    },
  )
}
