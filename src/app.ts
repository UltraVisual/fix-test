import { Launcher } from '../launcher'
import { SkeletonSession } from './skeleton-session'
import { initiator, IJsFixConfig, acceptor, IJsFixLogger } from 'jspurefix';
import logger from './utils/logger';

class AppLauncher extends Launcher {
  public constructor () {
    super(
      'data/session/test-initiator.json',
      'data/session/test-acceptor.json');
  }

  protected getAcceptor (config: IJsFixConfig): Promise<any> {
    return acceptor(config, c => new SkeletonSession(c))
  }

  protected getInitiator (config: IJsFixConfig): Promise<any> {
    return initiator(config, c => new SkeletonSession(c))
  }
}

const launcher = new AppLauncher();

launcher.run().then(() => {
  console.log('finished.');
});