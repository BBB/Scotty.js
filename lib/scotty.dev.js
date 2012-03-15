/*
* Scotty.js
* version: 0.1
* URL: http://github.com/BBB/scotty.js
* Description: A window.location.hash kvp system
* Author: Ollie Relph http://ollie.relph.me/ || ollie@relph.me
*/
var Scotty = function(str) {
	this.fromString(str);
	return this;
};
Scotty.prototype = {
	keyStore: {},
	_listeners: {},
	_triggerListeners: function (key, newValue) {
		for (var i in this._listeners[key]) {
			this._listeners[key][i].apply(null, [newValue]);
		}
		if (this._listeners.hasOwnProperty('*')) {
			for (var i in this._listeners['*']) {
				this._listeners['*'][i].apply(null, [newValue]);
			}
		}
	},
	_hasChanged: function (key, newValue) {
		return this.keyStore[key] != encodeURIComponent(newValue);
	},
	setValue: function (key, value) {
		if (key == '' || value == '' || value == 'undefined') return false;
		if (!this._hasChanged(key, value)) return false;
		this.keyStore[key] = value;
		this._triggerListeners(key, value);
		return true;
	},
	setValues: function (obj) {
		for (var key in obj) {
			if (this._hasChanged(key, obj[key])) {
				this.keyStore[key] = encodeURIComponent(obj[key]);
				this._triggerListeners(key, obj[key]);
			}
		}
	},
	fromString: function (str) {
		if (str.indexOf('?') > -1) {
			str = str.split('?')[1];
		}
		var kps = str.split('&');
		for (var pair in kps) {
			pair = kps[pair].split('=');
			this.setValue(pair[0], pair[1]);
		}
	},
	toString: function () {
		 var str = '#/?';
	    for (var p in this.keyStore) {
	        if (this.keyStore.hasOwnProperty(p)) {
	        	if (str.length > 1) str += '&';
	            str += p + '=' + this.keyStore[p];
	        }
	    }
	    return window.location.origin + window.location.pathname + str;
	},
	addListener: function (key, cb) {
		if (this._listeners.hasOwnProperty(key)) {
			this._listeners[key].push(cb);
		} else {
			this._listeners[key] = [cb];
		}
	},
	getValue: function (key) {
		return decodeURIComponent(this.keyStore[key]);
	}
};