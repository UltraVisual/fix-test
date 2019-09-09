import { AsciiSession, IJsFixLogger, IJsFixConfig, MsgView, MsgType } from "jspurefix";
import { ILooseObject } from "jspurefix/dist/collections/collection";
import { ITradeCaptureReportRequest, TradeRequestType, SubscriptionRequestType } from 'jspurefix/dist/types/FIX4.4/repo'

export class SkeletonSession extends AsciiSession {
  private readonly logger: IJsFixLogger
  private readonly fixLog: IJsFixLogger
  constructor (public readonly config: IJsFixConfig,
               public readonly logoutSeconds: number = 45) {
    super(config)
    this.logReceivedMsgs = true
    this.fixLog = config.logFactory.plain(`logs/jsfix.${config.description.application.name}.txt`)
    this.logger = config.logFactory.logger(`${this.me}`)

    this.logger.info('skeleton here');

    setTimeout(() => {
      const message:ILooseObject = {
        title: 'yourmum'
      };

      this.logger.info('sending message');
      const tcr = {
        TradeRequestID: 'all-trades',
        TradeRequestType: TradeRequestType.AllTrades,
        SubscriptionRequestType: SubscriptionRequestType.SnapshotAndUpdates,
        TrdCapDtGrp: [
          {
            TradeDate: new Date()
          }
        ]
      }
      this.send(MsgType.Quote, tcr);
    }, 3000);
  }

  protected onApplicationMsg (msgType: string, view: MsgView): void {
    // dispatch messages
    switch (msgType) {
      default: {
        this.logger.info(`received message type ${msgType}`)
        break
      }
    }
  }

  // use msgType for example to persist only trade capture messages to database
  protected onDecoded (msgType: string, txt: string): void {
    this.fixLog.info(txt)
  }

  // no delimiter substitution on transmit messages
  protected onEncoded (msgType: string, txt: string): void {
    this.fixLog.info(AsciiSession.asPiped(txt))
  }

  protected onLogon (view: MsgView, user: string, password: string): boolean {
    this.logger.info(`peer logs in user ${user}`);

    return true
  }

  protected onReady (view: MsgView): void {
    this.logger.info('onReady')
    const logoutSeconds = this.logoutSeconds
    const t = this.config.description.application.type
    switch (t) {
      case 'initiator': {
        this.logger.info(`will logout after ${logoutSeconds}`)
        setTimeout(() => {
          this.done()
        }, logoutSeconds * 1000)
        break
      }

      case 'acceptor': {
        this.logger.info(`acceptor is ready for requests`)
        break
      }

      default: {
        this.logger.warning(`unknown type ${t}`)
        break
      }
    }
  }

  protected onStopped (): void {
    this.logger.info('stopped')
  }
}