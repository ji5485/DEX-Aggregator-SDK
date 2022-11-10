import JSBI from 'jsbi'
import BigNumber from 'bignumber.js'
import invariant from 'tiny-invariant'
import { PairFeeType, _0, _1, _10000 } from '../constants'
import { Token } from './token'
import { TokenAmount } from './tokenAmount'
import { convertFromWei } from '../utils'

export class Pair {
  public readonly address: string
  private tokenAmounts: TokenAmount[]
  private readonly fee: PairFeeType
  public readonly protocol: string

  public constructor(
    address: string,
    tokenAmountA: TokenAmount,
    tokenAmountB: TokenAmount,
    fee: PairFeeType,
    protocol: string,
  ) {
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token)
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]

    this.tokenAmounts = tokenAmounts
    this.address = address
    this.fee = fee
    this.protocol = protocol
  }

  public get token0(): Token {
    return this.tokenAmounts[0].token
  }

  public get token1(): Token {
    return this.tokenAmounts[1].token
  }

  public get reserve0(): TokenAmount {
    return this.tokenAmounts[0]
  }

  public get reserve1(): TokenAmount {
    return this.tokenAmounts[1]
  }

  // reserve1 / reserve0
  public get token0Price(): number {
    invariant(JSBI.greaterThan(this.tokenAmounts[0].amount, _0), 'Denominator must be non-zero')

    const [token0, token1] = this.tokenAmounts
    return BigNumber(convertFromWei(token1.amount.toString(), token1.token.decimals))
      .div(BigNumber(convertFromWei(token0.amount.toString(), token0.token.decimals)))
      .toNumber()
  }

  // reserve0 / reserve1
  public get token1Price(): number {
    invariant(JSBI.greaterThan(this.tokenAmounts[1].amount, _0), 'Denominator must be non-zero')

    const [token0, token1] = this.tokenAmounts
    return BigNumber(convertFromWei(token0.amount.toString(), token0.token.decimals))
      .div(BigNumber(convertFromWei(token1.amount.toString(), token1.token.decimals)))
      .toNumber()
  }

  public setTokenAmounts(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount) {
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token)
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]

    invariant(
      this.token0.equals(tokenAmounts[0].token) && this.token1.equals(tokenAmounts[1].token),
      'Tokens are different',
    )

    this.tokenAmounts = tokenAmounts
  }

  public reserveOf(token: Token): TokenAmount {
    invariant(this.involvesToken(token), 'Token does not exist')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public priceOf(token: Token): number {
    invariant(this.involvesToken(token), 'Token does not exist')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  public getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(inputAmount.token), 'Token does not exist')

    if (JSBI.equal(this.reserve0.amount, _0) || JSBI.equal(this.reserve1.amount, _0))
      throw new Error('InsufficientReserves')

    const inputReserve = this.reserveOf(inputAmount.token)
    const outputReserve = this.reserveOf(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
    )

    const fee = JSBI.BigInt(10000 - this.fee * 100)
    const inputAmountWithFee = JSBI.multiply(inputAmount.amount, fee)

    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.amount)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.amount, _10000), inputAmountWithFee)

    const outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator),
    )

    if (JSBI.equal(outputAmount.amount, _0)) throw new Error('InsufficientInputAmount')

    return [
      outputAmount,
      new Pair(
        this.address,
        inputReserve.add(inputAmount.amount),
        outputReserve.subtract(outputAmount.amount),
        this.fee,
        this.protocol,
      ),
    ]
  }

  public getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(outputAmount.token), 'Token does not exist')

    if (
      JSBI.equal(this.reserve0.amount, _0) ||
      JSBI.equal(this.reserve1.amount, _0) ||
      JSBI.greaterThanOrEqual(outputAmount.amount, this.reserveOf(outputAmount.token).amount)
    )
      throw new Error('InsufficientReserves')

    const outputReserve = this.reserveOf(outputAmount.token)
    const inputReserve = this.reserveOf(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
    )
    const fee = JSBI.BigInt(10000 - this.fee * 100)

    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.amount, outputAmount.amount), _10000)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.amount, outputAmount.amount), fee)

    const inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), _1),
    )

    return [
      inputAmount,
      new Pair(
        this.address,
        inputReserve.add(inputAmount.amount),
        outputReserve.subtract(outputAmount.amount),
        this.fee,
        this.protocol,
      ),
    ]
  }
}
