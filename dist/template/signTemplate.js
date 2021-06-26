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
var notice = __importStar(require("../module/alertModule"));
function getSignTemplate(msg) {
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>CNU Library</title>\n            <link rel=\"stylesheet\" href=\"/style/sign.css\">\n            <link rel=\"stylesheet\" href=\"/style/font.css\">\n        </head>\n        <body>\n            <header>\n                <div class=\"both-hand-side\">\n                    <div class=\"center\" id=\"logo-box\">\n                        <a href=\"/index.html\">\n                            <h1 class=\"center\" id=\"logo-text\">\n                                Chungnam<br>\n                                National<br>\n                                University<br>\n                                Library\n                            </h1>\n                        </a>\n                    </div>\n                </div>\n            </header>\n            <main>\n                <div class=\"both-hand-side\">\n                    <div class=\"center\" id=\"sign-box\">\n                        <form action=\"/signin\" method=\"POST\">\n                            <label class=\"input-box\" id=\"signin-id-box\">\n                                ID<br>\n                                <input type=\"text\" class=\"hover-box\" name=\"id\">\n                            </label>\n                            <label class=\"input-box\" id=\"signin-pw-box\">\n                                PW<br>\n                                <input type=\"password\" class=\"hover-box\" name=\"pw\">\n                            </label>\n                            <div class=\"submit-box\" id=\"signin-submit-box\">\n                                <input type=\"submit\" value=\"Sign In\">\n                            </div>\n                            <div id=\"signup-link-box\">\n                                <a href=\"/page/signup.html\">Sign Up</a>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n            </main>\n            <footer>copyright\u00A9saltwalks2021</div>\n            " + notice.alert(msg) + "\n        </body>\n        </html>\n    ";
}
exports.default = getSignTemplate;
