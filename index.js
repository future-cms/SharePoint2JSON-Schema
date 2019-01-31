'use strict';

var fs = require('fs'),
  path = require('path'),
  http = require('http');
var cors = require('cors');
var app = require('connect')();
var bodyParser = require('body-parser');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
const apiConfig = require('./setups/config');
var serverPort = 8080;
// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  app.use(cors());
  app.use(bodyParser.json({limit: '50mb'}));

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // implement basic api_key with swaggerSecurity
  app.use(middleware.swaggerSecurity({
    APIKeyHeader: function(req, def, token, callback) {
      if(token!=apiConfig.default().API_KEY){
        //  console.log("Not Authorized!")
        var err = new Error('Not Authorized');
        err['statusCode'] = 401;
        callback(err);  
        return;
      } else {
        // console.log("Authorized!")
        if(req.headers.referer.indexOf('SiteAssets/')>-1){
          req.headers.referer = req.headers.referer.replace('SitePages/','');
        }
        let currentSite = req.headers.referer.split('/');
        global.currentSite = currentSite[4];
        global.currentPage = currentSite[6].split('.')[0].toLowerCase();
        callback();
      }
  
    }
  }));

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));



  // Serve the Swagger documents and Swagger UI
  // app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
