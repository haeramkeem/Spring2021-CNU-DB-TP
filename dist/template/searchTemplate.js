"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var d = __importStar(require("../module/dateModule"));
var blankRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
function getSearchTemplate(resultRows, today) {
    var buffer = "";
    for (var _i = 0, resultRows_1 = resultRows; _i < resultRows_1.length; _i++) {
        var oneRow = resultRows_1[_i];
        var isbn = void 0, title = void 0, publisher = void 0, year = void 0, author = void 0, exttimes = void 0, daterented = void 0, datedue = resultRows;
        if (oneRow instanceof Array) {
            buffer += "<tr>\n                <td>" + oneRow[0] + "</td>\n                <td>" + oneRow[1] + "</td>\n                <td>" + oneRow[2] + "</td>\n                <td>" + oneRow[3] + "</td>\n                <td>" + oneRow[4] + "</td>\n                <td>\n                    <form action=\"/rent\" method=\"POST\">\n                        <input type=\"hidden\" name=\"isbn\" value=\"" + oneRow[0] + "\">\n                        <input class=\"small-button\" type=\"submit\" value=\"\uB300\uC5EC\">\n                    </form>\n                    <form action=\"/reserve\" method=\"POST\">\n                        <input type=\"hidden\" name=\"isbn\" value=\"" + oneRow[0] + "\">\n                        <input type=\"hidden\" name=\"id\" value=\"" + oneRow[5] + "\">\n                        <input class=\"small-button\" type=\"submit\" value=\"\uC608\uC57D\">\n                    </form>\n                </td>\n            </tr>";
        }
    }
    for (var i = 0; i < 19 - resultRows.length; i++) {
        buffer += blankRow;
    }
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <link rel=\"stylesheet\" href=\"/style/search.css\">\n            <link rel=\"stylesheet\" href=\"/style/font.css\">\n            <title>CNU Library</title>\n        </head>\n        <body>\n            <header>\n                <span class=\"center\" id=\"logo-box\">\n                    <a href=\"/page/search.html\">\n                        <h1>Chungnam Nat'l University Library</h1>\n                    </a>\n                </span>\n            </header>\n            <nav>\n                <span class=\"center\" id=\"date-box\">\n                    DAEJEON, " + d.week(today) + ", " + d.month(today) + " " + today.getDate() + ", " + today.getFullYear() + "\n                </span>\n                <span class=\"center\" id=\"page-change-box\">\n                    <a class=\"ahover\" href=\"/page/pinfo.html\">My Page</a>\n                </span>\n            </nav>\n            <main>\n                <div class=\"main-container\" id=\"search-container\">\n                    <form action=\"/searchbook\" id=\"search-box\" method=\"GET\">\n                        <div class=\"query-box\" id=\"select-box\">\n                            <select class=\"no-appearance\" name=\"type\" id=\"\">\n                                <option value=\"title\">TITLE</option>\n                                <option value=\"publisher\">PUBLISHER</option>\n                                <option value=\"year\">YEAR</option>\n                                <option value=\"author\">AUTHOR</option>\n                                <option value=\"query\">QUERY</option>\n                            </select>\n                        </div>\n                        <div class=\"query-box\" id=\"word-box\">\n                            <input class=\"no-appearance\" type=\"text\" name=\"keyword\" value=\"\">\n                        </div>\n                        <div class=\"query-box\" id=\"submit-box\">\n                            <input class=\"no-appearance\" type=\"submit\" value=\"SEARCH\">\n                        </div>\n                    </form>\n                    <table class=\"result-box\">\n                        <thead>\n                            <th>ISBN</th>\n                            <th>TITLE</th>\n                            <th>PUBLISHER</th>\n                            <th>YEAR</th>\n                            <th>AUTHOR</th>\n                            <th>RENT & RESERVE</th>\n                        </thead>\n                        <tbody>\n                            " + buffer + "\n                        </tbody>\n                    </table>\n                </div>\n            </main>\n            <footer>copyright\u00A9saltwalks2021</footer>\n        </body>\n        </html>\n    ";
}
exports.default = getSearchTemplate;
