'use strict';
var cluster = require('cluster');
module.exports = function(callback) {
	if (cluster.isMaster) {
		console.log('Starting NineJS cluster');
		// Count the machine's CPUs
		var cpuCount = require('os').cpus().length;

		// Listen for dying workers
		cluster.on('exit', function (worker) {
			// Replace the dead worker,
			// we're not sentimental
			console.log('Worker ' + worker.id + ' died. Restarting ...');
			cluster.fork();
		});
		// Create a worker for each CPU
		for (var i = 0; i < cpuCount; i += 1) {
			cluster.fork();
		}
		var disconnect = function () {
			cluster.disconnect(function () {

			});
		};
		process.on('exit', disconnect);
		process.on('SIGSTOP', disconnect);
	}
	else {
		callback();
	}
};