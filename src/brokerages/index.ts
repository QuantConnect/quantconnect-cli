import { BaseBrokerage } from './BaseBrokerage';
import { PaperTradingBrokerage } from './PaperTradingBrokerage';
import { InteractiveBrokersBrokerage } from './InteractiveBrokersBrokerage';
import { FXCMBrokerage } from './FXCMBrokerage';
import { BitfinexBrokerage } from './BitfinexBrokerage';
import { CoinbaseProBrokerage } from './CoinbaseProBrokerage';
import { AlpacaBrokerage } from './AlpacaBrokerage';

export const brokerages: BaseBrokerage[] = [
  new PaperTradingBrokerage(),
  new InteractiveBrokersBrokerage(),
  new FXCMBrokerage(),
  new BitfinexBrokerage(),
  new CoinbaseProBrokerage(),
  new AlpacaBrokerage(),
];
