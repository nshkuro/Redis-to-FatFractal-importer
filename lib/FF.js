var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
		Storage        = require("dom-storage"),
 		sessionStorage = new Storage(),
		fs   = require('fs'),
		path = require('path');


var FF = function(username, password, url) {
	this.username = username || "";
	this.password = password || "";
	this.url 			= url || ""
	eval(fs.readFileSync(path.resolve(__dirname, './FatFractal.js')).toString());
	this.FatFractal = new FatFractal;

	this.FatFractal.setSimulateCookies(true);
	this.FatFractal.setBaseUrl(this.url);
  this.FatFractal.setDebug(false); 
  this.FatFractal.setAutoLoadRefs(false);
}

FF.prototype = {
	saveObject: function(collection, object, cb) {
		var self = this;
		self.FatFractal.login(self.username, self.password, 
			// Login: successCallback
			function(user) {
				// Try find exiting object	
				self.FatFractal.getObjFromUri("/" + collection + "/(key eq '" + object.key + "')", 
					function(obj, msg){
						// If exist just update object
						if (obj) {
							for (var attr in object) {
								if (obj[attr] != undefined) {
									obj[attr] = object[attr];	
								}								
							}
							self.FatFractal.updateObj(obj, cb, cb);									
						} else {
							// If not exist - create new object
							self.FatFractal.createObjAtUri(object, "/" + collection, cb, cb);				
						}
					});	
			},
			// Login: errorCallback
			function(status, msg) {}
		);		
	}
}
module.exports = FF;