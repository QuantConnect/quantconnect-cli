# Contributing

Thank you for your interest! Contributions are very welcome.

## Getting Started

This project uses
- [oclif](https://oclif.io/) as CLI framework
- [Yarn](https://yarnpkg.com/) as package manager
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to check for and automatically fix code style issues
- [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) to create a pre-commit hook which automatically fixes code style issues in changed files on commit

Before doing anything else, clone (or fork and clone) this repository, `cd` into it and run `yarn` to install all dependencies.

After installing all dependencies, it's time to get to work. The following commands can be useful (run with `yarn <command>`):
- `build`: build the code in `src/` to `lib/`
- `lint`: lint the code using ESLint and Prettier
- `fix`: auto-fix code style issues using ESLint and Prettier

To test changes, run `./bin/run`. Make sure you have ran `yarn build` at least one before doing so, because the `./bin/run` script depends on the logger to have been built so it can log errors properly.
