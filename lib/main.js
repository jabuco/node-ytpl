"use strict";

var https = require('https');
var firstpage = require('./firstpage.js');
var nonfirstpage = require('./nonfirstpage.js');
var util = require('./util.js')

module.exports = function(link_or_id, object_or_callback, callback) {
	if(!callback) {
		callback = object_or_callback;
		object_or_callback = {};
	}
	util.get_playlist_id(link_or_id, function(err, playlist_id) {
		var plist = {};
		firstpage.get_firstpage(playlist_id, object_or_callback, function(err, plist_obj) {
			if(err) {
				return callback(err);
			}
			if(!plist_obj.nextpage) {
				return callback(null, plist_obj);
			} else {
				nonfirstpage.get_nonfirstpage(plist_obj.nextpage, object_or_callback, function(err2, plist_items) {
					if(err2) {
						return callback(err2);
					}
					plist_obj.items = plist_obj.items.concat(plist_items);
					delete plist_obj.nextpage;
					return callback(null, plist_obj);
				});
			}
		});
	});
};