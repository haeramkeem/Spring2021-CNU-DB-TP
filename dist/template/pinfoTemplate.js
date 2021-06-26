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
function getPinfoTemplate(id, name, today) {
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <link rel=\"stylesheet\" href=\"/style/search.css\">\n            <link rel=\"stylesheet\" href=\"/style/font.css\">\n            <title>CNU Library</title>\n        </head>\n        <body>\n            <header>\n                <span class=\"center\" id=\"logo-box\">\n                    <a href=\"/page/search.html\">\n                        <h1>Chungnam Nat'l University Library</h1>\n                    </a>\n                </span>\n            </header>\n            <nav>\n                <span class=\"center\" id=\"date-box\">\n                    DAEJEON, " + d.week(today) + ", " + d.month(today) + " " + today.getDate() + ", " + today.getFullYear() + "\n                </span>\n                <span class=\"center\" id=\"page-change-box\">\n                    <a class=\"ahover\" href=\"/page/search.html\">Search Books</a>\n                </span>\n            </nav>\n            <main>\n                <div class=\"main-container\" id=\"mypage-container\">\n                    <h1 id=\"container-title-box\">SIGN IN AS : " + id + " - " + name + "</h1>\n                    <aside id=\"menu-box\">\n                        <a class=\"ahover selected\" id=\"info-box\" href=\"/page/pinfo.html\">Personal Information</a>\n                        <a class=\"ahover\" id=\"rent-box\" href=\"/page/rent.html\">Rented Books</a>\n                        <a class=\"ahover\" id=\"reserve-box\" href=\"/page/reserve.html\">Reserved Books</a>\n                    </aside>\n                    <article id=\"article-box\">\n                        <h2 id=\"article-title-box\">Personal Information</h2>\n                        <div id=\"article-content-box\">\n                            <div>ID : " + id + "</div>\n                            <div>Name : " + name + "</div>\n                            <form action=\"/pinfo\" method=\"POST\">\n                                <label>\n                                    Password : \n                                    <input class=\"no-appearance ihover info-input\" type=\"password\" name=\"pw\">\n                                </label>\n                                <br>\n                                <label>\n                                    Email : \n                                    <input class=\"no-appearance ihover info-input\" type=\"text\" name=\"email\">\n                                </label>\n                                <br><br>\n                                <input class=\"small-button\" id=\"content-submit\" type=\"submit\" value=\"Modify Information\">\n                            </form>\n                        </div>\n                    </article>\n                </div>\n            </main>\n            <footer>copyright\u00A9saltwalks2021</footer>\n        </body>\n        </html>\n    ";
}
exports.default = getPinfoTemplate;
