require('../src/index');
const http = require('http');
const server = http.createServer(function (_request: any, response: { write: (arg0: string) => void; end: () => void }) {
  response.write('Hello, My Love');
  response.end();
});
server.listen(3030);
