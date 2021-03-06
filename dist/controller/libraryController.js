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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var queryString = __importStar(require("querystring"));
var libraryService = __importStar(require("../service/libraryService"));
var classDomain_1 = require("../domain/classDomain");
var baseUrl = "http://localhost:3000";
//????????? ????????? ???????????? ????????? ????????? ????????? ????????????.
setInterval(libraryService.refreshDB, 60000);
function libraryController(request, response) {
    if (request.method === "POST") {
        /**
         *
         * POST ????????? ?????????
         * postHandler()??? ????????? query??? ?????? ????????????.
         * ?????? query??? ?????? ????????? ????????? service??? ????????? ???????????? ????????? ????????????.
         * ????????? ????????? ???????????? responseHandler()??? ????????? ????????? ????????????.
         *
         */
        var reqUrl = request.url;
        if (reqUrl === "/signin") {
            //????????? ??????
            postHandler(request).then(function (handleResult) {
                var id = handleResult.id, pw = handleResult.pw;
                if (typeof id === "string" && typeof pw === "string") {
                    libraryService.doSignIn(new classDomain_1.Customer(id, pw, "", "")).then(function (signInResult) {
                        responseHandler(response, signInResult);
                    });
                }
            });
        }
        else if (reqUrl === "/signup") {
            //???????????? ??????
            postHandler(request).then(function (handleResult) {
                var id = handleResult.id, pw = handleResult.pw, name = handleResult.name, email = handleResult.email;
                if (typeof id === "string" && typeof pw === "string" && typeof name === "string" && typeof email === "string") {
                    libraryService.doSignUp(new classDomain_1.Customer(id, pw, name, email)).then(function (signUpResult) {
                        responseHandler(response, signUpResult);
                    });
                }
            });
        }
        else if (reqUrl === "/rent") {
            //????????????
            postHandler(request).then(function (handleResult) {
                var isbn = handleResult.isbn;
                if (typeof isbn === "string") {
                    libraryService.doRentBook(isbn).then(function (rentResult) {
                        responseHandler(response, rentResult);
                    });
                }
            });
        }
        else if (reqUrl === "/reserve") {
            //????????????
            postHandler(request).then(function (handleResult) {
                var isbn = handleResult.isbn;
                if (typeof isbn === "string") {
                    libraryService.doReserveBook(isbn).then(function (reserveResult) {
                        responseHandler(response, reserveResult);
                    });
                }
            });
        }
        else if (reqUrl === "/pinfo") {
            //???????????? ?????? ??????
            postHandler(request).then(function (handleResult) {
                var pw = handleResult.pw, email = handleResult.email;
                if (typeof pw === "string" && typeof email === "string") {
                    libraryService.doModifyPinfo(pw, email).then(function (modifyResult) {
                        responseHandler(response, modifyResult);
                    });
                }
            });
        }
        else if (reqUrl === "/extend") {
            //?????? ?????? ??????
            postHandler(request).then(function (handleResult) {
                var isbn = handleResult.isbn, exttimes = handleResult.exttimes;
                if (typeof isbn === "string" && typeof exttimes === "string") {
                    libraryService.doExtendDue(isbn, exttimes).then(function (extendResult) {
                        responseHandler(response, extendResult);
                    });
                }
            });
        }
        else if (reqUrl === "/return") {
            //?????? ??????
            postHandler(request).then(function (handleResult) {
                var isbn = handleResult.isbn, title = handleResult.title;
                if (typeof isbn === "string" && typeof title === "string") {
                    libraryService.doReturnBook(isbn, title).then(function (returnResult) {
                        responseHandler(response, returnResult);
                    });
                }
            });
        }
        else if (reqUrl === "/cancel") {
            //?????? ?????? ??????
            postHandler(request).then(function (handleResult) {
                var isbn = handleResult.isbn;
                if (typeof isbn === "string") {
                    libraryService.doCancelReservation(isbn).then(function (cancelResult) {
                        responseHandler(response, cancelResult);
                    });
                }
            });
        }
    }
    else if (request.method === "GET") {
        /**
         *
         *
         * GET ????????? ??????
         * ?????? ?????? ????????? ??????????????? ???????????? ?????? ?????? ???????????? ????????? ?????? ????????????.
         * ??????????????? getHandler()????????? ?????? ?????????????????? path??? query??? ????????????
         * service??? ????????? ????????? ????????? ???????????? ????????? ???????????????
         *
         *
         */
        var _a = getHandler(request), path = _a.path, query = _a.query;
        if (path === "/searchbook") {
            var type = query.type, keyword = query.keyword; //query????????? ????????? ????????? ???????????? ??????
            if (typeof type === "string" && typeof keyword === "string") { //????????????
                libraryService.doSearchBook(new classDomain_1.SearchForm(type, keyword)).then(function (searchResult) {
                    responseHandler(response, searchResult);
                });
            }
        }
        else if (path === "/") {
            //???????????? ??????
            responseHandler(response, libraryService.loadSignPage());
        }
        else if (path === "/page/signup") {
            //????????????????????? ??????
            responseHandler(response, libraryService.loadSignUpPage());
        }
        else if (path === "/page/pinfo") {
            //????????????????????? ??????
            responseHandler(response, libraryService.loadPinfoPage());
        }
        else if (path === "/page/rent") {
            //???????????? ??????
            libraryService.loadRentedPage().then(function (page) {
                responseHandler(response, page);
            });
        }
        else if (path === "/page/reserve") {
            //??????????????? ??????
            libraryService.loadReservedPage().then(function (page) {
                responseHandler(response, page);
            });
        }
        else if (path === "/page/search") {
            //??????????????? ??????
            libraryService.loadSearchPage().then(function (page) {
                responseHandler(response, page);
            });
        }
        else {
            //?????? ?????? ??????
            responseHandler(response, libraryService.loadFile(path));
        }
    }
}
exports.default = libraryController;
/* --------------------------------- Handlers --------------------------------- */
function responseHandler(response, result) {
    //????????? ???????????? ??????
    //HTTP Status??? ??????
    //???????????? ?????????
    response.writeHead(result.status);
    response.end(result.data);
}
function postHandler(request) {
    return __awaiter(this, void 0, void 0, function () {
        var promise, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    promise = new Promise(function (resolve) {
                        request.on("data", function (data) {
                            resolve("" + data);
                        });
                    });
                    _b = (_a = queryString).parse;
                    return [4 /*yield*/, promise];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
function getHandler(request) {
    //GET ??????????????? path??? query??? ???????????? ??????
    var urlObject = new URL(baseUrl + request.url);
    return {
        path: urlObject.pathname,
        query: queryString.parse(urlObject.search.slice(1)),
    };
}
