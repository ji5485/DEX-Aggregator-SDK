import { BaseProvider } from '@ethersproject/providers'

export class PlexusRouter {
  private provider: BaseProvider

  constructor(provider: BaseProvider) {
    this.provider = provider
  }

  public async route() {}

  public async currentBlockNumber() {
    return await this.provider.getBlockNumber()
  }
}
