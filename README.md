jasmine-runner-node
====================
 - Run Jasmine 2 specs with (or without) PhantomJS
 - Compatible with any task runner
 - Doesn't generate temporary spec runner files
 - Doesn't require an external phantom installation
 - Perfect for use with [gulp.js](http://gulpjs.com/)

Installation
============
In your project root, run: `npm install jasmine-runner-node --save-dev`

Usage
=====
``` javascript
var jasmine = require('jasmine-runner-node');

// start server
jasmine.start({
  port: <num>, // port number to serve jasmine on (default: 8888)
  css: <file glob or glob list>,
  js: <file glob or glob list>,
});

// stop server
jasmine.stop()

// start server, run phantom, stop server
// (also takes all of the above)
jasmine.run({
  showColors: <bool>,      // colorize phantomjs output (default: true if console supports it)
  testOutput: <stream>,    // stream for test report output (default: stdout)
  phantomOutput: <stream>, // stream for phantom output (default: stderr)
}, function (phantomExitCode) {
  if (phantomExitCode == 0) {
    // Tests passed
  }
  if (phantomExitCode == 1) {
    // Test(s) failed  
  }
  else {
    // Something else went wrong
  }
});

```

Testing
=======
Run `npm test` :)
