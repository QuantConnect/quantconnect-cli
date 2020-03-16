`qcli api`
==========

make authenticated requests to the QuantConnect API

* [`qcli api:get ENDPOINT`](#qcli-apiget-endpoint)
* [`qcli api:post ENDPOINT`](#qcli-apipost-endpoint)

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
