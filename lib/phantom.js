var child_process = require('child_process');
var path = require('path');
var phantomjs = require('phantomjs');
var _ = require('underscore');

module.exports = function(options, callback) {
  var out = options.testOut || process.stdout;
  var err = options.phantomOut || process.stderr;

  var phantomProc = child_process.spawn(
    phantomjs.path,
    ['run_phantom.js', 'http://localhost:' + options.port],
    {cwd: path.join(__dirname, 'runner')}
  );

  phantomProc.stdout.setEncoding('utf8');
  phantomProc.stdout.on('data', _.bind(out.write, out));

  phantomProc.stderr.setEncoding('utf8');
  phantomProc.stderr.on('data', _.bind(err.write, err));

  phantomProc.on('close', function(code) {
    switch (code) {
      case 0: // Tests pass
      case 1: // Tests fail
      case 15:
        break;
      case 127:
        err.write('PhantomJS could not be found.');
        break;
      default:
        out.write('PhantomJS quit with code ' + code + '.');
    }

    if (_.isFunction(callback)) {
      callback(code);
    }
  });
};

