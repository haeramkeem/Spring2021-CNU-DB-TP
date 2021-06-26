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
function getAdminTemplate(today, count, rentStat, rankStat) {
    var rentAcc = "";
    for (var _i = 0, rentStat_1 = rentStat; _i < rentStat_1.length; _i++) {
        var rentRow = rentStat_1[_i];
        if (rentRow instanceof Array) {
            /* CLEAN - using map() */
            var id = rentRow[0], rentCount = rentRow[1];
            if (id === null) {
                rentAcc += "<tr><td>\uD569\uACC4</td><td>" + rentCount + "</td></tr>";
            }
            else {
                rentAcc += "<tr><td>" + id + "</td><td>" + rentCount + "</td></tr>";
            }
        }
    }
    var rankAcc = "";
    for (var _a = 0, rankStat_1 = rankStat; _a < rankStat_1.length; _a++) {
        var rankRow = rankStat_1[_a];
        if (rankRow instanceof Array) {
            var rank = rankRow[0], cno = rankRow[1], name_1 = rankRow[2], pw = rankRow[3], email = rankRow[4];
            rankAcc += "<tr><td>" + rank + "</td><td>" + cno + "</td><td>" + name_1 + "</td><td>" + pw + "</td><td>" + email + "</td></tr>";
        }
    }
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <link rel=\"stylesheet\" href=\"/style/search.css\">\n            <link rel=\"stylesheet\" href=\"/style/font.css\">\n            <title>CNU Library</title>\n        </head>\n        <body>\n            <header>\n                <span class=\"center\" id=\"logo-box\">\n                    <h1>Chungnam Nat'l University Library</h1>\n                </span>\n            </header>\n            <nav>\n                <span class=\"center\" id=\"date-box\">\n                    DAEJEON, " + d.week(today) + ", " + d.month(today) + " " + today.getDate() + ", " + today.getFullYear() + "\n                </span>\n                <span class=\"center\" id=\"page-change-box\">\n                    <a class=\"ahover\" href=\"/index.html\">Log Out</a>\n                </span>\n            </nav>\n            <main>\n                <div class=\"main-container\" id=\"mypage-container\">\n                    <h1 id=\"container-title-box\">Library Administration</h1>\n                    <aside id=\"menu-box\">\n                        <div class=\"selected\" id=\"info-box\">Library Stats</div>\n                    </aside>\n                    <article id=\"article-box\">\n                        <h2 id=\"article-title-box\">Library Stats</h2>\n                        <div id=\"article-content-box\">\n                                <div>\uC9C0\uAE08\uAE4C\uC9C0 \uBE4C\uB824\uAC04 \uCC45\uB4E4\uC911 \uC9D1\uD544\uC5D0 \uCC38\uC5EC\uD55C \uD55C\uAD6D\uC0AC\uB78C\uC758 \uBA85\uC218 : " + count[0] + "</div>\n                                <div class=\"stat\">\n                                    \uD559\uBC88\uBCC4 \uC9C0\uAE08\uAE4C\uC9C0 \uBA87\uAD8C\uC774\uB098 \uB300\uCD9C\uD574\uAC14\uB294\uC9C0\uC5D0 \uB300\uD55C \uD69F\uC218\uC640 \uBAA8\uB4E0 \uD559\uC0DD\uB4E4\uC5D0 \uB300\uD55C \uCD1D \uB300\uCD9C \uD69F\uC218\n                                    <table class=\"result-box\">\n                                        <thead>\n                                            <th>\uD559\uBC88</th>\n                                            <th>\uB300\uC5EC\uD69F\uC218</th>\n                                        </thead>\n                                        <tbody>" + rentAcc + "</tbody>\n                                    </table>\n                                </div>\n                                <div class=\"stat\">\n                                    \uB300\uC5EC \uD559\uC0DD \uD559\uBC88\uBCC4 \uC815\uB82C\n                                    <table class=\"result-box\">\n                                        <thead>\n                                            <th>\uC21C\uC704</th>\n                                            <th>\uD559\uBC88</th>\n                                            <th>\uC774\uB984</th>\n                                            <th>PW</th>\n                                            <th>EMAIL</th>\n                                        </thead>\n                                        <tbody>" + rankAcc + "</tbody>\n                                    </table>\n                                </div>\n                        </div>\n                    </article>\n                </div>\n            </main>\n            <footer>copyright\u00A9saltwalks2021</footer>\n        </body>\n        </html>\n    ";
}
exports.default = getAdminTemplate;
