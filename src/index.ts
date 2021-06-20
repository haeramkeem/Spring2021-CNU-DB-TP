import * as http from 'http';

const fs = require('fs');

var app = http.createServer(function(request:http.IncomingMessage, response: http.ServerResponse){
    var url = request.url;
    if(request.url == '/'){
      url = '/index.html';
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));    
});
app.listen(3000);