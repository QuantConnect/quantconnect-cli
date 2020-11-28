import * as chalk from 'chalk';
import * as open from 'open';
import { table } from 'table';
import { formatString } from './format';
import { logger } from './logger';

// Name generation logic is based on https://github.com/QuantConnect/Lean/blob/5034c28c2efb4691a148b2c4a59f1c7ceb5f3b7e/VisualStudioPlugin/BacktestNameProvider.cs

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

export function getBacktestUrl(project: QCProject, backtest: QCBacktest): string {
  return `https://www.quantconnect.com/terminal/#open/${project.projectId}/${backtest.backtestId}`;
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

  for (const key of Object.keys(backtest.runtimeStatistics)) {
    let value = backtest.runtimeStatistics[key];

    if (value.includes('-')) {
      value = chalk.red(value);
    } else if (/([1-9])/.test(value)) {
      value = chalk.green(value);
    }

    addStatistic(rows, key, value);
  }

  const splitIndex = rows.length;

  for (const key of Object.keys(backtest.statistics)) {
    const value = backtest.statistics[key];
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
  const url = getBacktestUrl(project, backtest);

  if (backtest.result !== null) {
    logger.info(createStatisticsTable(backtest));
  }

  logger.info(`Backtest id: ${backtest.backtestId}`);
  logger.info(`Backtest name: ${backtest.name}`);
  logger.info(`Backtest url: ${url}`);

  if (backtest.error !== null) {
    const error = formatString(backtest.stacktrace || backtest.error);

    logger.error('An error occurred during this backtest:');
    logger.error(error);

    // Don't open the results in the browser if the error happened during initialization
    // In the browser the logs won't show these errors, you'll just get empty charts and empty logs
    if (error.startsWith('During the algorithm initialization, the following exception has occurred:')) {
      return;
    }
  }

  if (openInBrowser) {
    await open(url);
  }
}
