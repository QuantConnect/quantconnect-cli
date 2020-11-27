import { AlpacaBrokerage } from './AlpacaBrokerage';
import { BaseBrokerage } from './BaseBrokerage';
import { BitfinexBrokerage } from './BitfinexBrokerage';
import { CoinbaseProBrokerage } from './CoinbaseProBrokerage';
import { FXCMBrokerage } from './FXCMBrokerage';
import { InteractiveBrokersBrokerage } from './InteractiveBrokersBrokerage';
import { PaperTradingBrokerage } from './PaperTradingBrokerage';

export const brokerages: BaseBrokerage[] = [
  new PaperTradingBrokerage(),
  new InteractiveBrokersBrokerage(),
  new FXCMBrokerage(),
  new BitfinexBrokerage(),
  new CoinbaseProBrokerage(),
  new AlpacaBrokerage(),
];
