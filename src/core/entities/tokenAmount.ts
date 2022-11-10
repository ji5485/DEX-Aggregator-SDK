import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import { BigIntish, MaxUint256 } from '../constants'
import { Token } from './token'

export class TokenAmount {
  public readonly token: Token
  public readonly amount: JSBI

  public constructor(token: Token, amount: BigIntish) {
    invariant(
      JSBI.lessThanOrEqual(JSBI.BigInt(amount), MaxUint256),
      'amount must be under the max integer',
    )

    this.token = token
    this.amount = JSBI.BigInt(amount)
  }

  public add(value: BigIntish): TokenAmount {
    return new TokenAmount(this.token, JSBI.add(this.amount, JSBI.BigInt(value)))
  }

  public subtract(value: BigIntish): TokenAmount {
    return new TokenAmount(this.token, JSBI.subtract(this.amount, JSBI.BigInt(value)))
  }

  public multiply(value: BigIntish): TokenAmount {
    return new TokenAmount(this.token, JSBI.multiply(this.amount, JSBI.BigInt(value)))
  }

  public divide(value: BigIntish): TokenAmount {
    if (
      (typeof value === 'number' || typeof value === 'string') &&
      Math.floor(Number(value)) !== Number(value)
    ) {
      const [integer, decimal] = value.toString().split('.')

      return new TokenAmount(
        this.token,
        JSBI.divide(
          JSBI.multiply(
            JSBI.multiply(this.amount, JSBI.BigInt(Number(integer) || 1)),
            JSBI.BigInt(decimal),
          ),
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimal.length)),
        ),
      )
    }

    return new TokenAmount(this.token, JSBI.divide(this.amount, JSBI.BigInt(value)))
  }
}
