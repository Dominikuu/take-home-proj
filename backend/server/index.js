
const app = require("./app");
const http = require('http');

// Create an HTTP service.
http.createServer(app).listen(3030, () => {
    console.info(`sso-server listening on port 3030`);
});