ShieldEM-sfdx
=============

Shield Event Monitoring sfdx plugin

# Installation
- In a terminal: 
```
$ sfdx plugins:install shieldem-sfdx
```

# Commands

## shield:em:eventlog:types
- This command retrieves the distinct types in the **EventLogFile**
  table of your org.
- For more information, type in a terminal:
```
$ sfdx help shield:em:eventlog:types
```

## shield:em:eventlog:metadatas
- This command lists the metadata of the log event files in your 
  org for a specific event type.
- Optional filtering is available like end date and number of days 
  in the past.
- For more information, type in a terminal:
```
$ sfdx help shield:em:eventlog:types
```

## shield:em:eventlog:data
- This command retrieves the data of a specific file in your org.
- By default, we list all the fields available, but you can specify 
  the field that you want. When specifying fields, please use API 
  names as describe in the metadata file at "logFileFieldNames".
- For more information, type in a terminal:
```
$ sfdx help shield:em:eventlog:types
```

## shield:em:eventlog:quiddities
- Get all quiddities possible with key and (human readable) names.
- For more information, type in a terminal:
```
$ sfdx help shield:em:eventlog:types
```

## shield:em:stats:apexentrypoints
- Get a list of apex classes with their stats from your org.
- For more information, type in a terminal:
```
$ sfdx help shield:em:eventlog:types
```
