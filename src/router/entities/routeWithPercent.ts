import JSBI from 'jsbi'
import { BigIntish, Route, TradeType } from '../../core'

export class RouteWithPercent {
  public readonly route: Route
  public readonly percent: number
  public readonly amount: JSBI | null

  constructor(route: Route, percent: number, amount: BigIntish, tradeType: TradeType) {
    this.route = route
    this.percent = percent
    this.amount = route.getExpectedSwapAmount(amount, tradeType)
  }
}
