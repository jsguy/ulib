/*global window, $, jQuery */
/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/*
	ulib - jsguy's standalone micro utilities library

	Copyright (C) 2011 by Mikkel Bergmann

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

*/

/*
	ulib.loadandcallback - ability to load a list of scripts and css files, then call back
	requires: ulib.loadScript
	part of the u collection - simple utilities

	Usage:

		ulib.loadAndCallback(['script1.js', 'style1.css'], function(){
			//	The script is loaded, and CSS has been attaced to the DOM for loading async.
		});

	url(s) - either a single URL or a list of urls of files that end in .js or .css
	callback - a function to run when the loading is completed (in the case of CSS files, started)
*/
var ulib = this.ulib || {};
(function(){

var libObj = {},
	loadThing = function(url, callback){
		var type = url.substr(url.lastIndexOf(".") + 1).toLowerCase();
		if(type == "js") {
			ulib.loadScript(url, callback);
		} else {
			//	Assume CSS - immediate callback
			var link = document.createElement("link");
			link.href = url;
			link.type = "text/css";
			link.rel = "stylesheet";
			document.getElementsByTagName("head")[0].appendChild(link);
			callback();
		}
	},
	loadAndCallback = function(url, func){
		var key = typeof url !== "string"? url.join("-"): url,
			lib = (libObj[key] = libObj[key] || {}),
			args = [].slice.call(arguments, 2),
			count = 0,
			doneFunc = function(){
				lib.hasLoaded = true;
				for(var i = 0; i < lib.queue.length; i += 1) {
					lib.queue[i].func.apply(this, lib.queue[i].args);
				}
			},
			getNext = function(url, len){
				loadThing(url, function(){
					count += 1;
					if(count == len) {
						doneFunc();
					}
				});
			};

		lib.queue = lib.queue || [];

		if(!lib.hasLoaded) {
			if(!lib.isLoading) {
				lib.isLoading = true;

				if(typeof url !== "string") {
					for(var i = 0; i < url.length; i += 1) {
						getNext(url[i], url.length);
					}
				} else {
					loadThing(url, doneFunc);
				}
			}
			lib.queue.push({func: func, args: args});
		} else {
			func.apply(this, args);
		}
	};

//	Expose the function
ulib.loadAndCallback = loadAndCallback;

}).call(this);
