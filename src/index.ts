import http from 'http';
import queryString from 'querystring';
import fs from 'fs';

let app = http.createServer(function(request:http.IncomingMessage, response: http.ServerResponse){
    let url = request.url;
    if(url == '/'){
      url = '/index.html';
    }
    if(request.method === 'POST') {
      console.log("plz");
      
      let body = '';

      request.on('data', function(data) {
        body += data;
      });

      request.on('end', function() {
        let post = queryString.parse(body);
        console.log(post);
        
      });

      url = '/page/search.html'
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));    
});
app.listen(3000);