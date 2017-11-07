## Install module

* Follow OpenPaaS installation instructions from [here](https://gist.github.com/tuanlc/217f000285404c22fe84f61c5a507daf)

* `Git clone https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.opendata` in esn/modules folder

* Add `linagora.esn.opendata` to `esn/config/default.json` in modules section

* Switch to node version with `nvm use 6`, then install from /linagora.esn.opendata folder `npm install` and `bower install` 

* Add the following to esn/frontend/views/esn/index.pug (temporary awaiting fix)

```bash
...
link(rel='stylesheet', href='/components/angular-gridster/dist/angular-gridster.min.css')
link(rel='stylesheet', href='/components/nvd3/build/nv.d3.min.css')
...
link(rel='stylesheet', href='/generated/css/esn/styles.css')
```
* Switch back to node version 8 `nvm use 8`, run OpenPaaS from esn folder with `grunt dev` and go to `/localhost:8080/#/opendata`





