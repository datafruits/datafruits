/*eslint-env node */
/* global require, process */
const FastBootAppServer = require('fastboot-app-server');
const config = require('./config/fastboot')(process.env.NODE_ENV);

const setCacheHeader = (request, response, next) => {
  response.setHeader('Cache-Control', 'max-age=31557600, private, must-revalidate');
  return next();
};

let server = new FastBootAppServer({
  beforeMiddleware: function (app) {
    app.use(setCacheHeader);
  },
  distPath: 'dist',
  gzip: true, // Optional - Enables gzip compression.
  host: '0.0.0.0', // Optional - Sets the host the server listens on.
  //sandboxGlobals: { GLOBAL_VALUE: MY_GLOBAL }, // Optional - Make values available to the Ember app running in the FastBoot server, e.g. "MY_GLOBAL" will be available as "GLOBAL_VALUE"
  chunkedResponse: false, // Optional - Opt-in to chunked transfer encoding, transferring the head, body and potential shoeboxes in separate chunks. Chunked transfer encoding should have a positive effect in particular when the app transfers a lot of data in the shoebox.
  ...config,
});

server.start();
