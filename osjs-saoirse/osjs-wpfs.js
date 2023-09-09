((src, factory) => {
    (window["webpackJsonp"] ||= []).push([
        [src], {[src]: factory}
    ]);
    return factory;
})
("osjs-wpfs.js",() => {

    /*** webpack-filesystem ***/

    /* tools */
    const chuncks = () => (window["webpackJsonp"] ||= []);
    const encoder = new TextEncoder();
    const stoa = (s) => encoder.encode(s).buffer;

    /* osjs core hook */
    let pfx = 'osjs:';
    let root = pfx + '/MyOsjs/';
    let fs;
    const boot = async ({detail:{osjs}}) => {
      // bootstrap
      fs = osjs.make('osjs/vfs');
      if (await fs.exists({path: root})) {
        return; // don't reload
      }
      // clean
      Object.keys(localStorage)
        .filter(k => k.startsWith(pfx + 'vfs'))
        .forEach(k => localStorage.removeItem(k));
      // force reload
      try {
        await fs.readfile({path: pfx + '/'});
      } catch (e) {}
      // do load
      chuncks().map(onchunck);
    };
    const onchunck = /*async*/ ([[name], modules]) => {
      let path = root;
      if (name == 'vendors~osjs') path += 'osjs/';
      if (name == './dist/metadata.json') path += 'osjs/';
      if (name.startsWith('osjs-')) path += 'osjs-saoirse/';
      if (/^\w+\/\w+$/.test(name)) path += 'lib/';
      if (path === root) path += 'other/';
      Object.entries(modules).map(onmodule(path));
    };
    const onmodule = (root) => async ([name, factory]) => {
      const islib = root.endsWith('/lib/');
      if (islib) name  = name.replace(/^(\w+)\/(\w+)/, '$1-$2');

      let path = root + name.replace(/^\.?\/?/, '');
      path = path.replace(/node_modules\//g, '');
      if (!path.match(/[^/]+/g).pop().includes('.')) path += '/index.js';

      const source = factory.toString();
      const data = stoa(source);

      await fs.touch({path});
      await fs.writefile({path}, data);
    }

    /* install */
    window.addEventListener('osjs/core:started', boot, {once:true});

})();

