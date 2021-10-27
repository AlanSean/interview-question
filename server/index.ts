require('../src/index');
const http = require('http');
const server = http.createServer(function (request, response) {
  response.write('Hello, My Love');
  response.end();
});
server.listen(3030);
