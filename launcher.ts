import { FixAcceptor, FixInitiator, IJsFixConfig, makeConfig, SessionMsgFactory, IJsFixLogger } from 'jspurefix';
import * as path from 'path';
import logger, { logFactory } from './src/utils/logger';

export abstract class Launcher {
  protected logger: IJsFixLogger;

  protected constructor (public readonly initiatorConfig: string, public readonly acceptorConfig: string) {
    this.logger = logger('launcher');
  }

  protected abstract getInitiator (config: IJsFixConfig): Promise<FixInitiator>
  protected abstract getAcceptor (config: IJsFixConfig): Promise<FixAcceptor>

  public run () {
    return new Promise<any>((accept, reject) => {
      const {logger} = this;
      logger.info('launching ..')
      this.setup().then(() => {
        logger.info('.. done')
        accept()
      }).catch((e: Error) => {
        logger.error(e)
        reject(e)
      })
    })
  }

  private async createInitiator() {
    const clientDescription = require(path.join(__dirname, this.initiatorConfig));
    const clientConfig = await makeConfig(clientDescription, logFactory, new SessionMsgFactory(clientDescription))

    this.logger.info('create initiator');

    return this.getInitiator(clientConfig);
  }

  private async createAcceptor() {
    const serverDescription = require(path.join(__dirname, this.acceptorConfig))
    const serverConfig = await makeConfig(serverDescription, logFactory, new SessionMsgFactory(serverDescription))

    this.logger.info('create acceptor');

    return this.getAcceptor(serverConfig)
  }

  private async setup () {
    this.logger.info('launching ..')

    const client = this.createInitiator();

    this.logger.info('launching ....')
    return Promise.all([client])
  }
}