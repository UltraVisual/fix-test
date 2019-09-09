import { JsFixWinstonLogFactory, WinstonLogger, IJsFixLogger } from "jspurefix";

export const logFactory = new JsFixWinstonLogFactory(WinstonLogger.consoleOptions('info'));

export default (context: string): IJsFixLogger => logFactory.logger(context) as IJsFixLogger;
