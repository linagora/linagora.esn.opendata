# Install 

1. Follow OpenPaaS installation instructions from [here](https://gist.github.com/tuanlc/217f000285404c22fe84f61c5a507daf)

2. "Git clone https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.opendata" in esn/modules folder

3. Add "linagora.esn.opendata" to esn/config/default.json in modules section

4. Switch to node version 6 with nvm and "npm install" and "bower install" from opendata folder 

5. Switch back to node version 8, run OP and go to /localhost:8080/#/opendata

6. Add the following to esn/frontend/views/esn/index.pug (temporary awaiting fix)

```
...
link(rel='stylesheet', href='/components/angular-gridster/dist/angular-gridster.min.css')
link(rel='stylesheet', href='/components/nvd3/build/nv.d3.min.css')
...
link(rel='stylesheet', href='/generated/css/esn/styles.css')
```

