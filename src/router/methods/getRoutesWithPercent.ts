import invariant from 'tiny-invariant'
import { BigIntish, Route, TokenAmount, TradeType } from '../../core'
import { RouteWithPercent } from '../entities'

export function getRoutesWithPercent(
  routes: Route[],
  amount: BigIntish,
  distributePercent: number,
  tradeType: TradeType,
) {
  invariant(100 > distributePercent && distributePercent > 0, 'Distribute Percent is invalid')
  invariant(routes.length > 0, 'There must be at least one route')

  const baseToken = new TokenAmount(routes[0].input, amount)
  const percents = Array.from({ length: 100 / distributePercent }).map(
    (_, index) => (index + 1) * distributePercent,
  )

  return routes.reduce<{
    [percent: number]: RouteWithPercent[]
  }>((result, route) => {
    const routeWithPercent = percents.reduce<(RouteWithPercent | null)[]>((result, percent) => {
      const amount = baseToken.multiply(percent).divide(100).amount
      const routeWithPercent = new RouteWithPercent(route, percent, amount, tradeType)

      return [...result, routeWithPercent]
    }, [])

    routeWithPercent.forEach((routeWithPercent, index) => {
      const percent = percents[index]

      // routeWithPercent 값이 null 일 수 있기 떄문에 result[percent]와 routeWithPercent가 null이 아닌 경우를 먼저 체크
      if (result[percent] && routeWithPercent) result[percent].push(routeWithPercent)
      else {
        if (!result[percent]) result[percent] = []
        if (routeWithPercent) result[percent] = [...result[percent], routeWithPercent]
      }
    })

    return result
  }, {})
}
