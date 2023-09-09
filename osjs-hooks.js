/******/ (window["webpackJsonp"] ||= []).push([
/******/   ["osjs-hooks"], {

/***/ "osjs-hooks":
/***/ (module, exports, require) => {

    const VfsSystemAdapter = require("osjs-hooks/filesystem.js");
    const LocalStorageSettings = require("osjs-hooks/settings.js");
  
    const args = (o) => (c) => ((c.options||={}).args=o, c);
    const provider = (o) => (c) => (c.provider=o(c.provider), c);
  
    module.exports = {
      VFS: args({
        adapters: {
          system: VfsSystemAdapter
        }
      }),
      // this osjs snapshot is not uptodate; master need no more this fix
      Settings: (conf) => ({...conf, provider:
        class SettingsServiceProvider extends conf.provider {
          constructor(core, options = {}) {
            super(core, options);
            this.settings.adapter = LocalStorageSettings(core);
          }
        }
      }),
      // TODO Auth
    };
  
  /***/ },
  /***/ "osjs-hooks/settings.js":
  /***/ (module) => {
  
    // this osjs snapshot is not uptodate; master need no more this fix
    module.exports = function LocalStorageSettings(core) {
  
      const prefix = core.config('settings.prefix', 'osjs__');
  
      const rmap = (fn, ns) => (
          (ns ? [prefix + ns] : Object.keys(localStorage))
          .filter((k) => k.startsWith(prefix))
          .map((k) => [
              k.substr(prefix.length),
              localStorage[fn + 'Item'](k)
          ])
      );
      const read = ([k, v]) => {
        try { return [k, JSON.parse(v)]; }
        catch (e) {
          logger.warn(`localStorageAdapter parse failed for '${prefix + k}'`, e);
        }
      };
      const write = ([k,v]) => localStorage.setItem(prefix + k, JSON.stringify(v));
  
      return {
        clear: async (ns) => !!rmap('remove', ns),
        load: async () => Object.fromEntries(rmap('get').map(read)),
        save: async (settings) => !!Object.entries(settings).map(write),
        init: async () => true,
        destroy: () => {},
      };
    };
  
  /***/ },
  /***/ "osjs-hooks/filesystem.js":
  /***/ (module, exports, require) => {
    const requireOpt = (m) => require.m[m] && require(m);
  
    const vfs_mime = (core) => {
      const defaultType = 'application/octet-stream';
      const broofa_mime = requireOpt("broofa/mime") || {};
      const defTypes = broofa_mime.define || (()=>{});
      const getType = broofa_mime.getType || (()=>'');
      const coreType = (f) => core.config('mime')?.filenames?.[basename(f)];
      const basename = (path) => path.split('/').filter(Boolean).pop();
  
      defTypes(core.config('mime')?.define || {}, {force: true});
  
      return (filename) => (
        coreType(filename) || getType(filename) || defaultType
      )
    };
  
    const errno = {
      EINVAL:   "Invalid argument",
      EPERM:    "Operation not permitted", // (system or process capabilities)
      EACCES:   "Permission denied", // (user/groups permissions)
  
      ENOTDIR:  "A component in pathname is not a directory",
      EISDIR:   "Is a directory",
      ENOENT:   "File/Directory doesn't exist",
      EEXIST:   "File/Directory allready exist",
      EBADF:    "Bad file descriptor",
      EIO:      "An I/O error occurred",
    }
  
    module.exports = function VfsSystemAdapter(core) {
  
      const mime = (core.make('osjs/vfs').mime ||= vfs_mime(core));
  
      const rootkey = "vfs-tree";
      const filekey = "vfs-file:";
      const seqkey = "/seq/";
      let pfx = '';
  
      let root = null;
      //let seq = null; --> root[seqKey]
  
      const success = true;
      const error = (code) => {
        root = null; // force reload on next operation
        throw `${code} ${errno[code]}`;
      };
  
      // serialization
      const json = JSON;
      const raw = { stringify: o => o, parse: s => s };
      const ab64 = { // ArrayBuffer <-> Base64
        stringify: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))),
        parse: (str) => {
          const bin = atob(str), len = bin.length, arr = new Uint8Array(len);
          for(let i = 0; i < len; i++) { arr[i] = bin.charCodeAt(i); }
          return arr.buffer;
        }
      }
  
      // database
      const db = (serial, op, key, data) => {
        try {
          data = serial.stringify(data);
          data = localStorage[op + "Item"](pfx + key, data);
          data = data ? serial.parse(data) : undefined;
          return (op === 'get') ? data : success;
        } catch (e) {
          root = null; // force reload on next operation
          return error('EIO');
        }
      };
      const load = () => root ||= db(json, 'get', rootkey) || {};
      const save = () => root &&  db(json, 'set', rootkey, root);
      const seq  = () => root && (++root[seqkey] || (root[seqkey] = 1));
  
      // synchronization
      let pending = Promise.resolve();
      const async = (job) => async () => job();
      const queue = (job) => new Promise((resolve) => {
        pending = pending.finally(() => {
          resolve(async(job)());
        });
      });
      // template method
      const doit = ({path}, walker, fop, ijob, fjob = nop, data) => {
        return queue(() => {
          const colon = path?.indexOf(':') + 1 || err('EINVAL');
          const slash = path.endsWith('/');
          pfx = path.substr(0, colon);
          path = path.substr(colon);
          path = ['root', ...path.split('/').filter(Boolean)];
          load();
          const name = path.pop();
          const node = path.reduce(walker, {root});
          if (slash && fop) ad(node, name); // resolve trailing slashes
          return ijob(node, name) && fjob(node[name], data);
        });
      }
      // meta
      const _kinds = {object: 'dir', number: 'file'};
      const _kerrs = {dir: 'EISDIR', file: 'ENOTDIR', undefined: 'ENOENT'};
      const kind = node => _kinds[typeof node];
      const kerr = node => _kerrs[kind(node)];
      const isname = (name) => name && !name.startsWith('/');
      // checks
      const node = node => !!kind(node);
      const dir  = node => kind(node) == 'dir';
      const file = node => kind(node) == 'file';
      const chk = (test, node) => test(node) ? node : error(kerr(node));
      // walkers
      const cd = (node, name) => node?.[name];                // change dir
      const ad = (node, name) => chk(dir, node[name]);        // assert dir
      const md = (node, name) => chk(dir, node[name] ||= {}); // make dir
      // inode jobs
      const is = (t    ) => (dir, name) => chk(t, dir[name]);
      const mk = (t, mk) => (dir, name) => chk(t, dir[name] ||= mk()) && save();
      const mkdir = mk(dir, () => ({}));
      const touch = mk(file, (id) => (id = seq(), del/*orphan*/(id), id));
      // file jobs
      const nop   = () => success;
      const set   = (node, data)  => db(ab64, 'set',    filekey + node, data);
      const get   = (node)        => db(ab64, 'get',    filekey + node);
      const del   = (node)        => db(ab64, 'remove', filekey + node);
      // dir jobs
      const stat = (node, {path}) => ({
        filename: path.match(/[^/]+/g).pop(),
        path: path,
        isDirectory: dir(node),
        isFile: file(node),
        mime: file(node) ? mime(path) : null,
        size: file(node) ? get(node)?.byteLength : null,
      });
      const ls = (node, {path}) => Object.keys(node).filter(isname).map(
        key => stat(node[key], {path: `${path}/${key}`})
      );
      // complexe inode jobs
      const exists = (node, name) => (node?.[name] !== undefined);
      const unlink = (node, name, _, target) => {
        if (!exists(node, name)) return success;
        switch(kind(target = node[name])) {
        case 'dir':
          const childs = Object.keys(target).map(k => [target[k], k]);
          const status = childs.map(entry => unlink.call(null, entry));
          // if (!status.every(Boolean)) return error;
          return (delete node[name]) && save();
        case 'file':
          return (del(target)) && (delete node[name]) && save();
        default:
          return err('BADF');
        }
      };
      // osjs extensions
      const asbuffer = (data) => (data?.arrayBuffer?.() ?? data);
      const xget = async (node, {path}) => ({
        body:get(node), mime: mime(path)
      });
      const xset = async (node, data, buf) => (
        set(node, buf = await asbuffer(data)) && buf.byteLength
      );
  
      // ref: fs-extra / node:fs
      // ref: paulmillr/chokidar => fs.watch
  
      // exists => boolean     (ENOTDIR => false)
      // unlink => true||throw (ENOTDIR/ENOENT => success) (recursive)
      // mkdir  => true||throw (EEXIST => success) (opt {recursive})
      // touch  => true||throw (EEXIST => success) (make parent dirs)
      // writefile  => size||throw
      // readfile   => {body, mime}||throw
      // readdir    => [VFSFile]||throw
      // stat       => VFSFile||throw
      // copy       => true||throw (...??)
      // rename     => true||throw (...??)
  
      return {
        /* entries operations */
        exists:     path        => doit(path, cd, 0, exists               ),
        unlink:     path        => doit(path, cd, 0, unlink               ),
        mkdir:      path        => doit(path, md, 0, mkdir                ),
        touch:      path        => doit(path, md, 1, touch                ),
        writefile: (path, data) => doit(path, ad, 1, touch   , xset, data ),
        readfile:   path        => doit(path, ad, 2, is(file), xget, path ),
        readdir:    path        => doit(path, ad, 2, is(dir) , ls,   path ),
        stat:       path        => doit(path, ad, 2, is(node), stat, path ),
        copy:       (from, to)  => Promise.resolve(false), // copy: read, write
        rename:     (from, to)  => Promise.resolve(false), // move: read, write, unlink
        search: (root, pattern) => Promise.resolve([]),
          // search:
          //   filehound.create.paths.match.find
          //   .then(files=[] => {realPath:root, files})
        // url: (path) => Promise.resolve(null),
        // download: ?,
  
        /* mountpoint methods */
        // *** capabilities: Get filesystem capabilities
        // mount:   (options) => Promise.resolve(true),
        // unmount: (options) => Promise.resolve(true),
        // capabilities: (path) => Promise.resolve({sort: false, pagination: false})
  
        // TODO checkMountpointPermission(method, readOnly, mount)
        //        with readOnly for: writefile mkdir touch unlink
        // TODO watch: ???
      };
    };
  
  /***/ },
  /******/ }]);
  