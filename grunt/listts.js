var fs = require('fs');
var path = require('path');
function excludeDir (dir) {
	if (dir.indexOf('node_modules') >= 0) {
		return true;
	}
	else if (dir.indexOf('.git') >= 0) {
		return true;
	}
	return false;
}
function excludeFile (file) {
	if ((path.extname(file) !== '.ts') || file.endsWith('.d.ts')) {
		return true;
	}
	return false;
}
var fs = require('fs');
var path = require('path');
var walk = function(dir, done) {
	if (excludeDir(dir)) {
		done(null, []);
		return;
	}
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function(file) {
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					if (!excludeFile(file)) {
						results.push(file);
					}
					if (!--pending) done(null, results);
				}
			});
		});
	});
};
walk(__dirname, function (err, list) {
	console.log(list.map(function (item) {
		return '\"./' + path.relative(__dirname, item).split(path.sep).join('/') + '\"'
	}).join(',\n'));
});