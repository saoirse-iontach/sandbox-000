# saoirse-iontach / sandbox-000
This is a sandbox ! \
That is a repository to make some experiments, \
and not aimed to be publish...

Initial purpose of this sandbox is to build a light IDE.
 - must work with a simple web navigator
 - must work full offline, served from a simple local directory

**OS.js** & **Hyperapp** were choosen because they do what I want as I want. \
Not reinvent the well !


## I. OS.js v3 standalone webpack 2023-02

### I-1. Get OS.js ###
First step, get a working copy of **OS.js** \
This was got from [the official live demonstration](https://demo.os-js.org/). \
Files were put under **osjs/** directory.

Notice that some files must stay at the root:
 - the backgroung image
 - the default icon
 - the favicon
 - and obviously the index

This correspond to a webpack build of the [os-js/OS.js](https://github.com/os-js/OS.js) repository. \
(This repository is not deployed to npm) \
(But dependencies like osjs-client are deployed and available from cdn...)

### I-2. Make it extensible ###
The **osjs.js** bootstrap file was replaced by a customized copy **osjs-bootstrap.js**. \
This file correspond to **OS.js/src/client/**, wrapped with the **webpackBootstrap**.

This **./src/client/index.js** bootstrap was rewrite:
 - to support optionnal webpack dependencies
 - to dispatch core OS.js events to DOM (like the **boot** event)
 - to provide hook points (around Core instantiation, and ServiceProvider registration)

### I-3. Make it working ###
Next, the first hook: **osjs-local.js**, to allow well working when locally file served. \
In this case, *application runtime* can't register at the good time; \
Either boot application register to quick when core is not booted, \
Or to late after init require then on startup... \
So we buffer all calls to **window.OSjs.register** and replay then on **boot** event.

### I-4. Make it usable ###
Now we have a working live demo, but no filesystem. \
That is because original vfs work remotely. \
So we provide a custom implementation backed by localstorage.\

We provide a fixture around OS.js settings to avoid to clear all the localstorage. \
(This is no more needed on recent version, and will be removed when upadte the osjs/ snaphot...)

This are located into **osjs-hooks.js**. \
We also provide the **broofa-mime.js** library.

### I-5. Make all these available to user ###
**OS.js** provide an eponym mountpoint. \
This is normally provide by the server, which we don't have because we are standalone... \
We could provide some fetch based hook, but this won't work when locally file served. \
So we fill this mountpoint from webpack chunks. \
Look at **osjs-wpfs.js** (standing for webpack filesystem).

### I-6. Little clean up... ###
Nice, a working standalone demo. But a little scattered tree ! \
In order to nicely grow up, some reorganisation:
 - **/** toplevel dir contains only necessary files
 - **osjs/** dir contains the demo snapshot of 2023/02/02
 - **osjs-saoirse/** dir contains essentials patch
 - other dirs will contains futur extension...

Applications and other OS.js Packages are for now under **/osjs/apps** and adjacent dirs.

### I-a. Release note 2023/09/09 ###
 - **OS.js** snapshot date: 2023/02/02
 - **Saoirse** extension dev date: 2023/02/13
 - Final publication (commit) date: 2023/09/09
 - **TODO**: update osjs and themes snapshots
 - **TODO**: unimplemented localstorage VfsSystemAdapter copy operation
 - **TODO**: unimplemented localstorage VfsSystemAdapter rename operation
 - **TODO**: unimplemented localstorage VfsSystemAdapter mountpoint operations

### I-b. What next ? ###
 - switch from webpack snapshot to UMD npm packages
 - allow dynamic package managment (with download of OS.js packages from cdn)
 - make it installable Progressive Web Application (PWA)
 - provide and UMD toolkit (giving acces to hyperapp and OS.js UI classes)
 - support to run js from vfs as custom applications
