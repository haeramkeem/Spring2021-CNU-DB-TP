"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var querystring_1 = __importDefault(require("querystring"));
var fs_1 = __importDefault(require("fs"));
var app = http_1.default.createServer(function (request, response) {
    var url = request.url;
    if (url == '/') {
        url = '/index.html';
    }
    if (request.method === 'POST') {
        console.log("plz");
        var body_1 = '';
        request.on('data', function (data) {
            body_1 += data;
        });
        request.on('end', function () {
            var post = querystring_1.default.parse(body_1);
            console.log(post);
        });
        url = '/page/search.html';
    }
    response.writeHead(200);
    response.end(fs_1.default.readFileSync(__dirname + url));
});
app.listen(3000);
