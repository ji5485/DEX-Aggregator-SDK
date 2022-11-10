import invariant from 'tiny-invariant'
import { Hop } from './hop'
import { Route } from './route'
import { Token } from './token'

type GraphType = { [address: string]: Hop[] }

export class TokenGraph {
  public readonly graph: GraphType

  public constructor(hops: Hop[]) {
    invariant(hops.length > 0, 'Pair does not exist')

    // 인접 리스트 방식으로 토큰 그래프 데이터 생성
    this.graph = hops.reduce<GraphType>((graph, hop) => {
      // token0
      if (graph[hop.token0.address]) graph[hop.token0.address].push(hop)
      else graph[hop.token0.address] = [hop]

      // token1
      if (graph[hop.token1.address]) graph[hop.token1.address].push(hop)
      else graph[hop.token1.address] = [hop]

      return graph
    }, {})
  }

  public computeAllPaths(
    tokenIn: Token,
    tokenOut: Token,
    maxHops: number,
    maxCount: number = 5,
  ): Route[] {
    const routes: Route[] = []
    const visited: { [address: string]: boolean } = Object.keys(this.graph).reduce(
      (map, address) => Object.assign(map, { [address]: false }),
      {},
    )

    const findPathsWithDFS = (start: Token, end: Token, currentHops: Hop[]) => {
      if (currentHops.length > maxHops) return

      if (start.equals(end)) {
        routes.push(new Route(tokenIn, tokenOut, currentHops))
        return
      }

      visited[start.address] = true

      this.graph[start.address].forEach(hop => {
        const nextStart = hop.token0.equals(start) ? hop.token1 : hop.token0

        if (!visited[nextStart.address]) {
          findPathsWithDFS(nextStart, end, [...currentHops, hop])
          visited[nextStart.address] = false
        }
      })
    }

    findPathsWithDFS(tokenIn, tokenOut, [])

    return routes
      .sort((routeA, routeB) => routeA.hops.length - routeB.hops.length)
      .slice(0, maxCount)
  }
}
