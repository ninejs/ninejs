'use strict';
var Service = require('node-windows').Service,
	path = require('path'),
	extend = require('../core/extend');

function install(/*argv*/) {
	var nconfig = require('../modules/config'),
		//ninejs = require('../modules/ninejs-server'),
		conf = {
			name: 'NineJS Service',
			description: 'NineJS unnamed service',
			script: path.resolve(process.cwd(), 'node_modules', 'ninejs/bin/ninejs'),
			env: [{
				name: 'NINEJS_CWD',
				value: process.cwd()
			},
			{
				name: 'NINEJS_ARGS',
				value: 'cluster'
			}]
		},
		serviceConfig;
	serviceConfig = (((nconfig.units['ninejs'] || {}).windows || {}).service || {});
	extend.mixinRecursive(conf, serviceConfig);
	// Create a new service object
	var svc = new Service(conf);

	// Listen for the "install" event, which indicates the
	// process is available as a service.
	svc.on('install',function(){
		svc.start();
	});

	console.log('Installing ' + conf.name);
	svc.install();
}

function uninstall() {
	var nconfig = require('../modules/config'),
		//ninejs = require('../modules/ninejs-server'),
		conf = {
			name: 'NineJS Service',
			script: path.resolve(process.cwd(), 'node_modules', 'ninejs/bin/ninejs')
		},
		serviceConfig;
	serviceConfig = (((nconfig.units['ninejs'] || {}).windows || {}).service || {});
	extend.mixinRecursive(conf, serviceConfig);
	// Create a new service object
	var svc = new Service(conf);

	// Listen for the "uninstall" event so we know when it's done.
	svc.on('uninstall',function(){
		console.log('Uninstall complete.');
		console.log('The service exists: ', svc.exists);
	});

	// Uninstall the service.
	svc.uninstall();
}

function run(argv) {
	if ((argv || []).length === 0) {
		argv = ['install', 'cluster'];
	}
	switch (argv[0]) {
		case 'install':
			install(argv.slice(1));
			break;
		case 'uninstall':
			uninstall(argv.slice(1));
			break;
	}
}
module.exports = {
	install: install,
	uninstall: uninstall,
	run: run
};