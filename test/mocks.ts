import { Token, TokenAmount, Pair } from '../src'
import { convertToWei } from '../src/core/utils'

// Address
export const TEST_ADDRESS = '0x111111111117dC0aa78b770fA6A738034120C302'

// Token
export const USDC = new Token('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC')
export const DAI = new Token('0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI')
export const WETH = new Token('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH')
export const USDT = new Token('0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT')
export const WBTC = new Token('0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC')

/*
  Pair List
  ------------------
  DAI - USDC
  DAI - WETH
  DAI - USDT
  DAI - WBTC
  USDT - WETH
  USDT - WBTC
  USDC - WBTC
  USDC - USDT
  WBTC - WETH
*/

// DAI - USDC Pair
export const DAI_USDC_1 = new Pair(
  '0x00004EE988665Cdda9A1080d5792cecD16Dc1220',
  new TokenAmount(DAI, convertToWei('100000', DAI.decimals)),
  new TokenAmount(USDC, convertToWei('100000', USDC.decimals)),
  0.3,
  'Uniswap V2',
)
export const DAI_USDC_2 = new Pair(
  '0x0000871C95bb027c90089f4926fD1BA82Cdd9a8B',
  new TokenAmount(DAI, convertToWei('10050', DAI.decimals)),
  new TokenAmount(USDC, convertToWei('10000', USDC.decimals)),
  0.01,
  'Sushiswap',
)
export const DAI_USDC_3 = new Pair(
  '0x00030110a7053083a7a160449A0E8F1aDCe9438D',
  new TokenAmount(DAI, convertToWei('51000', DAI.decimals)),
  new TokenAmount(USDC, convertToWei('50000', USDC.decimals)),
  0.05,
  'Curve V2',
)
export const DAI_USDC_4 = new Pair(
  '0x00031554Ee74E4a6d497677e5152d94c3dBE5f46',
  new TokenAmount(DAI, convertToWei('68000', DAI.decimals)),
  new TokenAmount(USDC, convertToWei('70000', USDC.decimals)),
  1,
  'Hashflow',
)

// DAI - WETH Pair
export const DAI_WETH_1 = new Pair(
  '0x0003713F74bC8C3435F4499eB0Cbc6298cD1529d',
  new TokenAmount(DAI, convertToWei('100000', DAI.decimals)),
  new TokenAmount(WETH, convertToWei('52', WETH.decimals)),
  0.3,
  'Uniswap V2',
)
export const DAI_WETH_2 = new Pair(
  '0x00048cf1ACdB5Fa81A0fAcf869eF60C3F49bfE36',
  new TokenAmount(DAI, convertToWei('80000', DAI.decimals)),
  new TokenAmount(WETH, convertToWei('42', WETH.decimals)),
  0.01,
  'Sushiswap',
)
export const DAI_WETH_3 = new Pair(
  '0x0004ecC9FDb2dAc546a215ABeB7ce73439F96cd1',
  new TokenAmount(DAI, convertToWei('75560', DAI.decimals)),
  new TokenAmount(WETH, convertToWei('40', WETH.decimals)),
  0.05,
  'Curve V2',
)
export const DAI_WETH_4 = new Pair(
  '0x0005eE2Ef3F313aE168451ef8174b4fCC508819F',
  new TokenAmount(DAI, convertToWei('51000', DAI.decimals)),
  new TokenAmount(WETH, convertToWei('27', WETH.decimals)),
  1,
  'Hashflow',
)

// DAI - USDT Pair
export const DAI_USDT_1 = new Pair(
  '0x000C5c3905733Ad4aBE97Bd7c52170d9dDf116ee',
  new TokenAmount(DAI, convertToWei('100000', DAI.decimals)),
  new TokenAmount(USDT, convertToWei('100000', USDT.decimals)),
  0.05,
  'Uniswap V2',
)
export const DAI_USDT_2 = new Pair(
  '0x000D6Bc79e6D73Bdd2099942f3Fd4B87F8e3c33c',
  new TokenAmount(DAI, convertToWei('78000', DAI.decimals)),
  new TokenAmount(USDT, convertToWei('77500', USDT.decimals)),
  0.01,
  'Sushiswap',
)
export const DAI_USDT_3 = new Pair(
  '0x000dd0B1528A396c6ea2E09796A7b4a534e9e37b',
  new TokenAmount(DAI, convertToWei('60000', DAI.decimals)),
  new TokenAmount(USDT, convertToWei('61000', USDT.decimals)),
  1,
  'Curve V2',
)
export const DAI_USDT_4 = new Pair(
  '0x0010B1d178614e65C877Fc5ff8C1B469c2CDbB14',
  new TokenAmount(DAI, convertToWei('53000', DAI.decimals)),
  new TokenAmount(USDT, convertToWei('52500', USDT.decimals)),
  0.3,
  'Hashflow',
)

// DAI - USDT Pair
export const DAI_WBTC_1 = new Pair(
  '0x002d5d2e048c98926ab0dae5ea7445fc3091e4c4',
  new TokenAmount(DAI, convertToWei('110000', DAI.decimals)),
  new TokenAmount(WBTC, convertToWei('5.4', WBTC.decimals)),
  1,
  'Uniswap V2',
)
export const DAI_WBTC_2 = new Pair(
  '0x002df45a71347ce68e10a0eb328a1e6bbc9d79f7',
  new TokenAmount(DAI, convertToWei('81000', DAI.decimals)),
  new TokenAmount(WBTC, convertToWei('4', WBTC.decimals)),
  0.3,
  'Sushiswap',
)
export const DAI_WBTC_3 = new Pair(
  '0x002e351cfc8474e7a84d54f1127fddd0a769f353',
  new TokenAmount(DAI, convertToWei('73000', DAI.decimals)),
  new TokenAmount(WBTC, convertToWei('3.6', WBTC.decimals)),
  0.05,
  'Curve V2',
)
export const DAI_WBTC_4 = new Pair(
  '0x002e5aa23751eca86ec1ce516c6ac67983464125',
  new TokenAmount(DAI, convertToWei('59000', DAI.decimals)),
  new TokenAmount(WBTC, convertToWei('2.9', WBTC.decimals)),
  0.01,
  'Hashflow',
)

// USDT - WETH Pair
export const USDT_WETH_1 = new Pair(
  '0x0006BC3e52137a1873d7D8Cd779A7E138Bb7E929',
  new TokenAmount(USDT, convertToWei('61000', USDT.decimals)),
  new TokenAmount(WETH, convertToWei('32', WETH.decimals)),
  0.01,
  'Uniswap V2',
)
export const USDT_WETH_2 = new Pair(
  '0x000A7f585C99791e49fA75FdbFbC8588A1F6fFc8',
  new TokenAmount(USDT, convertToWei('106880', USDT.decimals)),
  new TokenAmount(WETH, convertToWei('56', WETH.decimals)),
  0.05,
  'Sushiswap',
)
export const USDT_WETH_3 = new Pair(
  '0x000bC4F31D2c8DCC66F6F1c93bB00920e3Ea6c5D',
  new TokenAmount(USDT, convertToWei('76310', USDT.decimals)),
  new TokenAmount(WETH, convertToWei('40', WETH.decimals)),
  1,
  'Curve V2',
)
export const USDT_WETH_4 = new Pair(
  '0x000C5583ec00B076c41292484b3A24c3416583F0',
  new TokenAmount(USDT, convertToWei('74400', USDT.decimals)),
  new TokenAmount(WETH, convertToWei('39', WETH.decimals)),
  0.3,
  'Hashflow',
)

// USDT - WBTC Pair
export const USDT_WBTC_1 = new Pair(
  '0x00169B1Dd92b039A94d33f65c31BF1c297657A72',
  new TokenAmount(USDT, convertToWei('287000', USDT.decimals)),
  new TokenAmount(WBTC, convertToWei('12', WBTC.decimals)),
  0.3,
  'Uniswap V2',
)
export const USDT_WBTC_2 = new Pair(
  '0x0016E7ef098CE56339296292DA92AE1b7228D433',
  new TokenAmount(USDT, convertToWei('230000', USDT.decimals)),
  new TokenAmount(WBTC, convertToWei('9.7', WBTC.decimals)),
  1,
  'Sushiswap',
)
export const USDT_WBTC_3 = new Pair(
  '0x0017AF076efb1C1BC4f03AB7722F060310F3056B',
  new TokenAmount(USDT, convertToWei('192000', USDT.decimals)),
  new TokenAmount(WBTC, convertToWei('8', WBTC.decimals)),
  0.01,
  'Curve V2',
)
export const USDT_WBTC_4 = new Pair(
  '0x001dA7940d6ef6466c6d4A89B75C969Dc89b80eE',
  new TokenAmount(USDT, convertToWei('130000', USDT.decimals)),
  new TokenAmount(WBTC, convertToWei('5.7', WBTC.decimals)),
  0.05,
  'Hashflow',
)

// USDC - WBTC Pair
export const USDC_WBTC_1 = new Pair(
  '0x0012aB271B58299c90B597fad5cC45E30450105C',
  new TokenAmount(USDC, convertToWei('240000', USDC.decimals)),
  new TokenAmount(WBTC, convertToWei('10', WBTC.decimals)),
  0.3,
  'Uniswap V2',
)
export const USDC_WBTC_2 = new Pair(
  '0x00146b23e4861B00f6C242C25FBCBC72f5DBAe69',
  new TokenAmount(USDC, convertToWei('180000', USDC.decimals)),
  new TokenAmount(WBTC, convertToWei('7.6', WBTC.decimals)),
  1,
  'Sushiswap',
)
export const USDC_WBTC_3 = new Pair(
  '0x00153b7C47163A2C2FabD9EB44745678F709800d',
  new TokenAmount(USDC, convertToWei('136000', USDC.decimals)),
  new TokenAmount(WBTC, convertToWei('5.6', WBTC.decimals)),
  0.01,
  'Curve V2',
)
export const USDC_WBTC_4 = new Pair(
  '0x001631Be213Ed129110990E31667cD954970243f',
  new TokenAmount(USDC, convertToWei('100000', USDC.decimals)),
  new TokenAmount(WBTC, convertToWei('4.3', WBTC.decimals)),
  0.05,
  'Hashflow',
)

// USDC - USDT Pair
export const USDC_USDT_1 = new Pair(
  '0x002588d4948E32abA991E8dF8D4de9aaA48E928b',
  new TokenAmount(USDC, convertToWei('100000', USDC.decimals)),
  new TokenAmount(USDT, convertToWei('100000', USDT.decimals)),
  0.05,
  'Uniswap V2',
)
export const USDC_USDT_2 = new Pair(
  '0x00271d6E6004FC6322B2bf6b56bd3972Cf3Ea280',
  new TokenAmount(USDC, convertToWei('78000', USDC.decimals)),
  new TokenAmount(USDT, convertToWei('77500', USDT.decimals)),
  0.01,
  'Sushiswap',
)
export const USDC_USDT_3 = new Pair(
  '0x0027d3D8E3404f3b6018Ae59e969308EF6a7A04A',
  new TokenAmount(USDC, convertToWei('60000', USDC.decimals)),
  new TokenAmount(USDT, convertToWei('61000', USDT.decimals)),
  1,
  'Curve V2',
)
export const USDC_USDT_4 = new Pair(
  '0x00291E2f1839Ba80CCdbC1C0E45245946908E0C4',
  new TokenAmount(USDC, convertToWei('53000', USDC.decimals)),
  new TokenAmount(USDT, convertToWei('52500', USDT.decimals)),
  0.3,
  'Hashflow',
)

// WETH - WBTC Pair
export const WETH_WBTC_1 = new Pair(
  '0x00293eea1aa65e5b56c08d32f542b8135ec4150b',
  new TokenAmount(WETH, convertToWei('138.8', WETH.decimals)),
  new TokenAmount(WBTC, convertToWei('11', WBTC.decimals)),
  0.01,
  'Uniswap V2',
)
export const WETH_WBTC_2 = new Pair(
  '0x0029c2d413b34e99f0b528d3f6b5462fc0819fb8',
  new TokenAmount(WETH, convertToWei('103.4', WETH.decimals)),
  new TokenAmount(WBTC, convertToWei('8.2', WBTC.decimals)),
  0.3,
  'Sushiswap',
)
export const WETH_WBTC_3 = new Pair(
  '0x002a201afd448b8a95e33db5a86e4edb93566e75',
  new TokenAmount(WETH, convertToWei('74.4', WETH.decimals)),
  new TokenAmount(WBTC, convertToWei('5.9', WBTC.decimals)),
  1,
  'Curve V2',
)
export const WETH_WBTC_4 = new Pair(
  '0x002b931ef0edc4bf61cfa47e82d85fe3a6a31197',
  new TokenAmount(WETH, convertToWei('60.5', WETH.decimals)),
  new TokenAmount(WBTC, convertToWei('4.8', WBTC.decimals)),
  0.05,
  'Hashflow',
)
