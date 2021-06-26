import * as http from 'http';
import libraryController from './controller/libraryController';

let app = http.createServer((request:http.IncomingMessage, response: http.ServerResponse) => {
    libraryController(request, response);
});

//서버를 생성하고 시작함
app.listen(3000);
console.log("[Status] : Server Started - localhost:3000");