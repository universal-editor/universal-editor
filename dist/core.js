/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "0d5dcb6776e2fbf2b801"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	__webpack_require__(38);
	__webpack_require__(39);
	var context = __webpack_require__(40);
	context.keys().forEach(context);
	__webpack_require__(103);

	if (false) {
	  require('./vendor.scss');
	} else {
	  __webpack_require__(105);
	}

	__webpack_require__(109);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*(function(module) {
	try {
	  module = angular.module('universal.editor.templates');
	} catch (e) {
	  module = angular.module('universal.editor.templates', []);
	}
	module.run(['$templateCache', function($templateCache) {
	  $templateCache.put('module/components/ueButtonFilter/ueButtonFilter.html',
	    '\n' +
	    '<button data-ng-class="{ processing : vm.processing}" style="display: inline-block; margin: 10px;" ng-bind="::vm.label" class="btn btn-md btn-create btn-success">\n' +
	    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
	    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
	    '    </div>\n' +
	    '</button>');
	}]);
	})();*/

	(function (module) {
	    try {
	        module = angular.module('universal.editor.templates');
	    } catch (e) {
	        module = angular.module('universal.editor.templates', []);
	    }
	    debugger;
	    module.run(['$templateCache', function ($templateCache) {
	        __webpack_require__(6).keys().forEach(function (req) {
	            var path = req.substr(2, req.length - 7);
	            $templateCache.put('module/' + path + '.html', __webpack_require__(37)("./" + path + '.jade')());
	        });
	    }]);
	})();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./components/ueAutocomplete/ueAutocomplete.jade": 7,
		"./components/ueButtonFilter/ueButtonFilter.jade": 12,
		"./components/ueButtonGoto/ueButtonGoto.jade": 13,
		"./components/ueButtonModal/ueButtonModal.jade": 14,
		"./components/ueButtonRequest/ueButtonRequest.jade": 15,
		"./components/ueButtonService/ueButtonService.jade": 16,
		"./components/ueCheckbox/ueCheckbox.jade": 17,
		"./components/ueColorpicker/ueColorpicker.jade": 18,
		"./components/ueComponent/ueComponent.jade": 19,
		"./components/ueDate/ueDate.jade": 20,
		"./components/ueDatetime/ueDatetime.jade": 21,
		"./components/ueDropdown/dropdownItems.jade": 22,
		"./components/ueDropdown/ueDropdown.jade": 23,
		"./components/ueFilter/ueFilter.jade": 24,
		"./components/ueForm/ueForm.jade": 25,
		"./components/ueFormGroup/ueFormGroup.jade": 26,
		"./components/ueFormTabs/ueFormTabs.jade": 27,
		"./components/ueGrid/ueGrid.jade": 28,
		"./components/ueModal/ueModal.jade": 29,
		"./components/uePagination/uePagination.jade": 30,
		"./components/ueRadiolist/ueRadiolist.jade": 31,
		"./components/ueString/ueString.jade": 32,
		"./components/ueTextarea/ueTextarea.jade": 33,
		"./components/ueTime/ueTime.jade": 34,
		"./components/universalEditor/universalEditor.jade": 35,
		"./template/errorField/errorField.jade": 11,
		"./template/labelField/labelField.jade": 10,
		"./template/layouts/layoutComponent.jade": 36
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 6;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\" ng-style=\"{'overflow:auto':vm.multiple}\"> <div ng-class=\"vm.classComponent\"><div data-ng-class=\"{&quot;active&quot; : vm.isActivePossible, &quot;disabled-input&quot;: vm.readonly}\" data-ng-click=\"inputFocus()\" class=\"autocomplete-input-wrapper form-control\"><div data-ng-repeat=\"acItem in vm.selectedValues\" data-ng-show=\"acItem[vm.field_search]\" data-ng-if=\"vm.multiple\" class=\"autocomplete-item\">{{acItem[vm.field_search]}}<span data-ng-click=\"vm.removeFromSelected($event, acItem)\" data-ng-if=\"!vm.readonly\" class=\"remove-from-selected\">×</span></div><input ng-show=\"vm.preloadedData\" type=\"text\" ng-disabled=\"vm.readonly\" data-ng-model=\"vm.inputValue\" data-ng-focus=\"vm.focusPossible(true)\" data-ng-blur=\"vm.focusPossible(false)\" size=\"{{vm.sizeInput}}\" data-ng-style=\"vm.classInput\" data-ng-keydown=\"vm.deleteToAutocomplete($event)\" placeholder=\"{{vm.placeholder}}\" data-ng-class=\"!vm.isActivePossible ? &quot;color-placeholder&quot; : &quot;&quot;\" class=\"autocomplete-field-search\"><span data-ng-if=\"!vm.multiple &amp;&amp; !!vm.selectedValues.length &amp;&amp; !vm.readonly\" data-ng-click=\"vm.removeFromSelected($event, vm.selectedValues[0])\" class=\"selecte-delete selecte-delete-autocomplete\">×</span><div data-ng-show=\"vm.searching || !vm.preloadedData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><div data-ng-if=\"!vm.readonly &amp;&amp; (vm.possibleValues.length &gt; 0) &amp;&amp; vm.showPossible\" class=\"possible-values possible-autocomplete active possible-bottom\"><div class=\"possible-scroll\"><div data-ng-repeat=\"possible in vm.possibleValues\" data-ng-mouseover=\"vm.activeElement = $index\" data-ng-mousedown=\"vm.addToSelected($event, possible)\" data-ng-class=\"vm.activeElement == $index ? 'active' : ''\" class=\"possible-value-item\">{{::possible[vm.field_search]}}</div></div></div></div></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};


	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;

	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}

	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(9).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<label ng-if=\"!vm.options.filter &amp;&amp; !!vm.label\" class=\"field-name-label\"><div data-ng-if=\"!!vm.hint\" class=\"field-hint\"><div ng-bind=\"::vm.hint\" class=\"hint-text\"></div></div><span data-ng-class=\"{'editor-required': vm.required}\" ng-bind=\"::vm.label\"></span></label>");;return buf.join("");
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div ng-if=\"!vm.options.filter\" class=\"field-error-wrapper\"><div data-ng-repeat=\"err in vm.error track by $index\" class=\"error-item alert alert-danger\">{{err}}</div></div>");;return buf.join("");
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<button data-ng-class=\"{ processing : vm.processing}\" style=\"display: inline-block; margin: 10px;\" ng-bind=\"::vm.label\" class=\"btn btn-md btn-create btn-success\"><div data-ng-show=\"vm.processing\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div></button>");;return buf.join("");
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div><button data-ng-class=\"{ processing : vm.options.isLoading}\" data-ng-if=\"vm.setting.buttonClass == 'header'\" class=\"btn btn-lg btn-create btn-success\">{{::vm.label}}<div data-ng-show=\"vm.options.isLoading\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div></button><button data-ng-if=\"vm.setting.buttonClass == 'context'\" class=\"editor-action-button\">{{::vm.label}}</button></div>");;return buf.join("");
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div><button data-ng-class=\"{ processing : vm.processing}\" style=\"display: inline-block; margin: 10px;\" class=\"btn btn-lg btn-create btn-success\">{{::vm.label}}<div data-ng-show=\"vm.processing\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div></button></div>");;return buf.join("");
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<button data-ng-class=\"vm.classButton\" data-ng-click=\"vm.buttonClick()\">{{::vm.label}}</button>");;return buf.join("");
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div><button data-ng-class=\"{ processing : vm.options.isLoading}\" ng-disabled=\"vm.disabled\" data-ng-if=\"vm.setting.buttonClass == 'footer'\" class=\"btn btn-md btn-success\">{{::vm.label}}<div data-ng-show=\"vm.options.isLoading\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div></button><button data-ng-if=\"vm.setting.buttonClass == 'context'\" class=\"editor-action-button\">{{::vm.label}}</button></div>");;return buf.join("");
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\" style=\"{{::vm.checkBoxStyle}}\"><div data-ng-repeat=\"item in vm.optionValues\" data-ng-class=\"{'disabled': vm.readonly}\" class=\"checkbox\"><label><input type=\"checkbox\" data-ng-disabled=\"vm.readonly\" data-checklist-model=\"vm.fieldValue\" data-checklist-value=\"::item[vm.field_id]\"><span ng-bind=\"::item[vm.field_search]\"></span></label></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\" ng-style=\"{'overflow:auto':vm.multiple}\"><div data-ng-if=\"vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><div data-ng-repeat=\"field_item in vm.fieldValue track by $index\" class=\"item-colorpicker-wrappe input-group\"><input type=\"text\" data-ng-disabled=\"vm.readonly\" data-minicolors=\"\" data-ng-model=\"vm.fieldValue[$index]\" class=\"form-control input-sm\"><span class=\"input-group-btn\"><button data-ng-click=\"vm.removeItem($index)\" data-ng-if=\"!vm.readonly\" class=\"btn btn-default btn-sm\">x</button></span></div><div data-ng-click=\"vm.addItem()\" data-ng-disabled=\"vm.readonly\" class=\"btn btn-primary btn-sm\">{{'BUTTON.ADD' | translate}}</div></div><div data-ng-if=\"!vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><input type=\"text\" data-ng-disabled=\"vm.readonly\" data-minicolors=\"\" data-ng-model=\"vm.fieldValue\" class=\"form-control input-sm\"></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div></div>");;return buf.join("");
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\" ng-style=\"{'overflow:auto':vm.multiple}\"> <div data-ng-if=\"vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><div data-ng-repeat=\"field_item in vm.fieldValue track by $index\" class=\"item-datepicker-wrapper input-group\"><input data-date-time=\"\" name=\"{{vm.fieldName}}\" data-ng-disabled=\"vm.readonly\" data-ng-model=\"vm.fieldValue[$index]\" min-date=\"vm.minDate\" data-format=\"{{vm.format || 'DD.MM.YYYY'}}\" data-max-view=\"year\" data-min-view=\"date\" data-view=\"date\" data-ng-blur=\"vm.inputLeave(vm.fieldValue[$index])\" data-min-date=\"minDate\" data-max-date=\"maxDate\" class=\"form-control input-sm\"><span class=\"input-group-btn\"><button data-ng-click=\"vm.removeItem($index)\" data-ng-if=\"!vm.readonly\" class=\"btn btn-default btn-sm\">x</button></span></div><div data-ng-click=\"vm.addItem()\" data-ng-disabled=\"vm.readonly\" class=\"btn btn-primary btn-sm\">{{'BUTTON.ADD' | translate}}</div></div><div data-ng-if=\"!vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><input data-date-time=\"\" name=\"{{vm.fieldName}}\" data-ng-disabled=\"vm.readonly\" data-ng-model=\"vm.fieldValue\" data-format=\"{{vm.format || 'DD.MM.YYYY'}}\" data-min-view=\"date\" data-view=\"date\" data-ng-blur=\"vm.inputLeave(vm.fieldValue)\" data-min-date=\"minDate\" data-max-date=\"maxDate\" class=\"form-control input-sm\"></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\" ng-style=\"{'overflow:auto':vm.multiple}\"> <div data-ng-if=\"vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><div data-ng-repeat=\"field_item in vm.fieldValue track by $index\" class=\"item-datepicker-wrapper input-group\"><input date-time=\"\" name=\"{{vm.fieldName}}\" data-ng-disabled=\"vm.readonly\" ng-model=\"vm.fieldValue[$index]\" view=\"date\" format=\"{{vm.format || 'YYYY-MM-DD HH:mm:ss'}}\" data-ng-blur=\"vm.inputLeave(vm.fieldValue[$index])\" data-min-date=\"minDate\" data-max-date=\"maxDate\" class=\"form-control input-sm\"><span class=\"input-group-btn\"><button data-ng-click=\"vm.removeItem($index)\" data-ng-if=\"!vm.readonly\" class=\"btn btn-default btn-sm\">x</button></span></div><div data-ng-click=\"vm.addItem()\" data-ng-disabled=\"vm.readonly\" class=\"btn btn-primary btn-sm\">{{'BUTTON.ADD' | translate}}</div></div><div data-ng-if=\"!vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><input date-time=\"\" name=\"{{vm.fieldName}}\" data-ng-disabled=\"vm.readonly\" ng-model=\"vm.fieldValue\" view=\"date\" format=\"{{vm.format || 'YYYY-MM-DD HH:mm:ss'}}\" data-ng-blur=\"vm.inputLeave(vm.fieldValue)\" data-min-date=\"minDate\" data-max-date=\"maxDate\" class=\"form-control input-sm\"></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div data-ng-show=\"isOpen\"><div data-ng-class=\"{&quot;dropdown-scroll&quot; : (lvlDropdown == 1)}\"><div data-ng-repeat=\"option in options track by $index\" data-ng-class=\"activeElement == $index ? 'active' : ''\" data-ng-mouseover=\"setActiveElement($event, $index)\" class=\"dropdown-items__item\"><div class=\"option\"><div data-ng-if=\"::selectBranches || !option[childCountField]\" data-ng-mousedown=\"onToggle($event, option)\" data-ng-class=\"{&quot;multi_radio&quot; : !multiple}\" class=\"option__checkbox\"><div data-ng-style=\"{'display': option.checked ? 'block' : '', 'background-image':'url('+ assetsPath + (!multiple ? '/images/radio_green.png)' : '/images/checkbox_green.png)')}\" data-ng-class=\"{&quot;multi_radio&quot; : !multiple}\" class=\"checkbox__check\"></div></div><div data-ng-mousedown=\"onToggle($event, option, true)\" class=\"option__label\"><span data-ng-bind=\"option[fieldSearch]\"></span>" + (jade.escape(null == (jade_interp = ' ') ? "" : jade_interp)) + "<span data-ng-if=\"option[childCountField]\" data-ng-class=\"{'option__child-count_open': option.isOpen}\" class=\"option__child-count\">({{option[childCountField]}})</span></div></div><div data-ng-if=\"option[childCountField]\" data-ng-show=\"!!option.loadingData\" class=\"processing-status-wrapper\"><div class=\"processing-status\">Выполняется действие</div></div><div data-ng-if=\"option.childOpts\" data-dropdown-items=\"\" data-options=\"option.childOpts\" data-is-open=\"option.isOpen\" data-field-search=\"fieldSearch\" data-child-count-field=\"childCountField\" data-on-toggle=\"onToggle\" data-api=\"api\" data-select-branches=\"selectBranches\" data-assets-path=\"assetsPath\" data-multiple=\"multiple\" data-active-element=\"activeElement\" data-set-active-element=\"setActiveElement\" data-lvl-dropdown=\"lvlDropdown + 1\" class=\"dropdown-items__children\"></div></div></div></div>");;return buf.join("");
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\" ng-style=\"{'overflow:auto': vm.multiple}\"><div ng-class=\"vm.classComponent\"><div data-ng-if=\"vm.multiple &amp;&amp; !vm.isTree\"><div class=\"select-border\"><select name=\"{{vm.fieldName}}\" data-ng-disabled=\"vm.readonly || !vm.parentValue\" data-ng-model=\"vm.fieldValue\" multiple size=\"3\" class=\"form-control\"><option data-ng-repeat=\"option in vm.optionValues\" value=\"{{option[vm.field_id]}}\">{{option[vm.field_search]}}</option></select></div><div data-ng-show=\"!!vm.loadingData\" style=\"position: absolute; margin: -28px 0 0 20px;\" class=\"processing-status-wrapper\"><div class=\"processing-status\">{{'PERFORMS_ACTIONS' | translate}}</div></div></div><div data-ng-if=\"!vm.multiple &amp;&amp; !vm.isTree\"><div data-ng-click=\"vm.clickSelect()\" data-ng-class=\"{&quot;but-for-search&quot;: !vm.search, &quot;disabled-input&quot;: vm.readonly}\" class=\"select-input-wrapper\"><input data-ng-if=\"vm.search &amp;&amp; !vm.loadingData\" ng-disabled=\"vm.readonly\" placeholder=\"{{vm.placeholder}}\" data-ng-class=\"vm.isSelection ? &quot;color-placeholder&quot; : &quot;&quot;\" data-ng-model=\"vm.filterText\" data-ng-change=\"vm.change()\" data-ng-focus=\"vm.isShowPossible()\" data-ng-blur=\"vm.isBlur()\" class=\"form-control select-input\"><input data-ng-if=\"!vm.search\" data-ng-focus=\"vm.isShowPossible()\" data-ng-blur=\"vm.isBlur()\" class=\"focus-input\"><div data-ng-if=\"!vm.search\" class=\"form-control select-input\"><div data-ng-class=\"vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;\" class=\"dropdown__selected-items\">{{vm.placeholder}}</div></div><span data-ng-if=\"vm.isSpanSelectDelete &amp;&amp; !vm.readonly\" data-ng-click=\"vm.deleteToSelected($event, false)\" class=\"selecte-delete\">×</span><div data-ng-if=\"!vm.readonly &amp;&amp; (vm.optionValues.length &gt; 0) &amp;&amp; vm.showPossible\" data-ng-class=\"vm.possibleLocation ? &quot;possible-bottom&quot; : &quot;possible-top&quot;\" class=\"possible-values active\"><div class=\"possible-scroll\"><div data-ng-repeat=\"option in vm.optionValues\" data-ng-mouseover=\"vm.activeElement = $index\" data-ng-mousedown=\"vm.addToSelected($event, option)\" data-ng-class=\"vm.activeElement == $index ? 'active' : ''\" class=\"possible-value-item\">{{option[vm.field_search]}}</div></div></div></div><div data-ng-show=\"vm.loadingData\" style=\"position: absolute; margin: -28px 0 0 20px;\" class=\"processing-status-wrapper\"><div class=\"processing-status\">{{'PERFORMS_ACTIONS' | translate}}</div></div></div><div data-ng-if=\"vm.isTree\" class=\"dropdown\"><div class=\"dropdown__host\"><div data-ng-class=\"{'dropdown__title_open': isOpen, 'disabled-input': vm.readonly}\" data-ng-click=\"vm.clickSelect()\" data-ng-style=\"{&quot;cursor&quot; : vm.search &amp;&amp; !vm.loadingData ? &quot;text&quot; : &quot;pointer&quot;}\" class=\"dropdown__title form-control select-input\"><div data-ng-repeat=\"value in vm.fieldValue\" data-ng-if=\"vm.fieldValue.length &amp;&amp; vm.multiple &amp;&amp; value[vm.field_search]\" class=\"selected-items__item\"><div class=\"selected-item\"><label ng-bind=\"value[vm.field_search]\" style=\"overflow: hidden; text-overflow: ellipsis; margin-right: 15px; display: block;\"></label><span data-ng-click=\"vm.remove($event, value)\" style=\"float: right; width: 10px; margin-top: -24px;\" ng-if=\"!vm.readonly\" class=\"selected-item__btn_delete\">×</span></div></div><input data-ng-if=\"vm.search &amp;&amp; !vm.loadingData\" ng-disabled=\"vm.readonly\" data-ng-model=\"vm.filterText\" data-ng-change=\"vm.change()\" placeholder=\"{{vm.placeholder}}\" data-ng-style=\"vm.styleInput\" size=\"{{vm.sizeInput}}\" data-ng-focus=\"toggleDropdown()\" data-ng-blur=\"vm.isBlur()\" data-ng-keydown=\"vm.deleteToSelected($event, true)\" data-ng-class=\"vm.colorPlaceholder ? &quot;color-placeholder&quot; : &quot;&quot;\" class=\"dropdown__search-field\"><input data-ng-if=\"!vm.search\" data-ng-focus=\"toggleDropdown()\" data-ng-blur=\"vm.isBlur()\" ng-disabled=\"vm.readonly\" class=\"focus-input\"><div data-ng-if=\"!vm.search\" class=\"dropdown__selected\"><div data-ng-class=\"vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;\" data-ng-if=\"!vm.loadingData\" class=\"dropdown__selected-items dropdown-tree\">{{vm.placeholder}}</div></div><span data-ng-if=\"vm.isSpanSelectDelete &amp;&amp; !vm.readonly\" data-ng-click=\"vm.deleteToSelected($event, false)\" class=\"selecte-delete\">×</span><div data-ng-if=\"::(vm.treeParentField &amp;&amp; vm.treeChildCountField)\" data-ng-class=\"{'dropdown__items_with-selected': vm.fieldValue.length &gt; 2 || (vm.search &amp;&amp; vm.fieldValue.length)}\" data-dropdown-items=\"\" data-options=\"vm.optionValues\" data-is-open=\"isOpen &amp;&amp; vm.optionValues.length\" data-field-search=\"vm.field_search\" data-child-count-field=\"vm.treeChildCountField\" data-on-toggle=\"vm.toggle\" data-api=\"vm.field.values_remote.url\" data-select-branches=\"vm.treeSelectBranches\" data-assets-path=\"vm.assetsPath\" data-multiple=\"vm.multiple\" data-active-element=\"vm.activeElement\" data-set-active-element=\"vm.setActiveElement\" data-lvl-dropdown=\"1\" class=\"dropdown__items dropdown__items_with-padding active dropdown-bottom\"></div></div></div><div data-ng-show=\"vm.loadingData\" style=\"position: absolute; margin: -28px 0 0 20px;\" class=\"processing-status-wrapper\"><div class=\"processing-status\">{{'PERFORMS_ACTIONS' | translate}}</div></div></div></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"filter-component\"><button data-ng-click=\"vm.toggleFilterVisibility()\" class=\"btn btn-lg btn-default filter-button\">Фильтр {{vm.visiable ? '-' : '+'}}</button><div data-ng-hide=\"!vm.visiable\" class=\"editor-filter\"><div ng-keyup=\"vm.clickEnter($event)\" class=\"editor-filter-wrapper\"><div class=\"editor-filter-head\"><label ng-bind=\"vm.header.label\"></label></div><div class=\"editor-filter-body\"><div ng-repeat=\"group in vm.body track by $index\" class=\"filter-content-wrapper\"><label ng-bind=\"group.label\" title=\"{{group.label}}\" class=\"filter-name-label\"></label><component-wrapper ng-repeat=\"filter in group.filters\" data-setting=\"filter.field\" data-options=\"filter.options\" style=\"{{filter.ngStyle}}\"></component-wrapper></div></div><div class=\"editor-filter-footer\"><component-wrapper data-ng-repeat=\"button in vm.footer track by $index\" data-setting=\"button\" data-options=\"vm.options\" data-button-class=\"header\"></component-wrapper></div></div></div></div>");;return buf.join("");
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"editor-body\"><div data-ng-click=\"vm.closeButton()\" ng-style=\"{'background-image':'url('+ vm.assetsPath +'/images/close.jpg)'}\" class=\"close-editor\"></div><component-wrapper ng-repeat=\"component in ::vm.components\" data-setting=\"::component\" data-options=\"::vm.options\"></component-wrapper><div class=\"field-error-bottom-wrapper\"><div data-ng-repeat=\"err in vm.errors\" class=\"error-item alert alert-danger\">{{err}}</div></div><div class=\"field-notify-bottom-wrapper\"><div data-ng-repeat=\"notify in vm.notifys\" class=\"notify-item\">{{notify}}</div></div><div data-ng-if=\"vm.entityLoaded\" class=\"editor-entity-actions\"><component-wrapper data-ng-repeat=\"button in vm.editFooterBar track by $index\" data-entity-id=\"{{vm.entityId}}\" data-setting=\"button\" data-options=\"vm.options\" data-button-class=\"footer\" class=\"editor-action-button\"></component-wrapper></div></div>");;return buf.join("");
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div class=\"editor-field-array\">" + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div class=\"field-array-wrapper editor-form-group col-md-12 col-xs-12 col-sm-12 col-lg-12\"><div data-ng-if=\"vm.multiple\"><div data-ng-repeat=\"fields in vm.fieldsArray track by $index\" data-ng-init=\"outerIndex = $index\" class=\"item-array-wrapper\"><data-component-wrapper ng-class=\"vm.className\" data-ng-repeat=\"field in fields\" data-setting=\"field\" data-options=\"vm.options\"></data-component-wrapper><div class=\"col-md-12 col-xs-12 col-lg-12 col-sm-12\"><div data-ng-click=\"vm.removeItem(outerIndex)\" data-ng-if=\"!vm.readonly\" class=\"btn btn-primary btn-xs\">{{'BUTTON.DELETE' | translate}}</div></div></div><div class=\"col-md-12 col-xs-12 col-lg-12 col-sm-12\"><div data-ng-click=\"vm.addItem()\" data-ng-if=\"!vm.readonly\" class=\"btn btn-primary btn-sm\">{{'BUTTON.ADD' | translate}}</div></div></div><div data-ng-if=\"!vm.multiple\"><data-component-wrapper ng-class=\"vm.className\" data-ng-repeat=\"field in vm.innerFields\" data-setting=\"field\" data-options=\"vm.option\"></data-component-wrapper></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"ue-tab-wrapper\"><div class=\"nav nav-tabs\"><li data-ng-repeat=\"tab in vm.tabs\" data-ng-class=\"{'active': vm.indexTab === $index}\" data-ng-click=\"vm.activateTab($index)\"><a href=\"\" ng-bind=\"::tab.label\"></a></li></div><div class=\"tab-content-wrapper\"><div data-ng-repeat=\"tab in ::vm.tabs\" data-ng-show=\"vm.indexTab === $index\" class=\"tab-item-content\"><component-wrapper data-ng-repeat=\"field in tab.fields\" data-setting=\"field\" data-options=\"vm.options\" data-button-class=\"footer\"></component-wrapper></div></div></div>");;return buf.join("");
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\"><div class=\"editor-header\"><component-wrapper ng-if=\"vm.filterComponent\" data-setting=\"vm.filterComponent\" data-options=\"vm.options\"></component-wrapper><component-wrapper ng-repeat=\"button in vm.listHeaderBar track by $index\" data-setting=\"button\" data-button-class=\"header\" data-options=\"vm.options\" class=\"header-action-button\">       </component-wrapper></div><div class=\"groups-action\"><button data-ng-if=\"vm.parentButton &amp;&amp; !vm.options.isLoading\" data-ng-click=\"vm.getParent()\" class=\"btn btn-sm btn-default\">{{'BUTTON.HIGHER_LEVEL' | translate}}</button></div><div data-ng-show=\"vm.request.isProcessing\" class=\"processing-status-wrapper\"><div class=\"processing-status\">{{'PERFORMS_ACTIONS' | translate}}</div></div>{{vm.request.isProcessing}}<table data-ng-hide=\"vm.options.isLoading\" class=\"table table-bordered items-list\"><thead><tr><td ng-if=\"vm.isContextMenu\" class=\"actions-header context-column\"></td><td data-ng-repeat=\"fieldItem in vm.tableFields\" data-ng-class=\"{ 'active' : fieldItem.field == vm.sortField, 'asc' : vm.sortingDirection, 'desc' : !vm.sortingDirection}\" data-ng-click=\"vm.changeSortField(fieldItem.field, fieldItem.sorted)\">{{fieldItem.displayName}}</td></tr></thead><tbody data-ng-if=\"vm.listLoaded\"><tr data-ng-repeat=\"item in vm.items\" data-ng-class=\"{'zhs-item' : item[vm.subType] &amp;&amp; item[vm.subType] !== undefined}\" data-ng-mousedown=\"vm.toggleContextViewByEvent(item[vm.idField], $event)\" oncontextmenu=\"return false;\"><td ng-if=\"vm.isContextMenu\" class=\"context-column\"><span data-ng-click=\"vm.toggleContextView(item[vm.idField])\" data-ng-show=\"(vm.contextLinks.length &amp;&amp; (item[vm.subType] || item[vm.subType] == undefined)) || (vm.mixContextLinks.length &amp;&amp; vm.entityType)\" class=\"context-toggle\">Toggle buttons</span><div data-ng-show=\"vm.contextId == item[vm.idField]\" data-ng-style=\"vm.styleContextMenu\" class=\"context-menu-wrapper\"><div data-ng-repeat=\"link in vm.contextLinks track by $index\" data-ng-if=\"item[vm.subType] !== vm.entityType || !vm.isMixMode\" data-ng-class=\"{'component-separator': link.separator}\" class=\"context-menu-item\"><component-wrapper data-setting=\"link\" data-entity-id=\"{{::item[vm.idField]}}\" data-button-class=\"context\" data-scope-id-parent=\"{{vm.scopeIdParent}}\" data-options=\"vm.options\"></component-wrapper></div><div data-ng-repeat=\"link in vm.mixContextLinks track by $index\" data-ng-if=\"vm.entityType &amp;&amp; item[vm.subType] === vm.entityType\" data-ng-class=\"{'component-separator': link.separator}\" class=\"context-menu-item\"><component-wrapper data-setting=\"link\" data-entity-id=\"{{::item[vm.idField]}}\" data-button-class=\"context\" data-scope-id-parent=\"{{vm.scopeIdParent}}\" data-options=\"vm.mixOption\"></component-wrapper></div></div></td><td data-ng-repeat=\"fieldItem in vm.tableFields track by $index\"><span data-ng-class=\"{'glyphicon-folder-open icon-mix-mode' : vm.isMixMode &amp;&amp; item[vm.subType] !== vm.entityType}\" data-ng-if=\"vm.prependIcon === fieldItem.field\" class=\"glyphicon\"></span><component-wrapper data-setting=\"fieldItem.component\" data-options=\"item.$options\" ng-style=\"{'padding-left': (item.parentPadding || 0) * 10 + 'px'}\"></component-wrapper></td></tr><tr data-ng-if=\"vm.items.length == 0\"><td colspan=\"{{vm.tableFields.length + vm.isContextMenu}}\">{{'ELEMENT_NO' | translate}}</td></tr></tbody><tfoot><tr><td colspan=\"{{vm.tableFields.length + vm.isContextMenu}}\"><component-wrapper data-ng-repeat=\"component in vm.listFooterBar track by $index\" data-setting=\"component\" data-options=\"vm.options\"></component-wrapper></td></tr></tfoot></table></div>");;return buf.join("");
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div style=\"background: #ebf1f3;\"><div data-ng-click=\"vm.cancel()\" style=\"display: block; position: absolute; top: 22px; right: 22px; width: 13px; height: 13px; cursor: pointer;\" ng-style=\"{'background-image':'url('+ vm.assetsPath +'/images/close.jpg)'}\" class=\"close-editor\"></div><div ng-show=\"vm.header\" class=\"ue-modal-header\"><label ng-bind=\"vm.header.label\"></label></div><div ng-show=\"vm.body\" class=\"ue-modal-body\"><div ng-bind=\"vm.body.text\" ng-show=\"vm.body.text\" class=\"text\"></div><div data-ng-if=\"vm.body &amp;&amp; vm.body.component\" class=\"field-content-wrapper\"><component-wrapper data-setting=\"vm.body\" data-options=\"vm.options\"></component-wrapper></div></div><div data-ng-show=\"vm.footer\" class=\"ue-modal-footer\"><component-wrapper data-ng-repeat=\"button in vm.footer track by $index\" data-setting=\"button\" data-options=\"vm.options\" data-button-class=\"header\" class=\"editor-modal-button\"></component-wrapper></div></div>");;return buf.join("");
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div><ul class=\"pagination col-lg-10 col-md-10 col-sm-10 col-xs-10\"><li data-ng-repeat=\"pageItem in vm.pageItemsArray\" data-ng-class=\"pageItem.self ? 'active' : ''\"><a data-ng-if=\"!pageItem.self\" href=\"#\" data-ng-click=\"vm.changePage($event, pageItem)\">{{pageItem.label}}</a><span data-ng-if=\"pageItem.self\">{{pageItem.label}}</span></li></ul><div dana-ng-if=\"vm.metaKey\" class=\"meta-info col-lg-2 col-md-2 col-sm-2 col-xs-2\">{{'ELEMENTS' | translate}} {{vm.metaData.fromItem}} - {{vm.metaData.toItem}} {{'FROM' | translate}} {{vm.metaData.totalCount}}</div></div>");;return buf.join("");
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\"><div data-ng-repeat=\"item in vm.optionValues\" data-ng-class=\"{'radiodisabled': vm.readonly}\">\t\t<label class=\"radio\"><input type=\"radio\" data-ng-disabled=\"vm.readonly\" data-ng-model=\"vm.fieldValue\" value=\"{{::item[vm.field_id]}}\"><span ng-bind=\"::item[vm.field_search]\"></span></label></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\"><div data-ng-if=\"vm.multiple\" data-ng-class=\"vm.classComponent\"><div data-ng-repeat=\"field_item in vm.fieldValue track by $index\" class=\"item-string-wrapper input-group\"><input type=\"{{vm.typeInput}}\" data-ui-mask=\"{{vm.mask}}\" data-ui-options=\"{maskDefinitions : vm.maskDefinitions}\" data-ng-disabled=\"vm.readonly\" name=\"{{vm.fieldName}}\" data-ng-model=\"vm.fieldValue[$index]\" step=\"{{vm.stepNumber}}\" data-ng-blur=\"vm.inputLeave(vm.fieldValue[$index], $index)\" ng-trim=\"false\" class=\"form-control input-sm\"><span class=\"input-group-btn\"><button data-ng-click=\"vm.removeItem($index)\" data-ng-if=\"!vm.readonly\" class=\"btn btn-default btn-sm\">x</button></span></div><div data-ng-click=\"vm.addItem()\" data-ng-disabled=\"vm.readonly\" class=\"btn btn-primary btn-sm\">{{'BUTTON.ADD' | translate}}</div></div><div data-ng-if=\"!vm.multiple\" data-ng-class=\"vm.classComponent\"><input type=\"{{vm.typeInput}}\" data-ui-mask=\"{{vm.mask}}\" data-ui-options=\"{maskDefinitions : vm.maskDefinitions}\" data-ng-disabled=\"vm.readonly\" name=\"{{vm.fieldName}}\" data-ng-model=\"vm.fieldValue\" step=\"{{vm.stepNumber}}\" data-ng-blur=\"vm.inputLeave(vm.fieldValue)\" size=\"{{vm.size}}\" ng-trim=\"false\" class=\"form-control input-sm\"></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\"><div data-ng-if=\"vm.multiple\" data-ng-class=\"vm.classComponent\"><div data-ng-repeat=\"field_item in vm.fieldValue track by $index\" class=\"item-textarea-wrapper\"><textarea name=\"{{vm.fieldName}}\" rows=\"{{vm.rows}}\" data-ng-disabled=\"vm.readonly\" data-ng-model=\"vm.fieldValue[$index]\" data-ng-blur=\"vm.inputLeave(vm.fieldValue[$index])\" data-ng-trim=\"false\" data-ui-mask=\"{{vm.mask}}\" data-ui-options=\"{maskDefinitions : vm.maskDefinitions}\" class=\"form-control editor-textarea\"></textarea><div data-ng-click=\"vm.removeItem($index)\" data-ng-if=\"!vm.readonly\" class=\"btn btn-default btn-sm\">x</div></div><div data-ng-click=\"vm.addItem()\" data-ng-disabled=\"vm.readonly\" class=\"btn btn-primary btn-sm\">{{'BUTTON.ADD' | translate}}</div></div><div data-ng-if=\"!vm.multiple\" data-ng-class=\"vm.classComponent\"><textarea name=\"{{vm.fieldName}}\" rows=\"{{vm.rows}}\" data-ng-disabled=\"vm.readonly\" data-ng-model=\"vm.fieldValue\" data-ng-blur=\"vm.inputLeave(vm.fieldValue)\" data-ng-trim=\"false\" data-ui-mask=\"{{vm.mask}}\" data-ui-options=\"{maskDefinitions : vm.maskDefinitions}\" class=\"form-control editor-textarea\"></textarea></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> " + (null == (jade_interp = __webpack_require__(10).call(this, locals)) ? "" : jade_interp) + "<div ng-class=\"{'filter-inner-wrapper': vm.options.filter, 'field-element': !vm.options.filter}\" ng-style=\"{'overflow:auto':vm.multiple}\"><div data-ng-if=\"vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><div data-ng-repeat=\"field_item in vm.fieldValue track by $index\" class=\"item-timepicker-wrapper input-group\"><input name=\"{{vm.fieldName}}\" data-ng-disabled=\"vm.readonly\" data-ng-model=\"vm.fieldValue[$index]\" data-date-time=\"\" data-format=\"{{vm.format || 'HH:mm'}}\" data-max-view=\"hours\" data-min-view=\"minutes\" data-view=\"hours\" data-ng-blur=\"vm.inputLeave(vm.fieldValue[$index])\" data-min-date=\"minDate\" data-max-date=\"maxDate\" class=\"form-control input-sm timepicker\"><span class=\"input-group-btn\"><button data-ng-click=\"vm.removeItem($index)\" data-ng-if=\"!vm.readonly\" class=\"btn btn-default btn-sm\">x</button></span></div><div data-ng-click=\"vm.addItem()\" data-ng-disabled=\"vm.readonly\" class=\"btn btn-primary btn-sm\">{{'BUTTON.ADD' | translate}}</div></div><div data-ng-if=\"!vm.multiple\" ng-class=\"{'col-lg-2 col-md-2 col-sm-3 col-xs-3 clear-padding-left': (!vm.options.isGroup &amp;&amp; !vm.options.filter)}\"><input name=\"{{vm.fieldName}}\" data-ng-disabled=\"vm.readonly\" data-ng-model=\"vm.fieldValue\" data-date-time=\"\" data-format=\"{{vm.format || 'HH:mm'}}\" data-max-view=\"hours\" data-min-view=\"minutes\" data-view=\"hours\" data-ng-blur=\"vm.inputLeave(vm.fieldValue)\" data-min-date=\"minDate\" data-max-date=\"maxDate\" class=\"form-control input-sm timepicker\"></div></div></div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<ul data-ng-if=\"vm.menu.length &gt; 1\" class=\"nav nav-tabs\"><li data-ng-repeat=\"item in vm.menu track by $index\" data-ng-class=\"(item.name === vm.type) ? 'active' : ''\" class=\"item\"><a data-ui-sref=\"{{item.sref}}\" ui-sref-opts=\"{reload: true, inherit: false}\">{{item.label}}</a></li></ul><div class=\"universal-editor\"></div>");;return buf.join("");
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(8);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (undefined) {
	buf.push("<div ng-class=\"{'field-wrapper row':!vm.options.filter, 'filter-wrapper-field': vm.options.filter}\"><div on-render-template ng-class=\"{'component-filter': vm.options.filter,                   'component-edit': ((vm.templates.edit &amp;&amp; !vm.options.filter) || (vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit',                   'component-preview': vm.templates.preview &amp;&amp; vm.regim === 'preview'}\" class=\"component-template\"></div><div ng-if=\"((!vm.templates.edit &amp;&amp; !vm.options.filter) || (!vm.templates.filter &amp;&amp; vm.options.filter)) &amp;&amp; vm.regim === 'edit'\" ng-class=\"{'component-filter': vm.options.filter}\" class=\"component-edit\"> </div><div ng-if=\"!vm.templates.preview &amp;&amp; vm.regim === 'preview'\" class=\"component-preview\"> <div data-ng-show=\"vm.loadingData\" class=\"loader-search-wrapper\"><div class=\"loader-search\">{{'LOADING' | translate}}</div></div><span ng-bind=\"::vm.previewValue\" data-ng-show=\"!vm.loadingData\" ng-if=\"!vm.multiple\"></span><div ng-repeat=\"value in vm.previewValue track by $index\" data-ng-show=\"!vm.loadingData\" ng-if=\"vm.multiple\"><span ng-bind=\"value\"></span></div></div>" + (null == (jade_interp = __webpack_require__(11).call(this, locals)) ? "" : jade_interp) + "</div>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./components/ueAutocomplete/ueAutocomplete.jade": 7,
		"./components/ueButtonFilter/ueButtonFilter.jade": 12,
		"./components/ueButtonGoto/ueButtonGoto.jade": 13,
		"./components/ueButtonModal/ueButtonModal.jade": 14,
		"./components/ueButtonRequest/ueButtonRequest.jade": 15,
		"./components/ueButtonService/ueButtonService.jade": 16,
		"./components/ueCheckbox/ueCheckbox.jade": 17,
		"./components/ueColorpicker/ueColorpicker.jade": 18,
		"./components/ueComponent/ueComponent.jade": 19,
		"./components/ueDate/ueDate.jade": 20,
		"./components/ueDatetime/ueDatetime.jade": 21,
		"./components/ueDropdown/dropdownItems.jade": 22,
		"./components/ueDropdown/ueDropdown.jade": 23,
		"./components/ueFilter/ueFilter.jade": 24,
		"./components/ueForm/ueForm.jade": 25,
		"./components/ueFormGroup/ueFormGroup.jade": 26,
		"./components/ueFormTabs/ueFormTabs.jade": 27,
		"./components/ueGrid/ueGrid.jade": 28,
		"./components/ueModal/ueModal.jade": 29,
		"./components/uePagination/uePagination.jade": 30,
		"./components/ueRadiolist/ueRadiolist.jade": 31,
		"./components/ueString/ueString.jade": 32,
		"./components/ueTextarea/ueTextarea.jade": 33,
		"./components/ueTime/ueTime.jade": 34,
		"./components/universalEditor/universalEditor.jade": 35,
		"./template/errorField/errorField.jade": 11,
		"./template/labelField/labelField.jade": 10,
		"./template/layouts/layoutComponent.jade": 36
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 37;


/***/ },
/* 38 */
/***/ function(module, exports) {

	(function () {
	    'use strict';
	    //debugger;

	    angular.module('universal.editor', ['universal.editor.templates', 'minicolors', 'datePicker', 'checklist-model', 'angularMoment', 'ngCookies', 'ngFileUpload', 'ui.router', 'ui.mask', 'toastr', 'pascalprecht.translate']);

	    angular.module('universal.editor').factory('EditorHttpInterceptor', EditorHttpInterceptor);

	    EditorHttpInterceptor.$inject = ['$q', '$rootScope', 'toastr', '$translate'];

	    function EditorHttpInterceptor($q, $rootScope, toastr, $translate) {
	        return {
	            'request': function (config) {
	                if (config.beforeSend) {
	                    config.beforeSend(config);
	                }

	                $rootScope.$broadcast('editor:request_start', '');

	                // Заменяем пустые массивы на null так как при отправке такие массивы игнорируются
	                if (config.data && typeof config.data === 'object') {
	                    angular.forEach(config.data, function (value, key) {
	                        if (angular.isArray(value) && value.length === 0) {
	                            config.data[key] = null;
	                        }
	                    });
	                }

	                return config;
	            },
	            'responseError': function (rejection) {
	                if (rejection.status !== -1) {
	                    try {
	                        var json = JSON.parse(JSON.stringify(rejection));

	                        if (rejection.data !== null && rejection.data.hasOwnProperty('message') && rejection.data.message.length > 0) {
	                            toastr.error(rejection.data.message);
	                        } else if (rejection.status === 422 || rejection.status === 400) {
	                            $translate('RESPONSE_ERROR.INVALID_DATA').then(function (translation) {
	                                toastr.warning(translation);
	                            });
	                        } else if (rejection.status === 401) {
	                            $translate('RESPONSE_ERROR.UNAUTHORIZED').then(function (translation) {
	                                toastr.warning(translation);
	                            });
	                        } else if (rejection.status === 403) {
	                            $translate('RESPONSE_ERROR.FORBIDDEN').then(function (translation) {
	                                toastr.error(translation);
	                            });
	                        } else {
	                            $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
	                                toastr.error(translation);
	                            });
	                        }
	                    } catch (e) {
	                        console.error(e);
	                        $translate('RESPONSE_ERROR.UNEXPECTED_RESPONSE').then(function (translation) {
	                            toastr.error(translation);
	                        });
	                    }
	                }

	                return $q.reject(rejection);
	            }
	        };
	    }

	    angular.module('universal.editor').config(universalEditorConfig);

	    universalEditorConfig.$inject = ['minicolorsProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$provide', '$injector'];

	    function universalEditorConfig(minicolorsProvider, $httpProvider, $stateProvider, $urlRouterProvider, $provide, $injector) {

	        var dataResolver;

	        angular.extend(minicolorsProvider.defaults, {
	            control: 'hue',
	            position: 'top left',
	            letterCase: 'uppercase'
	        });

	        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
	        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
	        $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
	        $httpProvider.defaults.transformRequest = function (data) {

	            if (data === undefined) {
	                return data;
	            }

	            return $.param(data);
	        };

	        $httpProvider.interceptors.push('EditorHttpInterceptor');

	        $provide.decorator('mFormatFilter', function () {
	            return function newFilter(m, format, tz) {
	                if (!moment.isMoment(m)) {
	                    return '';
	                }
	                if (tz) {
	                    return moment.tz(m, tz).format(format);
	                } else {
	                    return m.format(format);
	                }
	            };
	        });
	    }

	    angular.module('universal.editor').run(universalEditorRun);

	    universalEditorRun.$inject = ['$rootScope', '$location', '$state', 'EditEntityStorage', 'ModalService', 'FilterFieldsStorage', 'RestApiService'];

	    function universalEditorRun($rootScope, $location, $state, EditEntityStorage, ModalService, FilterFieldsStorage, RestApiService) {
	        var itemsSelector = document.querySelectorAll(".nav.nav-tabs .item");

	        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
	            FilterFieldsStorage.filterSearchString = !options.reload ? $location.search() : {};
	        });
	        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
	            var stateParamEntityId = toParams.type;
	            angular.forEach(itemsSelector, function (item) {
	                $(item).removeClass("active");
	                if ($(item).find("a")[0].hash.split("/")[2] == stateParamEntityId) {
	                    $(item).addClass("active");
	                }
	            });

	            if (FilterFieldsStorage.filterSearchString) {
	                $location.search(FilterFieldsStorage.filterSearchString);
	            }

	            var toStateConfig = EditEntityStorage.getStateConfig(toState.name);
	            if (toStateConfig && toStateConfig.component.name === 'ue-modal') {

	                /** if fromstate is empty, try get parent state */
	                if (!fromState.name) {
	                    var temp = toState.name.split('.');
	                    if (temp.length) {
	                        temp.splice(temp.length - 1, 1);
	                        fromState = {
	                            name: temp.join('.')
	                        };
	                    }
	                }
	                angular.extend(toStateConfig.component.settings, {
	                    fromState: fromState,
	                    fromParams: fromParams
	                });
	                ModalService.open(toStateConfig.component);
	            }
	        });
	        if (itemsSelector.length == 1) {
	            angular.element(itemsSelector).css("display", "none");
	        }
	        angular.element(document).ready(function () {
	            var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
	            if (pk === 'new') {
	                EditEntityStorage.newSourceEntity();
	            }
	        });
	    }
	})();

/***/ },
/* 39 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').config(LocalizationMessage);

	    LocalizationMessage.$inject = ['$translateProvider'];

	    function LocalizationMessage($translateProvider) {

	        var constantLang = {
	            'RESPONSE_ERROR': {
	                'INVALID_DATA': 'Неправильно заполнена форма',
	                'SERVICE_UNAVAILABLE': 'Сервис временно недоступен',
	                'UNEXPECTED_RESPONSE': 'Сервис вернул неожиданный ответ',
	                'UNAUTHORIZED': 'Требуется авторизация',
	                'RELOAD_PAGE': 'Требуется повторная авторизация, перезагрузите страницу',
	                'FORBIDDEN': 'Нет доступа',
	                'NOT_FOUND': 'Запись не найдена'
	            },
	            'CHANGE_RECORDS': {
	                'CREATE': 'Запись создана',
	                'UPDATE': 'Запись обновлена',
	                'DELETE': 'Запись удалена'
	            },
	            'BUTTON': {
	                'ADD': 'Добавить',
	                'DELETE': 'Удалить',
	                'DELETE_MARK': 'Удалить метку',
	                'APPLY': 'Применить',
	                'CLEAN': 'Очистить',
	                'HIGHER_LEVEL': 'На уровень выше',
	                'FILTER': 'Фильтр'
	            },
	            'LOADING': 'Загрузка',
	            'SELECT_VALUE': 'Выберите значение',
	            'PERFORMS_ACTIONS': 'Выполняется действие',
	            'ELEMENT_NO': 'Нет элементов для отображения',
	            'ELEMENTS': 'Элементы',
	            'FROM': 'из',
	            'SEARCH_ELEMENTS': 'Поиск по элементам'
	        };
	        $translateProvider.translations('ru', constantLang);

	        $translateProvider.useStaticFilesLoader({
	            prefix: '',
	            suffix: ''
	        });
	        $translateProvider.preferredLanguage('ru');
	    }
	})();

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./components/componentWrapper/componentWrapper.component.js": 41,
		"./components/componentWrapper/componentWrapper.controller.js": 42,
		"./components/ueAutocomplete/ueAutocomplete.component.js": 43,
		"./components/ueAutocomplete/ueAutocomplete.controller.js": 44,
		"./components/ueButtonFilter/ueButtonFilter.component.js": 45,
		"./components/ueButtonFilter/ueButtonFilter.controller.js": 46,
		"./components/ueButtonGoto/ueButtonGoto.component.js": 47,
		"./components/ueButtonGoto/ueButtonGoto.controller.js": 48,
		"./components/ueButtonModal/ueButtonModal.component.js": 49,
		"./components/ueButtonModal/ueButtonModal.controller.js": 50,
		"./components/ueButtonRequest/ueButtonRequest.component.js": 51,
		"./components/ueButtonRequest/ueButtonRequest.controller.js": 52,
		"./components/ueButtonService/ueButtonService.component.js": 53,
		"./components/ueButtonService/ueButtonService.controller.js": 54,
		"./components/ueCheckbox/ueCheckbox.component.js": 55,
		"./components/ueCheckbox/ueCheckbox.controller.js": 56,
		"./components/ueColorpicker/ueColorpicker.component.js": 57,
		"./components/ueColorpicker/ueColorpicker.controller.js": 58,
		"./components/ueComponent/ueComponent.component.js": 59,
		"./components/ueComponent/ueComponent.controller.js": 60,
		"./components/ueDate/ueDate.component.js": 61,
		"./components/ueDate/ueDate.controller.js": 62,
		"./components/ueDatetime/ueDatetime.component.js": 63,
		"./components/ueDatetime/ueDatetime.controller.js": 64,
		"./components/ueDropdown/dropdownItems.controller.js": 65,
		"./components/ueDropdown/dropdownItems.directive.js": 66,
		"./components/ueDropdown/ueDropdown.component.js": 67,
		"./components/ueDropdown/ueDropdown.controller.js": 68,
		"./components/ueFilter/ueFilter.component.js": 69,
		"./components/ueFilter/ueFilter.controller.js": 70,
		"./components/ueForm/ueForm.component.js": 71,
		"./components/ueForm/ueForm.controller.js": 72,
		"./components/ueFormGroup/ueFormGroup.component.js": 73,
		"./components/ueFormGroup/ueFormGroup.controller.js": 74,
		"./components/ueFormTabs/ueFormTabs.component.js": 75,
		"./components/ueFormTabs/ueFormTabs.controller.js": 76,
		"./components/ueGrid/ueGrid.component.js": 77,
		"./components/ueGrid/ueGrid.controller.js": 78,
		"./components/ueModal/ueModal.comonent.js": 79,
		"./components/uePagination/uePagination.component.js": 80,
		"./components/uePagination/uePagination.controller.js": 81,
		"./components/ueRadiolist/ueRadiolist.component.js": 82,
		"./components/ueRadiolist/ueRadiolist.controller.js": 83,
		"./components/ueString/ueString.component.js": 84,
		"./components/ueString/ueString.controller.js": 85,
		"./components/ueTextarea/ueTextarea.component.js": 86,
		"./components/ueTextarea/ueTextarea.controller.js": 87,
		"./components/ueTime/ueTime.component.js": 88,
		"./components/ueTime/ueTime.controller.js": 89,
		"./components/universalEditor/universalEditor.controller.js": 90,
		"./controllers/Base.controller.js": 91,
		"./controllers/Buttons.controller.js": 92,
		"./controllers/Fields.controller.js": 93,
		"./directives/renderTemplate.directive.js": 94,
		"./factories/ComponentBuilder.js": 95,
		"./localization.configFile.js": 39,
		"./provider/ConfigData.provider.js": 96,
		"./services/ButtonsService.js": 97,
		"./services/EditEntityStorage.js": 98,
		"./services/FilterFieldsStorage.js": 99,
		"./services/ModalService.js": 100,
		"./services/RestApi.service.js": 101,
		"./templates.module.js": 5,
		"./universal-editor.js": 102,
		"./universal-editor.module.js": 38
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 40;


/***/ },
/* 41 */
/***/ function(module, exports) {

	(function () {
	    'use strict';
	    //var $ = require('jquery');

	    var componentWrapper = {
	        bindings: {
	            setting: '=',
	            entityId: '@',
	            buttonClass: '@',
	            options: '='
	        },
	        controller: 'ComponentWrapperController',
	        controllerAs: 'vm'
	    };

	    angular.module('universal.editor').component('componentWrapper', componentWrapper);
	})();

/***/ },
/* 42 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('ComponentWrapperController', ComponentWrapperController);

	    ComponentWrapperController.$inject = ['$element', '$scope', 'ComponentBuilder'];

	    function ComponentWrapperController($element, $scope, ComponentBuilder) {
	        var vm = this;
	        $scope.setting = vm.setting;
	        $scope.setting.entityId = vm.entityId;
	        $scope.setting.buttonClass = vm.buttonClass;
	        $scope.options = vm.options || {};

	        //$scope.filter = vm.filter || false;
	        //$scope.filterParameters = vm.filterParameters;
	        //$scope.setting.scopeIdParent = vm.scopeIdParent;

	        this.$postLink = function () {
	            $element.on('$destroy', function () {
	                $scope.$destroy();
	            });
	            var elem = new ComponentBuilder($scope).build();
	            $element.addClass('component-wrapper');
	            $element.append(elem);
	        };
	    }
	})();

/***/ },
/* 43 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueAutocomplete = {
	        bindings: {
	            setting: '<',
	            options: '<'
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueAutocomplete/ueAutocomplete.html');
	        }],
	        controller: 'UeAutocompleteController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc Autocomplete-type field.
	     * @example <ue-autocomplete></ue-autocomplete>
	     */
	    angular.module('universal.editor').component('ueAutocomplete', ueAutocomplete);
	})();

/***/ },
/* 44 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeAutocompleteController', UeAutocompleteController);

	    UeAutocompleteController.$inject = ['$scope', '$element', '$document', 'EditEntityStorage', 'RestApiService', '$timeout', 'FilterFieldsStorage', '$controller'];

	    function UeAutocompleteController($scope, $element, $document, EditEntityStorage, RestApiService, $timeout, FilterFieldsStorage, $controller) {
	        /* jshint validthis: true */
	        var vm = this,
	            inputTimeout;
	        vm.optionValues = [];
	        angular.extend(vm, $controller('FieldsController', { $scope: $scope }));
	        var componentSettings = vm.setting.component.settings;

	        vm.selectedValues = [];
	        vm.inputValue = "";
	        vm.possibleValues = [];
	        vm.activeElement = 0;
	        vm.preloadedData = true;
	        vm.searching = false;
	        vm.maxItemsCount = componentSettings.maxItems || Number.POSITIVE_INFINITY;
	        vm.minCount = componentSettings.minCount || 2;
	        vm.sizeInput = 1;
	        vm.classInput = { 'width': '1px' };
	        vm.showPossible = false;

	        if (!vm.multiple) {
	            vm.classInput.width = '99%';
	            vm.classInput['padding-right'] = '25px';
	        }

	        if (vm.options.filter) {
	            loadValues();
	        }

	        $element.bind("keydown", function (event) {
	            var possibleValues;
	            switch (event.which) {
	                case 13:
	                    event.preventDefault();
	                    if (vm.possibleValues.length < 1) {
	                        break;
	                    }

	                    $timeout(function () {
	                        vm.addToSelected(event, vm.possibleValues[vm.activeElement]);
	                    }, 0);

	                    break;
	                case 40:
	                    event.preventDefault();
	                    if (vm.possibleValues.length < 1) {
	                        break;
	                    }

	                    possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

	                    if (vm.activeElement < vm.possibleValues.length - 1) {
	                        $timeout(function () {
	                            vm.activeElement++;
	                        }, 0);

	                        $timeout(function () {
	                            var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
	                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
	                                wrapperScroll = possibleValues[0].scrollTop,
	                                wrapperHeight = possibleValues[0].clientHeight;

	                            if (activeTop >= wrapperHeight + wrapperScroll - activeHeight) {
	                                possibleValues[0].scrollTop += activeHeight + 1;
	                            }
	                        }, 1);
	                    }
	                    break;
	                case 38:
	                    event.preventDefault();
	                    if (vm.possibleValues.length < 1) {
	                        break;
	                    }

	                    possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

	                    if (vm.activeElement > 0) {
	                        $timeout(function () {
	                            vm.activeElement--;
	                        }, 0);

	                        $timeout(function () {
	                            var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
	                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
	                                wrapperScroll = possibleValues[0].scrollTop,
	                                wrapperHeight = possibleValues[0].clientHeight;

	                            if (activeTop < wrapperScroll) {
	                                possibleValues[0].scrollTop -= activeHeight + 1;
	                            }
	                        }, 1);
	                    }
	                    break;
	            }
	        });

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (event, data) {
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                vm.loadingData = true;
	                $scope.onLoadDataHandler(event, data);
	                componentSettings.$loadingPromise.then(function (optionValues) {
	                    vm.optionValues = optionValues;
	                    vm.equalPreviewValue();
	                }).finally(function () {
	                    vm.loadingData = false;
	                });
	            }
	        }));

	        vm.listeners.push($scope.$watch(function () {
	            return vm.inputValue;
	        }, function (newValue) {
	            if (newValue) {
	                if (inputTimeout) {
	                    $timeout.cancel(inputTimeout);
	                }
	                vm.showPossible = true;
	                vm.possibleValues = [];
	                if (vm.multiple) {
	                    vm.sizeInput = newValue.length || 1;
	                    if (vm.sizeInput === 1 && newValue.length != 1) {
	                        vm.classInput.width = '1px';
	                    } else {
	                        vm.classInput.width = 'initial';
	                    }
	                }
	                inputTimeout = $timeout(function () {
	                    autocompleteSearch(newValue);
	                }, 300);
	            }
	        }, true));

	        /* PUBLIC METHODS */

	        vm.addToSelected = function (event, obj) {
	            //** if you know only id  of the record            
	            if (!vm.multiple) {
	                vm.selectedValues = [];
	                vm.placeholder = obj[vm.field_search];
	                vm.fieldValue = obj[vm.field_id];
	            } else {
	                vm.fieldValue.push(obj[vm.field_id]);
	            }
	            vm.selectedValues.push(obj);
	            $element.find('.autocomplete-field-search').removeClass('hidden');
	            vm.inputValue = "";
	            vm.sizeInput = 1;
	            vm.possibleValues = [];
	            if (event && !vm.multiple) {
	                event.stopPropagation();
	            }
	        };

	        vm.removeFromSelected = function (event, obj) {
	            if (!vm.multiple) {
	                vm.fieldValue = null;
	            }
	            angular.forEach(vm.selectedValues, function (val, key) {
	                if (val[vm.field_id] == obj[vm.field_id]) {
	                    vm.selectedValues.splice(key, 1);
	                    if (!vm.multiple) {
	                        vm.placeholder = '';
	                    } else {
	                        vm.fieldValue.splice(key, 1);
	                    }
	                }
	            });
	        };

	        /* PRIVATE METHODS */

	        function autocompleteSearch(searchString) {
	            vm.error = [];

	            if (searchString === "" || searchString.length <= vm.minCount) {
	                return;
	            }
	            vm.searching = true;
	            if (componentSettings.hasOwnProperty("values")) {
	                angular.forEach(componentSettings.values, function (v, key) {
	                    var obj = {};
	                    if (angular.isArray(componentSettings.values)) {
	                        obj[vm.field_id] = v;
	                    } else {
	                        obj[vm.field_id] = key;
	                    }
	                    obj[vm.field_search] = v;
	                    if (v.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 && !alreadyIn(obj, vm.selectedValues)) {
	                        vm.possibleValues.push(obj);
	                    }
	                });
	                vm.activeElement = 0;
	                vm.searching = false;
	            } else {
	                var urlParam = {};
	                urlParam[vm.field_search] = "%" + searchString + "%";
	                RestApiService.getUrlResource(componentSettings.valuesRemote.url + "?filter=" + JSON.stringify(urlParam)).then(function (response) {
	                    angular.forEach(response.data.items, function (v) {
	                        if (!alreadyIn(v, vm.selectedValues) && !alreadyIn(v, vm.possibleValues)) {
	                            vm.possibleValues.push(v);
	                        }
	                    });
	                    vm.activeElement = 0;
	                    vm.searching = false;
	                }, function (reject) {
	                    console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
	                    vm.searching = false;
	                });
	            }
	        }

	        function alreadyIn(obj, list) {
	            if (list) {
	                return list.filter(function (v) {
	                    return v[vm.field_id] == obj[vm.field_id];
	                }).length;
	            }
	            return false;
	        }

	        function loadValues() {
	            vm.preloadedData = false;
	            if (componentSettings.hasOwnProperty("values")) {
	                angular.forEach(componentSettings.values, function (v, key) {
	                    var obj = {};
	                    if (Array.isArray(vm.fieldValue) && vm.fieldValue.indexOf(key) >= 0 && vm.multiple) {
	                        if (angular.isArray(componentSettings.values)) {
	                            obj[vm.field_id] = v;
	                        } else {
	                            obj[vm.field_id] = key;
	                        }
	                        obj[vm.field_search] = v;
	                        vm.selectedValues.push(obj);
	                    } else if ((vm.fieldValue == key || vm.fieldValue == v) && !vm.multiple) {
	                        if (angular.isArray(componentSettings.values)) {
	                            obj[vm.field_id] = v;
	                        } else {
	                            obj[vm.field_id] = key;
	                        }
	                        obj[vm.field_search] = v;
	                        vm.selectedValues.push(obj);
	                        vm.placeholder = obj[vm.field_search];
	                    }
	                });
	                vm.preloadedData = true;
	            } else if (componentSettings.hasOwnProperty('valuesRemote')) {

	                if (!vm.fieldValue) {
	                    vm.preloadedData = true;
	                    return;
	                }

	                var urlParam = {};
	                if (angular.isArray(vm.fieldValue)) {
	                    urlParam[vm.field_id] = vm.fieldValue;
	                } else {
	                    urlParam[vm.field_id] = [];
	                    urlParam[vm.field_id].push(vm.fieldValue);
	                }

	                RestApiService.getUrlResource(componentSettings.valuesRemote.url + '?filter=' + JSON.stringify(urlParam)).then(function (response) {
	                    angular.forEach(response.data.items, function (v) {
	                        if (Array.isArray(vm.fieldValue) && (vm.fieldValue.indexOf(v[vm.field_id]) >= 0 || vm.fieldValue.indexOf(String(v[vm.field_id])) >= 0) && vm.multiple && !alreadyIn(v, vm.selectedValues)) {
	                            vm.selectedValues.push(v);
	                        } else if (vm.fieldValue == v[vm.field_id] && !vm.multiple) {
	                            vm.selectedValues.push(v);
	                            vm.placeholder = v[vm.field_search];
	                        }
	                    });
	                    vm.preloadedData = true;
	                }, function (reject) {
	                    vm.preloadedData = true;
	                    console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
	                });
	            } else {
	                vm.preloadedData = true;
	                console.error('EditorFieldAutocompleteController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
	            }
	        }

	        vm.focusPossible = function (isActive) {
	            vm.isActivePossible = isActive;
	            if (!isActive) {
	                vm.showPossible = false;
	            }
	            if (!vm.multiple) {
	                if ($element.find('.autocomplete-item').length > 0) {
	                    if (isActive) {
	                        $element.find('.autocomplete-field-search').removeClass('hidden');
	                        $element.find('.autocomplete-item').addClass('opacity-item');
	                    } else {
	                        $element.find('.autocomplete-field-search').addClass('hidden');
	                        $element.find('.autocomplete-item').removeClass('opacity-item');
	                    }
	                }
	            }
	        };

	        vm.deleteToAutocomplete = function (event) {
	            if (event.which == 8 && !!vm.selectedValues && !!vm.selectedValues.length && !vm.inputValue && vm.multiple) {
	                vm.removeFromSelected(event, vm.selectedValues[vm.selectedValues.length - 1]);
	            }
	        };

	        this.$postLink = function () {

	            $scope.inputFocus = function () {
	                if (!vm.multiple) {
	                    $element.find('.autocomplete-field-search').removeClass('hidden');
	                    $element.find('.autocomplete-item').addClass('opacity-item');
	                }
	                vm.showPossible = true;
	                $element.find('input')[0].focus();
	            };

	            $element.on('$destroy', function () {
	                $scope.$destroy();
	            });
	        };

	        vm.clear = clear;
	        function clear() {
	            vm.fieldValue = vm.multiple ? [] : null;
	            $element.find('.autocomplete-field-search').removeClass('hidden');
	            vm.inputValue = "";
	            vm.sizeInput = 1;
	            vm.selectedValues = [];
	            vm.placeholder = '';
	        }
	    }
	})();

/***/ },
/* 45 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueButtonFilter = {
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueButtonFilter/ueButtonFilter.html');
	        }],
	        bindings: {
	            setting: '<',
	            options: '<'
	        },
	        controller: 'UeButtonFilterController',
	        controllerAs: 'vm'
	    };

	    angular.module('universal.editor').component('ueButtonFilter', ueButtonFilter);
	})();

/***/ },
/* 46 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeButtonFilterController', UeButtonFilterController);

	    UeButtonFilterController.$inject = ['$rootScope', '$scope', '$element', 'FilterFieldsStorage', '$location', '$controller'];

	    function UeButtonFilterController($rootScope, $scope, $element, FilterFieldsStorage, $location, $controller) {
	        $element.addClass('ue-button');
	        $element.addClass('grey');

	        var vm = this;
	        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));

	        var parentComponentId = vm.options.$parentComponentId;

	        $element.bind("click", function () {
	            var filterJSON = null,
	                filters;

	            var parentComponentId = vm.options.$parentComponentId;

	            if (vm.beforeSend) {
	                FilterFieldsStorage.callbackBeforeSend = vm.beforeSend;
	            }

	            filters = $location.search().filter;
	            if (filters) {
	                filters = JSON.parse(filters);
	            }

	            if (vm.action === 'send') {
	                var filterEntity = FilterFieldsStorage.calculate(parentComponentId);

	                if (filterEntity) {
	                    filters = filters || {};
	                    filters[parentComponentId] = filterEntity;
	                }

	                if (filterEntity === false) {
	                    filters = filters || {};
	                    delete filters[parentComponentId];
	                }
	                filterJSON = filters && !$.isEmptyObject(filters) ? JSON.stringify(filters) : null;
	            }

	            if (vm.action === 'clear') {
	                FilterFieldsStorage.clearFiltersValue(parentComponentId);
	                if (filters) {
	                    delete filters[parentComponentId];
	                    if (!$.isEmptyObject(filters)) {
	                        filterJSON = JSON.stringify(filters);
	                    }
	                }
	            }
	            $location.search('filter', filterJSON);
	            $rootScope.$broadcast('editor:read_entity', vm.options);
	        });

	        $element.on('$destroy', function () {
	            $scope.$destroy();
	        });
	    }
	})();

/***/ },
/* 47 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueButtonGoto = {
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueButtonGoto/ueButtonGoto.html');
	        }],
	        bindings: {
	            setting: '<',
	            options: '<'
	        },
	        controller: 'UeButtonGotoController',
	        controllerAs: 'vm'
	    };

	    angular.module('universal.editor').component('ueButtonGoto', ueButtonGoto);
	})();

/***/ },
/* 48 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeButtonGotoController', UeButtonGotoController);

	    UeButtonGotoController.$inject = ['$scope', '$element', 'RestApiService', '$state', '$location', 'configData', 'EditEntityStorage', 'ModalService', '$timeout', '$controller'];

	    function UeButtonGotoController($scope, $element, RestApiService, $state, $location, configData, EditEntityStorage, ModalService, $timeout, $controller) {
	        $element.addClass('ue-button');

	        var vm = this;
	        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));
	        var state = vm.setting.component.settings.state;
	        vm.entityId = vm.entityId || 'new';

	        $element.bind("click", function () {
	            console.log("angular version(webpack) is " + angular.version.full);
	            console.log("jquery version(webpack) is " + $.fn.jquery);
	            var stateOptions = {
	                reload: true
	            };

	            if (vm.options.isLoading) {
	                return;
	            }

	            var toStateConfig = EditEntityStorage.getStateConfig(state);
	            if (!toStateConfig) {
	                console.warn('Стейт ' + state + ' не зайден в конфигурационном файле.');
	            }
	            var pkKey = 'pk' + EditEntityStorage.getLevelChild(toStateConfig.name);
	            var params = {};
	            params[pkKey] = vm.entityId;

	            var searchString = $location.search();
	            if (toStateConfig) {
	                if (toStateConfig.component.name === 'ue-modal') {
	                    ModalService.options = vm.options;
	                    stateOptions.reload = false;
	                } else {
	                    if (!!vm.options && !!vm.options.back) {
	                        searchString.back = EditEntityStorage.getStateConfig().name;
	                    }
	                }
	            }

	            $state.go(toStateConfig.name, params, stateOptions).then(function () {
	                $location.search(searchString);
	                $timeout(function () {
	                    var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
	                    if (pk === 'new' && !ModalService.isModalOpen()) {
	                        EditEntityStorage.newSourceEntity(vm.options.$parentComponentId, vm.setting.component.settings.dataSource.parentField);
	                    }
	                }, 0);
	            });
	        });

	        vm.$postLink = function () {
	            $element.on('$destroy', function () {
	                $scope.$destroy();
	            });
	        };
	    }
	})();

/***/ },
/* 49 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueButtonModal = {
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueButtonModal/ueButtonModal.html');
	        }],
	        bindings: {
	            setting: '<',
	            options: '<'
	        },
	        controller: 'UeButtonModalController',
	        controllerAs: 'vm'
	    };

	    angular.module('universal.editor').component('ueButtonModal', ueButtonModal);
	})();

/***/ },
/* 50 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeButtonModalController', UeButtonModalController);

	    UeButtonModalController.$inject = ['$rootScope', '$scope', '$element', 'RestApiService', 'configData', '$window', 'ModalService', 'ButtonsService', '$controller'];

	    function UeButtonModalController($rootScope, $scope, $element, RestApiService, configData, $window, ModalService, ButtonsService, $controller) {
	        $element.addClass('ue-button');

	        var vm = this;

	        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));

	        $element.bind("click", function () {
	            if (vm.action === 'close') {
	                if (vm.beforeAction) {
	                    vm.beforeAction();
	                }
	                ModalService.close(true);
	            }
	        });
	    }
	})();

/***/ },
/* 51 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueButtonRequest = {
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueButtonRequest/ueButtonRequest.html');
	        }],
	        bindings: {
	            setting: '<',
	            options: '<'
	        },
	        controller: 'UeButtonRequestController',
	        controllerAs: 'vm'
	    };

	    angular.module('universal.editor').component('ueButtonRequest', ueButtonRequest);
	})();

/***/ },
/* 52 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeButtonRequestController', UeButtonRequestController);

	    UeButtonRequestController.$inject = ['$rootScope', '$scope', '$element', 'RestApiService', 'configData', 'ButtonsService', '$controller'];

	    function UeButtonRequestController($rootScope, $scope, $element, RestApiService, configData, ButtonsService, $controller) {
	        $element.addClass('ue-button');

	        var vm = this;

	        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));

	        vm.classButton = 'btn btn-md btn-success button-footer';

	        switch (vm.setting.buttonClass) {
	            case 'header':
	                vm.classButton = 'btn btn-lg btn-success';
	                break;
	            case 'context':
	                vm.classButton = 'editor-action-button';
	                break;
	        }

	        vm.buttonClick = function () {
	            if (!!vm.setting.component.settings.target) {
	                window.open(vm.setting.component.settings.url, vm.setting.component.settings.target);
	            } else {
	                var request = {
	                    url: vm.setting.component.settings.url,
	                    method: vm.setting.component.settings.method,
	                    beforeSend: vm.beforeSend
	                };
	                RestApiService.actionRequest(request).then(function (response) {
	                    if (!!vm.success) {
	                        vm.success(response);
	                    }
	                }, function (reject) {
	                    if (!!vm.error) {
	                        vm.error(reject);
	                    }
	                }).finally(function () {
	                    if (!!vm.complete) {
	                        vm.complete();
	                    }
	                    vm.options.isLoading = false;
	                });
	            }
	        };

	        vm.$postLink = function () {
	            $element.on('$destroy', function () {
	                $scope.$destroy();
	            });
	        };
	    }
	})();

/***/ },
/* 53 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueButtonService = {
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueButtonService/ueButtonService.html');
	        }],
	        bindings: {
	            setting: '<',
	            options: '<'
	        },
	        controller: 'UeButtonServiceController',
	        controllerAs: 'vm'
	    };

	    angular.module('universal.editor').component('ueButtonService', ueButtonService);
	})();

/***/ },
/* 54 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeButtonServiceController', UeButtonServiceController);

	    UeButtonServiceController.$inject = ['$rootScope', '$scope', '$element', 'EditEntityStorage', 'RestApiService', 'ModalService', '$state', '$controller', '$location'];

	    function UeButtonServiceController($rootScope, $scope, $element, EditEntityStorage, RestApiService, ModalService, $state, $controller, $location) {
	        $element.addClass('ue-button');

	        var vm = this;
	        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));
	        var request = {};
	        if (vm.setting.component.settings.request) {
	            request = JSON.parse(vm.setting.component.settings.request);
	        }

	        var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
	        var pk = $state.params[pkKey];
	        if (vm.action === 'delete') {
	            vm.disabled = pk === 'new' || !pk;
	        }

	        request.options = vm.options;
	        $element.bind("click", function () {
	            if (vm.options.isLoading || vm.disabled && vm.setting.buttonClass !== 'context') {
	                return;
	            }
	            switch (vm.action) {
	                case 'save':
	                    if (vm.type == 'create') {
	                        EditEntityStorage.editEntityUpdate("create", request);
	                    } else if (vm.type == 'update') {
	                        RestApiService.editedEntityId = vm.entityId;
	                        EditEntityStorage.editEntityUpdate("update", request);
	                    }
	                    break;
	                case 'delete':
	                    if (confirm("Удалить запись «" + vm.entityId + "»?")) {
	                        request.entityId = vm.entityId;
	                        request.setting = vm.setting;
	                        RestApiService.deleteItemById(request);
	                    }
	                    break;
	                case 'presave':
	                    RestApiService.editedEntityId = vm.entityId;
	                    EditEntityStorage.editEntityPresave(request);
	                    break;
	                case 'open':
	                    var newRequest = {};
	                    newRequest.id = vm.entityId;
	                    newRequest.options = vm.options;
	                    newRequest.url = vm.setting.url;
	                    newRequest.parentField = vm.setting.parentField;
	                    newRequest.headComponent = vm.setting.headComponent;
	                    RestApiService.loadChilds(newRequest);
	                    break;
	            }
	        });

	        $scope.$on("editor:presave_entity_created", function (event, data) {
	            if (!vm.options.isGrid && (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId)) {
	                vm.entityId = data[vm.setting.component.settings.dataSource.primaryKey];
	                vm.type = 'update';
	                if (vm.action === 'delete') {
	                    vm.disabled = false;
	                }
	            }
	        });
	    }
	})();

/***/ },
/* 55 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueCheckbox = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueCheckbox/ueCheckbox.html');
	        }],
	        controller: 'UeCheckboxController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc Checkbox-type field.
	     * @example <ue-checkbox></ue-checkbox>
	     */
	    angular.module('universal.editor').component('ueCheckbox', ueCheckbox);
	})();

/***/ },
/* 56 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeCheckboxController', UeCheckboxController);

	    UeCheckboxController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'FilterFieldsStorage', '$controller'];

	    function UeCheckboxController($scope, $element, EditEntityStorage, RestApiService, FilterFieldsStorage, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        var componentSettings = vm.setting.component.settings;
	        componentSettings.$fieldType = 'array';
	        vm.optionValues = [];
	        vm.inputValue = "";
	        vm.newEntityLoaded = newEntityLoaded;

	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        //vm.singleValue = angular.isArray(vm.optionValues) && vm.optionValues.length === 1 && !vm.optionValues[0][vm.field_search];
	        vm.singleValue = !componentSettings.hasOwnProperty('values') && !componentSettings.hasOwnProperty('valuesRemote');

	        if (vm.singleValue) {
	            vm.checkBoxStyle = 'display: inline;';
	            vm.getFieldValue = function () {
	                var field = {},
	                    wrappedFieldValue;
	                if (angular.isArray(vm.fieldValue)) {
	                    wrappedFieldValue = vm.fieldValue.length == 0 ? componentSettings.falseValue : componentSettings.trueValue;
	                } else {
	                    wrappedFieldValue = vm.fieldValue || componentSettings.falseValue;
	                }

	                if (vm.parentField) {
	                    field[vm.parentField] = {};
	                    field[vm.parentField][vm.fieldName] = wrappedFieldValue;
	                } else {
	                    field[vm.fieldName] = wrappedFieldValue;
	                }

	                return field;
	            };
	        }

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                $scope.onLoadDataHandler(e, data);
	                if (vm.singleValue) {
	                    vm.optionValues = [];
	                    vm.fieldValue = vm.fieldValue == componentSettings.trueValue ? [componentSettings.trueValue] : [];
	                    var obj = {};
	                    obj[vm.field_id] = componentSettings.trueValue;
	                    obj[vm.field_search] = componentSettings.label;
	                    vm.label = '';
	                    vm.optionValues.push(obj);
	                } else {
	                    componentSettings.$loadingPromise.then(function (optionValues) {
	                        vm.optionValues = optionValues;
	                        vm.equalPreviewValue();
	                    }).finally(function () {
	                        vm.loadingData = false;
	                    });
	                }
	            }
	        }));

	        function newEntityLoaded() {
	            vm.fieldValue = [];
	            angular.forEach(vm.setting.component.settings.defaultValue, function (item) {
	                if (vm.setting.component.settings.multiname) {
	                    vm.fieldValue.push(item[vm.setting.component.settings.multiname]);
	                } else {
	                    vm.fieldValue.push(item);
	                }
	            });
	        }
	    }
	})();

/***/ },
/* 57 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueColorpicker = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueColorpicker/ueColorpicker.html');
	        }],
	        controller: 'UeColorpickerController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc Colorpicker-type field.
	     * @example <ue-colorpicker></ue-colorpicker>
	     */
	    angular.module('universal.editor').component('ueColorpicker', ueColorpicker);
	})();

/***/ },
/* 58 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeColorpickerController', UeColorpickerController);

	    UeColorpickerController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$state', '$controller'];

	    function UeColorpickerController($scope, $element, EditEntityStorage, FilterFieldsStorage, $state, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        var componentSettings = vm.setting.component.settings;

	        componentSettings.defaultValue = componentSettings.multiple ? componentSettings.defaultValue || ['#000000'] : componentSettings.defaultValue || '#000000';
	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);

	        vm.addItem = addItem;
	        vm.removeItem = removeItem;

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            $scope.onLoadDataHandler(e, data);
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                vm.equalPreviewValue();
	            }
	        }));
	        //-- private functions
	        function removeItem(index) {
	            if (angular.isArray(vm.fieldValue)) {
	                vm.fieldValue.forEach(function (value, key) {
	                    if (key == index) {
	                        vm.fieldValue.splice(index, 1);
	                    }
	                });
	            }
	        }

	        function addItem() {
	            vm.fieldValue.push('#000000');
	        }
	    }
	})();

/***/ },
/* 59 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueComponent = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueComponent/ueComponent.html');
	        }],
	        controller: 'UeComponentController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc component-type field.
	     * @example <ue-component></ue-component>
	     */
	    angular.module('universal.editor').component('ueComponent', ueComponent);
	})();

/***/ },
/* 60 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeComponentController', UeComponentController);

	    UeComponentController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$location', '$controller', '$timeout'];

	    function UeComponentController($scope, $element, EditEntityStorage, FilterFieldsStorage, $location, $controller, $timeout) {
	        /* jshint validthis: true */
	        var vm = this;
	        var baseController = $controller('BaseController', { $scope: $scope });
	        angular.extend(vm, baseController);
	    }
	})();

/***/ },
/* 61 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueDate = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueDate/ueDate.html');
	        }],
	        controller: 'UeDateController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc String-type field.
	     * @example <ue-date></ue-date>
	     */
	    angular.module('universal.editor').component('ueDate', ueDate);
	})();

/***/ },
/* 62 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeDateController', UeDateController);

	    UeDateController.$inject = ['$scope', '$element', 'EditEntityStorage', 'moment', 'FilterFieldsStorage', '$controller'];

	    function UeDateController($scope, $element, EditEntityStorage, moment, FilterFieldsStorage, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        var componentSettings = vm.setting.component.settings;
	        componentSettings.$fieldType = 'date';
	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        vm.addItem = addItem;
	        vm.removeItem = removeItem;
	        vm.format = vm.format || 'DD.MM.YYYY';
	        $scope.minDate = !vm.minDate ? vm.minDate : moment(vm.minDate, vm.format);
	        $scope.maxDate = !vm.maxDate ? vm.maxDate : moment(vm.maxDate, vm.format);

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            $scope.onLoadDataHandler(e, data);
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                vm.equalPreviewValue();
	            }
	        }));

	        function removeItem(index) {
	            if (angular.isArray(vm.fieldValue)) {
	                vm.fieldValue.forEach(function (value, key) {
	                    if (key == index) {
	                        vm.fieldValue.splice(index, 1);
	                    }
	                });
	            }
	        }

	        function addItem() {
	            vm.fieldValue.push(moment());
	        }

	        vm.getFieldValue = function () {

	            var field = {};

	            var wrappedFieldValue;

	            if (vm.multiname) {
	                wrappedFieldValue = [];
	                angular.forEach(vm.fieldValue, function (valueItem) {
	                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
	                        return;
	                    }
	                    var tempItem = {};
	                    tempItem[vm.multiname] = moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format(vm.format);
	                    wrappedFieldValue.push(tempItem);
	                });
	            } else if (vm.multiple) {
	                wrappedFieldValue = [];
	                angular.forEach(vm.fieldValue, function (valueItem) {
	                    wrappedFieldValue.push(moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format(vm.format));
	                });
	            } else {
	                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
	                    wrappedFieldValue = "";
	                } else {
	                    wrappedFieldValue = moment(vm.fieldValue).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format(vm.format);
	                }
	            }

	            if (vm.parentField) {
	                field[vm.parentField] = {};
	                field[vm.parentField][vm.fieldName] = wrappedFieldValue;
	            } else {
	                field[vm.fieldName] = wrappedFieldValue;
	            }

	            return field;
	        };
	    }
	})();

/***/ },
/* 63 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueDatetime = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueDatetime/ueDatetime.html');
	        }],
	        controller: 'UeDatetimeController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc Datetime-type field.
	     * @example <div editor-field-datetime=""></div>
	     */
	    angular.module('universal.editor').component('ueDatetime', ueDatetime);
	})();

/***/ },
/* 64 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeDatetimeController', UeDatetimeController);

	    UeDatetimeController.$inject = ['$scope', '$element', 'EditEntityStorage', 'moment', 'FilterFieldsStorage', '$controller'];

	    function UeDatetimeController($scope, $element, EditEntityStorage, moment, FilterFieldsStorage, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        var componentSettings = vm.setting.component.settings;
	        componentSettings.$fieldType = 'date';
	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);

	        vm.addItem = addItem;
	        vm.removeItem = removeItem;

	        $scope.minDate = !vm.minDate ? vm.minDate : moment(vm.minDate, vm.format || 'YYYY-MM-DD HH:mm:ss');
	        $scope.maxDate = !vm.maxDate ? vm.maxDate : moment(vm.maxDate, vm.format || 'YYYY-MM-DD HH:mm:ss');
	        vm.format = vm.format || 'YYYY-MM-DD HH:mm:ss';

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            $scope.onLoadDataHandler(e, data);
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                vm.equalPreviewValue();
	            }
	        }));

	        //-- private functions
	        function removeItem(index) {
	            if (angular.isArray(vm.fieldValue)) {
	                vm.fieldValue.forEach(function (value, key) {
	                    if (key == index) {
	                        vm.fieldValue.splice(index, 1);
	                    }
	                });
	            }
	        }

	        function addItem() {
	            vm.fieldValue.push(moment());
	        }

	        vm.getFieldValue = function () {

	            var field = {};

	            var wrappedFieldValue;

	            if (vm.multiname) {
	                wrappedFieldValue = [];
	                angular.forEach(vm.fieldValue, function (valueItem) {
	                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
	                        return;
	                    }
	                    var tempItem = {};
	                    tempItem[vm.multiname] = moment(valueItem).format(vm.format);
	                    wrappedFieldValue.push(tempItem);
	                });
	            } else if (vm.multiple) {
	                wrappedFieldValue = [];
	                angular.forEach(vm.fieldValue, function (valueItem) {
	                    wrappedFieldValue.push(moment(valueItem).format(vm.format));
	                });
	            } else {
	                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
	                    wrappedFieldValue = "";
	                } else {
	                    wrappedFieldValue = moment(vm.fieldValue).format(vm.format);
	                }
	            }

	            if (vm.parentField) {
	                field[vm.parentField] = {};
	                field[vm.parentField][vm.fieldName] = wrappedFieldValue;
	            } else {
	                field[vm.fieldName] = wrappedFieldValue;
	            }

	            return field;
	        };
	    }
	})();

/***/ },
/* 65 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('DropdownItemsController', DropdownItemsController);

	    DropdownItemsController.$inject = ['$scope', 'RestApiService'];

	    function DropdownItemsController($scope, RestApiService) {}
	})();

/***/ },
/* 66 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').directive('dropdownItems', dropdownItems);

	    dropdownItems.$inject = ['$templateCache', '$document', '$compile'];

	    function dropdownItems($templateCache, $document, $compile) {
	        return {
	            restrict: 'A',
	            replace: true,
	            scope: {
	                options: '=',
	                isOpen: '=',
	                fieldSearch: '=',
	                childCountField: '=',
	                onToggle: '=',
	                api: '=',
	                selectBranches: '=',
	                assetsPath: '=',
	                multiple: '=',
	                activeElement: '=',
	                setActiveElement: '=',
	                lvlDropdown: '='
	            },
	            template: $templateCache.get('module/components/ueDropdown/dropdownItems.html'),
	            controller: 'DropdownItemsController',
	            controllerAs: 'vm',
	            compile: compile
	        };

	        function compile(element, link) {
	            // Normalize the link parameter
	            if (angular.isFunction(link)) {
	                link = { post: link };
	            }

	            // Break the recursion loop by removing the contents
	            var contents = element.contents().remove();
	            var compiledContents;
	            return {
	                post: function (scope, element) {
	                    // Compile the contents
	                    if (!compiledContents) {
	                        compiledContents = $compile(contents);
	                    }
	                    // Re-add the compiled contents to the element
	                    compiledContents(scope, function (clone) {
	                        element.append(clone);
	                    });

	                    // Call the post-linking function, if any
	                    if (link && link.post) {
	                        link.post.apply(null, arguments);
	                    }
	                }
	            };
	        }
	    }
	})();

/***/ },
/* 67 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueDropdown = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueDropdown/ueDropdown.html');
	        }],
	        controller: 'UeDropdownController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc Select-type field.
	     * @example <ue-dropdown></ue-dropdown>
	     */
	    angular.module('universal.editor').component('ueDropdown', ueDropdown);
	})();

/***/ },
/* 68 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeDropdownController', UeDropdownController);

	    UeDropdownController.$inject = ['$rootScope', '$scope', 'EditEntityStorage', 'RestApiService', '$timeout', 'configData', '$document', '$element', '$window', 'FilterFieldsStorage', '$controller', '$q'];

	    function UeDropdownController($rootScope, $scope, EditEntityStorage, RestApiService, $timeout, configData, $document, $element, $window, FilterFieldsStorage, $controller, $q) {
	        /* jshint validthis: true */
	        var vm = this;
	        vm.optionValues = [];
	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        var componentSettings = vm.setting.component.settings;

	        var possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

	        vm.assetsPath = '/assets/universal-editor';
	        if (!!configData.ui && !!configData.ui.assetsPath) {
	            vm.assetsPath = configData.ui.assetsPath;
	        }

	        vm.parentValue = !vm.depend;
	        vm.search = componentSettings.search;
	        vm.showPossible = false;
	        vm.activeElement = 0;
	        vm.isSelection = false;
	        vm.possibleLocation = true;
	        vm.isSpanSelectDelete = false;

	        if (componentSettings.hasOwnProperty('valuesRemote') && componentSettings.tree) {
	            vm.treeParentField = componentSettings.tree.parentField;
	            vm.treeChildCountField = componentSettings.tree.childCountField;
	            vm.treeSelectBranches = componentSettings.tree.selectBranches;
	            vm.isTree = vm.treeParentField && vm.treeChildCountField;
	            vm.sizeInput = vm.placeholder ? vm.placeholder.length : 0;
	        }

	        if (vm.depend) {
	            vm.dependField = vm.depend.fieldName;
	            vm.dependFilter = vm.depend.filter;
	        }

	        if (!vm.multiple) {
	            vm.styleInput = { 'width': '99%' };
	        }
	        if (vm.readonly) {
	            vm.styleInput = { 'width': '1px', 'padding': 0 };
	        }

	        if (vm.options.filter) {
	            vm.isTree = false;
	        }

	        var allOptions = [];

	        var destroyWatchEntityLoaded;
	        //   var destroyEntityLoaded = $scope.$on('editor:entity_loaded', );
	        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function (event, data) {
	            $scope.onLoadDataHandler(event, data);
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {

	                componentSettings.$loadingPromise.then(function (items) {
	                    allOptions = allOptions.length ? allOptions : items;
	                    vm.optionValues = [];
	                    angular.forEach(allOptions, function (v) {
	                        var v_id = v[vm.field_id];
	                        if (v_id && vm.fieldValue && (!vm.multiple || vm.isTree)) {
	                            if (angular.isArray(vm.fieldValue)) {
	                                for (var i = vm.fieldValue.length; i--;) {
	                                    if (vm.fieldValue[i] == v_id) {
	                                        vm.fieldValue[i] = v;
	                                        break;
	                                    }
	                                }
	                            } else if (v_id === vm.fieldValue) {
	                                vm.fieldValue = v;
	                            }
	                        }
	                        if (vm.isTree) {
	                            if (!v[vm.treeParentField]) {
	                                vm.optionValues.push(angular.copy(v));
	                            }
	                        } else {
	                            vm.optionValues.push(angular.copy(v));
	                        }
	                    });
	                    vm.equalPreviewValue(items);
	                }).finally(function () {
	                    vm.loadingData = false;
	                });
	            }
	        });

	        var destroyWatchFieldValue = $scope.$watch(function () {
	            return vm.fieldValue;
	        }, function (newVal) {
	            if (!vm.multiple && !vm.isTree) {
	                if (vm.search) {
	                    vm.filterText = '';
	                    change();
	                }
	                vm.placeholder = !!newVal && !!newVal[vm.field_search] ? newVal[vm.field_search] : componentSettings.placeholder;
	                vm.isSelection = !!newVal && !!newVal[vm.field_search];
	            }
	            if (vm.isTree && !vm.search) {
	                vm.placeholder = componentSettings.placeholder || '';
	            }
	            if (vm.isTree && !vm.multiple) {
	                vm.placeholder = !!newVal && !!newVal.length && !!newVal[0][vm.field_search] ? newVal[0][vm.field_search] : componentSettings.placeholder;
	            }
	            vm.setColorPlaceholder();
	            $rootScope.$broadcast('select_field:select_name_' + vm.fieldName, newVal);
	        }, true);

	        var destroySelectField;

	        if (vm.depend) {
	            destroySelectField = $scope.$on('select_field:select_name_' + vm.dependField, function (event, data) {
	                if (data && data !== "") {
	                    vm.parentValue = false;
	                    vm.optionValues = [];
	                    RestApiService.getUrlResource(componentSettings.valuesRemote.url + '?filter={"' + vm.dependFilter + '":"' + data + '"}').then(function (response) {
	                        angular.forEach(response.data.items, function (v) {
	                            vm.optionValues.push(v);
	                        });
	                        $timeout(function () {
	                            setSizeSelect();
	                        }, 0);
	                        allOptions = angular.copy(vm.optionValues);
	                        vm.parentValue = true;
	                    }, function (reject) {
	                        console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
	                    });
	                } else {
	                    vm.parentValue = false;
	                }
	            });
	        }

	        // dropdown functions
	        vm.toggle = toggle;
	        vm.remove = remove;
	        vm.focus = focus;
	        vm.change = change;

	        function toggle(e, item, loadChilds) {
	            if (loadChilds && item[vm.treeChildCountField]) {
	                item.isOpen = !item.isOpen;
	                if (item[vm.treeChildCountField] && !item.childOpts) {
	                    item.loadingData = true;
	                    RestApiService.getUrlResource(componentSettings.valuesRemote.url + '?filter={"' + vm.treeParentField + '":"' + item[vm.field_id] + '"}').then(function (response) {
	                        if (!item.childOpts) {
	                            item.childOpts = [];
	                        }
	                        item.loadingData = false;
	                        angular.forEach(response.data.items, function (v) {
	                            item.childOpts.push(v);
	                        });
	                        if (!vm.filterText) {
	                            allOptions = angular.copy(vm.optionValues);
	                        }
	                        if (vm.fieldValue.length) {
	                            setSelectedValuesFromRemote(item);
	                        }
	                    }, function (reject) {
	                        console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
	                    });
	                }
	            } else {
	                if (!angular.isArray(vm.fieldValue)) {
	                    vm.fieldValue = [];
	                }
	                var idx = findById(item[vm.field_id]);
	                if (vm.multiple) {
	                    if (idx !== null) {
	                        item.checked = false;
	                        vm.fieldValue.splice(idx, 1);
	                    } else {
	                        item.checked = true;
	                        vm.fieldValue.push(item);
	                    }
	                } else {
	                    if (idx === null) {
	                        vm.fieldValue.splice(0);
	                        uncheckAll(vm.optionValues);
	                        item.checked = true;
	                        vm.isSpanSelectDelete = true;
	                        vm.fieldValue.push(item);
	                    } else {
	                        vm.fieldValue.splice(0);
	                        item.checked = false;
	                        vm.isSpanSelectDelete = false;
	                    }
	                }
	                if (!vm.multiple) {
	                    $timeout(function () {
	                        vm.isBlur();
	                        $element.find('input')[0].blur();
	                    }, 0);
	                }
	            }
	            if (vm.fieldValue.length === 0 && !vm.filterText) {
	                vm.placeholder = componentSettings.placeholder || '';
	                vm.sizeInput = vm.placeholder.length;
	            } else {
	                vm.placeholder = vm.multiple ? '' : vm.fieldValue[0][vm.field_search];
	                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
	            }
	            if (!!e) {
	                e.stopPropagation();
	                e.preventDefault();
	            }
	        }

	        function uncheckAll(arr) {
	            for (var i = 0, len = arr.length; i < len; i++) {
	                arr[i].checked = false;
	                if (arr[i].childOpts) {
	                    uncheckAll(arr[i].childOpts);
	                }
	            }
	        }

	        function remove(e, item) {
	            if (vm.treeParentField && item[vm.treeParentField] && vm.multiple) {
	                uncheckByParentId(vm.optionValues, item[vm.treeParentField], item[vm.field_id]);
	                var idx = findById(item[vm.field_id], item[vm.treeParentField]);
	                if (idx !== null) {
	                    vm.fieldValue.splice(idx, 1);
	                }
	            } else {
	                var idx = findById(item[vm.field_id]);
	                if (idx !== null) {
	                    vm.fieldValue.splice(idx, 1);
	                    for (var i = 0, len = vm.optionValues.length; i < len; i++) {
	                        if (vm.optionValues[i][vm.field_id] === item[vm.field_id]) {
	                            vm.optionValues[i].checked = false;
	                        }
	                    }
	                }
	            }

	            if (vm.fieldValue.length === 0 && !vm.filterText) {
	                vm.placeholder = componentSettings.placeholder || '';
	                vm.sizeInput = vm.placeholder.length;
	            } else {
	                vm.placeholder = '';
	                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
	            }
	        }

	        function focus(e) {
	            $scope.toggleDropdown(e);
	            $scope.isOpen = true;
	        }

	        function change() {
	            vm.activeElement = 0;
	            if (vm.fieldValue && vm.fieldValue.length === 0 && !vm.filterText) {
	                vm.placeholder = componentSettings.placeholder || '';
	                vm.sizeInput = vm.placeholder.length;
	            } else {
	                vm.placeholder = '';
	                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
	            }

	            if (!vm.filterText) {
	                if (!vm.multiple && !vm.isTree) {
	                    if (vm.optionValues && vm.optionValues.length && vm.fieldValue) {
	                        var finded = vm.optionValues.filter(function (record) {
	                            return record[vm.field_id] === vm.fieldValue[vm.field_id] || record[vm.field_id] === vm.fieldValue;
	                        });
	                        if (finded.length) {
	                            vm.fieldValue = finded[0];
	                        }
	                    }
	                    vm.placeholder = !!vm.fieldValue && !!vm.fieldValue[vm.field_search] ? vm.fieldValue[vm.field_search] : componentSettings.placeholder;
	                } else if (!vm.multiple && vm.isTree) {
	                    vm.placeholder = !!vm.fieldValue.length && !!vm.fieldValue[0][vm.field_search] ? vm.fieldValue[0][vm.field_search] : componentSettings.placeholder;
	                }

	                if (vm.fieldValue) {
	                    for (var j = 0; j < vm.fieldValue.length; j++) {
	                        for (var i = 0, len = vm.optionValues.length; i < len; i++) {
	                            if (vm.optionValues[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
	                                vm.optionValues[i].checked = true;
	                            }
	                        }
	                    }
	                }
	                if (!allOptions) {
	                    allOptions = angular.copy(vm.optionValues);
	                }
	                vm.optionValues = filter(angular.copy(allOptions), vm.filterText);
	                return;
	            }
	            vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
	            if (!allOptions) {
	                allOptions = angular.copy(vm.optionValues);
	            }
	            vm.optionValues = filter(angular.copy(allOptions), vm.filterText);
	            for (var j = 0; j < vm.fieldValue.length; j++) {
	                for (var i = 0, len = vm.optionValues.length; i < len; i++) {
	                    if (vm.optionValues[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
	                        vm.optionValues[i].checked = true;
	                    }
	                }
	            }
	        }

	        function filter(opts, filterText) {
	            var result = [];
	            result = opts.filter(function (opt) {
	                if (opt.childOpts && opt.childOpts.length) {
	                    opt.childOpts = filter(opt.childOpts, filterText);
	                }
	                return opt[vm.field_search].toLowerCase().indexOf(filterText.toLowerCase()) > -1 || opt.childOpts && opt.childOpts.length;
	            });

	            return result;
	        }

	        function findById(id, parentId) {
	            if (parentId) {
	                for (var i = 0, len = vm.fieldValue.length; i < len; i++) {
	                    if (vm.fieldValue[i][vm.field_id] === id && vm.fieldValue[i][vm.treeParentField] === parentId) {
	                        return i;
	                    }
	                }
	            } else {
	                for (var i = 0, len = vm.fieldValue.length; i < len; i++) {
	                    if (vm.fieldValue[i][vm.field_id] === id) {
	                        return i;
	                    }
	                }
	            }
	            return null;
	        }

	        function uncheckByParentId(arr, parentId, id) {
	            for (var i = 0, len = arr.length; i < len; i++) {
	                if (arr[i][vm.field_id] === parentId && arr[i].childOpts) {
	                    for (var j = 0, lenj = arr[i].childOpts.length; j < lenj; j++) {
	                        if (arr[i].childOpts[j][vm.field_id] === id) {
	                            arr[i].childOpts[j].checked = false;
	                        }
	                    }
	                } else {
	                    if (arr[i].childOpts && arr[i].childOpts.length) {
	                        uncheckByParentId(arr[i].childOpts, parentId, id);
	                    }
	                }
	            }
	        }

	        function setSelectedValuesFromRemote(item) {
	            if (item) {
	                for (var i = 0, len = item.childOpts.length; i < len; i++) {
	                    for (var j = 0, lenj = vm.fieldValue.length; j < lenj; j++) {
	                        if (item[vm.field_id] === vm.fieldValue[j][vm.treeParentField] && item.childOpts[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
	                            item.childOpts[i].checked = true;
	                        }
	                    }
	                }
	            } else {
	                for (var i = 0, len = vm.optionValues.length; i < len; i++) {
	                    for (var j = 0, lenj = vm.fieldValue.length; j < lenj; j++) {
	                        if (vm.optionValues[i][vm.field_id] === vm.fieldValue[j][vm.field_id] && !vm.fieldValue[j][vm.treeParentField]) {
	                            vm.optionValues[i].checked = true;
	                        }
	                    }
	                }
	            }
	        }

	        vm.addToSelected = function (event, val) {
	            if (vm.multiple) {
	                vm.fieldValue.push(val);
	            } else {
	                vm.fieldValue = val;
	                if (!vm.fieldValue[vm.field_search]) {
	                    if (vm.optionValues.length === 0 && componentSettings.$loadingPromise) {
	                        componentSettings.$loadingPromise.then(convertToObject);
	                    } else {
	                        convertToObject(vm.optionValues);
	                    }
	                }
	            }
	            vm.filterText = '';
	            $timeout(function () {
	                vm.isSpanSelectDelete = true;
	                vm.showPossible = false;
	                vm.setColorPlaceholder();
	            }, 0);
	        };

	        function convertToObject(items) {
	            angular.forEach(items, function (v) {
	                if (v[vm.field_id] == vm.fieldValue[vm.field_id]) {
	                    vm.fieldValue[vm.field_search] = v[vm.field_search];
	                }
	            });
	        }

	        vm.isShowPossible = function () {
	            vm.activeElement = 0;
	            vm.showPossible = !vm.showPossible;
	            var formControl = $element.find('.select-input');
	            if (vm.showPossible) {
	                formControl.addClass('active');
	            }
	            var dHeight = $window.innerHeight;
	            var dropdownHost = $element.find('.select-input-wrapper');
	            var dropdownHeight = dropdownHost.height();
	            var dropdownOffset = dropdownHost.offset();
	            var dropdownBottom = dropdownOffset.top + dropdownHeight;
	            $scope.$evalAsync(function () {
	                vm.possibleLocation = !(dHeight - dropdownBottom < 162);
	            });
	            vm.setColorPlaceholder();
	        };

	        $document.bind("keydown", function (event) {
	            if (vm.showPossible || $scope.isOpen) {
	                switch (event.which) {
	                    case 27:
	                        event.preventDefault();
	                        $timeout(function () {
	                            vm.showPossible = false;
	                            $scope.isOpen = false;
	                        }, 0);
	                        break;
	                    case 13:
	                        event.preventDefault();
	                        if (!vm.multiple && !vm.isTree || vm.isTree) {
	                            if (vm.optionValues.length < 1) {
	                                break;
	                            }
	                        }
	                        $timeout(function () {
	                            if (!vm.multiple && !vm.isTree) {
	                                vm.addToSelected(null, vm.optionValues[vm.activeElement]);
	                            } else if (vm.isTree) {
	                                vm.toggle(undefined, vm.optionValues[vm.activeElement], true);
	                            }
	                        }, 0);

	                        break;
	                    case 40:
	                        event.preventDefault();
	                        if (!vm.multiple && !vm.isTree || vm.isTree) {
	                            if (vm.optionValues.length < 1) {
	                                break;
	                            }

	                            if (!vm.multiple && !vm.isTree) {
	                                possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);
	                            } else if (vm.isTree) {
	                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
	                            }

	                            if (vm.activeElement < vm.optionValues.length - 1) {
	                                $timeout(function () {
	                                    vm.activeElement++;
	                                }, 0);

	                                $timeout(function () {
	                                    var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
	                                        activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
	                                        wrapperScroll = possibleValues[0].scrollTop,
	                                        wrapperHeight = possibleValues[0].clientHeight;

	                                    if (activeTop >= wrapperHeight + wrapperScroll - activeHeight) {
	                                        possibleValues[0].scrollTop += activeHeight + 1;
	                                    }
	                                }, 1);
	                            }
	                        }
	                        break;
	                    case 38:
	                        event.preventDefault();
	                        if (!vm.multiple && !vm.isTree || vm.isTree) {
	                            if (vm.optionValues.length < 1) {
	                                break;
	                            }

	                            if (!vm.multiple && !vm.isTree) {
	                                possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);
	                            } else if (vm.isTree) {
	                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
	                            }

	                            if (vm.activeElement > 0) {
	                                $timeout(function () {
	                                    vm.activeElement--;
	                                }, 0);

	                                $timeout(function () {
	                                    var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
	                                        activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
	                                        wrapperScroll = possibleValues[0].scrollTop,
	                                        wrapperHeight = possibleValues[0].clientHeight;

	                                    if (activeTop < wrapperScroll) {
	                                        possibleValues[0].scrollTop -= activeHeight + 1;
	                                    }
	                                }, 1);
	                            }
	                        }
	                        break;
	                }
	            }
	        });

	        vm.setActiveElement = function (event, index) {
	            event.stopPropagation();
	            $timeout(function () {
	                vm.activeElement = index;
	            }, 0);
	        };

	        vm.setColorPlaceholder = function () {
	            if (!vm.search && !vm.isTree) {
	                vm.colorPlaceholder = !(vm.placeholder === componentSettings.placeholder) && !vm.showPossible;
	            } else {
	                vm.colorPlaceholder = !(vm.placeholder === componentSettings.placeholder) && !$scope.isOpen;
	            }
	        };

	        vm.isBlur = function () {
	            vm.showPossible = false;
	            $scope.isOpen = false;
	            var formControl = $element.find('.select-input');
	            formControl.removeClass('active');
	            vm.setColorPlaceholder();
	        };

	        vm.clickSelect = function () {
	            if (!vm.readonly) {
	                $element.find('input')[0].focus();
	            }
	        };

	        vm.deleteToSelected = function (event, isKeydown) {
	            if (isKeydown && event.which == 8 && !!vm.fieldValue && !!vm.fieldValue.length && !vm.filterText && vm.multiple) {
	                remove(null, vm.fieldValue[vm.fieldValue.length - 1]);
	            } else if (!vm.isTree && !isKeydown) {
	                vm.isSpanSelectDelete = false;
	                vm.fieldValue = {};
	                event.stopPropagation();
	            } else if (vm.isTree && !isKeydown) {
	                vm.isSpanSelectDelete = false;
	                remove(null, vm.fieldValue[0]);
	                event.stopPropagation();
	            }
	        };

	        vm.clear = clear;
	        function clear() {
	            vm.fieldValue = vm.multiple ? [] : null;
	            vm.isSpanSelectDelete = false;
	        }

	        function setSizeSelect() {
	            var size = vm.optionValues.length;
	            var select = $element.find('select');
	            if (!!select.length) {
	                var s = select[0];
	                if (size <= 3) {
	                    s.size = 3;
	                } else if (size >= 7) {
	                    s.size = 7;
	                } else {
	                    s.size = size;
	                }
	            }
	        }

	        vm.getDistanceByClass = function (className) {
	            var elem = angular.element($element.find(className)[0]);
	            return $window.innerHeight - elem.offset().top;
	        };

	        this.$onDestroy = function () {
	            if (angular.isFunction(destroyWatchEntityLoaded)) {
	                destroyWatchEntityLoaded();
	            }
	            destroyEntityLoaded();
	            destroyWatchFieldValue();
	            if (angular.isFunction(destroySelectField)) {
	                destroySelectField();
	            }
	        };

	        this.$postLink = function () {
	            $element.on('$destroy', function () {
	                $scope.$destroy();
	            });

	            $scope.isOpen = false;

	            $scope.toggleDropdown = function () {
	                $element.find('input')[0].focus();
	                var dHeight = $document.height();
	                var dropdownHost = $element.find('.dropdown__host');
	                var dropdownHeight = dropdownHost.height();
	                var dropdownOffset = dropdownHost.offset();
	                var dropdownBottom = dropdownOffset.top + dropdownHeight;
	                $element.find('.dropdown__items').removeClass('dropdown-top');
	                $element.find('.dropdown__items').removeClass('dropdown-bottom');
	                if (dHeight - dropdownBottom < 300) {
	                    $element.find('.dropdown__items').addClass('dropdown-top');
	                } else {
	                    $element.find('.dropdown__items').addClass('dropdown-bottom');
	                }
	                $scope.isOpen = !$scope.isOpen;
	                if ($scope.isOpen) {
	                    var formControl = $element.find('.select-input');
	                    formControl.addClass('active');
	                }
	                vm.setColorPlaceholder();
	            };
	        };
	    }

	    angular.module('universal.editor').filter('selectedValues', function () {
	        return function (arr, fieldSearch) {
	            var titles = arr.map(function (item) {
	                return item[fieldSearch];
	            });
	            return titles.join(', ');
	        };
	    });
	})();

/***/ },
/* 69 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').component('ueFilter', {
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueFilter/ueFilter.html');
	        }],
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        controllerAs: 'vm',
	        controller: 'UeFilterController'
	    });
	})();

/***/ },
/* 70 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeFilterController', UeFilterController);

	    UeFilterController.$inject = ['$scope', '$rootScope', '$element', 'EditEntityStorage', 'RestApiService', '$timeout', 'FilterFieldsStorage'];

	    function UeFilterController($scope, $rootScope, $element, EditEntityStorage, RestApiService, $timeout, FilterFieldsStorage) {
	        /* jshint validthis: true */
	        var vm = this;
	        var fieldErrorName;
	        var settings = vm.setting.component.settings;
	        vm.visiable = false;

	        vm.header = settings.header;

	        vm.body = [];
	        angular.forEach(settings.dataSource.fields, function (field) {
	            if (field.component.hasOwnProperty("settings") && (!settings.fields || ~settings.fields.indexOf(field.name)) && field.component.settings.filterable !== false) {
	                var fieldSettings = field.component.settings;

	                var group = {
	                    label: fieldSettings.label,
	                    operators: [],
	                    filters: [{
	                        field: field,
	                        options: {
	                            filterParameters: {
	                                operator: '%:text%',
	                                index: 0
	                            },
	                            filter: true,
	                            $parentComponentId: vm.options.$parentComponentId
	                        }
	                    }]
	                };

	                /** convert to filter object from fields*/
	                fieldSettings.$toFilter = fieldSettings.$toFilter || function (operator, fieldValue) {
	                    angular.forEach(fieldValue, function (value, key) {
	                        if (operator && operator.indexOf(":text") !== -1) {
	                            if (value && (!angular.isObject(value) || !$.isEmptyObject(value))) {
	                                fieldValue[key] = operator.replace(':text', value);
	                            }
	                            if (value === undefined || value === null || value === '' || angular.isObject(value) && $.isEmptyObject(value)) {
	                                delete fieldValue[key];
	                            }
	                        } else {
	                            if (value) {
	                                fieldValue[operator + key] = fieldValue[key];
	                            }
	                            delete fieldValue[key];
	                        }
	                    });
	                    return fieldValue;
	                };

	                /** parse filter objects with operators*/
	                fieldSettings.$parseFilter = function (model, filterValue) {
	                    var componentSettings = model.setting.component.settings;
	                    var parentComponentId = model.parentComponentId;
	                    var output = {};
	                    angular.forEach(filterValue, function (value, key) {
	                        //** delete operators from keys and value property
	                        if (angular.isString(value)) {
	                            value = value.replace(/^%/, '').replace(/%$/, '');
	                        }
	                        if (angular.isString(key)) {
	                            key = key.replace(/^\>\=/, '').replace(/^\<\=/, '');
	                        }

	                        /** for date is required convert into date-type (at this moment we have two fields of date) */
	                        if (field.component.settings.$fieldType === 'date') {
	                            output[key] = output[key] || [];
	                            output[key].push(moment.utc(value, model.format));
	                        } else {
	                            output[key] = value;
	                        }
	                    });
	                    var value = output[model.fieldName];
	                    if (angular.isArray(value)) {
	                        value = value[model.options.filterParameters.index];
	                    }
	                    if (field.component.settings.$fieldType === 'array') {
	                        model.fieldValue = value.split(',');
	                    } else {
	                        model.fieldValue = value;
	                        if (model.addToSelected && value) {
	                            model.fieldValue = {};
	                            model.fieldValue[model.field_id] = value;
	                            model.addToSelected(null, model.fieldValue);
	                        }
	                    }
	                    $timeout(function () {
	                        if (!FilterFieldsStorage.getFilterQueryObject(parentComponentId)) {
	                            FilterFieldsStorage.calculate(parentComponentId);
	                            $rootScope.$broadcast('editor:read_entity', model.options);
	                            vm.visiable = true;
	                        }
	                    }, 0);
	                    return output;
	                };

	                /*temprory custom logic for operators */

	                if (~['ue-dropdown', 'ue-autocomplete', 'ue-checkbox', 'ue-radiolist', 'ue-colorpicker'].indexOf(field.component.name)) {
	                    group.filters[0].options.filterParameters.operator = ":text";
	                }

	                if (~['ue-date', 'ue-time', 'ue-datetime'].indexOf(field.component.name)) {
	                    group.filters[0].ngStyle = "display: inline-block; width: 25%; margin-left: 5px;";
	                    group.filters[0].options.filterParameters.operator = ">=";
	                    var cloneField = angular.copy(field);
	                    group.filters.push({
	                        field: cloneField,
	                        options: {
	                            filterParameters: {
	                                operator: '<=',
	                                index: 1
	                            },
	                            filter: true,
	                            $parentComponentId: vm.options.$parentComponentId
	                        },
	                        ngStyle: 'display: inline-block; width: 25%; margin-left: 20px;'
	                    });
	                }

	                vm.body.push(group);
	            }
	        });

	        vm.footer = [];
	        if (!settings.footer || !settings.footer.controls) {
	            settings.footer = {
	                controls: [{
	                    component: {
	                        name: 'ue-button-filter',
	                        settings: {
	                            $groups: vm.body,
	                            label: 'Применить',
	                            action: 'send'
	                        }
	                    }
	                }, {
	                    component: {
	                        name: 'ue-button-filter',
	                        settings: {
	                            label: 'Очистить',
	                            action: 'clear'
	                        }
	                    }
	                }]
	            };
	        }

	        if (settings.footer && settings.footer.controls) {
	            angular.forEach(settings.footer.controls, function (control) {
	                vm.footer.push(control);
	            });
	        }

	        vm.toggleFilterVisibility = function () {
	            vm.visiable = !vm.visiable;
	        };

	        $element.on('$destroy', function () {
	            $scope.$destroy();
	        });
	    }
	})();

/***/ },
/* 71 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueForm = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueForm/ueForm.html');
	        }],
	        controller: 'UeFormController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc String-type field.
	     * @example <ue-form></ue-for,>
	     */
	    angular.module('universal.editor').component('ueForm', ueForm);
	})();

/***/ },
/* 72 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeFormController', UeFormController);

	    UeFormController.$inject = ['$scope', 'configData', 'RestApiService', '$location', '$state', '$translate', 'EditEntityStorage'];

	    function UeFormController($scope, configData, RestApiService, $location, $state, $translate, EditEntityStorage) {
	        // var entityObject = RestApiService.getEntityObject();
	        /* jshint validthis: true */
	        var vm = this,
	            mixEntityObject;

	        vm.assetsPath = '/assets/universal-editor';
	        vm.configData = configData;
	        vm.entityLoaded = false;
	        vm.listLoaded = false;
	        vm.errors = [];
	        vm.notifys = [];
	        vm.entityId = "";
	        vm.editorEntityType = "new";
	        vm.editFooterBar = [];
	        vm.editFooterBarNew = [];
	        vm.editFooterBarExist = [];
	        vm.idField = 'id';
	        var defaultEditFooterBar = [{
	            component: {
	                name: 'ue-button-service',
	                settings: {
	                    label: 'Сохранить',
	                    action: 'save'
	                }
	            }
	        }, {
	            component: {
	                name: 'ue-button-service',
	                settings: {
	                    label: 'Удалить',
	                    action: 'delete'
	                }
	            }
	        }, {
	            component: {
	                name: 'ue-button-service',
	                settings: {
	                    label: 'Сохранить',
	                    action: 'presave'
	                }
	            }
	        }];

	        vm.options = angular.copy(vm.options);
	        angular.merge(vm.options, {
	            isLoading: false,
	            $parentComponentId: vm.setting.component.$id,
	            $dataSource: vm.setting.component.settings.dataSource
	        });

	        var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
	        var pk = $state.params[pkKey];

	        if (!!vm.configData.ui && !!vm.configData.ui.assetsPath) {
	            vm.assetsPath = vm.configData.ui.assetsPath;
	        }

	        if (vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')) {
	            vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
	        }

	        if (!!vm.setting.component.settings.footer && !!vm.setting.component.settings.footer.controls) {
	            angular.forEach(vm.setting.component.settings.footer.controls, function (control) {
	                var newControl = angular.merge({}, control);
	                if (angular.isUndefined(newControl.component.settings.dataSource)) {
	                    newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
	                }
	                newControl.paginationData = {};
	                vm.editFooterBar.push(newControl);
	            });
	        }

	        if (vm.editFooterBar.length === 0) {
	            angular.forEach(defaultEditFooterBar, function (control) {
	                var newControl = angular.merge({}, control);
	                if (angular.isUndefined(newControl.component.settings.dataSource)) {
	                    newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
	                }
	                newControl.paginationData = {};
	                vm.editFooterBar.push(newControl);
	            });
	        }
	        updateButton();

	        function updateButton() {
	            pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
	            pk = $state.params[pkKey];
	            angular.forEach(vm.editFooterBar, function (button, index) {
	                if (pk === 'new') {
	                    button.type = 'create';
	                } else {
	                    button.type = 'update';
	                }
	            });
	        }

	        $scope.$watch(function () {
	            return $state.params;
	        }, function (newVal) {
	            updateButton();
	        });
	        vm.components = [];

	        angular.forEach(vm.setting.component.settings.body, function (componentObject) {
	            if (angular.isObject(componentObject) && componentObject.component) {
	                vm.components.push(componentObject);
	                if (componentObject.component.settings.dataSource === undefined) {
	                    componentObject.component.settings.dataSource = vm.setting.component.settings.dataSource;
	                }
	            }
	            if (angular.isString(componentObject)) {
	                var dataSourceComponent = vm.setting.component.settings.dataSource.fields.filter(function (k) {
	                    return k.name == componentObject;
	                });
	                if (dataSourceComponent.length > 0) {
	                    vm.components.push(dataSourceComponent[0]);
	                }
	            }
	        });

	        vm.closeButton = function () {
	            vm.entityLoaded = false;
	            vm.listLoaded = false;

	            var params = {};
	            var isReload = true;

	            if ($location.search().back) {
	                params.type = $location.search().back;
	            }
	            if ($location.search().parent) {
	                params.parent = $location.search().parent;
	                isReload = false;
	            }
	            var stateIndex = EditEntityStorage.getStateConfig();
	            var searchString = $location.search();
	            $state.go(stateIndex.name, params, { reload: isReload }).then(function () {
	                if (searchString.back) {
	                    delete searchString.back;
	                }
	                $location.search(searchString);
	            });
	        };

	        $scope.$on('editor:entity_loaded', function (event, data) {
	            if (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
	                vm.editorEntityType = data.editorEntityType;
	                vm.entityId = data[vm.idField];
	                vm.entityLoaded = true;
	            }
	        });

	        $scope.$on('editor:server_error', function (event, data) {
	            vm.errors.push(data);
	        });

	        if (pk !== 'new') {
	            if (pk) {
	                RestApiService.getItemById(pk, vm.setting.component.settings.dataSource, vm.options);
	            } else if (vm.setting.pk) {
	                RestApiService.getItemById(vm.setting.pk, vm.setting.component.settings.dataSource, vm.options);
	            }
	        }

	        $scope.$on('editor:presave_entity_created', function (event, data) {
	            vm.entityId = data;
	            vm.editorEntityType = "exist";
	        });

	        $scope.$on('editor:field_error', function (event, data) {
	            vm.errors.push(data);
	        });

	        $scope.$on('editor:request_start', function (event, data) {
	            vm.errors = [];
	            vm.notifys = [];
	        });

	        //локализация
	        if (configData.hasOwnProperty("ui") && configData.ui.hasOwnProperty("language")) {
	            if (configData.ui.language.search(".json") !== -1) {
	                $translate.use(configData.ui.language);
	            } else if (configData.ui.language !== 'ru') {
	                $translate.use('assets/json/language/' + configData.ui.language + '.json');
	            }
	        }

	        if (pk === 'new') {
	            vm.entityLoaded = true;
	        }
	    }
	})();

/***/ },
/* 73 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueFormGroup = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        transclude: true,
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueFormGroup/ueFormGroup.html');
	        }],
	        controller: 'UeFormGroupController',
	        controllerAs: 'vm'
	    };
	    /**
	     * @desc Array-type field.
	     * @example <ue-form-group></ue-form-group>
	     */
	    angular.module('universal.editor').component('ueFormGroup', ueFormGroup);
	})();

/***/ },
/* 74 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeFormGroupController', UeFormGroupController);

	    UeFormGroupController.$inject = ['$scope', 'EditEntityStorage', '$timeout', 'RestApiService', '$controller'];

	    function UeFormGroupController($scope, EditEntityStorage, $timeout, RestApiService, $controller) {
	        /* jshint validthis: true */
	        var vm = this,
	            componentSettings = vm.setting.component.settings,
	            entityObject = RestApiService.getEntityObject(),
	            baseController,
	            widthBootstrap = 12;

	        vm.fieldName = componentSettings.name;

	        baseController = $controller('BaseController', { $scope: $scope });
	        angular.extend(vm, baseController);

	        vm.innerFields = [];
	        vm.fieldsArray = [];
	        vm.countInLine = componentSettings.countInLine || 1;
	        widthBootstrap = Math.ceil(12 / vm.countInLine);
	        vm.className = 'col-md-' + widthBootstrap + ' col-xs-' + widthBootstrap + ' col-sm-' + widthBootstrap + ' col-lg-' + widthBootstrap;

	        if (vm.multiple === true && !vm.fieldName) {
	            console.log('UeFormGroup: в режиме multiple обязательно должен быть указан параметр name.');
	        }

	        vm.addItem = addItem;
	        vm.removeItem = removeItem;

	        angular.forEach(componentSettings.fields, function (value, index) {
	            var field;
	            if (angular.isString(value)) {
	                field = entityObject.dataSource.fields.filter(function (k) {
	                    return k.name == value;
	                })[0];
	            } else if (value && value.component) {
	                field = value;
	            }
	            if (field) {
	                if (vm.fieldName) {
	                    field.parentField = vm.fieldName;
	                }
	                vm.innerFields.push(field);
	            }
	        });

	        vm.$isOnlyChildsBroadcast = false;
	        vm.listeners.push($scope.$on('editor:entity_loaded', onLoadedHandler));
	        vm.option = angular.merge({}, vm.options);
	        vm.option.isGroup = true;
	        function onLoadedHandler(event, data) {
	            if (!vm.$isOnlyChildsBroadcast) {
	                var group = data[vm.fieldName];
	                if (group) {
	                    if (vm.multiple && angular.isArray(group)) {
	                        group.forEach(vm.addItem);
	                        $timeout(function () {
	                            vm.$isOnlyChildsBroadcast = true;
	                            $scope.$broadcast('editor:entity_loaded', data);
	                            delete vm.$isOnlyChildsBroadcast;
	                        }, 0);
	                    }
	                }
	            }
	        }

	        function removeItem(ind) {
	            vm.fieldsArray.splice(ind, 1);
	        }

	        function addItem() {
	            var clone = vm.innerFields.map(function (field) {
	                return angular.extend({}, field);
	            });
	            angular.forEach(clone, function (value, index) {
	                value.parentFieldIndex = vm.fieldsArray.length;
	            });
	            vm.fieldsArray.push(clone);
	        }
	    }
	})();

/***/ },
/* 75 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueFormTabs = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueFormTabs/ueFormTabs.html');
	        }],
	        controller: 'UeFormTabsController',
	        controllerAs: 'vm'
	    };

	    angular.module('universal.editor').component('ueFormTabs', ueFormTabs);
	})();

/***/ },
/* 76 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeFormTabsController', UeFormTabsController);

	    UeFormTabsController.$inject = ['$scope', '$state', 'EditEntityStorage', '$element'];

	    function UeFormTabsController($scope, $state, EditEntityStorage, $element) {
	        $element.addClass('ue-form-tabs');
	        /* jshint validthis: true */

	        var vm = this;
	        var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
	        var pk = $state.params[pkKey];
	        var componentSettings = vm.setting.component.settings;

	        vm.tabs = [];
	        vm.indexTab = 0;
	        vm.activateTab = activateTab;
	        if (angular.isArray(componentSettings.tabs)) {
	            angular.forEach(componentSettings.tabs, function (tab) {
	                var newTab = {};
	                newTab.label = tab.label;
	                newTab.fields = [];
	                if (angular.isArray(tab.fields)) {
	                    angular.forEach(tab.fields, function (field) {
	                        if (angular.isString(field)) {
	                            var newField = componentSettings.dataSource.fields.filter(function (k) {
	                                return k.name == field;
	                            });
	                            if (newField.length > 0) {
	                                newTab.fields.push(newField[0]);
	                            }
	                        } else {
	                            if (field.component.settings.dataSource === undefined) {
	                                field.component.settings.dataSource = componentSettings.dataSource;
	                            }
	                            newTab.fields.push(field);
	                        }
	                    });
	                }
	                vm.tabs.push(newTab);
	            });
	        }

	        function activateTab(indexTab) {
	            vm.indexTab = indexTab;
	        }
	    }
	})();

/***/ },
/* 77 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueGrid = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueGrid/ueGrid.html');
	        }],
	        controller: 'UeGridController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc String-type field.
	     * @example <ue-grid></ue-grid>
	     */
	    angular.module('universal.editor').component('ueGrid', ueGrid);
	})();

/***/ },
/* 78 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeGridController', UeGridController);

	    UeGridController.$inject = ['$scope', '$rootScope', 'configData', 'RestApiService', 'FilterFieldsStorage', '$location', '$document', '$timeout', '$httpParamSerializer', '$state', 'toastr', '$translate', '$element', '$compile', 'EditEntityStorage'];

	    function UeGridController($scope, $rootScope, configData, RestApiService, FilterFieldsStorage, $location, $document, $timeout, $httpParamSerializer, $state, toastr, $translate, $element, $compile, EditEntityStorage) {
	        $element.addClass('ue-grid');
	        //$scope.entity = RestApiService.getEntityType();
	        /* jshint validthis: true */
	        var vm = this,
	            itemsKey,
	            mixEntityObject,
	            url = vm.setting.component.settings.dataSource.url,
	            parentField = vm.setting.component.settings.dataSource.parentField;

	        vm.configData = configData;
	        vm.correctEntityType = true;
	        vm.listLoaded = false;
	        vm.loadingData = true;
	        vm.tableFields = [];
	        vm.items = [];
	        vm.links = [];
	        vm.errors = [];
	        vm.notifys = [];
	        vm.tabsVisibility = [];
	        vm.entityId = "";
	        vm.editorEntityType = "new";
	        vm.sortField = "";
	        vm.sortingDirection = true;
	        vm.pageItemsArray = [];
	        vm.contextLinks = [];
	        vm.mixContextLinks = [];
	        vm.listHeaderBar = [];
	        vm.$parentComponentId = vm.setting.component.$id;
	        vm.isContextMenu = !!vm.setting.component.settings.contextMenu && vm.setting.component.settings.contextMenu.length !== 0;

	        vm.options = {
	            $parentComponentId: vm.$parentComponentId,
	            $gridComponentId: vm.$parentComponentId,
	            mixedMode: vm.setting.component.settings.mixedMode,
	            sort: vm.setting.component.settings.dataSource.sortBy,
	            back: configData,
	            isGrid: true
	        };
	        vm.mixOption = angular.merge({}, vm.options);
	        vm.mixOption.isMix = true;
	        if (!!vm.setting.component.settings.header) {
	            vm.filterComponent = vm.setting.component.settings.header.filter;
	        } else {
	            vm.filterComponent = vm.setting.component.settings.header;
	        }
	        if (vm.filterComponent !== false) {
	            if (angular.isUndefined(vm.filterComponent)) {
	                vm.filterComponent = {
	                    component: {
	                        name: 'ue-filter',
	                        settings: {
	                            header: {
	                                label: 'Фильтр'
	                            }
	                        }
	                    }
	                };
	            }

	            if (angular.isUndefined(vm.filterComponent.component.settings.dataSource)) {
	                vm.filterComponent.component.settings.dataSource = vm.setting.component.settings.dataSource;
	            }
	        }
	        vm.editFooterBarNew = [];
	        vm.editFooterBarExist = [];
	        vm.listFooterBar = [];
	        vm.contextId = undefined;
	        vm.idField = 'id';
	        vm.parentButton = false;
	        vm.filterFields = [];
	        vm.visibleFilter = true;
	        vm.pagination = vm.setting.component.settings.dataSource.hasOwnProperty("pagination") ? vm.setting.component.settings.dataSource.pagination : true;
	        vm.autoCompleteFields = [];
	        vm.entityType = vm.setting.component.settings.entityType || configData;
	        vm.parent = null;
	        vm.paginationData = [];
	        vm.isMixMode = !!vm.setting.component.settings.mixedMode;
	        if (vm.isMixMode) {
	            vm.prependIcon = vm.setting.component.settings.mixedMode.prependIcon;
	            vm.entityType = vm.setting.component.settings.mixedMode.entityType;
	            vm.subType = vm.setting.component.settings.mixedMode.fieldType;

	            angular.forEach(vm.setting.component.settings.mixedMode.contextMenu, function (value) {
	                var newValue = angular.merge({}, value);
	                newValue.url = vm.setting.component.settings.mixedMode.dataSource.url;
	                newValue.parentField = parentField;
	                newValue.headComponent = vm.setting.headComponent;
	                vm.mixContextLinks.push(newValue);
	            });
	        }
	        vm.request = {
	            childId: vm.parent,
	            options: vm.options,
	            parentField: parentField,
	            url: url
	        };
	        vm.request.options.$dataSource = vm.setting.component.settings.dataSource;

	        // if (vm.setting.headComponent) {
	        var parentEntity = $location.search().parent;
	        if (parentEntity) {
	            parentEntity = JSON.parse(parentEntity);
	            vm.parent = parentEntity[vm.$parentComponentId] || null;
	        }
	        //   }

	        if (vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')) {
	            vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
	        }
	        itemsKey = "items";

	        var colSettings = vm.setting.component.settings.columns;

	        if (angular.isArray(colSettings)) {
	            colSettings.forEach(function (col) {
	                var tableField;
	                var component = vm.setting.component.settings.dataSource.fields.filter(function (field) {
	                    return field.name === col;
	                });
	                if (component.length) {
	                    col = component[0];
	                }
	                if (angular.isObject(col)) {
	                    tableField = {
	                        field: col.name || null,
	                        sorted: col.component.settings.multiple !== true,
	                        displayName: col.component.settings.label || col.name,
	                        component: col,
	                        options: {
	                            $parentComponentId: vm.$parentComponentId,
	                            regim: 'preview'
	                        }
	                    };
	                }
	                if (tableField) {
	                    vm.tableFields.push(tableField);
	                }
	            });
	        }

	        angular.forEach(vm.setting.component.settings.dataSource.fields, function (field) {
	            if (field.component.hasOwnProperty("settings") && vm.setting.component.settings.columns.indexOf(field.name) != -1) {}
	        });

	        angular.forEach(vm.setting.component.settings.contextMenu, function (value) {
	            var newValue = angular.merge({}, value);
	            newValue.url = url;
	            newValue.parentField = parentField;
	            newValue.headComponent = vm.setting.headComponent;
	            vm.contextLinks.push(newValue);
	        });

	        if (!!vm.setting.component.settings.header && !!vm.setting.component.settings.header.controls) {
	            angular.forEach(vm.setting.component.settings.header.controls, function (control) {
	                var newControl = angular.merge({}, control);
	                if (angular.isUndefined(newControl.component.settings.dataSource)) {
	                    newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
	                }
	                newControl.paginationData = {};
	                vm.listHeaderBar.push(newControl);
	            });
	        }

	        if (!!vm.setting.component.settings.footer && !!vm.setting.component.settings.footer.controls) {
	            angular.forEach(vm.setting.component.settings.footer.controls, function (control) {
	                var newControl = angular.merge({}, control);
	                if (angular.isUndefined(newControl.component.settings.dataSource)) {
	                    newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
	                }
	                newControl.paginationData = {};
	                vm.listFooterBar.push(newControl);
	            });
	        }

	        vm.sortField = vm.setting.component.settings.dataSource.sortBy || vm.tableFields[0].field;

	        vm.getScope = function () {
	            return $scope;
	        };

	        vm.setTabVisible = function (index, value) {
	            vm.tabsVisibility[index] = value;
	        };

	        vm.changeSortField = function (field, sorted) {
	            if (field && sorted) {
	                vm.listLoaded = false;
	                if (vm.sortField == field) {
	                    vm.sortingDirection = !vm.sortingDirection;
	                } else {
	                    vm.sortField = field;
	                }
	                vm.options.sort = vm.sortingDirection ? field : "-" + field;
	                RestApiService.getItemsList({
	                    url: url,
	                    options: vm.options,
	                    parentField: parentField,
	                    childId: vm.parent
	                });
	            }
	        };

	        vm.getParent = function () {
	            vm.request.childId = vm.parent;
	            vm.request.parentField = parentField;
	            vm.request.headComponent = vm.setting.headComponent;
	            RestApiService.loadParent(vm.request);
	        };

	        $scope.$on('editor:parent_id', function (event, data) {
	            if (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
	                vm.parent = data.parentId;
	            }
	        });

	        $scope.$on('editor:read_entity', function (event, data) {
	            var eventComponentId = data.$gridComponentId || data.$parentComponentId || data;
	            if (vm.$parentComponentId === eventComponentId) {
	                var parentEntity = $location.search().parent;
	                if (parentEntity) {
	                    parentEntity = JSON.parse(parentEntity);
	                    vm.parent = parentEntity[vm.$parentComponentId] || null;
	                }
	                vm.request.childId = vm.parent;
	                RestApiService.getItemsList(vm.request);
	            }
	        });

	        $scope.$on('editor:update_item', function (event, data) {
	            var eventComponentId = data.$gridComponentId || data.$parentComponentId;
	            if (!eventComponentId || vm.$parentComponentId === eventComponentId && data.value) {
	                var changed = false;
	                vm.items.filter(function (item) {
	                    if (item[vm.idField] === data.value[vm.idField]) {
	                        angular.merge(item, data.value);
	                        changed = true;
	                    }
	                });
	                if (changed) {
	                    var list = {};
	                    list[itemsKey] = vm.items;
	                    $rootScope.$broadcast('editor:items_list', list);
	                }
	            }
	        });

	        $scope.$on('editor:items_list', function (event, data) {
	            if (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
	                debugger;

	                vm.listLoaded = true;
	                vm.items = data[itemsKey];
	                if (angular.isObject(vm.items)) {
	                    angular.forEach(vm.items, function (item, index) {
	                        item.$options = {
	                            $parentComponentId: vm.$parentComponentId,
	                            regim: 'preview',
	                            $dataIndex: index
	                        };
	                    });
	                }
	                var eventObject = {
	                    editorEntityType: "exist",
	                    $parentComponentId: vm.$parentComponentId,
	                    $items: vm.items
	                };
	                $timeout(function () {
	                    $rootScope.$broadcast("editor:entity_loaded", eventObject);
	                });

	                vm.parentButton = !!vm.parent;
	                vm.pageItemsArray = [];

	                angular.forEach(vm.listFooterBar, function (control) {
	                    control.paginationData = data;
	                });
	            }
	        });

	        $scope.$on('editor:server_error', function (event, data) {
	            vm.errors.push(data);
	        });

	        $scope.$on('editor:parent_childs', function (event, data) {
	            angular.forEach(vm.items, function (item, ind) {

	                var startInd = 1;
	                if (item[vm.idField] === data.id) {
	                    if (item.isExpand === true) {
	                        item.isExpand = false;
	                        vm.items.splice(ind + 1, data.childs.length);
	                    } else {
	                        item.isExpand = true;
	                        angular.forEach(data.childs, function (newItem) {
	                            if (vm.items[ind].hasOwnProperty.parentPadding) {
	                                newItem.parentPadding = vm.items[ind].parentPadding + 1;
	                            } else {
	                                newItem.parentPadding = 1;
	                            }
	                            vm.items.splice(ind + startInd, 0, newItem);
	                        });
	                    }
	                }
	            });
	        });

	        $scope.$on('editor:entity_success_deleted', function (event, data) {});

	        $scope.$on('editor:field_error', function (event, data) {
	            vm.errors.push(data);
	        });

	        $scope.$on('editor:request_start', function (event, data) {
	            vm.errors = [];
	            vm.notifys = [];
	        });

	        $document.on('click', function (evt) {
	            if (!angular.element(evt.target).hasClass('context-toggle')) {
	                $timeout(function () {
	                    vm.contextId = undefined;
	                }, 0);
	            }
	        });

	        function isInTableFields(name) {
	            var index = vm.tableFields.findIndex(function (field) {
	                return field.field === name;
	            });

	            return index !== -1;
	        }

	        //локализация
	        if (configData.hasOwnProperty("ui") && configData.ui.hasOwnProperty("language")) {
	            if (configData.ui.language.search(".json") !== -1) {
	                $translate.use(configData.ui.language);
	            } else if (configData.ui.language !== 'ru') {
	                $translate.use('assets/json/language/' + configData.ui.language + '.json');
	            }
	        }

	        /*  vm.clickEnter = function(event) {
	         if (event.keyCode === 13) {
	         vm.applyFilter();
	         }
	         };*/

	        vm.$onInit = function () {
	            RestApiService.setFilterParams({});
	            vm.request.childId = vm.parent;
	            vm.request.options = vm.options;
	            vm.request.parentField = parentField;
	            vm.request.url = url;
	            RestApiService.getItemsList(vm.request);
	        };

	        vm.toggleContextView = function (id) {
	            vm.styleContextMenu = {};
	            if (vm.contextId == id) {
	                vm.contextId = undefined;
	            } else {
	                vm.contextId = id;
	            }
	        };

	        vm.toggleContextViewByEvent = function (id, event) {
	            var left = event.pageX - $element.find('table')[0].offsetLeft;
	            if (event.which === 3) {
	                vm.styleContextMenu = {
	                    'top': event.offsetY,
	                    'left': left
	                };
	                vm.contextId = id;
	            }
	        };
	    }
	})();

/***/ },
/* 79 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').component('ueModal', {
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueModal/ueModal.html');
	        }],
	        bindings: {
	            resolve: '<',
	            close: '&',
	            dismiss: '&'
	        },
	        controllerAs: 'vm',
	        controller: function ($uibModal, $scope, configData, $element, $state, EditEntityStorage, ModalService) {
	            var vm = this;
	            var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
	            vm.entityId = $state.params[pkKey];
	            vm.assetsPath = '/assets/universal-editor';
	            vm.options = ModalService.options;

	            if (!!configData.ui && !!configData.ui.assetsPath) {
	                vm.assetsPath = configData.ui.assetsPath;
	            }
	            var modalDialog = $element.closest(".modal-dialog");

	            vm.size = vm.resolve.settings.size;
	            if (vm.size) {
	                if (vm.size.width) {
	                    modalDialog.width(vm.size.width);
	                }
	                if (vm.size.height) {
	                    modalDialog.height(vm.size.height);
	                }
	            }

	            vm.header = vm.resolve.settings.header;

	            vm.body = vm.resolve.settings.body;
	            if (vm.body) {
	                if (vm.body.component) {
	                    vm.body.component.settings.modal = true;
	                }
	            }

	            vm.footer = [];

	            if (vm.resolve.settings.footer && vm.resolve.settings.footer.controls) {
	                angular.forEach(vm.resolve.settings.footer.controls, function (control) {
	                    vm.footer.push(control);
	                });
	            }

	            vm.$onInit = function () {
	                vm.resolve.settings.isModal = true;
	            };

	            vm.ok = function () {
	                vm.close({ $value: "ок modal" });
	            };

	            vm.cancel = function () {
	                ModalService.close(true);
	            };

	            $scope.$on('exit_modal', function () {
	                vm.dismiss({ $value: 'cancel modal emit' });
	            });
	        }
	    });
	})();

/***/ },
/* 80 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var uePagination = {
	        bindings: {
	            setting: "<",
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/uePagination/uePagination.html');
	        }],
	        controller: 'UePaginationController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc String-type field.
	     * @example <ue-pagination></ue-pagination>
	     */
	    angular.module('universal.editor').component('uePagination', uePagination);
	})();

/***/ },
/* 81 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UePaginationController', UePaginationController);

	    UePaginationController.$inject = ['$scope', 'RestApiService', '$httpParamSerializer', '$sce', '$location', '$element'];

	    function UePaginationController($scope, RestApiService, $httpParamSerializer, $sce, $location, $element) {
	        $element.addClass('ue-pagination');

	        var vm = this;
	        vm.metaKey = true;
	        vm.parentComponentId = vm.options.$parentComponentId;
	        var watchData = $scope.$watch(function () {
	            return vm.setting.paginationData;
	        }, function (data) {

	            var metaKey = '_meta';
	            var itemsKey = 'items';
	            var pageItems = vm.setting.component.settings.maxSize || 7;

	            var url = vm.setting.component.settings.dataSource.url;
	            var parentField = vm.setting.component.settings.dataSource.parentField;
	            var startIndex;
	            var endIndex;
	            //var qParams = vm.options.queryTempParams;
	            vm.request = {
	                params: {},
	                options: vm.options,
	                parentField: parentField,
	                url: url
	            };

	            vm.pageItemsArray = [];
	            vm.items = vm.setting.paginationData[itemsKey];
	            var label = {
	                last: '>>',
	                next: '>',
	                first: '<<',
	                previous: '<',
	                lastIs: true,
	                nextIs: true,
	                firstIs: true,
	                previousIs: true
	            };

	            if (!!vm.setting.component.settings.label) {
	                angular.forEach(['last', 'next', 'first', 'previous'], function (val) {
	                    if (angular.isDefined(vm.setting.component.settings.label[val])) {
	                        if (vm.setting.component.settings.label[val]) {
	                            label[val] = vm.setting.component.settings.label[val];
	                        } else {
	                            label[val + 'Is'] = false;
	                        }
	                    }
	                });
	            }

	            if (angular.isDefined(vm.setting.component.settings.dataSource.keys)) {
	                metaKey = vm.setting.component.settings.dataSource.keys.meta || metaKey;
	                itemsKey = vm.setting.component.settings.dataSource.keys.items || itemsKey;
	                vm.metaKey = vm.setting.component.settings.dataSource.keys.meta != false;
	            }

	            if (!!vm.items && vm.items.length === 0) {
	                vm.metaKey = false;
	            }

	            if (!!data[metaKey]) {
	                vm.metaData = data[metaKey];
	                vm.metaData.fromItem = (data[metaKey].currentPage - 1) * data[metaKey].perPage + 1;
	                vm.metaData.toItem = (data[metaKey].currentPage - 1) * data[metaKey].perPage + data[itemsKey].length;

	                if (data[metaKey].currentPage > 1) {

	                    if (label.firstIs) {
	                        vm.pageItemsArray.push({
	                            label: label.first,
	                            page: 1
	                        });
	                    }

	                    if (label.previousIs) {
	                        vm.pageItemsArray.push({
	                            label: label.previous,
	                            page: data[metaKey].currentPage - 1
	                        });
	                    }
	                }

	                if (data[metaKey].currentPage <= parseInt(pageItems / 2)) {
	                    startIndex = 1;
	                } else if (data[metaKey].currentPage > data[metaKey].pageCount - pageItems + 1) {
	                    startIndex = Math.max(data[metaKey].pageCount - pageItems + 1, 1);
	                } else {
	                    startIndex = Math.max(data[metaKey].currentPage - parseInt(pageItems / 2), 1);
	                }

	                endIndex = Math.min(startIndex + pageItems - 1, data[metaKey].pageCount);

	                if (startIndex > 1) {
	                    vm.pageItemsArray.push({
	                        label: "...",
	                        page: startIndex - 1
	                    });
	                }

	                for (var i = startIndex; i <= endIndex; i++) {
	                    if (i !== data[metaKey].currentPage) {
	                        vm.pageItemsArray.push({
	                            label: i,
	                            page: i
	                        });
	                    } else {
	                        vm.pageItemsArray.push({
	                            label: data[metaKey].currentPage,
	                            self: true
	                        });
	                    }
	                }

	                if (endIndex < data[metaKey].pageCount) {
	                    vm.pageItemsArray.push({
	                        label: "...",
	                        page: endIndex + 1
	                    });
	                }

	                if (data[metaKey].currentPage < data[metaKey].pageCount) {

	                    if (label.nextIs) {
	                        vm.pageItemsArray.push({
	                            label: label.next,
	                            page: data[metaKey].currentPage + 1
	                        });
	                    }

	                    if (label.lastIs) {
	                        vm.pageItemsArray.push({
	                            label: label.last,
	                            page: data[metaKey].pageCount
	                        });
	                    }
	                }
	            }
	        });

	        vm.changePage = function (event, pageItem) {
	            event.preventDefault();
	            vm.request.params.page = pageItem.page;
	            var parentEntity = $location.search().parent;
	            if (parentEntity) {
	                parentEntity = JSON.parse(parentEntity);
	                vm.parent = parentEntity[vm.parentComponentId] || null;
	                vm.request.childId = vm.parent;
	            } else {
	                vm.request.childId = null;
	            }
	            RestApiService.getItemsList(vm.request);
	        };

	        vm.$onDestroy = function () {
	            watchData();
	        };
	    }
	})();

/***/ },
/* 82 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueRadiolist = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueRadiolist/ueRadiolist.html');
	        }],
	        controller: 'UeRadiolistController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc Radiolist-type field.
	     * @example <ue-radiolist></ue-radiolist>
	     */
	    angular.module('universal.editor').component('ueRadiolist', ueRadiolist);
	})();

/***/ },
/* 83 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeRadiolistController', UeRadiolistController);

	    UeRadiolistController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'FilterFieldsStorage', '$controller'];

	    function UeRadiolistController($scope, $element, EditEntityStorage, RestApiService, FilterFieldsStorage, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        vm.optionValues = [];
	        vm.inputValue = "";
	        vm.newEntityLoaded = newEntityLoaded;

	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        var componentSettings = vm.setting.component.settings;

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            $scope.onLoadDataHandler(e, data);
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                componentSettings.$loadingPromise.then(function (optionValues) {
	                    vm.optionValues = optionValues;
	                    vm.equalPreviewValue();
	                }).finally(function () {
	                    vm.loadingData = false;
	                });
	            }
	        }));

	        function newEntityLoaded() {
	            vm.fieldValue = vm.setting.component.settings.defaultValue || null;
	        }
	    }
	})();

/***/ },
/* 84 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueString = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueString/ueString.html');
	        }],
	        controller: 'UeStringController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc String-type field.
	     * @example <ue-string></ue-string>
	     */
	    angular.module('universal.editor').component('ueString', ueString);
	})();

/***/ },
/* 85 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeStringController', UeStringController);

	    UeStringController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$location', '$controller', '$timeout'];

	    function UeStringController($scope, $element, EditEntityStorage, FilterFieldsStorage, $location, $controller, $timeout) {
	        /* jshint validthis: true */
	        var vm = this;
	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        vm.addItem = addItem;
	        vm.removeItem = removeItem;

	        if (vm.contentType == 'password') {
	            vm.typeInput = 'password';
	        }

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            $scope.onLoadDataHandler(e, data);
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                vm.equalPreviewValue();
	            }
	        }));

	        function removeItem(index) {
	            if (angular.isArray(vm.fieldValue)) {
	                vm.fieldValue.forEach(function (value, key) {
	                    if (key == index) {
	                        vm.fieldValue.splice(index, 1);
	                    }
	                });
	            }
	        }

	        function addItem() {
	            vm.fieldValue.push('');
	        }
	    }
	})();

/***/ },
/* 86 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueTextarea = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueTextarea/ueTextarea.html');
	        }],
	        controller: 'UeTextareaController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc String-type field.
	     * @example <ue-textarea></ue-textarea>
	     */
	    angular.module('universal.editor').component('ueTextarea', ueTextarea);
	})();

/***/ },
/* 87 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeTextareaController', UeTextareaController);

	    UeTextareaController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$controller'];

	    function UeTextareaController($scope, $element, EditEntityStorage, FilterFieldsStorage, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        var componentSettings = vm.setting.component.settings;
	        vm.rows = componentSettings.height || 7;
	        vm.addItem = addItem;
	        vm.removeItem = removeItem;
	        vm.classComponent = !vm.cols ? '' : vm.classComponent;

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            $scope.onLoadDataHandler(e, data);
	            //-- for set preview value
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                vm.equalPreviewValue();
	            }
	        }));

	        //-- private functions

	        function removeItem(index) {
	            if (angular.isArray(vm.fieldValue)) {
	                vm.fieldValue.forEach(function (value, key) {
	                    if (key == index) {
	                        vm.fieldValue.splice(index, 1);
	                    }
	                });
	            }
	        }

	        function addItem() {
	            vm.fieldValue.push("");
	        }
	    }
	})();

/***/ },
/* 88 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    var ueTime = {
	        bindings: {
	            setting: '<',
	            options: '='
	        },
	        template: ['$templateCache', function ($templateCache) {
	            return $templateCache.get('module/components/ueTime/ueTime.html');
	        }],
	        controller: 'UeTimeController',
	        controllerAs: 'vm'
	    };

	    /**
	     * @desc String-type field.
	     * @example <ue-time></ue-time>
	     */
	    angular.module('universal.editor').component('ueTime', ueTime);
	})();

/***/ },
/* 89 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UeTimeController', UeTimeController);

	    UeTimeController.$inject = ['$scope', 'EditEntityStorage', '$element', 'moment', 'FilterFieldsStorage', '$controller'];

	    function UeTimeController($scope, EditEntityStorage, $element, moment, FilterFieldsStorage, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        var componentSettings = vm.setting.component.settings;
	        componentSettings.$fieldType = 'date';
	        var baseController = $controller('FieldsController', { $scope: $scope });
	        angular.extend(vm, baseController);

	        vm.format = vm.format || 'HH:mm';

	        vm.addItem = addItem;
	        vm.removeItem = removeItem;
	        $scope.minDate = !vm.minDate ? vm.minDate : moment(vm.minDate, vm.format);
	        $scope.maxDate = !vm.maxDate ? vm.maxDate : moment(vm.maxDate, vm.format);

	        vm.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            $scope.onLoadDataHandler(e, data);
	            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
	                vm.equalPreviewValue();
	            }
	        }));

	        //-- private functions
	        function removeItem(index) {
	            if (angular.isArray(vm.fieldValue)) {
	                vm.fieldValue.forEach(function (value, key) {
	                    if (key == index) {
	                        vm.fieldValue.splice(index, 1);
	                    }
	                });
	            }
	        }

	        function addItem() {
	            vm.fieldValue.push(moment());
	        }

	        vm.getFieldValue = function () {

	            var field = {};

	            var wrappedFieldValue;

	            if (vm.multiname) {
	                wrappedFieldValue = [];
	                angular.forEach(vm.fieldValue, function (valueItem) {
	                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
	                        return;
	                    }
	                    var tempItem = {};
	                    tempItem[vm.multiname] = moment(valueItem).format(vm.format);
	                    wrappedFieldValue.push(tempItem);
	                });
	            } else if (vm.multiple) {
	                wrappedFieldValue = [];
	                angular.forEach(vm.fieldValue, function (valueItem) {
	                    wrappedFieldValue.push(moment(valueItem).format(vm.format));
	                });
	            } else {
	                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
	                    wrappedFieldValue = "";
	                } else {
	                    wrappedFieldValue = moment(vm.fieldValue).format(vm.format);
	                }
	            }

	            if (vm.parentField) {
	                field[vm.parentField] = {};
	                field[vm.parentField][vm.fieldName] = wrappedFieldValue;
	            } else {
	                field[vm.fieldName] = wrappedFieldValue;
	            }

	            return field;
	        };
	    }
	})();

/***/ },
/* 90 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('UniversalEditorController', UniversalEditorController);

	    UniversalEditorController.$inject = ['$scope', '$rootScope', 'configData', 'RestApiService', '$element', '$compile', 'component', '$state', 'EditEntityStorage'];

	    function UniversalEditorController($scope, $rootScope, configData, RestApiService, $element, $compile, component, $state, EditEntityStorage) {
	        debugger;
	        var vm = this;
	        vm.configData = configData;
	        vm.menu = [];
	        var currentState = $state.current;
	        var pk;

	        $rootScope.$broadcast('editor:set_entity_type', component.settings);

	        var element = $element.find('.universal-editor');
	        var scope = $scope.$new();
	        scope.settings = {};
	        scope.settings.component = component;
	        scope.settings.pk = pk || null;
	        scope.options = {};
	        element.append($compile('<' + component.name + ' data-setting="settings" data-options="options" ></' + component.name + '>')(scope));
	    }
	})();

/***/ },
/* 91 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('BaseController', BaseController);

	    BaseController.$inject = ['$scope', 'EditEntityStorage', 'FilterFieldsStorage', '$templateCache', '$compile'];

	    function BaseController($scope, EditEntityStorage, FilterFieldsStorage, $templateCache, $compile) {
	        /* jshint validthis: true */
	        var vm = this;
	        var self = $scope.vm;
	        var componentSettings = self.setting.component.settings;
	        var fieldErrorName;

	        if (self.options) {
	            self.parentComponentId = self.options.$parentComponentId || '';
	            self.regim = self.options.regim || 'edit';
	        }
	        if (!self.fieldName) {
	            self.fieldName = self.setting.name;
	        }
	        self.parentField = self.setting.parentField;
	        self.parentFieldIndex = angular.isNumber(self.setting.parentFieldIndex) ? self.setting.parentFieldIndex : false;

	        self.label = componentSettings.label || null;
	        self.hint = componentSettings.hint || null;
	        self.required = componentSettings.required === true;
	        self.multiple = componentSettings.multiple === true;

	        self.templates = componentSettings.templates;

	        /** if template is set as a html-file */
	        var htmlPattern = /[^\s]+(?=\.html$)/;
	        if (angular.isObject(self.templates)) {
	            ['preview', 'filter', 'edit'].forEach(function (property) {
	                var template = self.templates[property];
	                if (angular.isFunction(template)) {
	                    template = template($scope);
	                }
	                if (template) {
	                    if (htmlPattern.test(template)) {
	                        self.templates[property] = $templateCache.get(template);
	                        if (self.templates[property] === undefined) {
	                            console.warn('File ' + template + ' is not found!');
	                        }
	                    } else {
	                        self.templates[property] = template;
	                    }
	                }
	            });
	        }

	        self.error = [];

	        if (self.parentField) {
	            if (self.parentFieldIndex) {
	                fieldErrorName = self.parentField + "_" + self.parentFieldIndex + "_" + self.fieldName;
	            } else {
	                fieldErrorName = self.parentField + "_" + self.fieldName;
	            }
	        } else {
	            fieldErrorName = self.fieldName;
	        }

	        //-- listener storage for handlers
	        self.listeners = [];
	        self.listeners.push($scope.$on("editor:api_error_field_" + fieldErrorName, onErrorApiHandler));

	        $scope.onErrorApiHandler = onErrorApiHandler;
	        $scope.onDestroyHandler = onDestroyHandler;

	        $scope.$on("$destroy", onDestroyHandler);
	        self.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
	            if (!data.$parentComponentId || data.$parentComponentId === self.parentComponentId && !self.options.filter) {
	                if (data.editorEntityType === "exist" && self.regim === 'preview' && (self.options.$dataIndex || self.options.$dataIndex === 0) && angular.isObject(data.$items)) {
	                    $scope.data = self.data = data.$items[self.options.$dataIndex];
	                } else {
	                    $scope.data = self.data = data;
	                }
	            }
	        }));

	        function onDestroyHandler() {
	            if (angular.isArray(self.listeners)) {
	                self.listeners.forEach(function (listener) {
	                    if (angular.isFunction(listener)) {
	                        listener();
	                    }
	                });
	            }
	            EditEntityStorage.deleteFieldController(self);
	            FilterFieldsStorage.deleteFilterController(self);
	        }

	        function onErrorApiHandler(event, data) {
	            if (angular.isArray(data)) {
	                angular.forEach(data, function (error) {
	                    if (self.error.indexOf(error) < 0) {
	                        self.error.push(error);
	                    }
	                });
	            } else {
	                if (self.error.indexOf(data) < 0) {
	                    self.error.push(data);
	                }
	            }
	        }
	    }
	})();

/***/ },
/* 92 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('ButtonsController', ButtonsController);

	    ButtonsController.$inject = ['$scope', '$controller'];

	    function ButtonsController($scope, $controller) {
	        /* jshint validthis: true */
	        var vm = this;
	        var baseController = $controller('BaseController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        var self = $scope.vm;
	        var componentSettings = self.setting.component.settings;

	        self.label = componentSettings.label;
	        self.action = componentSettings.action;
	        self.beforeSend = componentSettings.beforeSend;
	        self.success = componentSettings.success;
	        self.error = componentSettings.error;
	        self.complete = componentSettings.complete;
	        self.type = self.setting.type;
	        self.entityId = self.setting.entityId;
	    }
	})();

/***/ },
/* 93 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').controller('FieldsController', FieldsController);

	    FieldsController.$inject = ['$scope', '$rootScope', '$location', '$controller', '$timeout', 'FilterFieldsStorage', 'RestApiService', 'moment', 'EditEntityStorage', '$q'];

	    function FieldsController($scope, $rootScope, $location, $controller, $timeout, FilterFieldsStorage, RestApiService, moment, EditEntityStorage, $q) {
	        /* jshint validthis: true */
	        var vm = this;
	        var baseController = $controller('BaseController', { $scope: $scope });
	        angular.extend(vm, baseController);
	        var self = $scope.vm;
	        var componentSettings = self.setting.component.settings;
	        var regEmail = new RegExp('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$', 'i');
	        var regUrl = new RegExp('^(?:(?:ht|f)tps?://)?(?:[\\-\\w]+:[\\-\\w]+@)?(?:[0-9a-z][\\-0-9a-z]*[0-9a-z]\\.)+[a-z]{2,6}(?::\\d{1,5})?(?:[?/\\\\#][?!^$.(){}:|=[\\]+\\-/\\\\*;&~#@,%\\wА-Яа-я]*)?$', 'i');

	        self.readonly = componentSettings.readonly === true;
	        self.multiname = componentSettings.multiname || null;
	        self.depend = componentSettings.depend || null;
	        self.width = !isNaN(+componentSettings.width) ? componentSettings.width : null;
	        self.defaultValue = transformToValue(componentSettings.defaultValue);
	        self.placeholder = componentSettings.placeholder || null;
	        self.classComponent = 'col-lg-4 col-md-4 col-sm-4 col-xs-4 clear-padding-left';
	        self.inputLeave = inputLeave;

	        var values = componentSettings.values;
	        var remoteValues = componentSettings.valuesRemote;
	        if (values || remoteValues) {
	            self.field_id = "id";
	            self.field_search = "title";
	            if (self.optionValues) {
	                if (values) {
	                    angular.forEach(componentSettings.values, function (v, key) {
	                        var obj = {};
	                        obj[self.field_id] = key;
	                        obj[self.field_search] = v;
	                        if (angular.isArray(componentSettings.values)) {
	                            obj[self.field_id] = v;
	                        }
	                        self.optionValues.push(obj);
	                    });
	                    equalPreviewValue();
	                    componentSettings.$loadingPromise = $q.when(self.optionValues);
	                } else if (remoteValues) {
	                    if (remoteValues.fields) {
	                        self.field_id = remoteValues.fields.value || self.field_id;
	                        self.field_search = remoteValues.fields.label || self.field_id;
	                    }
	                    self.loadingData = true;
	                    if (!componentSettings.$loadingPromise) {
	                        componentSettings.$loadingPromise = RestApiService.getUrlResource(remoteValues.url).then(function (response) {
	                            angular.forEach(response.data.items, function (v) {
	                                self.optionValues.push(v);
	                            });
	                            componentSettings.$optionValues = self.optionValues;
	                            return self.optionValues;
	                        }, function (reject) {
	                            console.error(self.constructor.name + ': Не удалось получить значения для поля \"' + self.fieldName + '\" с удаленного ресурса');
	                        }).finally(function () {
	                            self.loadingData = false;
	                        });
	                    } else {
	                        if (componentSettings.$optionValues && componentSettings.$optionValues.length) {
	                            self.loadingData = false;
	                            self.optionValues = componentSettings.$optionValues;
	                        }
	                        equalPreviewValue();
	                    }
	                }
	            }
	        }

	        self.fieldValue = transformToValue(self.defaultValue);

	        self.cols = self.width;

	        if (self.options.filter) {
	            self.multiple = false;
	            self.readonly = false;
	            self.required = false;
	            self.fieldValue = null;
	            self.cols = 12;
	        }

	        if (!!self.cols) {
	            if (self.cols > 12) {
	                self.cols = 12;
	                console.warn('Значение длины для поля ' + self.label + ' превышает максимальное значение сетки (12).');
	            }
	            if (self.cols < 1) {
	                self.cols = 1;
	                console.warn('Значение длины для поля ' + self.label + ' ниже минимального значения сетки (1).');
	            }
	            self.classComponent = 'col-lg-' + self.cols + ' col-md-' + self.cols + ' col-sm-' + self.cols + ' col-xs-' + self.cols + ' clear-padding-left';
	        }

	        //-- registration of the field's component
	        if (self.options.filter) {
	            FilterFieldsStorage.addFilterController(self);
	        } else {
	            EditEntityStorage.addFieldController(self);
	        }

	        //-- listener storage for handlers        
	        self.listeners.push($scope.$watch(function () {
	            return self.fieldValue;
	        }, function () {
	            self.error = [];
	        }, true));
	        if (self.options.filter) {
	            $scope.$watch(function () {
	                return $location.search();
	            }, function (newVal) {
	                if (newVal && newVal.filter) {
	                    var filter = JSON.parse(newVal.filter);
	                    componentSettings.$parseFilter($scope.vm, filter[self.parentComponentId]);
	                }
	            });
	        }

	        self.clear = clear;
	        self.getFieldValue = getFieldValue;
	        self.equalPreviewValue = equalPreviewValue;

	        function clear() {
	            self.fieldValue = self.multiple ? [] : null;
	        }

	        function transformToValue(object) {
	            var value;
	            if (componentSettings.$fieldType === 'date') {
	                value = moment(object);
	                return self.multiple ? [value] : value;
	            }
	            if (angular.isObject(object) && !angular.isArray(object) && self.field_id) {
	                value = object[self.field_id];
	            } else {
	                value = object;
	            }
	            if (value == 0) {
	                return value;
	            }
	            return angular.copy(value) || (self.multiple ? [] : null);
	        }

	        function equalPreviewValue(source) {
	            source = source || self.optionValues || [];
	            if (angular.isArray(self.fieldValue)) {
	                self.previewValue = [];
	            }
	            if (self.fieldValue !== null && !angular.isUndefined(self.fieldValue)) {
	                if (componentSettings.values || componentSettings.valuesRemote) {
	                    if (angular.isArray(source)) {
	                        source.forEach(function (option) {
	                            if (angular.isObject(self.fieldValue) && !angular.isArray(self.fieldValue)) {
	                                compareId(self.fieldValue[self.field_id], option, false);
	                            }
	                            if (angular.isArray(self.fieldValue)) {
	                                self.fieldValue.forEach(function (value) {
	                                    if (angular.isObject(value)) {
	                                        compareId(value[self.field_id], option, true);
	                                    }
	                                    if (angular.isNumber(value) || angular.isString(value)) {
	                                        compareId(value, option, true);
	                                    }
	                                });
	                            }
	                            if (angular.isNumber(self.fieldValue) || angular.isString(self.fieldValue)) {
	                                compareId(self.fieldValue, option, false);
	                            }
	                        });
	                    }
	                } else {
	                    self.previewValue = self.fieldValue;
	                }
	            }

	            function compareId(id, option, multiple) {
	                if (id == option[self.field_id]) {
	                    if (multiple) {
	                        self.previewValue = self.previewValue || [];
	                        self.previewValue.push(option[self.field_search]);
	                    } else {
	                        self.previewValue = option[self.field_search];
	                    }
	                }
	            }
	        }

	        function getFieldValue() {
	            var field = {},
	                wrappedFieldValue;

	            if (self.multiple) {
	                wrappedFieldValue = [];
	                self.fieldValue.forEach(function (value) {
	                    var temp;
	                    var output = transformToValue(value);

	                    if (self.multiname) {
	                        temp = {};
	                        temp[self.multiname] = output;
	                    }
	                    wrappedFieldValue.push(temp || output);
	                });
	            } else {
	                wrappedFieldValue = transformToValue(self.fieldValue);
	            }

	            if (self.parentField) {
	                field[self.parentField] = {};
	                field[self.parentField][self.fieldName] = wrappedFieldValue;
	            } else {
	                field[self.fieldName] = wrappedFieldValue;
	            }

	            return field;
	        }

	        $scope.onLoadDataHandler = onLoadDataHandler;

	        function onLoadDataHandler(event, data, callback) {
	            if (!data.$parentComponentId || data.$parentComponentId === self.parentComponentId) {
	                if (!self.options.filter) {
	                    //-- functional for required fields
	                    if (componentSettings.depend) {
	                        $scope.$watch(function () {
	                            var f_value = EditEntityStorage.getValueField(self.parentComponentId, componentSettings.depend);
	                            var result = false;
	                            if (f_value !== false) {
	                                (function check(value) {
	                                    var keys = Object.keys(value);
	                                    for (var i = keys.length; i--;) {
	                                        var propValue = value[keys[i]];
	                                        if (propValue !== null && propValue !== undefined && propValue !== "") {
	                                            if (angular.isObject(propValue) && !result) {
	                                                check(propValue);
	                                            } else {
	                                                result = true;
	                                            }
	                                        }
	                                    }
	                                })(f_value);
	                            }
	                            return result;
	                        }, function (value) {
	                            if (!value) {
	                                self.clear();
	                                self.readonly = true;
	                            } else {
	                                self.readonly = componentSettings.readonly || false;
	                            }
	                        }, true);
	                    }

	                    if (data.editorEntityType === "new" && self.regim !== 'preview') {

	                        if (!!self.newEntityLoaded) {
	                            self.newEntityLoaded();
	                            return;
	                        }

	                        var obj = {};
	                        self.fieldValue = transformToValue(componentSettings.defaultValue);
	                        if (self.field_id) {
	                            if (self.isTree) {
	                                self.fieldValue = [];
	                            }

	                            if (!!componentSettings.defaultValue && !self.isTree) {
	                                obj = {};
	                                obj[self.field_id] = componentSettings.defaultValue;
	                                self.fieldValue = obj;
	                            }
	                            if (data.hasOwnProperty(self.fieldName)) {
	                                self.fieldValue = data[self.fieldName];
	                            }
	                        }
	                        if (angular.isFunction(callback)) {
	                            callback();
	                        }
	                        return;
	                    }

	                    var apiValue;
	                    if (!self.parentField) {
	                        apiValue = self.data[self.fieldName];
	                    } else {
	                        apiValue = self.data[self.parentField];
	                        if (angular.isArray(self.data[self.parentField]) && angular.isNumber(self.parentFieldIndex)) {
	                            apiValue = apiValue[self.parentFieldIndex];
	                        }
	                        apiValue = apiValue[self.fieldName];
	                    }

	                    if (!self.multiple) {
	                        self.fieldValue = apiValue;
	                    } else {
	                        if (angular.isArray(apiValue)) {
	                            self.fieldValue = [];
	                            apiValue.forEach(function (item) {
	                                self.fieldValue.push(self.multiname ? item[self.multiname] : item);
	                            });
	                        }
	                    }
	                    if (angular.isFunction(callback)) {
	                        callback();
	                    }
	                    equalPreviewValue();
	                }
	            }
	        }

	        //validators
	        self.typeInput = 'text';
	        self.validators = self.setting.component.settings.validators;
	        angular.forEach(self.setting.component.settings.validators, function (validator) {
	            switch (validator.type) {
	                case 'string':
	                    self.minLength = validator.minLength;
	                    self.maxLength = validator.maxLength;
	                    self.pattern = validator.pattern;
	                    self.trim = validator.trim;
	                    self.contentType = validator.contentType;
	                    break;
	                case 'number':
	                    self.typeInput = 'number';
	                    self.minNumber = validator.min;
	                    self.maxNumber = validator.max;
	                    self.stepNumber = validator.step;
	                    break;
	                case 'date':
	                    self.minDate = validator.minDate;
	                    self.maxDate = validator.maxDate;
	                    self.format = validator.format;
	                    break;
	                case 'mask':
	                    self.isMask = true;
	                    self.maskDefinitions = validator.maskDefinitions;
	                    self.mask = validator.mask;
	                    break;
	            }
	        });

	        /* Слушатель события на покидание инпута. Необходим для валидации*/
	        function inputLeave(val, index) {
	            self.error = [];

	            if (!val) {
	                return;
	            }

	            if (self.trim) {
	                if (!self.multiple) {
	                    self.fieldValue = self.fieldValue.trim();
	                } else {
	                    self.fieldValue[index] = self.fieldValue[index].trim();
	                }
	                val = val.trim();
	            }

	            if (self.hasOwnProperty('maxLength') && val.length > self.maxLength) {
	                var maxError = 'Для поля превышено максимальное допустимое значение в ' + self.maxLength + ' символов. Сейчас введено ' + val.length + ' символов.';
	                if (self.error.indexOf(maxError) < 0) {
	                    self.error.push(maxError);
	                }
	            }

	            if (self.hasOwnProperty('minLength') && val.length < self.minLength) {
	                var minError = 'Минимальное значение поля не может быть меньше ' + self.minLength + ' символов. Сейчас введено ' + val.length + ' символов.';
	                if (self.error.indexOf(minError) < 0) {
	                    self.error.push(minError);
	                }
	            }

	            if (self.hasOwnProperty('pattern') && !val.match(new RegExp(self.pattern))) {
	                var patternError = 'Введенное значение не соответствует паттерну ' + self.pattern.toString();
	                if (self.error.indexOf(patternError) < 0) {
	                    self.error.push(patternError);
	                }
	            }

	            if (self.hasOwnProperty('maxNumber') && val > self.maxNumber) {
	                var maxNumberError = 'Для поля превышено максимальное допустимое значение ' + self.maxNumber + '. Сейчас введено ' + val + '.';
	                if (self.error.indexOf(maxNumberError) < 0) {
	                    self.error.push(maxNumberError);
	                }
	            }

	            if (self.hasOwnProperty('minNumber') && val < self.minNumber) {
	                var minNumberError = 'Минимальное значение поля не может быть меньше ' + self.minNumber + '. Сейчас введено ' + val + '.';
	                if (self.error.indexOf(minNumberError) < 0) {
	                    self.error.push(minNumberError);
	                }
	            }

	            if (self.contentType == 'email' && !val.match(regEmail)) {
	                var emailError = 'Введен некорректный email.';
	                if (self.error.indexOf(emailError) < 0) {
	                    self.error.push(emailError);
	                }
	            }

	            if (self.contentType == 'url' && !val.match(regUrl)) {
	                var urlError = 'Введен некорректный url.';
	                if (self.error.indexOf(urlError) < 0) {
	                    self.error.push(urlError);
	                }
	            }
	        }
	    }
	})();

/***/ },
/* 94 */
/***/ function(module, exports) {

	angular.module('universal.editor').directive('onRenderTemplate', ['$timeout', '$compile', function ($timeout, $compile) {
	  return {
	    restrict: 'A',
	    scope: false,
	    link: function (scope, element, attr) {
	      var vm = scope.vm;
	      $timeout(function () {
	        //debugger
	        if (angular.isObject(vm.templates)) {
	          if (vm.templates.filter && element.hasClass('component-filter')) {
	            insertHtml(element, vm.templates.filter);
	          } else if (vm.templates.edit && element.hasClass('component-edit')) {
	            insertHtml(element, vm.templates.edit);
	          } else if (vm.templates.preview && element.hasClass('component-preview')) {
	            insertHtml(element, vm.templates.preview);
	          } else if (element.hasClass('button-template')) {
	            insertHtml(element, vm.templates);
	          } else {
	            element.remove();
	          }
	        } else {
	          element.remove();
	        }
	      });
	      function insertHtml(el, html) {
	        element.html($compile(angular.element(html))(scope));
	      }
	    }
	  };
	}]);

/***/ },
/* 95 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').factory('ComponentBuilder', ComponentBuilder);

	    ComponentBuilder.$inject = ['$compile'];

	    function ComponentBuilder($compile) {
	        var Component = function (scope) {
	            this.scope = scope.$new();
	            this.scope.setting = scope.setting;
	            this.scope.options = scope.options;
	        };

	        Component.prototype.build = function () {
	            var element = '<' + this.scope.setting.component.name + ' class="field-wrapper-' + this.scope.setting.component.name + '" data-setting="::setting" data-options="::options"></' + this.scope.setting.component.name + '>';
	            return $compile(element)(this.scope);
	        };

	        return Component;
	    }
	})();

/***/ },
/* 96 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').provider('configData', ConfigDataProvider);

	    ConfigDataProvider.$inject = ['$stateProvider', '$urlRouterProvider', '$injector'];
	    function ConfigDataProvider($stateProvider, $urlRouterProvider, $injector) {
	        var configData = {};
	        return {
	            setConfig: function (moduleName, config) {
	                configData = config;
	                var defaultState = {
	                    'index': {
	                        'url': '/type?parent&back'
	                    },
	                    'edit': {
	                        'url': '/type/:pk?parent&back'
	                    }
	                };

	                //-- for deleting slash in the end of address
	                $urlRouterProvider.rule(function ($injector, $location) {
	                    var path = $location.path(),
	                        hasTrailingSlash = path[path.length - 1] === '/';
	                    if (hasTrailingSlash) {
	                        return path.substr(0, path.length - 1);
	                    }
	                });

	                var id = 0;
	                var prefix = function (str) {
	                    var hash = 5381,
	                        char;
	                    for (var i = 0; i < str.length; i++) {
	                        char = str.charCodeAt(i);
	                        hash = (hash << 5) + hash + char; /* hash * 33 + c */
	                    }
	                    return hash;
	                }(moduleName);
	                angular.forEach(config.states, function (state) {
	                    var nameState = state.name,
	                        urlState = state.url,
	                        levelState = state.name.split('.').length;
	                    if (defaultState[state.name]) {
	                        urlState = !!state.url ? state.url : defaultState[state.name].url.replace('type', '');
	                    }
	                    urlState = urlState.replace(':pk', ':pk' + levelState);

	                    //-- indentifier components. Set id for components.
	                    (function check(value) {
	                        var keys = Object.keys(value);
	                        for (var i = keys.length; i--;) {
	                            var propValue = value[keys[i]];
	                            if (keys[i] === 'component') {
	                                propValue.$id = propValue.$id || prefix + ++id;
	                            }
	                            if (angular.isObject(propValue)) {
	                                check(propValue);
	                            }
	                        }
	                    })(state);

	                    //-- options for the state of ui-router
	                    var stateOptions = {
	                        url: urlState,
	                        reloadOnSearch: false,
	                        resolve: {
	                            moduleName: function () {
	                                return moduleName;
	                            }
	                        },
	                        params: {
	                            pk: null
	                        }
	                    };
	                    stateOptions.views = {};
	                    stateOptions.views[moduleName] = {
	                        templateUrl: 'module/components/universalEditor/universalEditor.html',
	                        controller: 'UniversalEditorController',
	                        controllerAs: 'vm',
	                        resolve: {
	                            component: function () {
	                                return state.component;
	                            }
	                        }
	                    };
	                    $stateProvider.state(nameState, stateOptions);
	                });
	                if (!window.universal_editor_is_load) {
	                    window.universal_editor_is_load = true;
	                    $urlRouterProvider.otherwise(config.states[0].url || '/');
	                }
	            },

	            $get: ['$q', '$rootScope', function ($q, $root) {
	                return configData;
	            }]
	        };
	    }
	})();

/***/ },
/* 97 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').service('ButtonsService', ButtonsService);

	    ButtonsService.$inject = ['$window'];

	    function ButtonsService($window) {
	        var self = this;

	        self.getCallback = getCallback;

	        function getCallback(name) {
	            if (!name) {
	                return name;
	            }
	            var callback = name.split('.');
	            return $window[callback[0]][callback[1]];
	        }
	    }
	})();

/***/ },
/* 98 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').service('EditEntityStorage', EditEntityStorage);

	    EditEntityStorage.$inject = ['$rootScope', '$timeout', 'configData', '$location', '$state'];

	    function EditEntityStorage($rootScope, $timeout, configData, $location, $state) {
	        var sourceEntity,
	            configuredFields = {},
	            fieldControllers = [],
	            entityObject,
	            self = this,
	            storage = {};

	        /* PUBLIC METHODS */

	        this.actionType = "create";

	        this.getLevelChild = function (stateName) {
	            return stateName.split('.').length;
	        };

	        this.getValueField = function (componentId, fieldName) {
	            var controllers = storage[componentId] || [];
	            for (var i = controllers.length; i--;) {
	                var controller = controllers[i];
	                if (controller.fieldName === fieldName) {
	                    return controller.getFieldValue();
	                }
	            }
	            return false;
	        };

	        this.newSourceEntity = function (id, parentField) {
	            var parentEntity = $location.search().parent;
	            var parent;
	            if (parentEntity) {
	                parentEntity = JSON.parse(parentEntity);
	                parent = parentEntity[id] || null;
	            }
	            var data = { editorEntityType: "new", $parentComponentId: !!parentField ? undefined : id };
	            if (!!parent && !!parentField) {
	                data[parentField] = parent;
	            }
	            $rootScope.$broadcast("editor:entity_loaded", data);
	        };

	        this.addFieldController = function (ctrl) {
	            var id = ctrl.parentComponentId;
	            if (id) {
	                storage[id] = storage[id] || [];
	                storage[id].push(ctrl);
	                ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
	            }
	        };

	        this.deleteFieldController = function (ctrl) {
	            var controllers = storage[ctrl.parentComponentId];
	            if (controllers) {
	                angular.forEach(controllers, function (controller, ind) {
	                    if (controller.$fieldHash === ctrl.$fieldHash) {
	                        controllers.splice(ind, 1);
	                    }
	                });
	            }
	        };

	        this.setActionType = function (type) {
	            this.actionType = type;
	        };

	        this.editEntityUpdate = function (type, request) {
	            this.setActionType(request.entityType);
	            var entityObject = {};
	            var controllers = storage[request.options.$parentComponentId] || [];
	            var isError = true;

	            angular.forEach(controllers, function (fCtrl) {
	                var value = fCtrl.getFieldValue();
	                if (!fCtrl.multiple) {
	                    fCtrl.inputLeave(fCtrl.fieldValue);
	                } else {
	                    var flagError = true;
	                    angular.forEach(fCtrl.fieldValue, function (val, index) {
	                        if (flagError) {
	                            fCtrl.inputLeave(val, index);
	                            if (fCtrl.error.length !== 0) {
	                                flagError = false;
	                            }
	                        }
	                    });
	                }

	                isError = fCtrl.error.length === 0 && isError;
	                if (!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false) {
	                    if (fCtrl.parentField && fCtrl.parentFieldIndex !== false) {
	                        entityObject[fCtrl.parentField] = entityObject[fCtrl.parentField] || [];
	                        entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] = entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] || {};
	                        angular.merge(entityObject[fCtrl.parentField][fCtrl.parentFieldIndex], value[fCtrl.parentField]);
	                    } else {
	                        angular.merge(entityObject, value);
	                    }
	                }
	            });
	            if (isError) {
	                request.data = entityObject;
	                switch (type) {
	                    case "create":
	                        $rootScope.$emit('editor:create_entity', request);
	                        break;
	                    case "update":
	                        $rootScope.$emit('editor:update_entity', request);
	                        break;
	                }
	            }
	        };

	        this.editEntityPresave = function (request) {
	            var entityObject = {};
	            var isError = true;
	            var controllers = storage[request.options.$parentComponentId] || [];

	            angular.forEach(controllers, function (fCtrl) {
	                var value = fCtrl.getFieldValue();
	                if (!fCtrl.multiple) {
	                    fCtrl.inputLeave(fCtrl.fieldValue);
	                } else {
	                    var flagError = true;
	                    angular.forEach(fCtrl.fieldValue, function (val, index) {
	                        if (flagError) {
	                            fCtrl.inputLeave(val, index);
	                            if (fCtrl.error.length !== 0) {
	                                flagError = false;
	                            }
	                        }
	                    });
	                }
	                isError = fCtrl.error.length === 0 && isError;
	                if (!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false) {
	                    if (fCtrl.parentField && fCtrl.parentFieldIndex !== false) {
	                        entityObject[fCtrl.parentField] = entityObject[fCtrl.parentField] || [];
	                        entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] = entityObject[fCtrl.parentField][fCtrl.parentFieldIndex] || {};
	                        angular.merge(entityObject[fCtrl.parentField][fCtrl.parentFieldIndex], value[fCtrl.parentField]);
	                    } else {
	                        angular.merge(entityObject, value);
	                    }
	                }
	                if (!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false) {
	                    angular.merge(entityObject, fCtrl.getFieldValue());
	                }
	            });

	            if (isError) {
	                request.data = entityObject;
	                $rootScope.$emit('editor:presave_entity', request);
	            }
	        };

	        this.getEntity = function (stateName, entityName) {
	            return configData;
	        };

	        this.getStateConfig = function (stateName, entityName) {

	            entityName = entityName || configData;
	            var result = null;
	            var entity = configData;

	            angular.forEach(configData.states, function (state) {
	                if (state.name) {
	                    if (state.name === stateName) {
	                        result = state;
	                    }
	                }
	            });
	            if (!stateName) {
	                return configData.states[0];
	            }
	            return result;
	        };

	        /* !PUBLIC METHODS */

	        /* EVENTS LISTENING */

	        $rootScope.$on("editor:add_entity", function (event, data) {
	            self.actionType = data;
	        });

	        $rootScope.$on('editor:set_entity_type', function (event, type) {
	            entityObject = type;
	            fieldControllers = [];
	        });

	        /* !EVENTS LISTENING */

	        /* PRIVATE METHODS */

	        function validateEntityFields() {

	            var valid = true;

	            if (sourceEntity === undefined || entityType === undefined) {
	                console.log("EditEntityStorage: Сущность не доступна для проверки так как она не указана или не указан её тип");
	                valid = false;
	            }

	            return valid;
	        }

	        /* !PRIVATE METHODS */
	    }
	})();

/***/ },
/* 99 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').service('FilterFieldsStorage', FilterFieldsStorage);

	    FilterFieldsStorage.$inject = ['$rootScope', '$timeout', 'configData'];

	    function FilterFieldsStorage($rootScope, $timeout, configData) {
	        var storage = {},
	            queryObject = [],
	            srvc = this,
	            filterSearchString;

	        /** set functions for service */
	        angular.extend(srvc, {
	            addFilterController: addFilterController,
	            deleteFilterController: deleteFilterController,
	            clearFiltersValue: clearFiltersValue,
	            calculate: calculate,
	            getFilterQueryObject: getFilterQueryObject
	        });

	        function addFilterController(ctrl) {
	            var id = ctrl.parentComponentId;
	            if (id) {
	                storage[id] = storage[id] || [];
	                storage[id].push(ctrl);
	                ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
	            }
	        }

	        function deleteFilterController(ctrl) {
	            var id = ctrl.parentComponentId;
	            if (id) {
	                var filterControllers = storage[id];
	                if (filterControllers) {
	                    angular.forEach(filterControllers, function (fc, ind) {
	                        if (fc.$fieldHash === ctrl.$fieldHash) {
	                            filterControllers.splice(ind, 1);
	                        }
	                    });
	                }
	            }
	        }

	        function clearFiltersValue(id) {
	            if (storage[id]) {
	                angular.forEach(storage[id], function (ctrl) {
	                    ctrl.clear();
	                });
	                calculate(id);
	            }
	        }

	        function calculate(id) {
	            var ctrls = storage[id];
	            var filters = {};
	            //-- get list of filter fields
	            angular.forEach(ctrls, function (ctrl) {
	                //--get settings of the field
	                var settings = ctrl.setting.component.settings;
	                //--get operator from settings of the field
	                var operator = ctrl.options.filterParameters.operator;
	                //--get value of the field
	                var fieldValue = ctrl.getFieldValue();

	                //-- genarate filter objects with prepared filters
	                var filterValue = settings.$toFilter(operator, ctrl.getFieldValue());
	                angular.extend(filters, filterValue);
	            });

	            //** storage filter object
	            if (!$.isEmptyObject(filters)) {
	                queryObject[id] = angular.copy(filters);
	            } else {
	                delete queryObject[id];
	                filters = false;
	            }
	            return filters;
	        }

	        function getFilterQueryObject(id) {
	            return queryObject[id];
	        }
	    }
	})();

/***/ },
/* 100 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').service('ModalService', ModalService);

	    ModalService.$inject = ['$q', '$rootScope', '$http', 'configData', 'EditEntityStorage', '$location', '$timeout', '$state', '$httpParamSerializer', '$document', '$uibModal'];

	    function ModalService($q, $rootScope, $http, configData, EditEntityStorage, $location, $timeout, $state, $httpParamSerializer, $document, $uibModal) {
	        var self = this,
	            modalInstance,
	            isOpen = false,
	            settings;

	        self.close = closeWindow;
	        self.open = openWindow;
	        self.isModalOpen = isModalOpen;
	        self.options = {};
	        self.fromState = null;

	        function openWindow(component) {
	            /** send fromState и _pk */
	            settings = component.settings;

	            if (self.options.$parentComponentId) {
	                $location.search('relativeEntityId', self.options.$parentComponentId);
	            }
	            modalInstance = $uibModal.open({
	                component: 'ueModal',
	                resolve: {
	                    settings: function () {
	                        return settings;
	                    },
	                    $parentComponentId: function () {
	                        return self.options.$parentComponentId || $location.search().relativeEntityId;
	                    }
	                }
	            });

	            modalInstance.rendered.then(function () {
	                isOpen = true;
	                var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
	                if (pk === 'new') {
	                    EditEntityStorage.newSourceEntity(self.options.$parentComponentId);
	                }
	                self.fromState = settings.fromState || null;
	            });

	            modalInstance.result.then(closeWindow, closeWindow);
	        }

	        function isModalOpen() {
	            return isOpen;
	        }

	        function closeWindow(isUpdateParentComponent) {
	            console.log('closes');
	            if (isOpen) {
	                var parentComponentId = self.options.$parentComponentId;
	                isOpen = false;
	                if (modalInstance) {
	                    modalInstance.close();
	                }
	                modalInstance = null;
	                $location.search('relativeEntityId', null);
	                self.options = null;
	                if (settings.fromState) {
	                    $state.go(settings.fromState.name, settings.fromParams, { reload: false }).then(function () {
	                        console.log(isUpdateParentComponent);
	                        if (!isUpdateParentComponent) {
	                            $rootScope.$broadcast('editor:read_entity', parentComponentId);
	                        }
	                    });
	                }
	                settings = null;
	            }
	        }
	    }
	})();

/***/ },
/* 101 */
/***/ function(module, exports) {

	(function () {
	    'use strict';

	    angular.module('universal.editor').service('RestApiService', RestApiService);

	    RestApiService.$inject = ['$q', '$rootScope', '$http', 'configData', 'EditEntityStorage', '$location', '$timeout', '$state', '$httpParamSerializer', '$document', 'FilterFieldsStorage', 'ModalService', 'toastr', '$translate'];

	    function RestApiService($q, $rootScope, $http, configData, EditEntityStorage, $location, $timeout, $state, $httpParamSerializer, $document, FilterFieldsStorage, ModalService, toastr, $translate) {
	        var self = this,
	            queryTempParams,
	            filterParams,
	            itemsKey,
	            entityObject,
	            mixEntity,
	            cancelerPromises = [];

	        self.isProcessing = false;
	        self.methodType = "";
	        self.editedEntityId = null;

	        $rootScope.$on('editor:set_entity_type', function (event, type) {
	            entityObject = type;
	            itemsKey = "items";
	        });

	        $rootScope.$on('editor:create_entity', function (event, request) {
	            self.addNewItem(request);
	        });

	        $rootScope.$on('editor:update_entity', function (event, request) {
	            self.updateItem(request);
	        });

	        $rootScope.$on('editor:presave_entity', function (event, request) {
	            self.presaveItem(request);
	        });

	        this.getQueryParams = function () {
	            try {
	                return JSON.parse(JSON.stringify(queryTempParams));
	            } catch (e) {
	                return {};
	            }
	        };

	        this.setQueryParams = function (params) {
	            if (Object.keys(params).length > 0) {
	                queryTempParams = params;
	            } else {
	                queryTempParams = undefined;
	            }
	        };

	        this.setFilterParams = function (params) {
	            if (Object.keys(params).length > 0) {
	                filterParams = params;
	            } else {
	                filterParams = undefined;
	            }
	        };

	        function setTimeOutPromise(id, mode) {
	            var def = $q.defer();
	            cancelerPromises[id] = cancelerPromises[id] || {};
	            if (cancelerPromises[id][mode]) {
	                cancelerPromises[id][mode].resolve();
	            }
	            cancelerPromises[id][mode] = def;
	            return def;
	        }

	        this.getItemsList = function (request) {

	            //** cancel previouse request if request start again 
	            var canceler = setTimeOutPromise(request.options.$parentComponentId, 'read');
	            request.options.isLoading = true;
	            var dataSource = request.options.$dataSource;

	            var deferred = $q.defer();

	            var _method = 'GET';
	            var _url = request.url;

	            var params = request.params || {};
	            _method = request.method || _method;
	            if (!!request.options && request.options.sort !== undefined) {
	                params.sort = request.options.sort;
	            }

	            var id = request.options.$parentComponentId;
	            var filters = FilterFieldsStorage.getFilterQueryObject(id);
	            var beforeSend;
	            if (!!request.childId) {
	                filters = filters || {};
	                filters[request.parentField] = request.childId;
	            }

	            /** beforeSend handler */
	            if (angular.isFunction(FilterFieldsStorage.callbackBeforeSend)) {
	                beforeSend = FilterFieldsStorage.callbackBeforeSend;
	                delete FilterFieldsStorage.callbackBeforeSend;
	            }

	            if (filters) {
	                angular.extend(params, { filter: JSON.stringify(filters) });
	            } else {
	                delete params.filter;
	            }

	            if (!!request.options.mixedMode) {
	                params = params || {};
	                angular.extend(params, {
	                    mixed: request.options.mixedMode.entityType
	                });
	            }

	            if (dataSource.hasOwnProperty("parentField")) {
	                params = params || {};

	                if (!params.hasOwnProperty("filter")) {
	                    params.root = true;
	                }
	            }

	            if (dataSource.hasOwnProperty("sortBy") && !params.hasOwnProperty(dataSource.sortBy) && !params.sort) {
	                params = params || {};
	                angular.extend(params, {
	                    sort: dataSource.sortBy
	                });
	            }

	            if (params.hasOwnProperty("filter")) {
	                delete params.root;
	            }

	            var expandFields = [];

	            angular.forEach(dataSource.fields, function (field) {
	                if (field.hasOwnProperty("expandable") && field.expandable === true) {
	                    expandFields.push(field.name);
	                }
	            });

	            if (expandFields.length > 0) {
	                params.expand = expandFields.join(',');
	            }

	            $http({
	                method: _method,
	                url: _url,
	                params: params,
	                timeout: canceler.promise,
	                beforeSend: beforeSend
	            }).then(function (response) {
	                if (response.data[itemsKey].length === 0) {
	                    $rootScope.$broadcast("editor:parent_empty");
	                }
	                response.data.$parentComponentId = request.options.$parentComponentId;
	                $rootScope.$broadcast('editor:items_list', response.data);
	                deferred.resolve(response.data);
	            }).finally(function () {
	                request.options.isLoading = false;
	            });

	            return deferred.promise;
	        };

	        this.getData = function (api, params) {
	            return $http({
	                method: 'GET',
	                url: api,
	                params: params
	            });
	        };

	        this.addNewItem = function (request) {

	            if (request.options.isLoading) {
	                return;
	            }
	            var dataSource = request.options.$dataSource;

	            var parentField = dataSource.fields.parent;
	            if (parentField && $location.search().parent) {
	                //-- проверяю редактируется ли поле parentField в форме. Если да, то его не нужно извлекать из адреса.
	                var isNotEditableParentField = !$document[0].querySelector(".field-wrapper [name='" + parentField + "']");
	                if (isNotEditableParentField) {
	                    request.data[parentField] = $location.search().parent;
	                }
	            }

	            request.options.isLoading = true;
	            var params = {};
	            var _method = 'POST';
	            var _url = dataSource.url;
	            var idField = 'id';
	            var state = EditEntityStorage.getStateConfig().name;

	            if (dataSource.hasOwnProperty('fields')) {
	                idField = dataSource.fields.primaryKey || idField;
	            }
	            $http({
	                method: request.method || _method,
	                url: request.method || _url,
	                data: request.data
	            }).then(function (response) {
	                var data = {
	                    id: response.data[idField],
	                    $parentComponentId: request.options.$parentComponentId
	                };
	                $rootScope.$broadcast("editor:presave_entity_created", data);
	                request.options.isLoading = false;
	                $rootScope.$broadcast("uploader:remove_session");
	                $rootScope.$broadcast("editor:entity_success");
	                successCreateMessage();

	                var params = {};
	                if ($location.search().parent) {
	                    params.parent = $location.search().parent;
	                }
	                if ($location.search().back) {
	                    params.state = $location.search().back;
	                    state = $location.search().back;
	                }
	                if (!ModalService.isModalOpen()) {
	                    $state.go(state, params).then(function () {
	                        $location.search(params);
	                        $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
	                    });
	                } else {
	                    ModalService.close();
	                }
	            }, function (reject) {
	                var wrongFields = reject.data.hasOwnProperty('data') ? reject.data.data : reject.data;

	                if (wrongFields.length > 0) {
	                    angular.forEach(wrongFields, function (err) {
	                        if (err.hasOwnProperty('field')) {
	                            $rootScope.$broadcast('editor:api_error_field_' + err.field, err.message);
	                            if (err.hasOwnProperty('fields')) {
	                                angular.forEach(err.fields, function (innerError, key) {
	                                    $rootScope.$broadcast('editor:api_error_field_' + err.field + '_' + key + '_' + innerError.field, innerError.message);
	                                });
	                            }
	                        }
	                    });
	                }
	                request.options.isLoading = false;
	            });
	        };

	        this.updateItem = function (request) {
	            if (request.options.isLoading) {
	                return;
	            }
	            var dataSource = request.options.$dataSource;

	            request.options.isLoading = true;
	            var params = {};
	            var _method = 'PUT';

	            var _url = dataSource.url + '/' + self.editedEntityId;
	            var state = EditEntityStorage.getStateConfig().name;
	            var idField = 'id';

	            $http({
	                method: request.method || _method,
	                url: request.url || _url,
	                data: request.data || {}
	            }).then(function (response) {
	                var data = {
	                    id: response.data[idField],
	                    $parentComponentId: request.options.$parentComponentId
	                };
	                $rootScope.$broadcast("editor:presave_entity_updated", data);
	                request.options.isLoading = false;
	                $rootScope.$broadcast('uploader:remove_session');
	                $rootScope.$broadcast('editor:entity_success');
	                successUpdateMessage();
	                var params = {};
	                if ($location.search().parent) {
	                    params.parent = $location.search().parent;
	                }
	                if ($location.search().back) {
	                    params.type = $location.search().back;
	                    state = $location.search().back;
	                }
	                if (!ModalService.isModalOpen()) {
	                    $state.go(state, params).then(function () {
	                        $location.search(params);
	                        $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
	                    });
	                } else {
	                    ModalService.close();
	                }
	            }, function (reject) {
	                var wrongFields = reject.data.hasOwnProperty('data') ? reject.data.data : reject.data;

	                if (wrongFields.length > 0) {
	                    angular.forEach(wrongFields, function (err) {
	                        if (err.hasOwnProperty('field')) {
	                            $rootScope.$broadcast('editor:api_error_field_' + err.field, err.message);
	                            if (err.hasOwnProperty('fields')) {
	                                angular.forEach(err.fields, function (innerError, key) {
	                                    $rootScope.$broadcast('editor:api_error_field_' + err.field + '_' + key + '_' + innerError.field, innerError.message);
	                                });
	                            }
	                        }
	                    });
	                }
	                request.options.isLoading = false;
	            });
	        };

	        this.presaveItem = function (request) {
	            var _url;
	            var _method = 'POST';
	            var idField = 'id';
	            var isCreate = true;
	            if (request.options.isLoading) {
	                return;
	            }
	            var dataSource = request.options.$dataSource;

	            request.options.isLoading = true;

	            if (self.editedEntityId !== '') {
	                _url = dataSource.url + '/' + self.editedEntityId;
	                _method = 'PUT';
	                isCreate = false;
	            } else {
	                _url = dataSource.url;
	            }

	            if (dataSource.hasOwnProperty('fields')) {
	                idField = dataSource.fields.primaryKey || idField;
	            }

	            $http({
	                method: request.method || _method,
	                url: request.url || _url,
	                data: request.data || {}
	            }).then(function (response) {
	                request.options.isLoading = false;
	                var newId = response.data[idField];
	                var par = {};
	                par['pk' + EditEntityStorage.getLevelChild($state.current.name)] = newId;
	                var searchString = $location.search();
	                $state.go($state.current.name, par, { reload: false, notify: false }).then(function () {
	                    $location.search(searchString);
	                    $rootScope.$broadcast('editor:update_item', {
	                        $gridComponentId: request.options.$gridComponentId,
	                        value: response.data
	                    });
	                });
	                var data = {
	                    id: newId,
	                    $parentComponentId: request.options.$parentComponentId
	                };
	                if (isCreate) {
	                    $rootScope.$broadcast('editor:presave_entity_created', data);
	                    successPresaveCreateMessage();
	                } else {
	                    successUpdateMessage();
	                    $rootScope.$broadcast("editor:presave_entity_updated", data);
	                }
	            }, function (reject) {
	                if ((reject.status === 422 || reject.status === 400) && reject.data) {
	                    var wrongFields = reject.data.hasOwnProperty('data') ? reject.data.data : reject.data;

	                    angular.forEach(wrongFields, function (err) {
	                        if (err.hasOwnProperty('field')) {
	                            $rootScope.$broadcast('editor:api_error_field_' + err.field, err.message);
	                            if (err.hasOwnProperty('fields')) {
	                                angular.forEach(err.fields, function (innerError, key) {
	                                    $rootScope.$broadcast('editor:api_error_field_' + err.field + '_' + key + '_' + innerError.field, innerError.message);
	                                });
	                            }
	                        }
	                    });
	                }
	                request.options.isLoading = false;
	            });
	        };

	        this.getItemById = function (id, par, options) {
	            var qParams = {},
	                expandFields = [],
	                expandParam = "",
	                dataSource = options.$dataSource || entityObject.dataSource;

	            options.isLoading = true;
	            angular.forEach(dataSource.fields, function (field) {
	                if (field.hasOwnProperty("expandable") && field.expandable === true) {
	                    expandFields.push(field.name);
	                }
	            });
	            if (expandFields.length > 0) {
	                qParams.expand = expandFields.join(',');
	            }

	            $http({
	                method: 'GET',
	                url: dataSource.url + '/' + id,
	                params: qParams
	            }).then(function (response) {
	                var data = response.data;
	                data.$parentComponentId = options.$parentComponentId;
	                data.editorEntityType = "exist";
	                $rootScope.$broadcast("editor:entity_loaded", data);
	            }).finally(function () {
	                options.isLoading = false;
	            });
	        };

	        this.deleteItemById = function (request) {
	            var state = EditEntityStorage.getStateConfig().name;
	            if (request.options.isLoading) {
	                return;
	            }
	            var dataSource = request.options.$dataSource;
	            var url = dataSource.url;

	            if (request.options.isMix) {
	                url = request.options.mixedMode.dataSource.url;
	            }
	            request.options.isLoading = true;

	            var _url = url + '/' + request.entityId;

	            if (request.setting.buttonClass === 'edit') {
	                _url = url.replace(':pk', request.entityId);
	            }

	            return $http({
	                method: request.method || 'DELETE',
	                url: request.url || _url,
	                params: request.params || {}
	            }).then(function (response) {
	                request.options.isLoading = false;
	                self.setQueryParams({});
	                self.setFilterParams({});
	                $rootScope.$broadcast("editor:entity_success_deleted");
	                successDeleteMessage();
	                var params = {};
	                if ($location.search().parent) {
	                    params.parent = $location.search().parent;
	                }
	                if ($location.search().back) {
	                    params.type = $location.search().back;
	                    state = $location.search().back;
	                }

	                if (!ModalService.isModalOpen()) {
	                    $state.go(state, params).then(function () {
	                        $location.search(params);
	                        $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
	                    });
	                } else {
	                    ModalService.close();
	                }
	            }, function (reject) {
	                request.options.isLoading = false;
	            });
	        };

	        function successDeleteMessage() {
	            $translate('CHANGE_RECORDS.DELETE').then(function (translation) {
	                toastr.success(translation);
	            });
	        }

	        function successUpdateMessage() {
	            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
	                toastr.success(translation);
	            });
	        }

	        function successPresaveUpdateMessage() {
	            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
	                toastr.success(translation);
	            });
	        }

	        function successPresaveCreateMessage() {
	            $translate('CHANGE_RECORDS.CREATE').then(function (translation) {
	                toastr.success(translation);
	            });
	        }

	        function successCreateMessage() {
	            $translate('CHANGE_RECORDS.CREATE').then(function (translation) {
	                toastr.success(translation);
	            });
	        }

	        //-- read all pages
	        this.getUrlResource = function getUrlResource(url, callback, res, def, fromP, toP) {
	            var defer = def || $q.defer();
	            var result = res || [];
	            var promiseStack = [];
	            fromP = fromP || 1;
	            toP = toP || 0;

	            if (fromP === 12) {
	                fromP = 11;
	            }
	            if (!toP) {
	                promiseStack.push(getPromise(url));
	            } else {
	                for (var i = fromP; i <= toP; i++) {
	                    promiseStack.push(getPromise(url, i));
	                }
	            }

	            //-- read items from one page
	            function getPromise(url, page) {
	                return $http({
	                    method: 'GET',
	                    url: url,
	                    params: {
	                        page: page || 1,
	                        "per-page": 50
	                    }
	                });
	            }

	            $q.all(promiseStack).then(function (allResp) {
	                var resp;
	                var countP;
	                for (var i = allResp.length; i--;) {
	                    resp = allResp[i];
	                    result = result.concat(resp.data.items);
	                    if (angular.isFunction(callback)) {
	                        callback(resp.data.items);
	                    }
	                }
	                if (resp && resp.data._meta) {
	                    countP = resp.data._meta.pageCount;
	                }

	                if (!countP || countP === toP || countP === 1) {
	                    defer.resolve({ data: { items: result } });
	                } else {
	                    if (fromP === 1) {
	                        fromP = 2;
	                    } else if (fromP === 2) {
	                        fromP += 4;
	                    } else {
	                        fromP += 5;
	                    }
	                    toP += 5;
	                    if (toP > countP) {
	                        toP = countP;
	                    }
	                    return getUrlResource(url, callback, result, defer, fromP, toP);
	                }
	            }, function (reject) {});
	            return defer.promise;
	        };

	        this.actionRequest = function (request) {
	            var deferred = $q.defer();

	            var reqParams = request.params || {};
	            var url = request.url;
	            if (request.id) {
	                url = request.url.replace(":id", id);
	            }
	            self.isProcessing = true;

	            $http({
	                method: request.method,
	                url: url,
	                params: reqParams,
	                beforeSend: request.beforeSend
	            }).then(function (response) {
	                self.isProcessing = false;
	                deferred.resolve(response);
	            }, function (reject) {
	                self.isProcessing = false;
	                deferred.reject(reject);
	            });

	            return deferred.promise;
	        };

	        this.loadChilds = function (request) {
	            var data = {
	                parentId: request.id,
	                $parentComponentId: request.options.$parentComponentId
	            };
	            $rootScope.$broadcast('editor:parent_id', data);
	            request.childId = request.id;
	            self.getItemsList(request).then(function () {
	                parent = $location.search().parent;
	                if (parent) {
	                    parent = JSON.parse(parent);
	                }
	                if (request.childId) {
	                    parent = parent || {};
	                    parent[request.options.$parentComponentId] = request.childId;
	                }
	                var parentJSON = parent ? JSON.stringify(parent) : null;
	                $location.search("parent", parentJSON);
	            });
	        };

	        this.loadParent = function (request) {
	            var data = {
	                $parentComponentId: request.options.$parentComponentId
	            };
	            var entityId = typeof request.childId !== 'undefined' ? request.childId : undefined;
	            if (entityId) {
	                request.options.isLoading = true;
	                $http({
	                    method: 'GET',
	                    url: request.url + "/" + entityId
	                }).then(function (response) {
	                    var parentId = response.data[request.parentField];

	                    parent = $location.search().parent;
	                    if (parent) {
	                        parent = JSON.parse(parent);
	                    }
	                    if (parentId) {
	                        parent = parent || {};
	                        parent[request.options.$parentComponentId] = parentId;
	                    } else {
	                        delete parent[request.options.$parentComponentId];
	                    }

	                    var parentJSON = null;
	                    if (!$.isEmptyObject(parent)) {
	                        parentJSON = JSON.stringify(parent);
	                    }
	                    $location.search("parent", parentJSON);
	                    request.options.isLoading = false;
	                    data.parentId = parentId;
	                    $rootScope.$broadcast('editor:parent_id', data);
	                    request.childId = parentId;
	                    self.getItemsList(request);
	                }, function (reject) {
	                    request.options.isLoading = false;
	                });
	            } else {
	                reset();
	            }
	            function reset() {
	                request.options.isLoading = false;
	                request.parentField = null;
	                $rootScope.$broadcast('editor:parent_id', data);
	                var parentJSON = null;
	                parent = $location.search().parent;
	                if (parent) {
	                    parent = JSON.parse(parent);
	                    delete parent[request.options.$parentComponentId];
	                    if (!$.isEmptyObject(parent)) {
	                        parentJSON = JSON.stringify(parent);
	                    }
	                }
	                $location.search("parent", parentJSON);
	                request.childId = null;
	                self.getItemsList(request);
	            }
	        };

	        this.getEntityObject = function () {
	            return entityObject;
	        };
	    }
	})();

/***/ },
/* 102 */
/***/ function(module, exports) {

	/**
	 * Constructor for create editor
	 * @param {string} id - Id html element instead of which will be the editor
	 * @param {Object} config - Configuration object
	 * @constructor
	 */
	var UniversalEditor = {
	    constructor: function (id, config) {
	        'use strict';

	        var moduleName = 'unEditor-' + id;
	        var unEditor = $('#' + id);
	        if (unEditor[0]) {
	            var app = angular.module(moduleName, ['universal.editor', 'ui.bootstrap']).config(['$stateProvider', '$urlRouterProvider', '$injector', 'configDataProvider', function ($stateProvider, $urlRouterProvider, $injector, configDataProvider) {
	                configDataProvider.setConfig(id, config);
	            }]);
	            unEditor.append("<div class='u-editors' data-ui-view='" + id + "'></div>");
	            angular.bootstrap(unEditor[0], [moduleName]);
	        }
	    },
	    angular: angular
	};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["UniversalEditor"] = __webpack_require__(104);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 104 */
/***/ function(module, exports) {

	/**
	 * Constructor for create editor
	 * @param {string} id - Id html element instead of which will be the editor
	 * @param {Object} config - Configuration object
	 * @constructor
	 */
	var UniversalEditor = {
	    constructor: function (id, config) {
	        'use strict';

	        var moduleName = 'unEditor-' + id;
	        var unEditor = $('#' + id);
	        if (unEditor[0]) {
	            var app = angular.module(moduleName, ['universal.editor', 'ui.bootstrap']).config(['$stateProvider', '$urlRouterProvider', '$injector', 'configDataProvider', function ($stateProvider, $urlRouterProvider, $injector, configDataProvider) {
	                configDataProvider.setConfig(id, config);
	            }]);
	            unEditor.append("<div class='u-editors' data-ui-view='" + id + "'></div>");
	            angular.bootstrap(unEditor[0], [moduleName]);
	        }
	    },
	    angular: angular
	};

	/*** EXPORTS FROM exports-loader ***/
	module.exports = UniversalEditor;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(106);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(108)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(106, function() {
				var newContent = __webpack_require__(106);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(107)();
	// imports


	// module
	exports.push([module.id, "body {\n  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  background-color: #E1E9EB; }\n\n.universal-editor .component-edit,\n.universal-editor .component-preview,\n.modal-dialog .component-edit,\n.modal-dialog .component-preview {\n  display: inline-block;\n  width: 100%; }\n\n.universal-editor .editor-header {\n  padding: 0px 0px 5px 0px; }\n  .universal-editor .editor-header .filter-button {\n    display: block;\n    margin-bottom: 5px;\n    min-width: 110px; }\n  .universal-editor .editor-header .header-action-button {\n    border: none;\n    display: inline-block;\n    margin-right: 10px;\n    outline: none; }\n\n.universal-editor .groups-action {\n  margin-bottom: 10px; }\n\n.universal-editor .editor-entity-actions {\n  background: #ebf1f3;\n  padding: 10px;\n  border-top: 1px solid #E1E9EB; }\n\n.universal-editor .editor-filter {\n  margin-bottom: 10px;\n  border-bottom: 1px solid #9ca9ae;\n  background: #cbd6da;\n  -webkit-border-radius: 0 3px 3px;\n  border-radius: 0 3px 3px;\n  padding: 10px;\n  min-width: 600px;\n  display: inline-block;\n  width: auto; }\n  .universal-editor .editor-filter .buttons-wrapper {\n    margin-top: 10px; }\n\n.universal-editor .meta-info {\n  text-align: right;\n  padding: 10px;\n  padding-bottom: 0px;\n  font-size: 11px;\n  color: #6a7b8b; }\n\n.universal-editor table {\n  background-color: #FFFFFF;\n  border-spacing: 0; }\n  .universal-editor table tfoot {\n    background-color: #cbd6da; }\n  .universal-editor table td {\n    vertical-align: top;\n    position: relative; }\n  .universal-editor table thead td {\n    font-weight: 700;\n    cursor: pointer; }\n    .universal-editor table thead td.actions-header {\n      cursor: default; }\n    .universal-editor table thead td.active.asc:after {\n      content: \"\";\n      width: 0;\n      height: 0;\n      border-left: 5px solid transparent;\n      border-right: 5px solid transparent;\n      border-bottom: 7px solid #000000;\n      display: block;\n      float: right;\n      transform: scale(-1, -1);\n      margin-top: 3px; }\n    .universal-editor table thead td.active.desc:after {\n      content: \"\";\n      width: 0;\n      height: 0;\n      border-left: 5px solid transparent;\n      border-right: 5px solid transparent;\n      border-top: 7px solid #000000;\n      display: block;\n      float: right;\n      transform: scale(-1, -1);\n      margin-top: 3px; }\n  .universal-editor table tbody td {\n    font-size: 12px; }\n    .universal-editor table tbody td .field-wrapper.row {\n      margin: 0;\n      padding: 0; }\n\n.field-wrapper.row {\n  margin: 0 15px;\n  padding: 10px 0; }\n\n.editor-action-button {\n  margin-right: 10px;\n  display: inline-block;\n  outline: none;\n  width: 100%; }\n  .editor-action-button.small {\n    padding: 0 5px;\n    height: 15px;\n    font-size: 8px;\n    line-height: 15px; }\n\n.items-list .child {\n  margin-left: 30px; }\n\n.editor-body {\n  padding: 22px 20px;\n  position: relative;\n  background-color: #cbd6da; }\n  .editor-body .close-editor {\n    display: block;\n    position: absolute;\n    top: 22px;\n    right: 22px;\n    width: 13px;\n    height: 13px;\n    cursor: pointer; }\n  .editor-body .field-error-bottom-wrapper,\n  .editor-body .field-notify-bottom-wrapper {\n    background-color: #ebf1f3;\n    padding: 1px; }\n  .editor-body .tab-content-wrapper {\n    background: #ebf1f3; }\n\n.error-item {\n  padding: 3px;\n  margin: 5px 0; }\n\n.notify-item {\n  padding: 3px;\n  border: 1px solid #02ae00;\n  border-radius: 3px;\n  font-size: 11px;\n  margin: 5px;\n  background: rgba(40, 255, 35, 0.19); }\n\n.field-hint {\n  position: relative;\n  display: inline-block;\n  margin-right: 5px;\n  width: 12px;\n  height: 12px;\n  margin-bottom: 5px; }\n  .field-hint .hint-text {\n    display: none;\n    position: absolute;\n    top: 15px;\n    left: 0px;\n    width: 150px;\n    padding: 5px;\n    font-size: 12px;\n    background-color: #cbd6da;\n    color: #555;\n    border-radius: 3px;\n    border: 1px solid #949494;\n    z-index: 1000;\n    text-align: start; }\n  .field-hint:hover .hint-text {\n    display: block; }\n  .field-hint:before {\n    content: \"?\";\n    display: block;\n    width: 12px;\n    height: 12px;\n    border: 1px solid #949494;\n    text-align: center;\n    color: #949494;\n    font-size: 10px;\n    line-height: 13px;\n    border-radius: 2px; }\n\nlabel {\n  font-weight: normal; }\n\n.field-name-label .editor-required {\n  font-weight: bold; }\n\n.processing-status,\n.processing-status:before,\n.processing-status:after {\n  background: #3e565b;\n  -webkit-animation: load2 1s infinite ease-in-out;\n  animation: load2 1s infinite ease-in-out;\n  width: 2px;\n  height: 12px; }\n\n.processing-status:before,\n.processing-status:after {\n  position: absolute;\n  top: 0;\n  content: ''; }\n\n.processing-status:before {\n  left: -4px;\n  -webkit-animation-delay: -0.32s;\n  animation-delay: -0.32s; }\n\n.processing-status {\n  text-indent: -9999em;\n  position: absolute;\n  font-size: 11px;\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-animation-delay: -0.16s;\n  animation-delay: -0.16s;\n  top: 0; }\n\n.processing-status:after {\n  left: 4px; }\n\n@-webkit-keyframes load2 {\n  0%,\n  80%,\n  100% {\n    top: 0px;\n    height: 12px; }\n  40% {\n    top: 3px;\n    height: 6px; } }\n\n@keyframes load2 {\n  0%,\n  80%,\n  100% {\n    top: 0px;\n    height: 12px; }\n  40% {\n    top: 3px;\n    height: 6px; } }\n\n.processing-status-wrapper {\n  display: block;\n  width: 30px;\n  position: relative;\n  height: 12px;\n  margin: 0px auto 10px auto; }\n\n.context-toggle {\n  display: block;\n  width: 15px;\n  height: 13px;\n  border-top: 3px solid #94A0A5;\n  border-bottom: 3px solid #94A0A5;\n  position: relative;\n  text-indent: -9999px;\n  cursor: pointer; }\n\n.context-toggle:before {\n  content: '';\n  display: block;\n  position: absolute;\n  top: 2px;\n  width: 15px;\n  height: 3px;\n  background-color: #94A0A5; }\n\n.context-menu-wrapper {\n  position: absolute;\n  top: 28px;\n  background: #fff;\n  border-radius: 5px;\n  box-shadow: 0px 5px 6px #B9B8B8;\n  overflow: hidden;\n  z-index: 10;\n  display: block;\n  height: auto;\n  width: auto; }\n  .context-menu-wrapper .context-menu-item {\n    cursor: pointer;\n    display: block;\n    position: relative;\n    min-width: 120px; }\n    .context-menu-wrapper .context-menu-item button {\n      padding: 3px 7px; }\n    .context-menu-wrapper .context-menu-item:hover {\n      background-color: #eeeded; }\n  .context-menu-wrapper .editor-action-button {\n    color: #000;\n    text-transform: none;\n    font-size: 12px;\n    text-shadow: none;\n    padding: 0;\n    margin: 0;\n    background: transparent;\n    border: none;\n    border-radius: 0px;\n    line-height: 15px;\n    text-align: left; }\n\n.editor-entity-actions .editor-action-button {\n  width: auto; }\n\n.context-column {\n  width: 15px;\n  min-width: 32px; }\n\n.field-name-label {\n  text-align: right;\n  margin-bottom: 5px; }\n\n.filter-name-label {\n  float: left;\n  width: 200px;\n  vertical-align: top;\n  height: 25px; }\n\n.filter-inner-wrapper .select-input-wrapper .dropdown__selected-items {\n  color: #999; }\n  .filter-inner-wrapper .select-input-wrapper .dropdown__selected-items.color-placeholder-div {\n    color: #555; }\n\n.filter-wrapper {\n  margin-bottom: 5px; }\n\n.dropdown__selected-items.dropdown__selected-items_with-borders.form-control {\n  height: auto; }\n\n.dropdown__selected {\n  min-height: 28px; }\n\n.field-wrapper-ue-dropdown select[multiple] {\n  min-height: 150px; }\n\n.field-wrapper-ue-dropdown .select-wrapper > div > .processing-status-wrapper {\n  margin: -16px 0 0 20px;\n  position: absolute; }\n\n.field-wrapper-ue-dropdown .dropdown {\n  position: relative;\n  border-radius: 2px; }\n  .field-wrapper-ue-dropdown .dropdown .select-input {\n    min-height: 34px; }\n    .field-wrapper-ue-dropdown .dropdown .select-input.disabled-input {\n      background-color: #eceff1; }\n    .field-wrapper-ue-dropdown .dropdown .select-input.disabled-input input[disabled] {\n      border: none;\n      background-color: #eceff1; }\n  .field-wrapper-ue-dropdown .dropdown * {\n    box-sizing: border-box; }\n  .field-wrapper-ue-dropdown .dropdown__title {\n    position: relative;\n    background-color: #fff;\n    height: 100%;\n    padding: 2px;\n    padding-right: 25px !important; }\n    .field-wrapper-ue-dropdown .dropdown__title:before {\n      content: '';\n      position: absolute;\n      margin-top: -4px;\n      top: 18px;\n      right: 10px;\n      display: block;\n      width: 0;\n      height: 0;\n      border-top: 8px solid #2a3534;\n      border-right: 4px solid transparent;\n      border-left: 4px solid transparent;\n      z-index: 55;\n      cursor: pointer; }\n    .field-wrapper-ue-dropdown .dropdown__title:after {\n      content: '';\n      display: table;\n      clear: both; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder::-webkit-input-placeholder {\n      color: #555; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder::-moz-placeholder {\n      color: #555; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder:-moz-placeholder {\n      color: #555; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder:-ms-input-placeholder {\n      color: #555; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder:focus::-webkit-input-placeholder {\n      color: #999; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder:focus::-moz-placeholder {\n      color: #999; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder:focus:-moz-placeholder {\n      color: #999; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder:focus:-ms-input-placeholder {\n      color: #999; }\n    .field-wrapper-ue-dropdown .dropdown__title .color-placeholder-div {\n      color: #555; }\n  .field-wrapper-ue-dropdown .dropdown .selected-items__item {\n    float: left;\n    margin: 2px;\n    padding: 0 5px;\n    height: 24px;\n    max-width: 99%;\n    line-height: 22px;\n    border: 1px solid #acacac;\n    border-radius: 3px;\n    background-color: #CBD6DA; }\n    .field-wrapper-ue-dropdown .dropdown .selected-items__item .selected-item {\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap; }\n      .field-wrapper-ue-dropdown .dropdown .selected-items__item .selected-item__btn_delete {\n        margin: 0 0 0 5px;\n        padding: 0;\n        border: none;\n        background: 0 0;\n        cursor: pointer;\n        vertical-align: middle;\n        font: 700 16px Arial, sans-serif;\n        color: #585858; }\n  .field-wrapper-ue-dropdown .dropdown__items {\n    border: 1px solid #ccc;\n    position: absolute;\n    z-index: 999;\n    max-height: 300px;\n    overflow-y: auto;\n    width: 100%;\n    box-sizing: content-box;\n    background-color: #fff; }\n    .field-wrapper-ue-dropdown .dropdown__items.dropdown-top {\n      margin-bottom: -2px;\n      bottom: 100%;\n      border-radius: 4px 4px 0 0;\n      border-bottom: 0; }\n      .field-wrapper-ue-dropdown .dropdown__items.dropdown-top.active {\n        -webkit-box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075), 0 -3px 4px rgba(102, 175, 233, 0.3);\n        box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075), 0 -3px 4px rgba(102, 175, 233, 0.3); }\n    .field-wrapper-ue-dropdown .dropdown__items.dropdown-bottom {\n      margin-top: -2px;\n      top: 100%;\n      border-radius: 0 0 4px 4px;\n      border-top: 0; }\n    .field-wrapper-ue-dropdown .dropdown__items_with-padding {\n      margin-left: -3px;\n      overflow: hidden; }\n      .field-wrapper-ue-dropdown .dropdown__items_with-padding.active {\n        border-color: #66afe9;\n        outline: 0;\n        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 3px 4px rgba(102, 175, 233, 0.3);\n        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 3px 4px rgba(102, 175, 233, 0.3); }\n      .field-wrapper-ue-dropdown .dropdown__items_with-padding .dropdown-scroll {\n        overflow-y: auto;\n        max-height: 300px; }\n  .field-wrapper-ue-dropdown .dropdown-items__children {\n    padding-left: 15px; }\n  .field-wrapper-ue-dropdown .dropdown-items__item {\n    min-height: 31px; }\n    .field-wrapper-ue-dropdown .dropdown-items__item.active {\n      background-color: #f3f3f3; }\n  .field-wrapper-ue-dropdown .dropdown .option {\n    position: relative;\n    line-height: 31px;\n    border-bottom: 1px solid #ECECEC;\n    padding-left: 15px; }\n    .field-wrapper-ue-dropdown .dropdown .option:hover {\n      background-color: #fafafa; }\n    .field-wrapper-ue-dropdown .dropdown .option__checkbox {\n      position: relative;\n      float: right;\n      height: 31px;\n      width: 20px; }\n      .field-wrapper-ue-dropdown .dropdown .option__checkbox:before {\n        position: absolute;\n        top: 50%;\n        margin-top: -9px;\n        left: 0;\n        display: block;\n        width: 17px;\n        height: 17px;\n        content: '';\n        border: 1px solid #c6cfd1;\n        -webkit-border-radius: 3px;\n        border-radius: 3px; }\n      .field-wrapper-ue-dropdown .dropdown .option__checkbox.multi_radio:before {\n        border-radius: 10px; }\n      .field-wrapper-ue-dropdown .dropdown .option__checkbox .checkbox__check {\n        position: absolute;\n        display: none;\n        top: 50%;\n        margin-top: -5px;\n        left: 4px;\n        width: 12px;\n        height: 11px; }\n        .field-wrapper-ue-dropdown .dropdown .option__checkbox .checkbox__check.multi_radio {\n          margin-top: -7px;\n          margin-left: -2px; }\n    .field-wrapper-ue-dropdown .dropdown .option__label:hover {\n      cursor: pointer;\n      background-color: #fafafa; }\n    .field-wrapper-ue-dropdown .dropdown .option__label_no-multiple {\n      margin-left: 5px; }\n    .field-wrapper-ue-dropdown .dropdown .option__child-count {\n      position: relative;\n      color: #999; }\n      .field-wrapper-ue-dropdown .dropdown .option__child-count:after {\n        content: '';\n        position: absolute;\n        top: 6px;\n        right: -15px;\n        display: block;\n        width: 0;\n        height: 0;\n        border-top: 5px solid #2a3534;\n        border-right: 3px solid transparent;\n        border-left: 3px solid transparent; }\n      .field-wrapper-ue-dropdown .dropdown .option__child-count_open:after {\n        transform: rotate(180deg); }\n    .field-wrapper-ue-dropdown .dropdown .option__children {\n      padding-left: 15px; }\n  .field-wrapper-ue-dropdown .dropdown__search-field {\n    float: left;\n    position: relative;\n    padding: 0 35px 0 0;\n    margin-left: 3px;\n    background-color: #fff;\n    border: none;\n    height: 28px;\n    max-width: 100%;\n    box-sizing: border-box;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n    .field-wrapper-ue-dropdown .dropdown__search-field:focus {\n      outline: none; }\n  .field-wrapper-ue-dropdown .dropdown .processing-status {\n    margin-top: 3px; }\n  .field-wrapper-ue-dropdown .dropdown__selected-items {\n    padding: 0 0 2px 0;\n    color: #999; }\n    .field-wrapper-ue-dropdown .dropdown__selected-items.dropdown-tree {\n      padding-left: 4px;\n      padding-top: 4px;\n      min-height: 28px; }\n\n.field-wrapper-ue-dropdown .select-wrapper .dropdown .processing-status-wrapper {\n  margin-top: 2px; }\n\n.item-datepicker-wrapper, .item-colorpicker-wrapper, .item-string-wrapper, .item-textarea-wrapper, .item-timepicker-wrapper, .item-array-wrapper, .item-map-wrapper {\n  padding-bottom: 10px; }\n\n.radio,\n.checkbox {\n  margin-top: 0px; }\n\n.editor-field-array > .field-name-label {\n  background-color: #d3dfe2;\n  text-align: center;\n  padding: 10px 0;\n  display: block; }\n\n.icon-mix-mode {\n  padding-right: 10px; }\n\n.hidden {\n  display: none; }\n\n.select-input-wrapper {\n  position: relative;\n  cursor: pointer; }\n  .select-input-wrapper.disabled-input,\n  .select-input-wrapper.disabled-input .select-input {\n    color: #c8cbcd;\n    background-color: #eceff1; }\n  .select-input-wrapper.disabled-input input[disabled] {\n    border: none;\n    background-color: #eceff1; }\n  .select-input-wrapper:before {\n    content: '';\n    position: absolute;\n    margin-top: -4px;\n    top: 18px;\n    right: 10px;\n    display: block;\n    width: 0;\n    height: 0;\n    border-top: 8px solid #2a3534;\n    border-right: 4px solid transparent;\n    border-left: 4px solid transparent;\n    z-index: 55;\n    cursor: pointer; }\n  .select-input-wrapper .color-placeholder::-webkit-input-placeholder {\n    color: #555; }\n  .select-input-wrapper .color-placeholder::-moz-placeholder {\n    color: #555; }\n  .select-input-wrapper .color-placeholder:-moz-placeholder {\n    color: #555; }\n  .select-input-wrapper .color-placeholder:-ms-input-placeholder {\n    color: #555; }\n  .select-input-wrapper .color-placeholder:focus::-webkit-input-placeholder {\n    color: #999; }\n  .select-input-wrapper .color-placeholder:focus::-moz-placeholder {\n    color: #999; }\n  .select-input-wrapper .color-placeholder:focus:-moz-placeholder {\n    color: #999; }\n  .select-input-wrapper .color-placeholder:focus:-ms-input-placeholder {\n    color: #999; }\n  .select-input-wrapper .color-placeholder-div {\n    color: #555; }\n  .select-input-wrapper .select-input {\n    padding-right: 35px;\n    min-height: 28px; }\n  .select-input-wrapper .dropdown__selected-items {\n    white-space: nowrap;\n    overflow: hidden; }\n\n.selecte-delete {\n  position: absolute;\n  top: 9px;\n  right: 25px;\n  font: 700 16px Arial, sans-serif;\n  color: #585858;\n  cursor: pointer; }\n  .selecte-delete-autocomplete {\n    right: 10px; }\n\n.select-input.active {\n  border-color: #66afe9;\n  outline: 0;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n\n.focus-input {\n  position: absolute;\n  height: 0;\n  width: 0;\n  border: none; }\n\n.select-border {\n  border: 1px solid #ccc;\n  border-radius: 4px; }\n  .select-border .form-control {\n    border: none; }\n\nspan.glyphicon + .component-wrapper {\n  display: inline-block; }\n\n.tab-content-wrapper .tab-item-content > .component-wrapper {\n  display: inline-block;\n  width: 100%; }\n\n.component-separator::before {\n  content: '';\n  width: 100%;\n  height: 1px;\n  background: rgba(177, 160, 160, 0.48);\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0; }\n\n.autocomplete-item {\n  background: #CBD6DA;\n  border: 1px solid #959EA9;\n  -webkit-border-radius: 4px;\n  border-radius: 4px;\n  color: #444;\n  margin: 2px;\n  padding: 0 5px;\n  display: inline-block;\n  height: 24px;\n  line-height: 22px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 100%; }\n  .autocomplete-item.opacity-item {\n    opacity: 0.2; }\n  .autocomplete-item .remove-from-selected {\n    margin: 0 0 0 5px;\n    padding: 0;\n    border: none;\n    background: 0 0;\n    cursor: pointer;\n    vertical-align: middle;\n    font: 700 16px Arial,sans-serif;\n    color: #585858; }\n\n.autocomplete-input-wrapper {\n  position: relative;\n  height: 100%;\n  min-height: 34px;\n  padding: 2px; }\n  .autocomplete-input-wrapper.disabled-input, .autocomplete-input-wrapper.disabled-input input {\n    color: #c8cbcd;\n    background-color: #eceff1;\n    border: 1px solid #ccc; }\n  .autocomplete-input-wrapper.disabled-input input {\n    border: none; }\n  .autocomplete-input-wrapper .loader-search {\n    margin-left: 5px;\n    margin-top: 2px; }\n  .autocomplete-input-wrapper:after {\n    content: '';\n    display: table;\n    clear: both; }\n  .autocomplete-input-wrapper .form-control {\n    display: inline-block; }\n  .autocomplete-input-wrapper .autocomplete-field-search {\n    display: inline-block;\n    position: relative;\n    padding: 0;\n    margin-left: 3px;\n    background-color: #fff;\n    border: none;\n    height: 28px;\n    max-width: 100%;\n    box-sizing: border-box;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n    .autocomplete-input-wrapper .autocomplete-field-search:focus {\n      outline: none; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder::-webkit-input-placeholder {\n      color: #555; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder::-moz-placeholder {\n      color: #555; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder:-moz-placeholder {\n      color: #555; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder:-ms-input-placeholder {\n      color: #555; }\n  .autocomplete-input-wrapper.active {\n    border-color: #66afe9;\n    outline: 0;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 3px 4px rgba(102, 175, 233, 0.3);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 3px 4px rgba(102, 175, 233, 0.3); }\n\n.possible-values {\n  width: 100%;\n  overflow-x: hidden;\n  position: absolute;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  z-index: 60;\n  max-height: 162px;\n  overflow-y: scroll; }\n  .possible-values .possible-scroll {\n    overflow-y: auto;\n    max-height: 162px; }\n  .possible-values.possible-top {\n    margin-bottom: -4px;\n    bottom: 100%;\n    border-bottom: 0; }\n    .possible-values.possible-top.active {\n      -webkit-box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075), 0 -3px 4px rgba(102, 175, 233, 0.3);\n      box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075), 0 -3px 4px rgba(102, 175, 233, 0.3); }\n  .possible-values.possible-bottom {\n    margin-top: -2px;\n    top: 100%;\n    border-top: 0; }\n  .possible-values.active {\n    overflow: hidden;\n    border-color: #66afe9;\n    outline: 0; }\n  .possible-values .possible-value-item {\n    padding: 5px 10px;\n    border-bottom: 1px solid #ECECEC;\n    cursor: pointer;\n    min-height: 31px; }\n    .possible-values .possible-value-item.active {\n      background-color: #f3f3f3; }\n  .possible-values.possible-autocomplete {\n    box-sizing: content-box;\n    margin-left: -3px; }\n\n.field-preloaded-data {\n  color: #677C95;\n  font-size: 12px;\n  margin: 10px 0 0 0; }\n\n.loader-search,\n.loader-search:before,\n.loader-search:after {\n  background: #3e565b;\n  -webkit-animation: load1 1s infinite ease-in-out;\n  animation: load1 1s infinite ease-in-out;\n  width: 2px;\n  height: 12px; }\n\n.loader-search:before,\n.loader-search:after {\n  position: absolute;\n  top: 0;\n  content: ''; }\n\n.loader-search:before {\n  left: -4px;\n  -webkit-animation-delay: -0.32s;\n  animation-delay: -0.32s; }\n\n.loader-search {\n  text-indent: -9999em;\n  position: absolute;\n  font-size: 11px;\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-animation-delay: -0.16s;\n  animation-delay: -0.16s;\n  top: 0; }\n\n.loader-search:after {\n  left: 4px; }\n\n@-webkit-keyframes load1 {\n  0%,\n  80%,\n  100% {\n    top: 0px;\n    height: 12px; }\n  40% {\n    top: 3px;\n    height: 6px; } }\n\n@keyframes load1 {\n  0%,\n  80%,\n  100% {\n    top: 0px;\n    height: 12px; }\n  40% {\n    top: 3px;\n    height: 6px; } }\n\n.loader-search-wrapper {\n  display: inline-block;\n  width: 30px;\n  margin-left: 10px;\n  position: relative;\n  height: 12px; }\n\n.autocomplete-item {\n  background: #CBD6DA;\n  border: 1px solid #959EA9;\n  -webkit-border-radius: 4px;\n  border-radius: 4px;\n  color: #444;\n  margin: 2px;\n  padding: 0 5px;\n  display: inline-block;\n  height: 24px;\n  line-height: 22px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  max-width: 100%; }\n  .autocomplete-item.opacity-item {\n    opacity: 0.2; }\n  .autocomplete-item .remove-from-selected {\n    margin: 0 0 0 5px;\n    padding: 0;\n    border: none;\n    background: 0 0;\n    cursor: pointer;\n    vertical-align: middle;\n    font: 700 16px Arial,sans-serif;\n    color: #585858; }\n\n.autocomplete-input-wrapper {\n  position: relative;\n  height: 100%;\n  min-height: 34px;\n  padding: 2px; }\n  .autocomplete-input-wrapper.disabled-input, .autocomplete-input-wrapper.disabled-input input {\n    color: #c8cbcd;\n    background-color: #eceff1;\n    border: 1px solid #ccc; }\n  .autocomplete-input-wrapper.disabled-input input {\n    border: none; }\n  .autocomplete-input-wrapper .loader-search {\n    margin-left: 5px;\n    margin-top: 2px; }\n  .autocomplete-input-wrapper:after {\n    content: '';\n    display: table;\n    clear: both; }\n  .autocomplete-input-wrapper .form-control {\n    display: inline-block; }\n  .autocomplete-input-wrapper .autocomplete-field-search {\n    display: inline-block;\n    position: relative;\n    padding: 0;\n    margin-left: 3px;\n    background-color: #fff;\n    border: none;\n    height: 28px;\n    max-width: 100%;\n    box-sizing: border-box;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n    .autocomplete-input-wrapper .autocomplete-field-search:focus {\n      outline: none; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder::-webkit-input-placeholder {\n      color: #555; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder::-moz-placeholder {\n      color: #555; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder:-moz-placeholder {\n      color: #555; }\n    .autocomplete-input-wrapper .autocomplete-field-search.color-placeholder:-ms-input-placeholder {\n      color: #555; }\n  .autocomplete-input-wrapper.active {\n    border-color: #66afe9;\n    outline: 0;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 3px 4px rgba(102, 175, 233, 0.3);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 3px 4px rgba(102, 175, 233, 0.3); }\n\n.possible-values {\n  width: 100%;\n  overflow-x: hidden;\n  position: absolute;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  z-index: 60;\n  max-height: 162px;\n  overflow-y: scroll; }\n  .possible-values .possible-scroll {\n    overflow-y: auto;\n    max-height: 162px; }\n  .possible-values.possible-top {\n    margin-bottom: -4px;\n    bottom: 100%;\n    border-bottom: 0; }\n    .possible-values.possible-top.active {\n      -webkit-box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075), 0 -3px 4px rgba(102, 175, 233, 0.3);\n      box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.075), 0 -3px 4px rgba(102, 175, 233, 0.3); }\n  .possible-values.possible-bottom {\n    margin-top: -2px;\n    top: 100%;\n    border-top: 0; }\n  .possible-values.active {\n    overflow: hidden;\n    border-color: #66afe9;\n    outline: 0; }\n  .possible-values .possible-value-item {\n    padding: 5px 10px;\n    border-bottom: 1px solid #ECECEC;\n    cursor: pointer;\n    min-height: 31px; }\n    .possible-values .possible-value-item.active {\n      background-color: #f3f3f3; }\n  .possible-values.possible-autocomplete {\n    box-sizing: content-box;\n    margin-left: -3px; }\n\n.field-preloaded-data {\n  color: #677C95;\n  font-size: 12px;\n  margin: 10px 0 0 0; }\n\n.loader-search,\n.loader-search:before,\n.loader-search:after {\n  background: #3e565b;\n  -webkit-animation: load1 1s infinite ease-in-out;\n  animation: load1 1s infinite ease-in-out;\n  width: 2px;\n  height: 12px; }\n\n.loader-search:before,\n.loader-search:after {\n  position: absolute;\n  top: 0;\n  content: ''; }\n\n.loader-search:before {\n  left: -4px;\n  -webkit-animation-delay: -0.32s;\n  animation-delay: -0.32s; }\n\n.loader-search {\n  text-indent: -9999em;\n  position: absolute;\n  font-size: 11px;\n  -webkit-transform: translateZ(0);\n  -ms-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-animation-delay: -0.16s;\n  animation-delay: -0.16s;\n  top: 0; }\n\n.loader-search:after {\n  left: 4px; }\n\n@-webkit-keyframes load1 {\n  0%,\n  80%,\n  100% {\n    top: 0px;\n    height: 12px; }\n  40% {\n    top: 3px;\n    height: 6px; } }\n\n@keyframes load1 {\n  0%,\n  80%,\n  100% {\n    top: 0px;\n    height: 12px; }\n  40% {\n    top: 3px;\n    height: 6px; } }\n\n.loader-search-wrapper {\n  display: inline-block;\n  width: 30px;\n  margin-left: 10px;\n  position: relative;\n  height: 12px; }\n\n.minicolors input {\n  height: 30px; }\n  .minicolors input.wrong {\n    border: 1px solid red;\n    height: 32px; }\n\n.minicolors {\n  position: relative; }\n\n.minicolors-swatch {\n  z-index: 10; }\n\n.modal-dialog .ue-modal-body .editor-body .close-editor {\n  display: none; }\n\n.editor-entity-actions {\n  background: #ebf1f3;\n  padding: 10px;\n  border-top: 1px solid #E1E9EB; }\n\n.filter-component {\n  max-width: 600px;\n  margin: 10px 5px; }\n  .filter-component .editor-filter-body {\n    padding: 5px 15px; }\n    .filter-component .editor-filter-body component-wrapper {\n      display: block;\n      margin-left: 205px; }\n      .filter-component .editor-filter-body component-wrapper .filter-inner-wrapper > div[class*=\"col-\"] {\n        padding: 0; }\n    .filter-component .editor-filter-body .filter-content-wrapper {\n      margin-bottom: 10px;\n      display: inline-block;\n      width: 100%; }\n      .filter-component .editor-filter-body .filter-content-wrapper label.filter-name-label {\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis; }\n  .filter-component .editor-filter-footer {\n    margin-top: 15px; }\n\n.universal-editor .field-array-wrapper .add-more, .modal-dialog .field-array-wrapper .add-more {\n  margin-top: 10px; }\n\n.universal-editor .editor-field-array, .modal-dialog .editor-field-array {\n  overflow: visible; }\n\n.universal-editor .editor-form-group, .modal-dialog .editor-form-group {\n  padding: 0; }\n  .universal-editor .editor-form-group .item-array-wrapper .btn, .modal-dialog .editor-form-group .item-array-wrapper .btn {\n    margin: 10px 15px 0 15px;\n    float: right; }\n  .universal-editor .editor-form-group .field-wrapper.row, .modal-dialog .editor-form-group .field-wrapper.row {\n    margin: 0; }\n\n.ue-tab-wrapper .button-footer {\n  margin-left: 15px; }\n\n.ue-tab-wrapper .clear-padding-left {\n  padding-left: 0; }\n\n.modal-dialog .ue-modal-body .editor-body .close-editor {\n  display: none; }\n\n.editor-entity-actions {\n  background: #ebf1f3;\n  padding: 10px;\n  border-top: 1px solid #E1E9EB; }\n\n.ue-modal-header, .ue-modal-body {\n  padding: 10px; }\n\n.ue-modal-footer .editor-modal-button {\n  margin-right: 10px;\n  display: inline-block;\n  outline: none;\n  width: auto; }\n\n.modal-dialog .modal-content {\n  height: 100%; }\n\n.modal-dialog ue-modal > div {\n  height: 100%;\n  position: relative;\n  padding-bottom: 85px; }\n  .modal-dialog ue-modal > div .ue-modal-body {\n    overflow: auto;\n    height: 95%; }\n\n.modal-dialog .ue-modal-footer {\n  position: absolute;\n  bottom: 0; }\n\n.pagination {\n  margin-top: 0; }\n\n.editor-textarea {\n  width: 100%;\n  resize: vertical; }\n\n.timepicker.wrong {\n  border: 1px solid red; }\n\nbody {\n  background: white; }\n", ""]);

	// exports


/***/ },
/* 107 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 109 */
/***/ function(module, exports) {

	window.RequstCallback = {
	    beforeAction: function () {
	        console.log('Привет мир!!! я beforeSend');
	    }
	};
	var host = "https://manage.new.tech.mos.ru";

	var pguDataSource = {
	    type: 'REST',
	    url: host + '/api/catalog/v1/backend/json/pgu',
	    sortBy: '-id',
	    primaryKey: 'id',
	    parentField: 'id_parent',
	    fields: [{
	        name: 'title',
	        component: {
	            name: 'ue-string',
	            settings: {
	                label: 'Наименование',
	                validators: [],
	                required: true,
	                list: true,
	                templates: {
	                    edit: '<div>' + '<label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">' + '<div data-ng-if="!!vm.hint" class="field-hint">' + '<div ng-bind="vm.hint" class="hint-text"></div>' + '</div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>' + '</label>' + '<div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}">' + '<div data-ng-if="vm.multiple" data-ng-class="vm.classComponent">' + ' <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-string-wrapper input-group">' + '<input type="{{vm.typeInput}}" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue[$index]" step="{{vm.stepNumber}}" data-ng-blur="vm.inputLeave(vm.fieldValue[$index], $index)" ng-trim="false" class="form-control input-sm"/><span class="input-group-btn">' + ' <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>' + '</div>' + '<div data-ng-click="vm.addItem()" data-ng-disabled="vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>' + '</div>' + '<div data-ng-if="!vm.multiple" data-ng-class="vm.classComponent">' + '<input type="{{vm.typeInput}}" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue" step="{{vm.stepNumber}}" data-ng-blur="vm.inputLeave(vm.fieldValue)" size="{{vm.size}}" ng-trim="false" class="form-control input-sm"/>' + '</div>' + '</div>' + '</div>',
	                    filter: '<div>' + '<label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">' + '<div data-ng-if="!!vm.hint" class="field-hint">' + '<div ng-bind="vm.hint" class="hint-text"></div>' + '</div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="vm.label"></span>' + '</label>' + '<div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}">' + '<div data-ng-if="vm.multiple" data-ng-class="vm.classComponent">' + ' <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-string-wrapper input-group">' + '<input type="{{vm.typeInput}}" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue[$index]" step="{{vm.stepNumber}}" data-ng-blur="vm.inputLeave(vm.fieldValue[$index], $index)" ng-trim="false" class="form-control input-sm"/><span class="input-group-btn">' + ' <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>' + '</div>' + '<div data-ng-click="vm.addItem()" data-ng-disabled="vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>' + '</div>' + '<div data-ng-if="!vm.multiple" data-ng-class="vm.classComponent">' + '<input type="{{vm.typeInput}}" data-ui-mask="{{vm.mask}}" data-ui-options="{maskDefinitions : vm.maskDefinitions}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue" step="{{vm.stepNumber}}" data-ng-blur="vm.inputLeave(vm.fieldValue)" size="{{vm.size}}" ng-trim="false" class="form-control input-sm"/>' + '</div>' + '</div>' + '</div>',
	                    preview: '<span ng-bind="vm.previewValue"></span>'
	                }
	            }
	        }
	    }, {
	        name: 'id_parent',
	        component: {
	            name: 'ue-autocomplete',
	            settings: {
	                label: 'Наименование родителя',
	                valuesRemote: {
	                    fields: {
	                        value: "id",
	                        label: "title"
	                    },
	                    url: host + "/api/catalog/v1/backend/json/ru/pgu"
	                },
	                hint: "Поле с автоматическим дополнением, начните вводить название родительского элемента",
	                list: true,
	                filterable: true,
	                validators: []
	            }
	        }
	    }, {
	        name: 'type',
	        component: {
	            name: 'ue-dropdown',
	            settings: {
	                label: 'Тип услуги',
	                values: {
	                    "APPLICATION": "Электронная",
	                    "URL": "Справочная"
	                },
	                hint: "Подсказка",
	                list: true,
	                required: true,
	                filterable: false,
	                validators: []
	            }
	        }
	    }, {
	        name: 'description',
	        component: {
	            name: 'ue-textarea',
	            settings: {
	                label: 'Описание',
	                list: false,
	                validators: []
	            }
	        }
	    }, {
	        name: 'tags',
	        component: {
	            name: 'ue-dropdown',
	            settings: {
	                label: 'Теги',
	                valuesRemote: {
	                    fields: {
	                        value: "title",
	                        label: "title"
	                    },
	                    url: host + "/api/catalog/v1/backend/json/ru/searchtags"
	                },
	                multiple: true,
	                filter: false,
	                required: true,
	                hint: "Поле с автоматическим дополнением, начните вводить название тега и выберите из выпадающего списка",
	                validators: []
	            }
	        }
	    }, {
	        name: 'ek_ids',
	        component: {
	            name: 'ue-dropdown',
	            settings: {
	                label: 'Элементы к которым привязан',
	                validators: [],
	                valuesRemote: {
	                    fields: {
	                        value: "id",
	                        label: "title"
	                    },
	                    url: host + "/api/catalog/v1/backend/json/categories"
	                },
	                multiple: true,
	                list: false,
	                search: true,
	                hint: "Выберите элементы Единого каталога для связи и заполните поле \"Популярность\" числовым значением",
	                tree: {
	                    parentField: "id_parent",
	                    childCountField: "count_children",
	                    selectBranches: false
	                }
	            }
	        }
	    }, {
	        name: 'popular',
	        component: {
	            name: 'ue-string',
	            settings: {
	                label: 'Популярность',
	                validators: [],
	                hint: "Выберите элементы Единого каталога для связи и заполните поле \"Популярность\" числовым значением"
	            }
	        }
	    }, {
	        name: 'mark',
	        component: {
	            name: 'ue-dropdown',
	            settings: {
	                label: 'Марк',
	                validators: [],
	                search: true,
	                values: {
	                    "new": "Новое",
	                    "mfc": "МФЦ",
	                    "hit": "Хит"
	                },
	                multiple: false
	            }
	        }
	    }, {
	        name: 'url',
	        component: {
	            name: 'ue-string',
	            settings: {
	                label: 'Ссылка на услугу',
	                validators: [],
	                list: false,
	                filterable: true,
	                hint: "Выберите элементы Единого каталога для связи и заполните поле \"Популярность\" числовым значением"
	            }
	        }
	    }, {
	        name: 'urlLandingPage',
	        component: {
	            name: 'ue-string',
	            settings: {
	                label: 'Ссылка на посадочную страницу',
	                validators: [],
	                list: true,
	                filterable: true,
	                hint: "Выберите элементы Единого каталога для связи и заполните поле \"Популярность\" числовым значением"
	            }
	        }
	    }, {
	        name: 'isExternal',
	        component: {
	            name: 'ue-checkbox',
	            settings: {
	                label: 'Внешний ресурс',
	                values: {
	                    "1": "Да",
	                    "0": "Нет"
	                }
	            }
	        }
	    }, {
	        name: 'fullName',
	        component: {
	            name: 'ue-textarea',
	            settings: {
	                label: 'Полное наименование услуги',
	                validators: [],
	                list: false,
	                filterable: false,
	                hint: "Выберите элементы Единого каталога для связи и заполните поле \"Популярность\" числовым значением"
	            }
	        }
	    }, {
	        name: 'visible',
	        component: {
	            name: 'ue-radiolist',
	            settings: {
	                label: 'Видимость',
	                validators: [],
	                list: false,
	                filterable: false,
	                required: true,
	                hint: "Поле влияет на отображение элемента",
	                values: {
	                    "1": "видим",
	                    "0": "скрыт"
	                }

	            }
	        }
	    }, {
	        name: 'sortOrder',
	        component: {
	            name: 'ue-string',
	            settings: {
	                label: 'Порядок сортировки',
	                validators: [],
	                list: true,
	                filterable: true,
	                hint: "Целочисленное значение. Влияет на положение элемента в списке (больше - выше)"
	            }
	        }
	    }, {
	        name: 'has_children',
	        component: {
	            name: 'ue-radiolist',
	            settings: {
	                label: 'Имеются дочерние элементы',
	                validators: [],
	                list: true,
	                filterable: false,
	                required: true,
	                readOnly: true,
	                values: {
	                    "1": "видим",
	                    "0": "скрыт"
	                }

	            }
	        }
	    }, {
	        name: 'catalog_items',
	        component: {
	            name: 'ue-string',
	            settings: {
	                label: 'Элементы к которым привязан',
	                validators: [],
	                list: true,
	                filterable: true,
	                readOnly: true,
	                expandable: true
	            }
	        }
	    }]
	};

	var filterComponent = {
	    component: {
	        name: 'ue-filter',
	        settings: {
	            header: {
	                label: 'Фильтр'
	            },
	            fields: ['title', 'id_parent', 'type', 'description', 'popular', 'mark', 'url', 'urlLandingPage', 'isExternal', 'fullName', 'sortOrder', 'has_children', 'catalog_items'],
	            footer: {
	                controls: [{
	                    component: {
	                        name: 'ue-button-filter',
	                        settings: {
	                            label: 'Применить',
	                            action: 'send'
	                        }
	                    }
	                }, {
	                    component: {
	                        name: 'ue-button-filter',
	                        settings: {
	                            label: 'Очистить',
	                            action: 'clear'
	                        }
	                    }
	                }]
	            }
	        }
	    }
	};
	var pguUeTabs = {
	    component: {
	        name: 'ue-form-tabs',
	        settings: {
	            tabs: [{
	                label: 'Tab 1',
	                fields: ['title', {
	                    component: {
	                        name: 'ue-form-group',
	                        settings: {
	                            label: 'Группа полей 1',
	                            countInLine: 2,
	                            fields: ['id_parent', 'type', 'description', 'tags']
	                        }
	                    }
	                }, 'ek_ids', 'popular', 'mark', 'url']
	            }, {
	                label: 'Tab 2',
	                fields: ['urlLandingPage', 'isExternal', 'fullName', 'sortOrder', "visible"]
	            }, {
	                label: 'Tab 3',
	                fields: ['has_children', 'catalog_items']
	            }]
	        }
	    }
	};

	var pguUeFormFooter = {
	    controls: [{
	        component: {
	            name: 'ue-button-service',
	            settings: {
	                label: 'Удалить',
	                action: 'delete'
	            }
	        }
	    }, {
	        component: {
	            name: 'ue-button-service',
	            settings: {
	                label: 'Сохранить',
	                action: 'save'
	            }
	        }
	    }, {
	        component: {
	            name: 'ue-button-service',
	            settings: {
	                label: 'Применить',
	                action: 'presave'
	            }
	        }
	    }]
	};

	var ue = new UniversalEditor.constructor('universal-editor', {
	    func: function () {},
	    ui: {
	        assetsPath: '/assets'
	    },
	    states: [{
	        name: 'index',
	        url: '/pgu',
	        component: {
	            name: 'ue-grid',
	            settings: {
	                dataSource: pguDataSource,
	                header: {
	                    controls: [{
	                        component: {
	                            name: 'ue-button-goto',
	                            settings: {
	                                label: 'Добавить',
	                                state: 'edit',
	                                templates: "module/template/templatesForComponents/temp.html"
	                            }
	                        }
	                    }, {
	                        component: {
	                            name: 'ue-button-goto',
	                            settings: {
	                                label: 'Добавить (модалку)',
	                                state: 'index.editWithModal'
	                            }
	                        }
	                    }]
	                },
	                columns: ['title', 'popular', 'sortOrder', 'isExternal', "visible", 'ek_ids', 'tags', 'type', {
	                    component: {
	                        name: 'ue-component',
	                        settings: {
	                            label: 'Переключатель',
	                            templates: {
	                                preview: function (scope) {
	                                    scope.lockTrigger = function (e) {
	                                        // debugger;
	                                    };
	                                    return "module/template/templatesForComponents/temp.html";
	                                }
	                            }
	                        }
	                    }
	                }],
	                contextMenu: [{
	                    component: {
	                        name: 'ue-button-goto',
	                        settings: {
	                            label: 'Редактировать (модалка)',
	                            state: 'index.editWithModal'
	                        }
	                    }
	                }, {
	                    component: {
	                        name: 'ue-button-goto',
	                        settings: {
	                            label: 'Редактировать',
	                            state: 'edit'
	                        }
	                    }
	                }, {
	                    component: {
	                        name: 'ue-button-service',
	                        settings: {
	                            label: 'Удалить',
	                            templates: '<button data-ng-class="{ processing : vm.options.isLoading}" ng-disabled="vm.disabled" data-ng-if="vm.setting.buttonClass == \'footer\'" class="btn btn-md btn-success">{{vm.label}}' + '<div data-ng-show="vm.options.isLoading" class="loader-search-wrapper">' + '<div class="loader-search">{{\'LOADING\' | translate}}</div>' + '</div>' + '</button>' + '<button data-ng-if="vm.setting.buttonClass == \'context\'" class="editor-action-button">{{vm.label}}</button>',
	                            action: 'delete'
	                        }
	                    }
	                }, {
	                    component: {
	                        name: 'ue-button-service',
	                        settings: {
	                            label: 'Раскрыть',
	                            action: 'open'
	                        }
	                    }
	                }],
	                footer: {
	                    controls: [{
	                        component: {
	                            name: 'ue-pagination',
	                            settings: {
	                                label: {
	                                    last: '>>',
	                                    next: '>'
	                                }
	                            }
	                        }
	                    }]
	                }
	            }
	        }
	    }, {
	        name: 'edit',
	        url: '/staff/:pk',
	        component: {
	            name: 'ue-form',
	            settings: {
	                dataSource: pguDataSource,
	                body: [pguUeTabs],
	                footer: pguUeFormFooter
	            }
	        }
	    }, {
	        name: 'index.editWithModal',
	        url: '/services/:pk',
	        component: {
	            name: 'ue-modal',
	            settings: {
	                size: {
	                    width: '70%',
	                    height: '90%'
	                },
	                header: {
	                    label: 'Редактирование услуги'
	                },

	                body: {
	                    text: 'Текст внутри окна.'
	                },
	                footer: {
	                    controls: [{
	                        component: {
	                            name: 'ue-button-modal',
	                            settings: {
	                                label: 'Закрыть',
	                                action: 'close',
	                                beforeAction: 'RequstCallback.sendAction'
	                            }
	                        }
	                    }, {
	                        component: {
	                            name: 'ue-button-goto',
	                            settings: {
	                                label: 'Редактировать',
	                                state: 'edit'
	                            }
	                        }
	                    }]
	                }
	            }
	        }
	    }]
	});

/***/ }
/******/ ]);