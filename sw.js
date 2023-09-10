if (globalThis === window) {
    // main thread bootstrap
  
    const src = document.currentScript.src;
    const swc = navigator.serviceWorker;
  
    const register    = ()=> swc?.register(src);
    const installable = ()=> swc.controller?.postMessage("clearCache");
    const installed   = ()=> swc.ready.then(r => r.active?.postMessage("loadCache"));
  
    if (location.protocol === 'https:') {
      register();
  
      window.addEventListener("beforeinstallprompt", (e) => {
        installable();
  
        e.userChoice.then(uc => {
          if (uc.outcome === 'accepted') installed();
        });
      })
    }
  
  } else {
    // service worker thread
  
    self.addEventListener("fetch", fetchHandler);
    self.addEventListener("message", ({data}) => (
      data === 'clearCache' ? clearCache():
      data === 'loadCache' ? loadCache():
      undefined
    ));
  
    const cacheName = "osjs-app";
    let cached = true;
  
    function clearCache() {
      cached = false;
      caches.delete(cacheName);
    }
  
    function loadCache() {
      cached = true;
      fetch('manifest.json').then(js => JSON.parse(js)).then(
        files => caches.open(cacheName).then(c => c.addAll(files))
      );
    }
  
    function fetchHandler({request, respondWith}) {
      if (cached) respondWith(
        caches.match(request).then(r => r || fetch(request))
      );
    }
  }