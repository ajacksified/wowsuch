// Require newrelic for app traces
require('newrelic');

// Load all of the dependencies we need to start up the web server
var http = require('http'),
    connect = require('connect'),
    express = require('express'),
    fs = require('fs');

// Start up a new Express instance, and set the config
var app = express();
app.config = require('./config/config.js');

// Set the port that the webserver should run on
app.set('port', app.config.port);

// Configure the webserver, and set up middleware
app.configure(function(){
  app.use(express.bodyParser());
  app.use(connect.compress());

  // ./routes.js contains all of the routes that the webserver should parse
  require('./routes.js')(app);
});

// Create a server using http,
var server = http.createServer(app);

// Start listening on the configured port
server.listen(app.get('port'));


// server running, display welcome message 
console.info('Welcome to Metaphorgy.');

console.info('Running on port ' + app.get('port') + ' using the '
              + app.config.environment + ' environment settings.');

if(app.config.environment == 'development'){
  console.info('Open: http://localhost:' + app.get('port'));
}

