/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"osjs": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/client/index.js","vendors~osjs"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/config.js":
/***/ (function(module, exports) {
  let path = location.pathname;
  let sidx = path.lastIndexOf('/');
  let didx = path.lastIndexOf('.');
  if (sidx < didx) { path = path.substr(0, sidx + 1); }
  module.exports = {
    standalone: true,
    http: { public: path + 'osjs/' },
  };
/***/ }),

/***/ "./src/client/index.js":
/***/ (function(module, exports, require) {
  "use strict";
  require.r(exports);
  const require_default = mod => require.n(require(mod)).a;
  const require_osjs = (mod, type='main') => require(`./node_modules/@osjs/${mod}/dist/${type}.js`);
  const require_opt = mod => (mod in require.m) ? require_default(mod) : null;

  /* dependencies */
  const config = require_default("./src/client/config.js");
  const packages = [
    require_osjs("client"),
    require_osjs("panels"),
    require_osjs("dialogs"),
    require_osjs("gui", "esm"),
    require_osjs("widgets"),
  ];

  /* some config */
  class CoreEvents {
    boot; booted; start; started; destroy;
    connect; disconnect; "connection-failed";
    "logged-in"; "logged-out";
  }
  class Services { 
    Core; Desktop; VFS; Notification; Settings; Auth;
    Panel; Dialog; GUI; Widget;
  }
  const servicesOptions = {
    Auth: {before:true},
    Settings: {before:true},
  };

  /* bootstrap */
  function init() {

    const customConfig = require_opt("osjs-config") || config;
    const servicesHooks = require_opt("osjs-hooks") || {};
    const servicesNames = Object.keys(new Services());
    const eventsNames = Object.keys(new CoreEvents());

    /* Services and hooks */
    let {provider, options} = {};
    const find = (sym) => packages.find(pkg => sym in pkg)?.[sym];
    const hook = (srv) => (servicesHooks[srv] || (o=>o));
    const get = (type, name = '') => {
      provider = find(name + type);
      options = servicesOptions[name];
      ({provider, options} = hook(name)({provider, options}));
      return provider;
    }

    /* Events to dom */
    const _dispatch = (name, options) => {
      try { window.dispatchEvent(new CustomEvent(name, options)); }
      catch (err) { console.error(err); }
    }
    const dispatch = (osjs, state) => (...args) => {
      const options = {detail: {osjs, state, args}};
      _dispatch("osjs/core", options);
      _dispatch("osjs/core:" + state, options);
    }

    /* do bootstrap */
    const osjs = new (get("Core"))(customConfig, options);
    for(let evt of eventsNames) {
      osjs.on("osjs/core:" + evt, dispatch(osjs, evt));
    }
    for(let srv of servicesNames) {
      osjs.register(get("ServiceProvider", srv), options)
    }
    osjs.boot();
  };

  /* schedule */
  if (document.readyState == "loading") {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

/***/ }),

/***/ "./src/client/index.scss":
/***/ (function(module, exports, require) {
  "use strict";
  require.r(exports);
/***/ })

/******/ });
