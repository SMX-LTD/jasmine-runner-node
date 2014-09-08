var connect = require('connect');
var http = require('http');
var path = require('path');
var _ = require('underscore');

var phantom = require('./phantom.js');
var util = require('./util.js');

module.exports = {
  start: function(options) {
    var parentScriptRoot = path.dirname(module.parent.parent.filename);
    var clientRoot = options.root || parentScriptRoot;
    var runnerRoot = path.join(__dirname, 'runner');
    var jasmineRoot = path.join(__dirname, '..', 'vendor', 'jasmine-2.0.1');
    var globbedFiles = util.globValues(options.files, clientRoot);
    var showColors = _.isUndefined(options.showColors) ? true : options.showColors;

    var app = connect()
      .use('/jasmine', connect.static(jasmineRoot))
      .use('/runner', connect.static(runnerRoot))
      .use('/app', connect.static(clientRoot))
      .use(function(req, res, next) {
        res.writeHead(200, {"Context-Type": "text/html"});
        res.end(util.buildSpecRunner(globbedFiles, showColors));
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
