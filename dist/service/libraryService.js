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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshDB = exports.loadFile = exports.loadReservedPage = exports.loadRentedPage = exports.loadPinfoPage = exports.loadSearchPage = exports.loadAdminPage = exports.loadSignUpPage = exports.loadSignPage = exports.doCancelReservation = exports.doReturnBook = exports.doExtendDue = exports.doModifyPinfo = exports.doReserveBook = exports.doRentBook = exports.doSearchBook = exports.doSignUp = exports.doSignIn = void 0;
var fs = __importStar(require("fs"));
var database = __importStar(require("../repository/database"));
var mailer = __importStar(require("nodemailer"));
var classDomain_1 = require("../domain/classDomain");
var dbconfig_1 = require("../repository/dbconfig");
var dateModule_1 = require("../module/dateModule");
var pug_1 = __importDefault(require("pug"));
var ROOT_DIR = __dirname.replace("\\service", "");
var MAILER_SENDER = "haeram.kim1@gmail.com";
var MAILER_PASS = "revell1998115";
var ADMIN_ID = "201702004";
var ADMIN_PW = "111111";
var RESERVABLE = 0;
var OVER_RESERVE = 1;
var USER_RESERVED = 2;
var ALL_BOOK = undefined;
/* -------------------------------------- GLOBAL VARIABLES --------------------------------------  */
var logInSession = null;
var date = 0;
var today = new Date();
/* -------------------------------------- GLOBAL FUNCTIONS --------------------------------------  */
/* -------------------------------------- POST --------------------------------------  */
function doSignIn(customer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            /* Sign In Progress */
            if (customer.id === ADMIN_ID && customer.pw === ADMIN_PW) {
                //??????????????? ??????
                return [2 /*return*/, loadAdminPage()];
            }
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.selectCustomerByIdPw(customer.id, customer.pw).then(function (res) {
                        //id??? pw??? ???????????? ?????? ??????
                        if (res.status === dbconfig_1.DB_ERROR || res.status === dbconfig_1.DB_CHANGED) {
                            reject(409);
                            return;
                        }
                        else if (res.status === dbconfig_1.SELECT_NOTHING) {
                            resolve(loadSignPage("Wrong ID or PW"));
                            return;
                        }
                        //????????? ?????? ??????
                        logInSession = new classDomain_1.Customer(String(res.rows[0][0]), "", res.rows[0][2], res.rows[0][3]);
                        //??????????????? ??????
                        resolve(loadSearchPage());
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doSignIn = doSignIn;
function doSignUp(customer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var id = customer.id, pw = customer.pw, name = customer.name, email = customer.email;
                    if (id === "" || pw === "" || name === "" || email === "") {
                        return resolve(loadSignUpPage("Please Enter All Informations"));
                    }
                    database.selectCustomerByIdEmail(id, email).then(function (res) {
                        //id, email?????? ??????
                        if (res.status === dbconfig_1.DB_ERROR || res.status === dbconfig_1.DB_CHANGED) {
                            return reject(409);
                        }
                        else if (res.status === dbconfig_1.SELECT_SOMETHING) {
                            return resolve(loadSignUpPage("ID or Email Already Exists"));
                        }
                        //????????? ????????? ??????
                        database.createCustomer(id, pw, name, email).then(function (res) {
                            //db??? ????????? ???????????? ??????
                            if (res.status === dbconfig_1.DB_CHANGED) {
                                resolve(loadSignPage("Sign Up Success"));
                            }
                            else {
                                reject(409);
                            }
                        });
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doSignUp = doSignUp;
function doSearchBook(query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    if (query.type === "author") {
                        //????????? ??????
                        database.selectBookByAuthor(query.keyword).then(function (res) {
                            resolve(res);
                        });
                    }
                    else if (query.type === "query") {
                        //????????? ??????
                        searchBookByQuery(query.keyword).then(function (res) {
                            resolve(res);
                        });
                    }
                    else {
                        //??????, ?????????, ??????????????? ??????
                        database.selectBookByOneColumn(query.type, query.keyword).then(function (res) {
                            resolve(res);
                        });
                    }
                }).then(function (res) {
                    //?????? ?????? ??????
                    switch (res.status) {
                        case dbconfig_1.SELECT_SOMETHING:
                            //?????? ?????? - ???????????? ??????????????? ??????
                            return loadSearchPage(res.rows);
                        case dbconfig_1.SELECT_NOTHING:
                            //????????? ?????? ??????
                            return loadSearchPage([]);
                        default:
                            //?????? ??????
                            return errorHandler(409);
                    }
                })];
        });
    });
}
exports.doSearchBook = doSearchBook;
function doRentBook(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!(logInSession instanceof classDomain_1.Customer)) {
                        return reject(401);
                    }
                    var signedId = logInSession.id;
                    database.selectRentedBookByIsbn(isbn).then(function (rentCheck) {
                        //?????? ??????????????? ??????
                        if (rentCheck.status === dbconfig_1.DB_ERROR || rentCheck.status === dbconfig_1.DB_CHANGED) {
                            return reject(409);
                        }
                        else if (rentCheck.status === dbconfig_1.SELECT_SOMETHING) {
                            return resolve(loadSearchPage(ALL_BOOK, "Can\'t Rent : Already Rented By Someone"));
                        }
                        database.selectRentedBookById(signedId).then(function (res) {
                            //????????? ?????? ??????????????? ??????
                            if (res.status === dbconfig_1.DB_ERROR || res.status === dbconfig_1.DB_CHANGED) {
                                return reject(409);
                            }
                            else if (res.rows.length > 2) {
                                return resolve(loadSearchPage(ALL_BOOK, "Can\'t Rent : You Already Rented 3 Books"));
                            }
                            database.selectNextCustomerByIsbn(isbn).then(function (next) {
                                if (next.status === dbconfig_1.DB_ERROR || next.status === dbconfig_1.DB_CHANGED) {
                                    return reject(409);
                                }
                                else if (next.status === dbconfig_1.SELECT_SOMETHING) {
                                    if (String(next.rows[0][1]) !== signedId) {
                                        return resolve(loadSearchPage(ALL_BOOK, "Can\'t Rent : Reserved By Someone"));
                                    }
                                    else {
                                        database.deleteOneReservation(signedId, isbn);
                                    }
                                }
                                database.updateToRented(signedId, isbn).then(function (res) {
                                    //?????? ??????
                                    if (res.status === dbconfig_1.DB_CHANGED) {
                                        resolve(loadSearchPage(ALL_BOOK, "Rent Success"));
                                    }
                                    else {
                                        reject(409);
                                    }
                                });
                            });
                        });
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doRentBook = doRentBook;
function doReserveBook(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!(logInSession instanceof classDomain_1.Customer)) {
                        reject(401);
                        return;
                    }
                    var signedId = logInSession.id;
                    database.selectRentedBookByIsbn(isbn).then(function (rentCheck) {
                        if (rentCheck.status === dbconfig_1.DB_ERROR || rentCheck.status === dbconfig_1.DB_CHANGED) {
                            reject(409);
                            return;
                        }
                        else if (rentCheck.status === dbconfig_1.SELECT_NOTHING) {
                            resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Can Rent"));
                            return;
                        }
                        else if (String(rentCheck.rows[0][0]) === signedId) {
                            resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Already Rent"));
                            return;
                        }
                        checkUserReservable(signedId, isbn).then(function (userCheck) {
                            if (userCheck === dbconfig_1.DB_ERROR) {
                                reject(409);
                                return;
                            }
                            else if (userCheck === OVER_RESERVE) {
                                resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Reserved 3 Books"));
                                return;
                            }
                            else if (userCheck === USER_RESERVED) {
                                resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Already Reserved"));
                                return;
                            }
                            database.createReservation(signedId, isbn).then(function (res) {
                                //?????? ?????? ??????
                                if (res.status === dbconfig_1.DB_CHANGED) {
                                    resolve(loadSearchPage(ALL_BOOK, "Reserve Success"));
                                }
                                else {
                                    reject(409);
                                }
                            });
                        });
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doReserveBook = doReserveBook;
function doModifyPinfo(pw, email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!(logInSession instanceof classDomain_1.Customer)) {
                        //????????? ??????
                        return reject(401);
                    }
                    var signedId = logInSession.id;
                    if (pw === "" || email === "") {
                        return resolve(loadPinfoPage("Please Enter All Information"));
                    }
                    database.selectCustomerByEmail(email).then(function (res) {
                        //????????? ?????? ??????
                        if (res.status === dbconfig_1.DB_ERROR || res.status === dbconfig_1.DB_CHANGED) {
                            return reject(409);
                        }
                        else if (res.status === dbconfig_1.SELECT_SOMETHING) {
                            return resolve(loadPinfoPage("Email Already Used"));
                        }
                        database.updatePinfo(signedId, pw, email).then(function (res) {
                            //???????????? ??????
                            if (res.status === dbconfig_1.DB_CHANGED) {
                                resolve(loadPinfoPage("Modify Personal Information Success"));
                            }
                            else {
                                reject(409);
                            }
                        });
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doModifyPinfo = doModifyPinfo;
function doExtendDue(isbn, exttimes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!(logInSession instanceof classDomain_1.Customer)) {
                        //????????? ??????
                        return reject(401);
                    }
                    else if (Number(exttimes) >= 2) {
                        //???????????? ??????
                        return resolve(loadRentedPage("Can\'t Extend : Already Extend Twice"));
                    }
                    database.selectNextCustomerByIsbn(isbn).then(function (next) {
                        if (next.status === dbconfig_1.DB_ERROR || next.status === dbconfig_1.DB_CHANGED) {
                            return reject(409);
                        }
                        else if (next.status === dbconfig_1.SELECT_SOMETHING) {
                            return resolve(loadRentedPage("Can\' Extend : Reserved By Someone"));
                        }
                        database.updateDateDue(isbn).then(function (res) {
                            //?????? ??????
                            if (res.status === dbconfig_1.DB_CHANGED) {
                                resolve(loadRentedPage("Extend Sucess"));
                            }
                            else {
                                reject(409);
                            }
                        });
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doExtendDue = doExtendDue;
function doReturnBook(isbn, title) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    returnBook(isbn, title).then(function (returnedNormally) {
                        //?????? ??????
                        if (returnedNormally) {
                            //?????? ?????? - ????????? ???????????? ????????? ??????
                            resolve(loadRentedPage("Returned Successfully"));
                        }
                        else {
                            //?????? ??????
                            reject(409);
                        }
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doReturnBook = doReturnBook;
function doCancelReservation(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (logInSession instanceof classDomain_1.Customer) {
                        //????????? ??????
                        var signedId = logInSession.id;
                        database.deleteOneReservation(signedId, isbn).then(function (res) {
                            //?????? ?????? ??????
                            switch (res.status) {
                                case dbconfig_1.DB_CHANGED:
                                    //?????? ??????
                                    resolve(loadReservedPage("Canceling Reservation Success"));
                                    break;
                                default:
                                    //?????? ??????
                                    reject(409);
                            }
                        });
                    }
                    else {
                        //???????????????
                        reject(401);
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doCancelReservation = doCancelReservation;
/* -------------------------------------- GET - load --------------------------------------  */
function loadSignPage(msg) {
    //????????????
    logInSession = null;
    var signPage = pug_1.default.compileFile(ROOT_DIR + "/view/signIn.pug");
    return new classDomain_1.Responsable(200, signPage({ alertMsg: msg }));
}
exports.loadSignPage = loadSignPage;
function loadSignUpPage(msg) {
    var signUpPage = pug_1.default.compileFile(ROOT_DIR + "/view/signUp.pug");
    return new classDomain_1.Responsable(200, signUpPage({ alertMsg: msg }));
}
exports.loadSignUpPage = loadSignUpPage;
function loadAdminPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    getStat1().then(function (res1) {
                        //?????? 1
                        getStat2().then(function (res2) {
                            //?????? 2
                            getStat3().then(function (res3) {
                                //?????? 3
                                if (res1 instanceof Array && res1[0] instanceof Array && res2 instanceof Array && res3 instanceof Array) {
                                    //?????? ?????? ?????? ??????
                                    var adminPage = pug_1.default.compileFile(ROOT_DIR + "/view/admin.pug");
                                    var templateObj = {
                                        date: dateModule_1.getFullDate(today),
                                        alertMsg: "",
                                        count: res1[0][0],
                                        rents: res2,
                                        ranks: res3,
                                    };
                                    resolve(new classDomain_1.Responsable(200, adminPage(templateObj)));
                                }
                                else {
                                    //??????
                                    reject(409);
                                }
                            });
                        });
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.loadAdminPage = loadAdminPage;
function loadSearchPage(books, msg) {
    return __awaiter(this, void 0, void 0, function () {
        var searchPage;
        return __generator(this, function (_a) {
            searchPage = pug_1.default.compileFile(ROOT_DIR + "/view/searchBooks.pug");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (typeof books === "undefined") {
                        database.selectAllBook().then(function (res) {
                            //?????? ?????? ??????
                            switch (res.status) {
                                case dbconfig_1.SELECT_SOMETHING:
                                case dbconfig_1.SELECT_NOTHING:
                                    //????????? ?????? ???????????? ??????
                                    var templateObj = {
                                        date: dateModule_1.getFullDate(today),
                                        booksToShow: res.rows,
                                        alertMsg: msg,
                                    };
                                    resolve(new classDomain_1.Responsable(200, searchPage(templateObj)));
                                    break;
                                default:
                                    //?????? ??????
                                    reject(409);
                            }
                        });
                    }
                    else {
                        var templateObj = {
                            date: dateModule_1.getFullDate(today),
                            booksToShow: books,
                            alertMeg: msg
                        };
                        resolve(new classDomain_1.Responsable(200, searchPage(templateObj)));
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.loadSearchPage = loadSearchPage;
function loadPinfoPage(msg) {
    if (logInSession instanceof classDomain_1.Customer) {
        //????????? ??????
        var pinfoPage = pug_1.default.compileFile(ROOT_DIR + "/view/pinfo.pug");
        var templateObj = {
            date: today,
            id: logInSession.id,
            name: logInSession.name,
            alertMsg: msg,
        };
        //???????????? ????????? ??????
        return new classDomain_1.Responsable(200, pinfoPage(templateObj));
    }
    else {
        //???????????????
        return new classDomain_1.Responsable(401, "401 : Unauthorized");
    }
}
exports.loadPinfoPage = loadPinfoPage;
function loadRentedPage(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var rentPage;
        return __generator(this, function (_a) {
            rentPage = pug_1.default.compileFile(ROOT_DIR + "/view/rented.pug");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (logInSession instanceof classDomain_1.Customer) {
                        //????????? ??????
                        var templateObj_1 = {
                            date: dateModule_1.getFullDate(today),
                            alertMsg: msg,
                            id: logInSession.id,
                            name: logInSession.name,
                            booksToShow: new Array(),
                        };
                        database.selectRentedBookById(logInSession.id).then(function (res) {
                            //?????? ?????? ??????
                            switch (res.status) {
                                case dbconfig_1.SELECT_SOMETHING:
                                    //?????? ?????? ?????? - ???????????? ??????
                                    templateObj_1.booksToShow = res.rows;
                                    resolve(new classDomain_1.Responsable(200, rentPage(templateObj_1)));
                                    break;
                                case dbconfig_1.SELECT_NOTHING:
                                    //?????? ?????? ???????????? ?????? - ???????????? ??????
                                    templateObj_1.booksToShow = [];
                                    resolve(new classDomain_1.Responsable(200, rentPage(templateObj_1)));
                                    break;
                                default:
                                    //?????? ??????
                                    reject(409);
                            }
                        });
                    }
                    else {
                        //???????????????
                        reject(401);
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.loadRentedPage = loadRentedPage;
function loadReservedPage(msg) {
    return __awaiter(this, void 0, void 0, function () {
        var reservePage;
        return __generator(this, function (_a) {
            reservePage = pug_1.default.compileFile(ROOT_DIR + "/view/reserved.pug");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (logInSession instanceof classDomain_1.Customer) {
                        //????????? ??????
                        var templateObj_2 = {
                            date: dateModule_1.getFullDate(today),
                            alertMsg: msg,
                            id: logInSession.id,
                            name: logInSession.name,
                            booksToShow: new Array(),
                        };
                        database.selectReservedBookById(logInSession.id).then(function (res) {
                            //?????? ?????? ??????
                            switch (res.status) {
                                case dbconfig_1.SELECT_SOMETHING:
                                    //?????? ?????? ?????? - ???????????? ??????
                                    templateObj_2.booksToShow = res.rows;
                                    resolve(new classDomain_1.Responsable(200, reservePage(templateObj_2)));
                                    break;
                                case dbconfig_1.SELECT_NOTHING:
                                    //???????????? ?????? - ???????????? ??????
                                    templateObj_2.booksToShow = [];
                                    resolve(new classDomain_1.Responsable(200, reservePage(templateObj_2)));
                                    break;
                                default:
                                    //?????? ??????
                                    reject(409);
                            }
                        });
                    }
                    else {
                        //???????????????
                        reject(401);
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.loadReservedPage = loadReservedPage;
function loadFile(filePath) {
    try {
        //?????? ?????? ??????
        return new classDomain_1.Responsable(200, fs.readFileSync(ROOT_DIR + filePath));
    }
    catch (error) {
        console.error(error);
        //?????? ?????? ??????
        return new classDomain_1.Responsable(404, "404 : Not Found");
    }
}
exports.loadFile = loadFile;
/* ------------------------------- INITIAL FUNCTIONS ------------------------------- */
function refreshDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function () {
                    if (date !== today.getDate()) {
                        //?????? ??????
                        date = today.getDate();
                        //????????? ?????? ??????
                        returnExpiredBooks();
                        cancelUnrentedReservation();
                    }
                })];
        });
    });
}
exports.refreshDB = refreshDB;
function returnExpiredBooks() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function () {
                    database.selectAllExpBooks().then(function (res) {
                        //????????? ?????? ??????
                        if (res.status === dbconfig_1.SELECT_SOMETHING) {
                            for (var _i = 0, _a = res.rows; _i < _a.length; _i++) {
                                var book = _a[_i];
                                //?????? ??????
                                returnBook(String(book[0]), book[1]);
                            }
                        }
                    });
                })];
        });
    });
}
function cancelUnrentedReservation() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function () {
                    database.selectReservedBooksNotRented().then(function (selectedBooks) {
                        if (selectedBooks.status === dbconfig_1.SELECT_SOMETHING) {
                            var _loop_1 = function (book) {
                                var isbn = book[0];
                                var title = book[1];
                                database.selectNextCustomerByIsbn(isbn).then(function (selectedCustomer) {
                                    if (selectedCustomer.status === dbconfig_1.SELECT_SOMETHING) {
                                        var email = selectedCustomer.rows[0][0];
                                        var id = String(selectedCustomer.rows[0][1]);
                                        database.deleteOneReservation(id, isbn);
                                        sendEmail(email, title);
                                    }
                                });
                            };
                            for (var _i = 0, _a = selectedBooks.rows; _i < _a.length; _i++) {
                                var book = _a[_i];
                                _loop_1(book);
                            }
                        }
                    });
                })];
        });
    });
}
/* ------------------------------- LOCAL FUNCTIONS ------------------------------- */
function returnBook(isbn, title) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    database.createPreviousRental(isbn).then(function (creationResult) {
                        //?????? ??????????????? ???????????? ??????
                        if (creationResult.status !== dbconfig_1.DB_CHANGED) {
                            return resolve(false);
                        }
                        //????????????
                        database.updateToReturned(isbn).then(function (updateResult) {
                            //??? ??????
                            if (updateResult.status !== dbconfig_1.DB_CHANGED) {
                                return resolve(false);
                            }
                            //?????? ??????
                            database.selectNextCustomerByIsbn(isbn).then(function (res) {
                                //???????????? ????????? ??????
                                if (res.status === dbconfig_1.SELECT_SOMETHING) {
                                    sendEmail(res.rows[0][0], title).then(function () { return resolve(true); });
                                }
                                else if (res.status === dbconfig_1.SELECT_NOTHING) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            });
                        });
                    });
                })];
        });
    });
}
function checkUserReservable(id, isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectReservedBookById(id).then(function (reserveCheck) {
                        if (reserveCheck.status === dbconfig_1.DB_ERROR || reserveCheck.status === dbconfig_1.DB_CHANGED) {
                            resolve(dbconfig_1.DB_ERROR);
                        }
                        else if (reserveCheck.status === dbconfig_1.SELECT_NOTHING) {
                            resolve(RESERVABLE);
                        }
                        else if (reserveCheck.rows.length > 2) {
                            resolve(OVER_RESERVE);
                        }
                        else {
                            for (var _i = 0, _a = reserveCheck.rows; _i < _a.length; _i++) {
                                var book = _a[_i];
                                if (book[0] === isbn) {
                                    resolve(USER_RESERVED);
                                    return;
                                }
                            }
                            resolve(RESERVABLE);
                        }
                    });
                })];
        });
    });
}
function sendEmail(email, bookTitle) {
    return __awaiter(this, void 0, void 0, function () {
        //????????? ??????
        function send() {
            return __awaiter(this, void 0, void 0, function () {
                var transporter, info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transporter = mailer.createTransport({
                                service: 'gmail',
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false,
                                auth: {
                                    user: MAILER_SENDER,
                                    pass: MAILER_PASS,
                                },
                            });
                            return [4 /*yield*/, transporter.sendMail({
                                    from: "\"CNU Library\" <" + MAILER_SENDER + ">",
                                    to: email,
                                    subject: '[????????? ?????????] ?????? ?????? ?????? ?????? ??????',
                                    text: mailContent,
                                    html: "<b>" + mailContent + "</b>",
                                })];
                        case 1:
                            info = _a.sent();
                            console.log("[" + today.getTime() + "] : Email Send : " + info.messageId);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var mailContent;
        return __generator(this, function (_a) {
            mailContent = "\n        \uC548\uB155\uD558\uC138\uC694. \uCDA9\uB0A8\uB300 \uB3C4\uC11C\uAD00\uC785\uB2C8\uB2E4.\n\n        \uC608\uC57D\uD558\uC2E0 \uB3C4\uC11C \"" + bookTitle + "\" \uC5D0 \uB300\uD574 \uD574\uB2F9 \uB3C4\uC11C\uAC00 \uBC18\uB0A9\uB418\uC5B4 \uB300\uC5EC \uAC00\uB2A5\uD568\uC744 \uC54C\uB824\uB4DC\uB9BD\uB2C8\uB2E4.\n\n        \uAC10\uC0AC\uD569\uB2C8\uB2E4.\n    ";
            ;
            send().catch(console.error);
            return [2 /*return*/];
        });
    });
}
function errorHandler(err) {
    //?????? ?????? ??????
    switch (err) {
        case 401:
            return loadSignPage("Log out");
        case 409:
            return new classDomain_1.Responsable(409, "409 : Conflict");
        default:
            var PANIC = "f";
            console.error(PANIC);
            throw new Error(PANIC);
    }
}
function searchBookByQuery(query) {
    return __awaiter(this, void 0, void 0, function () {
        var selectionQuery;
        return __generator(this, function (_a) {
            selectionQuery = query.replace(/=[(]/g, " like \'").replace(/[)]/g, "\'");
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectBookByWhere(selectionQuery).then(function (res) {
                        //????????? ????????? ??????
                        switch (res.status) {
                            case dbconfig_1.DB_CHANGED:
                                //?????? ??????
                                resolve(new classDomain_1.DBForm(dbconfig_1.DB_ERROR, [[]], 0));
                                break;
                            case dbconfig_1.DB_ERROR:
                                //????????? ?????? ??????
                                resolve(new classDomain_1.DBForm(dbconfig_1.SELECT_NOTHING, [[]], 0));
                                break;
                            default:
                                //?????? ??????
                                resolve(res);
                        }
                    });
                })];
        });
    });
}
function getStat1() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //?????? 1??? ?????? ?????? ??????
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectStat1().then(function (res) {
                        switch (res.status) {
                            case dbconfig_1.SELECT_SOMETHING:
                                resolve(res.rows);
                                break;
                            case dbconfig_1.SELECT_NOTHING:
                                resolve([]);
                                break;
                            default:
                                resolve(409);
                        }
                    });
                })];
        });
    });
}
function getStat2() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //?????? 2??? ?????? ?????? ??????
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectStat2().then(function (res) {
                        switch (res.status) {
                            case dbconfig_1.SELECT_SOMETHING:
                                resolve(res.rows);
                                break;
                            case dbconfig_1.SELECT_NOTHING:
                                resolve([]);
                                break;
                            default:
                                resolve(409);
                        }
                    });
                })];
        });
    });
}
function getStat3() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //?????? 2??? ?????? ?????? ??????
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectStat3().then(function (res) {
                        switch (res.status) {
                            case dbconfig_1.SELECT_SOMETHING:
                                resolve(res.rows);
                                break;
                            case dbconfig_1.SELECT_NOTHING:
                                resolve([]);
                                break;
                            default:
                                resolve(409);
                        }
                    });
                })];
        });
    });
}
