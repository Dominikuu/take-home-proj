const app = require("./app");
const http = require('http');
const PORT = 3032;

// Create an HTTP service.
http.createServer(app).listen(PORT, () => {
    console.info(`server listening on port ${PORT}`);
});