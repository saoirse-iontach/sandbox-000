(() => {
    if (location.protocol != "file:") { return; }

    /* webpack */
    const chuncks = () => (window["webpackJsonp"] ||= []).map(c => c[1]);
    const find = (mod) => chuncks().find(c => mod in c)?.[mod];
    const load = (f, m={exports:{}}) => f && (f(m), m.exports);
    const require_opt = (mod) => load(find(mod));

    /* defered registration */
    const pending = [];
    const register = (...args) => pending.push(args);
    const delegate = (args) => window.OSjs.register(...args);
    const reroll = () => pending.splice(0).map(delegate);

    /* osjs core hook */
    const boot = ({detail:{osjs}}) => {

      let metadata = osjs.config('packages.manifest');
      if (metadata &&= require_opt('./dist' + metadata)) {
        osjs.configuration.packages.manifest = null;
      }
      osjs.register(class ManifestProvider{
        depends() { return ['osjs/packages']; }
        async init() {
          osjs.make('osjs/packages').addPackages(metadata);
          reroll();
        }
        start() {}
        destroy() {}
      });
    }

    /* install */
    window.OSjs = {register};
    window.addEventListener('osjs/core:boot', boot, {once:true});

})();
