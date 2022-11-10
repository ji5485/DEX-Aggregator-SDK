import JSBI from 'jsbi'

export type BigIntish = JSBI | string | number
export type PairFeeType = 0.01 | 0.05 | 0.3 | 1

export enum TradeType {
  EXACT_IN = 'from',
  EXACT_OUT = 'to',
}

export const _0 = JSBI.BigInt(0)
export const _1 = JSBI.BigInt(1)
export const _10000 = JSBI.BigInt(10000)
export const MaxUint256 = JSBI.BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)
