/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/d3/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	const processBuffer = (data, width = 800, precision = 100) => {
	  const result = new Array(width)
	  for (let n = 0; n < width; n++) {
	    const tmp = [],
	      current = Math.ceil(n * data.length / width),
	      next = Math.ceil((n + 1) * data.length / width),
	      delta = next - current
	    if (delta > precision)
	      for (let i = 0; i < precision; i++) {
	        const idx = Math.floor(Math.random() * delta) + current
	        tmp.push(Math.abs(data[idx]))
	      }
	    else
	      for (let j = current; j < next; j++) {
	        const val = Math.floor(Math.abs(data[j]))
	        tmp.push(val)
	      }
	    result[n] = tmp.reduce((sum, i) => sum + i, 0)/tmp.length
	  }
	  return result
	}
	
	onmessage = (e) => {
	  const data = processBuffer(e.data)
	  postMessage(data)
	}

/***/ })
/******/ ]);