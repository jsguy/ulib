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
	ulib.ajax - ajax functionality
	part of the u collection - simple utilities

	Usage:

		u.ajax({url: url, success: function(){}})

	url - the URL to use
	callback - a function to run when the call is completed, it will be data typically as an object
	options - optional arguments:

*/
var ulib = this.ulib || {};
(function(){
	var def = function(obj1, obj2){
		for(var i in obj2) {if(obj2.hasOwnProperty(i)){
			obj1[i] = obj2[i];
		}}
		return obj1;
	},
	ajax = function(args) {
		args = def({
			requestType: 'ajax',
			async: true,
			type: 'POST',
			processResponse: true
		}, args);

		args.type = args.type.toUpperCase();

		var req = new XMLHttpRequest(),
			//	Add parameters to URL if we have data and it is GET
			url = (args.type === 'GET')?
				args.url + (args.data? Object.keys(args.data).map(function(k) {
				    return encodeURIComponent(k) + '=' + encodeURIComponent(args.data[k]);
				}).join('&'): ""):
				args.url;

		req.onreadystatechange = function (object) {
			if (req.readyState==4) {
		        if (req.status === 200) {
					args.success(args.processResponse? JSON.parse(req.responseText): req.responseText, req);
				} else {
					args.error(req);
				}
			}
		};
		req.open(args.type, url, args.async);
		req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		if(args.contentType) {
			req.setRequestHeader('Content-type', args.contentType);
		} else if(args.contentType !== false) {
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}

		if(args.type !== "GET") {
			req.send(args.data);
		}

		return req;
	};

	//	Expose the ajax function
	ulib.ajax = ajax;
}).call(this);
