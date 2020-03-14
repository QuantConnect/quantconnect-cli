# QuantConnect CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Build Status](https://dev.azure.com/jmerle/quantconnect-cli/_apis/build/status/Build?branchName=master)](https://dev.azure.com/jmerle/quantconnect-cli/_build/latest?definitionId=25&branchName=master)
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
* [`qcli backtests:list`](#qcli-backtestslist)
* [`qcli backtests:new`](#qcli-backtestsnew)
* [`qcli backtests:report`](#qcli-backtestsreport)
* [`qcli backtests:show`](#qcli-backtestsshow)
* [`qcli help [COMMAND]`](#qcli-help-command)
* [`qcli init`](#qcli-init)
* [`qcli projects:compile`](#qcli-projectscompile)
* [`qcli projects:delete`](#qcli-projectsdelete)
* [`qcli projects:list`](#qcli-projectslist)
* [`qcli projects:new`](#qcli-projectsnew)
* [`qcli sync:pull`](#qcli-syncpull)
* [`qcli sync:push`](#qcli-syncpush)
* [`qcli sync:watch`](#qcli-syncwatch)

## `qcli backtests:list`

list all backtest ran for a project

```
USAGE
  $ qcli backtests:list

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/backtests/list.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/backtests/list.ts)_

## `qcli backtests:new`

run a backtest for a project

```
USAGE
  $ qcli backtests:new

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/backtests/new.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/backtests/new.ts)_

## `qcli backtests:report`

download the report of a given backtest

```
USAGE
  $ qcli backtests:report

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/backtests/report.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/backtests/report.ts)_

## `qcli backtests:show`

show results of a given backtest

```
USAGE
  $ qcli backtests:show

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/backtests/show.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/backtests/show.ts)_

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

## `qcli init`

create a new QuantConnect CLI project

```
USAGE
  $ qcli init

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/init.ts)_

## `qcli projects:compile`

compile a project

```
USAGE
  $ qcli projects:compile

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/projects/compile.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/projects/compile.ts)_

## `qcli projects:delete`

delete a project

```
USAGE
  $ qcli projects:delete

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/projects/delete.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/projects/delete.ts)_

## `qcli projects:list`

list all projects and libraries

```
USAGE
  $ qcli projects:list

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/projects/list.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/projects/list.ts)_

## `qcli projects:new`

create a new project

```
USAGE
  $ qcli projects:new

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/projects/new.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/projects/new.ts)_

## `qcli sync:pull`

pull all files from QuantConnect to the current directory

```
USAGE
  $ qcli sync:pull

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/sync/pull.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/sync/pull.ts)_

## `qcli sync:push`

push locally updated files to QuantConnect

```
USAGE
  $ qcli sync:push

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/sync/push.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/sync/push.ts)_

## `qcli sync:watch`

watch for local file changes and push them to QuantConnect

```
USAGE
  $ qcli sync:watch

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/sync/watch.ts](https://github.com/jmerle/quantconnect-cli/blob/v0.0.0/src/commands/sync/watch.ts)_
<!-- commandsstop -->
