import * as chalk from 'chalk';
import { table } from 'table';
import * as open from 'open';
import { logger } from './logger';

// Name generation logic is based on https://github.com/QuantConnect/Lean/blob/master/VisualStudioPlugin/BacktestNameProvider.cs

// prettier-ignore
const verbs = [
  'Determined', 'Pensive', 'Adaptable', 'Calculating', 'Logical',
  'Energetic', 'Creative', 'Smooth', 'Calm', 'Hyper-Active',
  'Measured', 'Fat', 'Emotional', 'Crying', 'Jumping',
  'Swimming', 'Crawling', 'Dancing', 'Focused', 'Well Dressed',
  'Retrospective', 'Hipster', 'Square', 'Upgraded', 'Ugly',
  'Casual', 'Formal', 'Geeky', 'Virtual', 'Muscular',
  'Alert', 'Sleepy',
];

// prettier-ignore
const colors = [
  'Red', 'Red-Orange', 'Orange', 'Yellow', 'Tan', 'Yellow-Green',
  'Yellow-Green', 'Fluorescent Orange', 'Apricot', 'Green',
  'Fluorescent Pink', 'Sky Blue', 'Fluorescent Yellow', 'Asparagus',
  'Blue', 'Violet', 'Light Brown', 'Brown', 'Magenta', 'Black',
];

// prettier-ignore
const animals = [
  'Horse', 'Zebra', 'Whale', 'Tapir', 'Barracuda', 'Cow', 'Cat',
  'Wolf', 'Hamster', 'Monkey', 'Pelican', 'Snake', 'Albatross',
  'Viper', 'Guanaco', 'Anguilline', 'Badger', 'Dogfish', 'Duck',
  'Butterfly', 'Gaur', 'Rat', 'Termite', 'Eagle', 'Dinosaur',
  'Pig', 'Seahorse', 'Hornet', 'Koala', 'Hippopotamus',
  'Cormorant', 'Jackal', 'Rhinoceros', 'Panda', 'Elephant',
  'Penguin', 'Beaver', 'Hyena', 'Parrot', 'Crocodile', 'Baboon',
  'Pony', 'Chinchilla', 'Fox', 'Lion', 'Mosquito', 'Cobra', 'Mule',
  'Coyote', 'Alligator', 'Pigeon', 'Antelope', 'Goat', 'Falcon',
  'Owlet', 'Llama', 'Gull', 'Chicken', 'Caterpillar', 'Giraffe',
  'Rabbit', 'Flamingo', 'Caribou', 'Goshawk', 'Galago', 'Bee',
  'Jellyfish', 'Buffalo', 'Salmon', 'Bison', 'Dolphin', 'Jaguar',
  'Dog', 'Armadillo', 'Gorilla', 'Alpaca', 'Kangaroo', 'Dragonfly',
  'Salamander', 'Owl', 'Bat', 'Sheep', 'Frog', 'Chimpanzee',
  'Bull', 'Scorpion', 'Lemur', 'Camel', 'Leopard', 'Fish', 'Donkey',
  'Manatee', 'Shark', 'Bear', 'kitten', 'Fly', 'Ant', 'Sardine',
];

export function generateBacktestName(): string {
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${verb} ${color} ${animal}`;
}

function addStatistic(rows: any[][], statistic: string, value: string): void {
  if (rows[rows.length - 1].length === 4) {
    rows.push([statistic, value]);
  } else {
    rows[rows.length - 1].push(statistic, value);
  }
}

function createStatisticsTable(backtest: QCBacktest): string {
  const rows: any[][] = [['Statistic', 'Value', 'Statistic', 'Value']];

  for (const key of Object.keys(backtest.result.RuntimeStatistics)) {
    let value = backtest.result.RuntimeStatistics[key];

    if (value.includes('-')) {
      value = chalk.red(value);
    } else if (/([1-9])/.test(value)) {
      value = chalk.green(value);
    }

    addStatistic(rows, key, value);
  }

  const splitIndex = rows.length;

  for (const key of Object.keys(backtest.result.Statistics)) {
    const value = backtest.result.Statistics[key];
    addStatistic(rows, key, value);
  }

  if (rows[rows.length - 1].length !== 4) {
    addStatistic(rows, '', '');
  }

  const options = {
    drawHorizontalLine: (index: number, size: number): boolean => {
      return index === 0 || index === 1 || index === splitIndex || index === size;
    },
  };

  return table(rows, options);
}

export async function logBacktestInformation(
  project: QCProject,
  backtest: QCBacktest,
  openInBrowser: boolean,
): Promise<void> {
  const url = `https://www.quantconnect.com/terminal/#open/${project.projectId}/${backtest.backtestId}`;

  if (backtest.result !== null) {
    logger.info(createStatisticsTable(backtest));
  }

  logger.info(`Backtest id: ${backtest.backtestId}`);
  logger.info(`Backtest name: ${backtest.name}`);
  logger.info(`Backtest url: ${url}`);

  if (backtest.error !== null) {
    logger.error('An error occurred during this backtest:');
    logger.error(backtest.stacktrace);
  }

  if (openInBrowser) {
    await open(url);
  }
}
