`qcli backtests`
================

manage backtests

* [`qcli backtests:list`](#qcli-backtestslist)
* [`qcli backtests:new`](#qcli-backtestsnew)
* [`qcli backtests:report`](#qcli-backtestsreport)
* [`qcli backtests:results`](#qcli-backtestsresults)

## `qcli backtests:list`

list all backtest for a project

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
