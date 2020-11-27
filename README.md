# QuantConnect CLI

[![Build Status](https://github.com/QuantConnect/quantconnect-cli/workflows/Build/badge.svg)](https://github.com/QuantConnect/quantconnect-cli/actions?query=workflow%3ABuild)
[![Version](https://img.shields.io/npm/v/quantconnect-cli.svg)](https://npmjs.org/package/quantconnect-cli)
[![License](https://img.shields.io/npm/l/quantconnect-cli.svg)](https://github.com/QuantConnect/quantconnect-cli/blob/master/LICENSE)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

QuantConnect CLI is a CLI aimed at making local development of QuantConnect algorithms easier. It makes it easy to synchronize projects between your local drive and the QuantConnect cloud and supports running cloud backtests from the terminal.

![](./media/backtest.png)

# Install

```
$ npm install --global quantconnect-cli
# or
$ yarn global add quantconnect-cli
```

After installing using the instructions above, simply `cd` into an empty directory and run `qcli init` to set-up a QuantConnect CLI project.

# Usage

A workflow with QuantConnect CLI may look like this:
1. `cd` into the QuantConnect CLI project.
2. Run `qcli files:pull` to pull remotely changed files.
3. Run `qcli files:watch` to start watching for file changes which will be pushed to QuantConnect when they happen.
4. Open a new terminal and `cd` into the QuantConnect CLI project again (keep `qcli files:watch` running in the other terminal).
5. Start programming and run backtests with `qcli backtests:new --open` whenever there is something to backtest. The `--open` flag means that the backtest results will be opened in the browser when done. Additionally, you can specify the project id or name with `--project <project id or name>` if you don't want the interactive selector to open every time.

Whenever you create a new algorithm or Alpha Stream via the web interface or with the `qcli projects:new` command, quit the `qcli files:watch` command, run `qcli files:pull` and start `qcli files:watch` again.

`qcli files:pull`, `qcli files:push` and `qcli files:watch` all accept a `--project` flag to only pull/push/watch a single project. The value of this flag can be either the id of the project or its name.

# Commands

<!-- commands -->
* [`qcli api:get ENDPOINT`](#qcli-apiget-endpoint)
* [`qcli api:post ENDPOINT`](#qcli-apipost-endpoint)
* [`qcli backtests:list`](#qcli-backtestslist)
* [`qcli backtests:new`](#qcli-backtestsnew)
* [`qcli backtests:report`](#qcli-backtestsreport)
* [`qcli backtests:results`](#qcli-backtestsresults)
* [`qcli backtests:update`](#qcli-backtestsupdate)
* [`qcli files:pull`](#qcli-filespull)
* [`qcli files:push`](#qcli-filespush)
* [`qcli files:watch`](#qcli-fileswatch)
* [`qcli help [COMMAND]`](#qcli-help-command)
* [`qcli init`](#qcli-init)
* [`qcli live:list`](#qcli-livelist)
* [`qcli live:stop`](#qcli-livestop)
* [`qcli nodes:delete`](#qcli-nodesdelete)
* [`qcli nodes:list`](#qcli-nodeslist)
* [`qcli nodes:stop`](#qcli-nodesstop)
* [`qcli nodes:update`](#qcli-nodesupdate)
* [`qcli projects:compile`](#qcli-projectscompile)
* [`qcli projects:delete`](#qcli-projectsdelete)
* [`qcli projects:info`](#qcli-projectsinfo)
* [`qcli projects:list`](#qcli-projectslist)
* [`qcli projects:new PATH`](#qcli-projectsnew-path)

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
  --verbose      display API requests as they happen

EXAMPLE
  $ qcli api:get authenticate
  {
     "success": true
  }
```

_See code: [src/commands/api/get.ts](src/commands/api/get.ts)_

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
  --verbose        display API requests as they happen

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

_See code: [src/commands/api/post.ts](src/commands/api/post.ts)_

## `qcli backtests:list`

list all backtests for a project

```
USAGE
  $ qcli backtests:list

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
  --verbose              display API requests as they happen
```

_See code: [src/commands/backtests/list.ts](src/commands/backtests/list.ts)_

## `qcli backtests:new`

launch a backtest for a project

```
USAGE
  $ qcli backtests:new

OPTIONS
  -h, --help             display usage information
  -n, --name=name        name of the backtest (optional, a random one is generated if not specified)
  -o, --open             open the backtest results in the browser when done
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
  --verbose              display API requests as they happen
```

_See code: [src/commands/backtests/new.ts](src/commands/backtests/new.ts)_

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
  --verbose                display API requests as they happen
```

_See code: [src/commands/backtests/report.ts](src/commands/backtests/report.ts)_

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
  --verbose                display API requests as they happen
```

_See code: [src/commands/backtests/results.ts](src/commands/backtests/results.ts)_

## `qcli backtests:update`

change the name and/or the note of a given backtest

```
USAGE
  $ qcli backtests:update

OPTIONS
  -b, --backtest=backtest  backtest id or name (optional, interactive selector opens if not specified)
  -h, --help               display usage information
  -p, --project=project    project id or name (optional, interactive selector opens if not specified)
  -v, --version            display version information
  --name=name              the new name to assign to the given backtest (default: current name)
  --note=note              the new note to assign to the given backtest (default: current note)
  --verbose                display API requests as they happen
```

_See code: [src/commands/backtests/update.ts](src/commands/backtests/update.ts)_

## `qcli files:pull`

pull files from QuantConnect to the current directory

```
USAGE
  $ qcli files:pull

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name of the project to pull (all projects if not specified)
  -v, --version          display version information
  --verbose              display API requests as they happen
```

_See code: [src/commands/files/pull.ts](src/commands/files/pull.ts)_

## `qcli files:push`

push local files to QuantConnect

```
USAGE
  $ qcli files:push

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name of the project to push (all projects if not specified)
  -v, --version          display version information
  --verbose              display API requests as they happen
```

_See code: [src/commands/files/push.ts](src/commands/files/push.ts)_

## `qcli files:watch`

watch for local file changes and push them to QuantConnect

```
USAGE
  $ qcli files:watch

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name of the project to watch (all projects if not specified)
  -v, --version          display version information
  --poll                 use polling to watch for file changes
  --verbose              display API requests as they happen
```

_See code: [src/commands/files/watch.ts](src/commands/files/watch.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `qcli init`

create a new QuantConnect CLI project

```
USAGE
  $ qcli init

OPTIONS
  -h, --help     display usage information
  -v, --version  display version information
  --verbose      display API requests as they happen
```

_See code: [src/commands/init.ts](src/commands/init.ts)_

## `qcli live:list`

list all live projects

```
USAGE
  $ qcli live:list

OPTIONS
  -h, --help                                             display usage information
  -s, --status=running|runtime-error|stopped|liquidated  only show live projects with a given status
  -v, --version                                          display version information
  --verbose                                              display API requests as they happen
```

_See code: [src/commands/live/list.ts](src/commands/live/list.ts)_

## `qcli live:stop`

stop live trading for a project

```
USAGE
  $ qcli live:stop

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
  --liquidate            liquidate existing holdings (optional, defaults to false)
  --verbose              display API requests as they happen
```

_See code: [src/commands/live/stop.ts](src/commands/live/stop.ts)_

## `qcli nodes:delete`

delete a node

```
USAGE
  $ qcli nodes:delete

OPTIONS
  -h, --help                       display usage information
  -n, --node=node                  node id or name (optional, interactive selector opens if not specified)
  -o, --organization=organization  organization id (optional, interactive selector opens if not specified)
  -v, --version                    display version information
  --verbose                        display API requests as they happen
```

_See code: [src/commands/nodes/delete.ts](src/commands/nodes/delete.ts)_

## `qcli nodes:list`

list all nodes in an organization

```
USAGE
  $ qcli nodes:list

OPTIONS
  -h, --help                       display usage information
  -o, --organization=organization  organization id (optional, interactive selector opens if not specified)
  -v, --version                    display version information
  --verbose                        display API requests as they happen
```

_See code: [src/commands/nodes/list.ts](src/commands/nodes/list.ts)_

## `qcli nodes:stop`

stop a node

```
USAGE
  $ qcli nodes:stop

OPTIONS
  -h, --help                       display usage information
  -n, --node=node                  node id or name (optional, interactive selector opens if not specified)
  -o, --organization=organization  organization id (optional, interactive selector opens if not specified)
  -v, --version                    display version information
  --verbose                        display API requests as they happen
```

_See code: [src/commands/nodes/stop.ts](src/commands/nodes/stop.ts)_

## `qcli nodes:update`

update the name of a node

```
USAGE
  $ qcli nodes:update

OPTIONS
  -h, --help                       display usage information
  -n, --node=node                  node id or name (optional, interactive selector opens if not specified)
  -o, --organization=organization  organization id (optional, interactive selector opens if not specified)
  -v, --version                    display version information
  --name=name                      (required) new name for the node
  --verbose                        display API requests as they happen
```

_See code: [src/commands/nodes/update.ts](src/commands/nodes/update.ts)_

## `qcli projects:compile`

compile a project

```
USAGE
  $ qcli projects:compile

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
  --verbose              display API requests as they happen
```

_See code: [src/commands/projects/compile.ts](src/commands/projects/compile.ts)_

## `qcli projects:delete`

delete a project

```
USAGE
  $ qcli projects:delete

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
  --verbose              display API requests as they happen
```

_See code: [src/commands/projects/delete.ts](src/commands/projects/delete.ts)_

## `qcli projects:info`

display useful information about a project

```
USAGE
  $ qcli projects:info

OPTIONS
  -h, --help             display usage information
  -p, --project=project  project id or name (optional, interactive selector opens if not specified)
  -v, --version          display version information
  --verbose              display API requests as they happen
```

_See code: [src/commands/projects/info.ts](src/commands/projects/info.ts)_

## `qcli projects:list`

list all projects

```
USAGE
  $ qcli projects:list

OPTIONS
  -h, --help     display usage information
  -v, --version  display version information
  --verbose      display API requests as they happen
```

_See code: [src/commands/projects/list.ts](src/commands/projects/list.ts)_

## `qcli projects:new PATH`

create a new project

```
USAGE
  $ qcli projects:new PATH

ARGUMENTS
  PATH  path of the project to create

OPTIONS
  -h, --help                    display usage information
  -l, --language=python|csharp  [default: python] language of the project to create
  -v, --version                 display version information
  --verbose                     display API requests as they happen
```

_See code: [src/commands/projects/new.ts](src/commands/projects/new.ts)_
<!-- commandsstop -->

# Contributing

All contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) first as it contains information regarding the tools used by the project and instructions on how to set up a development environment.
