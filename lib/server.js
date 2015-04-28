var connect       = require('connect');
var http          = require('http');
var path          = require('path');
var _             = require('underscore');
var supportsColor = require('supports-color');
var handlebars    = require('handlebars');
var glob          = require('glob');
var fs            = require('fs');
var serveStatic   = require('serve-static');

var phantom = require('./phantom.js');

var template = handlebars.compile(
  fs.readFileSync(path.join(__dirname, 'runner', 'spec_runner.html.hbs'), 'utf8')
);

function expandGlobs (globs, root) {
  globs = _.isArray(globs) ? globs : [globs];
  return _.flatten(globs.map(function (g){
    return glob.sync(g, {cwd: root});
  }));
}

module.exports = {
  start: function(options) {
    _.defaults(options, {
      css: [],
      js: [],
      root: path.dirname(module.parent.parent.filename),
      showColors: supportsColor
    });

    var app = connect()
      .use('/jasmine', serveStatic(path.join(__dirname, '..', 'vendor', 'jasmine-2.0.1')))
      .use('/runner', serveStatic(path.join(__dirname, 'runner')))
      .use('/app', serveStatic(options.root))
      .use(function(req, res) {
        res.writeHead(200, {"Context-Type": "text/html"});
        res.end(
          template({
            css: expandGlobs(options.css, options.root),
            js: expandGlobs(options.js, options.root),
            showColors: options.showColors.toString()
          })
        );
      });

    this.server = http.createServer(app);
    this.server.listen(options.port || 8888, 'localhost');
  },

  stop: function() {
    this.server.close();
  },

  run: function(options, callback) {
    this.start(options);

    phantom({
      port: options.port || 8888,
      testOutput: options.testOutput,
      phantomOutput: options.phantomOutput
    }, function (code) {
      this.stop();
      if (_.isFunction(callback)) {
        callback(code)
      }
    }.bind(this));
  }
};
