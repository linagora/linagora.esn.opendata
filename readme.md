![Archived](https://img.shields.io/badge/Current_Status-archived-blue?style=flat)

## Install OpenPaaS

- Check OP install documentation https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.opendata/wikis/installation

## Install Open Data module

- Download module 

``` bash
    Git clone https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.opendata` and install with `npm install` from the created folder
```
* Declare module by adding `linagora.esn.dataviz` to `esn/config/default.json` in modules section

* Install module from /linagora.esn.opendata folder 

``` bash
    npm install
```

* Access to application at `/localhost:8080/#/opendata`
