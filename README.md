# QuantConnect CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Build Status](https://dev.azure.com/jmerle/quantconnect-cli/_apis/build/status/Build?branchName=master)](https://dev.azure.com/jmerle/quantconnect-cli/_build/latest?definitionId=8&branchName=master)
[![Version](https://img.shields.io/npm/v/quantconnect-cli.svg)](https://npmjs.org/package/quantconnect-cli)
[![License](https://img.shields.io/npm/l/quantconnect-cli.svg)](https://github.com/jmerle/quantconnect-cli/blob/master/LICENSE)

A CLI aimed at making local development of QuantConnect algorithms easier. It supports syncing projects between your local drive and QuantConnect and makes it easy to run backtests from the terminal.

**This project is a work-in-progress at the moment. Not all features are implemented yet and links may not work yet. PR's are not accepted at this time.**

# Install

```
$ npm install --global quantconnect-cli
# or
$ yarn global add quantconnect-cli
```

# Usage

TBD.

# Commands

<!-- commands -->
* [`qcli hello [FILE]`](#qcli-hello-file)
* [`qcli help [COMMAND]`](#qcli-help-command)

## `qcli hello [FILE]`

describe the command here

```
USAGE
  $ qcli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ qcli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/hello.ts)_

## `qcli help [COMMAND]`

display help for qcli

```
USAGE
  $ qcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
