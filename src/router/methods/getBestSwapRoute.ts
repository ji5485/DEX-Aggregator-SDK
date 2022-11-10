import Queue from 'mnemonist/queue'
import JSBI from 'jsbi'
import { flatMap, intersection, map } from 'lodash'
import { Route, TradeType } from '../../core'
import { RouteWithPercent } from '../entities'

type RoutesByPercentType = {
  [percent: number]: RouteWithPercent[]
}

function findNotUsedRoute(curRoutes: RouteWithPercent[], selectableRoutes: RouteWithPercent[]) {
  // token0-token1 키로 이루어진 배열
  const usedHop = flatMap(curRoutes, ({ route }) =>
    map(route.hops, hop => `${hop.token0.address}-${hop.token1.address}`),
  )

  for (const selectableRoute of selectableRoutes) {
    const hopKey = map(
      selectableRoute.route.hops,
      hop => `${hop.token0.address}-${hop.token1.address}`,
    )

    if (intersection(usedHop, hopKey).length !== 0) continue
    else return selectableRoute
  }

  return null
}

function compareAmount(amount: JSBI, bestAmount: JSBI, tradeType: TradeType) {
  return tradeType === TradeType.EXACT_IN
    ? JSBI.greaterThan(amount, bestAmount)
    : JSBI.lessThan(amount, bestAmount)
}

export function getBestSwapRoute(routesByPercent: RoutesByPercentType, tradeType: TradeType) {
  // 각 퍼센트 별 예상 스왑 수량 내림차순으로 정렬
  const sortedRoutesByPercent = Object.entries(routesByPercent).reduce<RoutesByPercentType>(
    (percentMap, [percent, routes]) => {
      percentMap[parseFloat(percent)] = routes.sort((routeA, routeB) => {
        if (!routeA.amount || !routeB.amount) return 0

        if (tradeType === TradeType.EXACT_IN)
          return JSBI.greaterThan(routeA.amount, routeB.amount) ? -1 : 1
        else return JSBI.lessThan(routeA.amount, routeB.amount) ? -1 : 1
      })

      return percentMap
    },
    [],
  )

  // BFS 알고리즘을 위한 Queue 및 최대값을 받기 위한 변수 세팅
  const queue = new Queue<{
    percentIndex: number
    curRoutes: RouteWithPercent[]
    remainingPercent: number
  }>()

  let bestRoute: RouteWithPercent[] | undefined
  let bestAmount: JSBI | undefined

  // 경로 분할이 필요 없는 경우 먼저 초기값으로 선택
  if (sortedRoutesByPercent[100][0] && sortedRoutesByPercent[100][0].amount) {
    bestRoute = [sortedRoutesByPercent[100][0]]
    bestAmount = sortedRoutesByPercent[100][0].amount
  }

  // BFS 알고리즘 실행을 위한 Queue 초기 세팅
  const percents = Object.keys(routesByPercent).sort(
    (percentA, percentB) => parseFloat(percentA) - parseFloat(percentB),
  )

  for (let index = percents.length - 1; index >= 0; index--) {
    const percent = parseFloat(percents[index])

    if (percent === 100) continue

    if (sortedRoutesByPercent[percent][0])
      queue.enqueue({
        percentIndex: index,
        curRoutes: [sortedRoutesByPercent[percent][0]],
        remainingPercent: 100 - percent,
      })

    if (sortedRoutesByPercent[percent][1])
      queue.enqueue({
        percentIndex: index,
        curRoutes: [sortedRoutesByPercent[percent][1]],
        remainingPercent: 100 - percent,
      })
  }

  // BFS 알고리즘 코드
  while (queue.size > 0) {
    const { percentIndex, curRoutes, remainingPercent } = queue.dequeue()!

    for (let index = percentIndex; index >= 0; index--) {
      const percent = parseFloat(percents[index])

      // 남은 퍼센트 값이 현재 선택된 퍼센트보다 작거나 선택된 퍼센트에 대한 Routes 값이 존재하지 않으면 패스
      if (percent > remainingPercent || !sortedRoutesByPercent[percent]) continue

      const selectedRoute = findNotUsedRoute(curRoutes, sortedRoutesByPercent[percent])

      // 사용 가능한 Route가 없으면 패스
      if (!selectedRoute) continue

      const newRemainingPercent = remainingPercent - percent
      const newCurRoutes = [...curRoutes, selectedRoute]

      // 선택된 Route를 추가했을 때 남은 퍼센트가 0인 경우
      if (newRemainingPercent === 0) {
        const expectedAmount = newCurRoutes.reduce<JSBI | null>((amount, route) => {
          if (!route.amount || !amount) return null
          return JSBI.add(amount, route.amount)
        }, JSBI.BigInt(0))

        if (
          expectedAmount &&
          (!bestAmount || compareAmount(expectedAmount, bestAmount, tradeType))
        ) {
          bestRoute = newCurRoutes
          bestAmount = expectedAmount
        }
      } else
        queue.enqueue({
          percentIndex: index,
          curRoutes: newCurRoutes,
          remainingPercent: newRemainingPercent,
        })
    }
  }

  if (!bestRoute || !bestAmount) return null

  return {
    amount: bestAmount,
    route: bestRoute,
  }
}
