`qcli sync`
===========

manage synchronizing local files with QuantConnect

* [`qcli sync:pull`](#qcli-syncpull)
* [`qcli sync:push`](#qcli-syncpush)
* [`qcli sync:watch`](#qcli-syncwatch)

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
