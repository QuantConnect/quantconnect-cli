# QuantConnect CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Build Status](https://dev.azure.com/jmerle/quantconnect-cli/_apis/build/status/Build?branchName=master)](https://dev.azure.com/jmerle/quantconnect-cli/_build/latest?definitionId=26&branchName=master)
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
* [`qcli api:get ENDPOINT`](#qcli-apiget-endpoint)
* [`qcli api:post ENDPOINT`](#qcli-apipost-endpoint)
* [`qcli backtests:list`](#qcli-backtestslist)
* [`qcli backtests:new`](#qcli-backtestsnew)
* [`qcli backtests:report`](#qcli-backtestsreport)
* [`qcli backtests:results`](#qcli-backtestsresults)
* [`qcli help [COMMAND]`](#qcli-help-command)
* [`qcli init`](#qcli-init)
* [`qcli projects:compile`](#qcli-projectscompile)
* [`qcli projects:delete`](#qcli-projectsdelete)
* [`qcli projects:list`](#qcli-projectslist)
* [`qcli sync:pull`](#qcli-syncpull)
* [`qcli sync:push`](#qcli-syncpush)
* [`qcli sync:watch`](#qcli-syncwatch)

## `qcli api:get ENDPOINT`

make an authenticated GET request to the QuantConnect API

```
USAGE
  $ qcli api:get ENDPOINT

ARGUMENTS
  ENDPOINT  API endpoint to send the request to

OPTIONS
  -h, --help     display usage information
  -v, --version  display version information

EXAMPLE
  $ qcli api:get authenticate
  {
     "success": true
  }
```

_See code: [src/commands/api/get.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/api/get.ts)_

## `qcli api:post ENDPOINT`

make an authenticated POST request to the QuantConnect API

```
USAGE
  $ qcli api:post ENDPOINT

ARGUMENTS
  ENDPOINT  API endpoint to send the request to

OPTIONS
  -b, --body=body  JSON string containing the data to use as body of the request
  -h, --help       display usage information
  -v, --version    display version information

EXAMPLE
  $ qcli api:post files/create --body '{ "projectId": 1234567, "name": "Empty.cs", "content": "// Empty file" }'
  {
     "files": [
       {
         "id": 1234567,
         "uid": 12345,
         "pid": 1234567,
         "fpid": 0,
         "sname": "Empty.cs",
         "scontent": "// Empty file",
         "dtcreated": "2020-01-01 00:00:00",
         "dtmodified": "2020-01-01 00:00:00",
         "estatus": "Active",
         "etype": "File",
         "bopen": 0
       }
     ],
     "success": true
  }
```

_See code: [src/commands/api/post.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/api/post.ts)_

## `qcli backtests:list`

list all backtest ran for a project

```
USAGE
  $ qcli backtests:list

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
```

_See code: [src/commands/backtests/list.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/backtests/list.ts)_

## `qcli backtests:new`

run a backtest for a project

```
USAGE
  $ qcli backtests:new

OPTIONS
  -h, --help             display usage information
  -n, --name=name        name of the backtest (optional, a random one is generated if not specified)
  -o, --open             open the backtest results in the browser when done
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
```

_See code: [src/commands/backtests/new.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/backtests/new.ts)_

## `qcli backtests:report`

download the report of a given backtest

```
USAGE
  $ qcli backtests:report

OPTIONS
  -b, --backtest=backtest  backtest id or name (optional, interactive selector opens if not specified)
  -h, --help               display usage information
  -p, --project=project    project id or name (optional, interactive selector opens if not specified)
  -v, --version            display version information
  --open                   open the report in the browser when done
  --overwrite              overwrite the file if it already exists
  --path=path              path to save report to (optional, backtest name is used if not specified)
```

_See code: [src/commands/backtests/report.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/backtests/report.ts)_

## `qcli backtests:results`

show the results of a given backtest

```
USAGE
  $ qcli backtests:results

OPTIONS
  -b, --backtest=backtest  backtest id or name (optional, interactive selector opens if not specified)
  -h, --help               display usage information
  -o, --open               open the backtest results in the browser
  -p, --project=project    project id or name (optional, interactive selector opens if not specified)
  -v, --version            display version information
```

_See code: [src/commands/backtests/results.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/backtests/results.ts)_

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
  -h, --help     display usage information
  -v, --version  display version information
```

_See code: [src/commands/init.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/init.ts)_

## `qcli projects:compile`

compile a project

```
USAGE
  $ qcli projects:compile

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
```

_See code: [src/commands/projects/compile.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/projects/compile.ts)_

## `qcli projects:delete`

delete a project

```
USAGE
  $ qcli projects:delete

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
```

_See code: [src/commands/projects/delete.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/projects/delete.ts)_

## `qcli projects:list`

list all projects

```
USAGE
  $ qcli projects:list

OPTIONS
  -h, --help     display usage information
  -v, --version  display version information
```

_See code: [src/commands/projects/list.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/projects/list.ts)_

## `qcli sync:pull`

pull all files from QuantConnect to the current directory

```
USAGE
  $ qcli sync:pull

OPTIONS
  -h, --help     display usage information
  -v, --version  display version information
```

_See code: [src/commands/sync/pull.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/sync/pull.ts)_

## `qcli sync:push`

push locally updated files to QuantConnect

```
USAGE
  $ qcli sync:push

OPTIONS
  -h, --help     display usage information
  -v, --version  display version information
```

_See code: [src/commands/sync/push.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/sync/push.ts)_

## `qcli sync:watch`

watch for local file changes and push them to QuantConnect

```
USAGE
  $ qcli sync:watch

OPTIONS
  -h, --help     display usage information
  -v, --version  display version information
```

_See code: [src/commands/sync/watch.ts](https://github.com/jmerle/quantconnect-cli/blob/master/src/commands/sync/watch.ts)_
<!-- commandsstop -->
