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
exports.refreshDB = exports.loadFile = exports.loadReservedPage = exports.loadRentedPage = exports.loadPinfoPage = exports.loadSearchPage = exports.loadAdminPage = exports.loadSignPage = exports.doCancelReservation = exports.doReturnBook = exports.doExtendDue = exports.doModifyPinfo = exports.doReserveBook = exports.doRentBook = exports.doSearchBook = exports.doSignUp = exports.doSignIn = void 0;
var fs = __importStar(require("fs"));
var database = __importStar(require("../repository/database"));
var mailer = __importStar(require("nodemailer"));
var classDomain_1 = require("../domain/classDomain");
var searchTemplate_1 = __importDefault(require("../template/searchTemplate"));
var pinfoTemplate_1 = __importDefault(require("../template/pinfoTemplate"));
var rentedTemplate_1 = __importDefault(require("../template/rentedTemplate"));
var reservedTemplate_1 = __importDefault(require("../template/reservedTemplate"));
var adminTemplates_1 = __importDefault(require("../template/adminTemplates"));
var ROOTDIR = "C:\\Users\\Host\\Desktop\\Spring2021-CNU-database-termproject-main\\dist";
var MAILER_SENDER = "haeram.kim1@gmail.com";
var MAILER_PASS = "revell1998115";
var RENTABLE = 0;
var RENTED = 1;
var DBERROR = 2;
var SELECT_SOMETHING = 0;
var SELECT_NOTHING = 1;
var DB_CHANGED = 3;
var ADMIN_ID = "201702004";
var ADMIN_PW = "111111";
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
                //관리자인지 확인
                return [2 /*return*/, loadAdminPage()];
            }
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.selectCustomerByIdPw(customer.id, customer.pw).then(function (res) {
                        //id와 pw로 일치하는 고객 조회
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                //로그인 성공
                                var _a = res.rows[0], id = _a[0], _ = _a[1], name_1 = _a[2], email = _a[3];
                                if (typeof id === "number" && typeof name_1 === "string" && typeof email === "string") {
                                    //현재 사용자 정보 등록
                                    logInSession = new classDomain_1.Customer(String(id), "", name_1, email);
                                    //도서검색창 이동
                                    resolve(loadSearchPage());
                                }
                                break;
                            case SELECT_NOTHING:
                                //로그인 실패
                                // resolve(loadFile("/index.html"));
                                resolve(new classDomain_1.Responsable(200, "<script type=\"text/javascript\">alert(\"fuck\")</script>"));
                                break;
                            default:
                                //조회 실패
                                reject(409);
                        }
                    });
                }).catch(function (err) {
                    return errorHandler(err);
                })];
        });
    });
}
exports.doSignIn = doSignIn;
function doSignUp(customer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.selectCustomerById(customer.id).then(function (res) {
                        //id중복 조회
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                //중복
                                resolve(loadFile("/page/signup.html"));
                                break;
                            case SELECT_NOTHING:
                                //새로운 사용자 등록
                                resolve(signUp(customer.id, customer.pw, customer.name, customer.email));
                                break;
                            default:
                                //조회 실패
                                reject(409);
                        }
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
                        //저자로 조회
                        database.selectBookByAuthor(query.keyword).then(function (res) {
                            resolve(res);
                        });
                    }
                    else if (query.type === "query") {
                        //퀴리로 조회
                        searchBookByQuery(query.keyword).then(function (res) {
                            resolve(res);
                        });
                    }
                    else {
                        //서명, 출판사, 발행년도로 조회
                        database.selectBookByOneColumn(query.type, query.keyword).then(function (res) {
                            resolve(res);
                        });
                    }
                }).then(function (res) {
                    //조회 결과 처리
                    switch (res.status) {
                        case SELECT_SOMETHING:
                            //조회 성공 - 반영해서 도서검색창 생성
                            return new classDomain_1.Responsable(200, searchTemplate_1.default(res.rows, today));
                        case SELECT_NOTHING:
                            //조회된 도서 없음
                            return new classDomain_1.Responsable(200, searchTemplate_1.default([], today));
                        default:
                            //조회 실패
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
                    checkBookRentable(isbn).then(function (checkResult) {
                        //책이 대여중인지 확인
                        if (checkResult === RENTABLE) {
                            //대여중이 아님
                            if (logInSession instanceof classDomain_1.Customer) {
                                //로그인 했음
                                var signedId_1 = logInSession.id;
                                database.selectRentedBookById(signedId_1).then(function (res) {
                                    //자신이 몇권 대여했는지 확인
                                    switch (res.status) {
                                        case SELECT_SOMETHING:
                                            //대여한 도서가 있음
                                            if (res.rows.length > 2) {
                                                //대여 가능 횟수 초과
                                                resolve(loadSearchPage());
                                            }
                                            else {
                                                //대여 가능 횟수 이하 - 대여 진행
                                                resolve(rentBook(signedId_1, isbn));
                                            }
                                            break;
                                        case SELECT_NOTHING:
                                            //대여 기록 없음 - 대여 진행
                                            resolve(rentBook(signedId_1, isbn));
                                            break;
                                        default:
                                            //조회 실패
                                            reject(409);
                                    }
                                });
                            }
                            else {
                                //로그아웃됨
                                reject(401);
                            }
                        }
                        else if (checkResult === RENTED) {
                            //대여중 - 대여 불가능
                            resolve(loadSearchPage());
                        }
                        else {
                            //확인 실패
                            reject(409);
                        }
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doRentBook = doRentBook;
function doReserveBook(isbn, rentedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    checkBookRentable(isbn).then(function (checkResult) {
                        //대여중 확인
                        if (checkResult === RENTABLE) {
                            //대여 가능 - 예약 불가능
                            resolve(loadSearchPage());
                        }
                        else if (checkResult === RENTED) {
                            //대여중
                            if (logInSession instanceof classDomain_1.Customer) {
                                //로그인 확인
                                var signedId_2 = logInSession.id;
                                if (rentedBy === signedId_2) {
                                    //자신이 대여했음
                                    resolve(loadSearchPage());
                                }
                                else {
                                    database.selectReservedBookById(signedId_2).then(function (res) {
                                        //예약 기록 확인
                                        switch (res.status) {
                                            case SELECT_SOMETHING:
                                                //예약 기록 존재
                                                if (res.rows.length > 2) {
                                                    //예약 가능 횟수 초과
                                                    resolve(loadSearchPage());
                                                }
                                                else if (checkAlreadyReserved(res.rows, isbn)) {
                                                    //이미 예약한 도서
                                                    resolve(loadSearchPage());
                                                }
                                                else {
                                                    //예약 가능
                                                    resolve(reserveBook(isbn, signedId_2));
                                                }
                                                break;
                                            case SELECT_NOTHING:
                                                //예약 기록 없음 - 예약 가능
                                                resolve(reserveBook(isbn, signedId_2));
                                                break;
                                            default:
                                                //예약 기록 조회 실패
                                                reject(409);
                                        }
                                    });
                                }
                            }
                            else {
                                //로그아웃됨
                                reject(401);
                            }
                        }
                        else {
                            //대여가능 확인 실패
                            reject(409);
                        }
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
                    if (logInSession instanceof classDomain_1.Customer) {
                        //로그인 확인
                        var _a = [logInSession.id, logInSession.name], signedId_3 = _a[0], signedName_1 = _a[1];
                        database.selectCustomerByEmail(email).then(function (res) {
                            //이메일 중복 확인
                            switch (res.status) {
                                case SELECT_SOMETHING:
                                    //이메일 중복
                                    resolve(new classDomain_1.Responsable(200, pinfoTemplate_1.default(signedId_3, signedName_1, today)));
                                    break;
                                case SELECT_NOTHING:
                                    //중복되지 않음 - 변경
                                    resolve(modifyPinfo(signedId_3, pw, email, signedName_1));
                                    break;
                                default:
                                    //중복 확인 실패
                                    reject(409);
                            }
                        });
                    }
                    else {
                        //로그아웃됨
                        reject(401);
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doModifyPinfo = doModifyPinfo;
function doExtendDue(isbn, exttimes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(exttimes);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (logInSession instanceof classDomain_1.Customer) {
                        //로그인 확인
                        if (Number(exttimes) < 2) {
                            //연장횟수 조회
                            database.selectReservedBookByIsbn(isbn).then(function (res) {
                                //해당 도서 예약 기록 조회
                                switch (res.status) {
                                    case SELECT_SOMETHING:
                                        //예약 기록 존재 - 연장 기각
                                        console.log(1);
                                        resolve(loadRentedPage());
                                        break;
                                    case SELECT_NOTHING:
                                        //예약 기록 없음
                                        database.updateDateDue(isbn).then(function (res) {
                                            //연장 진행
                                            switch (res.status) {
                                                case DB_CHANGED:
                                                    //연장 성공 - 반영된 결과 응답
                                                    resolve(loadRentedPage());
                                                    break;
                                                default:
                                                    //연장 실패
                                                    reject(409);
                                            }
                                        });
                                        break;
                                    default:
                                        //예약 기록 확인 실패
                                        reject(409);
                                }
                            });
                        }
                        else {
                            //연장 횟수 초과 - 기각
                            console.log(2);
                            resolve(loadRentedPage());
                        }
                    }
                    else {
                        //로그아웃됨
                        reject(401);
                    }
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
                        //반납 진행
                        if (returnedNormally) {
                            //반납 성공 - 반영된 대여도서 검색창 응답
                            resolve(loadRentedPage());
                        }
                        else {
                            //반납 실패
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
                        //로그인 확인
                        var signedId = logInSession.id;
                        database.deleteOneReservation(signedId, isbn).then(function (res) {
                            //예약 취소 진행
                            switch (res.status) {
                                case DB_CHANGED:
                                    //취소 완료
                                    resolve(loadReservedPage());
                                    break;
                                default:
                                    //취소 실패
                                    reject(409);
                            }
                        });
                    }
                    else {
                        //로그아웃됨
                        reject(401);
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.doCancelReservation = doCancelReservation;
/* -------------------------------------- GET - load --------------------------------------  */
function loadSignPage() {
    //로그아웃
    logInSession = null;
    return loadFile("/index.html");
}
exports.loadSignPage = loadSignPage;
function loadAdminPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    getStat1().then(function (res1) {
                        //통계 1
                        getStat2().then(function (res2) {
                            //통계 2
                            getStat3().then(function (res3) {
                                //통계 3
                                if (res1 instanceof Array && res2 instanceof Array && res3 instanceof Array) {
                                    //통계 결과 조회 성공
                                    resolve(new classDomain_1.Responsable(200, adminTemplates_1.default(today, res1, res2, res3)));
                                }
                                else {
                                    //실패
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
function loadSearchPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.selectAllBook().then(function (res) {
                        //모든 도서 조회
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                //조회된 도서 반영하여 응답
                                resolve(new classDomain_1.Responsable(200, searchTemplate_1.default(res.rows, today)));
                                break;
                            case SELECT_NOTHING:
                                //도서 없음
                                resolve(new classDomain_1.Responsable(200, searchTemplate_1.default([], today)));
                                break;
                            default:
                                //조회 실패
                                reject(409);
                        }
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.loadSearchPage = loadSearchPage;
function loadPinfoPage() {
    if (logInSession instanceof classDomain_1.Customer) {
        //로그인 확인
        var _a = [logInSession.id, logInSession.name], signedId = _a[0], signedName = _a[1];
        //고객정보 변결창 응답
        return new classDomain_1.Responsable(200, pinfoTemplate_1.default(signedId, signedName, today));
    }
    else {
        //로그아웃됨
        return new classDomain_1.Responsable(401, "401 : Unauthorized");
    }
}
exports.loadPinfoPage = loadPinfoPage;
function loadRentedPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (logInSession instanceof classDomain_1.Customer) {
                        //로그인 확인
                        var _a = [logInSession.id, logInSession.name], signedId_4 = _a[0], signedName_2 = _a[1];
                        database.selectRentedBookById(signedId_4).then(function (res) {
                            //대여 도서 조회
                            switch (res.status) {
                                case SELECT_SOMETHING:
                                    //대여 도서 존재 - 반영하여 응답
                                    resolve(new classDomain_1.Responsable(200, rentedTemplate_1.default(signedId_4, signedName_2, res.rows, today)));
                                    break;
                                case SELECT_NOTHING:
                                    //대여 도서 존재하지 않음 - 없음으로 반영
                                    resolve(new classDomain_1.Responsable(200, rentedTemplate_1.default(signedId_4, signedName_2, [], today)));
                                    break;
                                default:
                                    //조회 실패
                                    reject(409);
                            }
                        });
                    }
                    else {
                        //로그아웃됨
                        reject(401);
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.loadRentedPage = loadRentedPage;
function loadReservedPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (logInSession instanceof classDomain_1.Customer) {
                        //로그인 확인
                        var _a = [logInSession.id, logInSession.name], signedId_5 = _a[0], signedName_3 = _a[1];
                        database.selectReservedBookById(signedId_5).then(function (res) {
                            //예약 도서 조회
                            switch (res.status) {
                                case SELECT_SOMETHING:
                                    //예약 도서 존재 - 반영하여 응답
                                    resolve(new classDomain_1.Responsable(200, reservedTemplate_1.default(signedId_5, signedName_3, res.rows, today)));
                                    break;
                                case SELECT_NOTHING:
                                    //존재하지 않음 - 반영하여 응답
                                    resolve(new classDomain_1.Responsable(200, reservedTemplate_1.default(signedId_5, signedName_3, [], today)));
                                    break;
                                default:
                                    //조회 실패
                                    reject(409);
                            }
                        });
                    }
                    else {
                        //로그아웃됨
                        reject(401);
                    }
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
exports.loadReservedPage = loadReservedPage;
function loadFile(filePath) {
    try {
        //파일 읽기 시도
        return new classDomain_1.Responsable(200, fs.readFileSync(ROOTDIR + filePath));
    }
    catch (error) {
        console.error(error);
        //파일 열기 실패
        return new classDomain_1.Responsable(404, "404 : Not Found");
    }
}
exports.loadFile = loadFile;
/* ------------------------------- INITIAL FUNCTIONS ------------------------------- */
function refreshDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (date !== today.getDate()) {
                        //날짜 변경
                        date = today.getDate();
                        //변경된 날짜 반영
                        database.selectAllExpBooks().then(function (res) {
                            //만료된 도서 조회
                            switch (res.status) {
                                case SELECT_SOMETHING:
                                    //만료 도서 존재
                                    for (var _i = 0, _a = res.rows; _i < _a.length; _i++) {
                                        var book = _a[_i];
                                        //모두 반납
                                        returnBook(String(book[0]), book[1]);
                                    }
                                    resolve(true);
                                    break;
                                case SELECT_NOTHING:
                                    //만료 도서 없음
                                    resolve(true);
                                    break;
                                default:
                                    //조회 실패
                                    reject("[" + today.getTime() + "] : DB Refresh Failure");
                            }
                        });
                    }
                    else {
                        //날짜 변경되지 않음
                        resolve(true);
                    }
                }).catch(function (reason) {
                    console.error(reason);
                    return false;
                })];
        });
    });
}
exports.refreshDB = refreshDB;
/* ------------------------------- LOCAL FUNCTIONS ------------------------------- */
function signUp(id, pw, name, email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.createCustomer(id, pw, name, email).then(function (res) {
                        //db에 접속해 사용자를 생성
                        switch (res.status) {
                            case DB_CHANGED:
                                resolve(loadFile("/index.html")); //성공
                                break;
                            default:
                                reject(409); //실패
                        }
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
function returnBook(isbn, title) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    database.createPreviousRental(isbn).then(function (creationResult) {
                        //이전 대여기록의 인스턴스 생성
                        switch (creationResult.status) {
                            case DB_CHANGED:
                                //생성성공
                                database.updateToReturned(isbn).then(function (updateResult) {
                                    //책 반납
                                    switch (updateResult.status) {
                                        case DB_CHANGED:
                                            //반납 성공
                                            getNextCustomer(isbn).then(function (email) {
                                                //다음 순번 고객의 email 조회
                                                switch (email) {
                                                    case "ERROR":
                                                        //실패
                                                        resolve(false);
                                                        break;
                                                    case "NOTHING":
                                                        //다음순번이 없음
                                                        resolve(true);
                                                        break;
                                                    default:
                                                        //다음순번에게 email전송
                                                        sendEmail(email, title).then(function () { return resolve(true); });
                                                }
                                            });
                                            break;
                                        default:
                                            //반납 실패
                                            resolve(false);
                                    }
                                });
                                break;
                            default:
                                //생성실패
                                resolve(false);
                        }
                    });
                })];
        });
    });
}
function modifyPinfo(id, pw, email, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.updatePinfo(id, pw, email).then(function (res) {
                        //개인정보 수정
                        switch (res.status) {
                            case DB_CHANGED:
                                //수정 성공
                                resolve(new classDomain_1.Responsable(200, pinfoTemplate_1.default(id, name, today)));
                                break;
                            default:
                                //수정 실패
                                reject(409);
                        }
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
function checkBookRentable(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectBookRentalInfoByIsbn(isbn).then(function (res) {
                        //도서 대여 정보 조회
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                //조회 성공
                                if (res.rows[0][0] === null && res.rows[0][1] === null && res.rows[0][2] === null && res.rows[0][3] === null) {
                                    //대여되지 않음
                                    resolve(RENTABLE);
                                }
                                else if (res.rows[0][0] !== null && res.rows[0][1] !== null && res.rows[0][2] !== null && res.rows[0][3] !== null) {
                                    //대여됨
                                    resolve(RENTED);
                                }
                                else {
                                    //DB이상
                                    resolve(DBERROR);
                                }
                                break;
                            default:
                                //조회 실패
                                resolve(DBERROR);
                        }
                    });
                })];
        });
    });
}
function checkAlreadyReserved(bookList, isbn) {
    //책 목록에서 책 하나씩 꺼내 isbn확인
    for (var _i = 0, bookList_1 = bookList; _i < bookList_1.length; _i++) {
        var book = bookList_1[_i];
        if (book[0] === isbn) {
            return true;
        }
    }
    return false;
}
function reserveBook(isbn, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.createReservation(id, isbn).then(function (res) {
                        //예약 기록 생성
                        switch (res.status) {
                            case DB_CHANGED:
                                //성공
                                resolve(loadSearchPage());
                                break;
                            default:
                                //실패
                                reject(409);
                        }
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
function rentBook(id, isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    database.updateToRented(id, isbn).then(function (res) {
                        //대여 진행
                        switch (res.status) {
                            case DB_CHANGED:
                                //성공
                                resolve(loadSearchPage());
                                break;
                            default:
                                //실패
                                reject(409);
                        }
                    });
                }).catch(function (err) { return errorHandler(err); })];
        });
    });
}
function getNextCustomer(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectEmailToSendByIsbn(isbn).then(function (res) {
                        //다음순번 이메일 조회
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                //다음 순번 존재
                                var email = res.rows[0][0];
                                resolve(email);
                                break;
                            case SELECT_NOTHING:
                                //다음 순번 없음
                                resolve("NOTHING");
                                break;
                            default:
                                //조회 실패
                                resolve("ERROR");
                        }
                    });
                })];
        });
    });
}
function sendEmail(email, bookTitle) {
    return __awaiter(this, void 0, void 0, function () {
        //보내는 함수
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
                                    subject: '[충남대 도서관] 예약 도서 대여 가능 알림',
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
    //에러 코드 응답
    switch (err) {
        case 401:
            return new classDomain_1.Responsable(401, "401 : Unauthorized");
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
                        //파싱된 쿼리로 조회
                        switch (res.status) {
                            case DB_CHANGED:
                                //조회 실패
                                resolve(new classDomain_1.DBForm(DBERROR, [[]], 0));
                                break;
                            case DBERROR:
                                //잘못된 쿼리 입력
                                resolve(new classDomain_1.DBForm(SELECT_NOTHING, [[]], 0));
                                break;
                            default:
                                //조회 성공
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
            //통계 1에 대한 결과 조회
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectStat1().then(function (res) {
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                resolve(res.rows);
                                break;
                            case SELECT_NOTHING:
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
            //통계 2에 대한 결과 조회
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectStat2().then(function (res) {
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                resolve(res.rows);
                                break;
                            case SELECT_NOTHING:
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
            //통계 2에 대한 결과 조회
            return [2 /*return*/, new Promise(function (resolve) {
                    database.selectStat3().then(function (res) {
                        switch (res.status) {
                            case SELECT_SOMETHING:
                                resolve(res.rows);
                                break;
                            case SELECT_NOTHING:
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
