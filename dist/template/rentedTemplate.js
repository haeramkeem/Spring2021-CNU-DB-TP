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
var BLANK_ROW = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
function getRentedTemplate(id, name, resultRows, today) {
    var buffer = "";
    for (var _i = 0, resultRows_1 = resultRows; _i < resultRows_1.length; _i++) {
        var oneRow = resultRows_1[_i];
        if (oneRow instanceof Array) {
            /* CLEAN - using map() */
            var isbn = oneRow[0], title = oneRow[1], publisher = oneRow[2], year = oneRow[3], author = oneRow[4], exttimes = oneRow[5], dateRented = oneRow[6], dateDue = oneRow[7];
            buffer += "\n                <tr>\n                    <td>" + isbn + "</td>\n                    <td>" + title + "</td>\n                    <td>" + publisher + "</td>\n                    <td>" + year + "</td>\n                    <td>" + author + "</td>\n                    <td>" + d.dateToString(dateRented) + "</td>\n                    <td>" + d.dateToString(dateDue) + "</td>\n                    <td>" + exttimes + "</td>\n                    <td>\n                        <form action=\"/extend\" method=\"POST\">\n                            <input type=\"hidden\" name=\"isbn\" value=\"" + oneRow[0] + "\">\n                            <input type=\"hidden\" name=\"exttimes\" value=\"" + oneRow[5] + "\">\n                            <input class=\"small-button\" type=\"submit\" value=\"\uC5F0\uC7A5\">\n                        </form>\n                        <form action=\"/return\" method=\"POST\">\n                            <input type=\"hidden\" name=\"isbn\" value=\"" + oneRow[0] + "\">\n                            <input type=\"hidden\" name=\"title\" value=\"" + oneRow[1] + "\">\n                            <input class=\"small-button\" type=\"submit\" value=\"\uBC18\uB0A9\">\n                        </form>\n                    </td>\n                </tr>";
        }
    }
    for (var i = 0; i < 14 - resultRows.length; i++) {
        buffer += BLANK_ROW;
    }
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <link rel=\"stylesheet\" href=\"/style/search.css\">\n            <link rel=\"stylesheet\" href=\"/style/font.css\">\n            <title>CNU Library</title>\n        </head>\n        <body>\n            <header>\n                <span class=\"center\" id=\"logo-box\">\n                    <a href=\"/page/search.html\">\n                        <h1>Chungnam Nat'l University Library</h1>\n                    </a>\n                </span>\n            </header>\n            <nav>\n                <span class=\"center\" id=\"date-box\">\n                    DAEJEON, " + d.week(today) + ", " + d.month(today) + " " + today.getDate() + ", " + today.getFullYear() + "\n                </span>\n                <span class=\"center\" id=\"page-change-box\">\n                    <a class=\"ahover\" href=\"/page/search.html\">Search Books</a>\n                </span>\n            </nav>\n            <main>\n                <div class=\"main-container\" id=\"mypage-container\">\n                    <h1 id=\"container-title-box\">SIGN IN AS : " + id + " - " + name + "</h1>\n                    <aside id=\"menu-box\">\n                        <a class=\"ahover\" id=\"info-box\" href=\"/page/pinfo.html\">Personal Information</a>\n                        <a class=\"ahover selected\" id=\"rent-box\" href=\"/page/rent.html\">Rented Books</a>\n                        <a class=\"ahover\" id=\"reserve-box\" href=\"/page/reserve.html\">Reserved Books</a>\n                    </aside>\n                    <article id=\"article-box\">\n                        <h2 id=\"article-title-box\">Rented Books</h2>\n                        <div id=\"article-content-box\">\n                            <table class=\"result-box\">\n                                <thead>\n                                    <th>ISBN</th>\n                                    <th>TITLE</th>\n                                    <th>PUBLISHER</th>\n                                    <th>YEAR</th>\n                                    <th>AUTHOR</th>\n                                    <th>DATE RENTED</th>\n                                    <th>DATE DUE</th>\n                                    <th>EXTEND TIMES</th>\n                                    <th>EXTEND & RETURN</th>\n                                </thead>\n                                <tbody>" + buffer + "</tbody>\n                            </table>\n                        </div>\n                    </article>\n                </div>\n            </main>\n            <footer>copyright\u00A9saltwalks2021</footer>\n        </body>\n        </html>\n    ";
}
exports.default = getRentedTemplate;
