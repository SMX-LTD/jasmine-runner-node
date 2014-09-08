var connect = require('connect');
var http = require('http');
var path = require('path');
var _ = require('underscore');

var phantom = require('./phantom.js');
var util = require('./util.js');

module.exports = {
  start: function(options) {
    _.defaults(options, {
      root: path.dirname(module.parent.parent.filename),
      showColors: true
    });

    var app = connect()
      .use('/jasmine', connect.static(path.join(__dirname, '..', 'vendor', 'jasmine-2.0.1')))
      .use('/runner', connect.static(path.join(__dirname, 'runner')))
      .use('/app', connect.static(options.root))
      .use(function(req, res, next) {
        res.writeHead(200, {"Context-Type": "text/html"});
        res.end(util.buildSpecRunner(
          util.globValues(options.files, options.root),
          options.showColors
        ));
      });

    this.server = http.createServer(app);
    this.server.listen(options.port || 8888, 'localhost');
  },

  stop: function() {
    this.server.close();
  },

  run: function(options) {
    this.start(options);

    phantom(options.port || 8888,
      _.bind(this.stop, this),
      options.testOutput,
      options.phantomOutput
    );
  }
};
