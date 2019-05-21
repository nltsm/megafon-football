;(function (window, undefined) {	var modules = {};	window.app = {		addModule: function (moduleName, fn, call) {			call = call || false;			if (modules[moduleName]) {				console.error('Module "' + moduleName + '" exists');				return;			}			modules[moduleName] = fn;			modules[moduleName]['called'] = false;			if (call == true) {				app.callModule(moduleName);			}		},		callModule: function (moduleName) {			if (typeof modules[moduleName]['init'] == 'function') {				try {					if (!modules[moduleName]['called']) {						modules[moduleName]['init']();						modules[moduleName]['called'] = true;					} else {						console.error('Module was already called');					}				}				catch(e) {					console.error(e);				}			}		},		initModules: function () {			for (var moduleName in modules) {				try {					modules[moduleName] = new modules[moduleName]() || {};				}				catch(e) {					console.error(e);				}			}		},		getModules: function () {			return modules;		},		getModule: function (moduleName) {			if (modules[moduleName]) {				return modules[moduleName];			} else {				console.error("Module doesn't exist");			}		},		callModules: function () {			this.initModules();			for (var module in modules) {				app.callModule(module);			}		}	};})(window, undefined);jQuery(function () {	app.callModules();});
