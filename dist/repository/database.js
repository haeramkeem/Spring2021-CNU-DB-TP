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
exports.deleteOneReservation = exports.createPreviousRental = exports.createReservation = exports.createCustomer = exports.updateToReturned = exports.updateDateDue = exports.updatePinfo = exports.updateToRented = exports.selectStat3 = exports.selectStat2 = exports.selectStat1 = exports.selectReservedBookByIsbn = exports.selectCustomerByEmail = exports.selectEmailToSendByIsbn = exports.selectAllExpBooks = exports.selectReservedBookById = exports.selectRentedBookById = exports.selectBookRentalInfoByIsbn = exports.selectBookByWhere = exports.selectBookByAuthor = exports.selectCustomerById = exports.selectBookByOneColumn = exports.selectAllBook = exports.selectCustomerByIdPw = void 0;
var oracledb_1 = __importDefault(require("oracledb"));
var dbconfig = __importStar(require("./dbconfig"));
var classDomain_1 = require("../domain/classDomain");
/* -------------------------------- PREPROCESS -------------------------------- */
var connectedDatabase; //연결된 db 저장
oracledb_1.default.autoCommit = dbconfig.AUTOCOMMIT; // 자동 커밋 설정
oracledb_1.default.getConnection(dbconfig.USER_INFO, function (err, conn) {
    if (err) {
        //연결 실패
        console.log("[Status] : Database Connection Failure");
    }
    else {
        //연결 성공
        connectedDatabase = conn;
        console.log("[Status] : Database Connection Success");
    }
});
/* -------------------------------- LOCAL FUNCTIONS -------------------------------- */
function execQuery(query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    connectedDatabase.execute(query, [], function (err, res) {
                        //입력받은 SQL 실행
                        if (err) {
                            //실행 실패
                            reject("[Status] : Database Query Execution Fail");
                        }
                        else if (!(res.rows instanceof Array)) {
                            //db변경 SQL 일때
                            if (typeof res.rowsAffected !== "number") {
                                //변경 실패
                                reject("[Status] : Database Query Execution Fail");
                            }
                            else {
                                //변경 성공
                                resolve(new classDomain_1.DBForm(3, [[]], res.rowsAffected));
                            }
                        }
                        else if (res.rows.length === 0) {
                            //조회된 결과 없을 때
                            resolve(new classDomain_1.DBForm(1, [[]], 0));
                        }
                        else {
                            //조회된 결과 있을 때
                            resolve(new classDomain_1.DBForm(0, res.rows, 0));
                        }
                    });
                }).catch(function (dbErr) {
                    //실행 실패 문구 + 결과 반환
                    console.error(dbErr);
                    return new classDomain_1.DBForm(2, [[]], 0);
                })];
        });
    });
}
/* -------------------------------- LOCAL FUNCTIONS -------------------------------- */
/* -------------------------------- SELECT -------------------------------- */
function selectCustomerByIdPw(id, pw) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT cno, passwd, name, email\n        FROM customer\n        WHERE cno LIKE '" + id + "' AND passwd LIKE '" + pw + "'")];
        });
    });
}
exports.selectCustomerByIdPw = selectCustomerByIdPw;
function selectAllBook() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author), e.cno\n        FROM ebook e JOIN authors a \n        ON e.isbn = a.isbn \n        GROUP BY e.isbn, e.title, e.publisher, e.year, e.cno ")];
        });
    });
}
exports.selectAllBook = selectAllBook;
function selectBookByOneColumn(column, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author), e.cno\n        FROM ebook e JOIN authors a \n        ON e.isbn = a.isbn \n        WHERE e." + column + " LIKE '" + value + "' \n        GROUP BY e.isbn, e.title, e.publisher, e.year, e.cno")];
        });
    });
}
exports.selectBookByOneColumn = selectBookByOneColumn;
function selectCustomerById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT * \n        FROM customer \n        WHERE cno LIKE '" + id + "'")];
        });
    });
}
exports.selectCustomerById = selectCustomerById;
function selectBookByAuthor(author) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT e.isbn, e.title, e.publisher, e.year, a.author, e.cno\n        FROM ebook e JOIN authors a \n        ON e.isbn = a.isbn \n        WHERE a.author LIKE '" + author + "'")];
        });
    });
}
exports.selectBookByAuthor = selectBookByAuthor;
function selectBookByWhere(searchQuery) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author), e.cno\n        FROM ebook e JOIN authors a \n        ON e.isbn = a.isbn \n        WHERE " + searchQuery + "\n        GROUP BY e.isbn, e.title, e.publisher, e.year, e.datedue, e.cno")];
        });
    });
}
exports.selectBookByWhere = selectBookByWhere;
function selectBookRentalInfoByIsbn(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT cno, exttimes, daterented, datedue\n        FROM ebook \n        WHERE isbn LIKE '" + isbn + "'")];
        });
    });
}
exports.selectBookRentalInfoByIsbn = selectBookRentalInfoByIsbn;
function selectRentedBookById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author), e.exttimes, e.daterented, e.datedue\n        FROM ebook e JOIN authors a \n        ON e.isbn = a.isbn \n        WHERE e.cno LIKE '" + id + "' \n        GROUP BY e.isbn, e.title, e.publisher, e.year, e.exttimes, e.daterented, e.datedue ")];
        });
    });
}
exports.selectRentedBookById = selectRentedBookById;
function selectReservedBookById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author) \n        FROM ebook e JOIN reservation r \n        ON e.isbn = r.isbn JOIN authors a ON e.isbn = a.isbn \n        WHERE r.cno LIKE '" + id + "' \n        GROUP BY e.isbn, e.title, e.publisher, e.year ")];
        });
    });
}
exports.selectReservedBookById = selectReservedBookById;
function selectAllExpBooks() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT isbn, title\n        FROM ebook\n        WHERE ebook.datedue < SYSDATE")];
        });
    });
}
exports.selectAllExpBooks = selectAllExpBooks;
function selectEmailToSendByIsbn(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT c.email \n        FROM reservation r JOIN customer c \n        ON r.cno = c.cno \n        WHERE r.reservationtime = (\n        SELECT MIN(r1.reservationtime) \n        FROM reservation r1 \n        GROUP BY r1.isbn \n        HAVING r1.isbn LIKE '" + isbn + "') \n        AND r.isbn LIKE '" + isbn + "'")];
        });
    });
}
exports.selectEmailToSendByIsbn = selectEmailToSendByIsbn;
function selectCustomerByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT * \n        FROM customer \n        WHERE email LIKE '" + email + "'")];
        });
    });
}
exports.selectCustomerByEmail = selectCustomerByEmail;
function selectReservedBookByIsbn(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT *\n        FROM reservation\n        WHERE isbn LIKE '" + isbn + "'")];
        });
    });
}
exports.selectReservedBookByIsbn = selectReservedBookByIsbn;
function selectStat1() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT COUNT(*)\n        FROM PreviousRental p RIGHT OUTER JOIN Authors a\n        ON p.isbn = a.isbn\n        WHERE LENGTH(a.author) = 3 AND p.cno IS NOT NULL")];
        });
    });
}
exports.selectStat1 = selectStat1;
function selectStat2() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT p.cno , COUNT(*)\n        FROM PreviousRental p\n        GROUP BY ROLLUP(p.cno)")];
        });
    });
}
exports.selectStat2 = selectStat2;
function selectStat3() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        SELECT ROW_NUMBER() OVER(ORDER BY p.cno) \"\uC21C\uBC88\", c.*\n        FROM PreviousRental p JOIN Customer c\n        ON p.cno = c.cno")];
        });
    });
}
exports.selectStat3 = selectStat3;
/* -------------------------------- UPDATE -------------------------------- */
function updateToRented(id, isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        UPDATE ebook SET\n        cno = " + id + ",\n        exttimes = 0,\n        daterented = SYSDATE,\n        datedue = SYSDATE + 10\n        WHERE isbn LIKE '" + isbn + "'")];
        });
    });
}
exports.updateToRented = updateToRented;
function updatePinfo(id, pw, email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        UPDATE customer \n        SET \n        passwd = '" + pw + "', \n        email = '" + email + "' \n        WHERE cno LIKE '" + id + "'")];
        });
    });
}
exports.updatePinfo = updatePinfo;
function updateDateDue(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        UPDATE ebook SET\n        exttimes = (\n        SELECT exttimes\n        FROM ebook\n        WHERE isbn LIKE '" + isbn + "') + 1,\n        datedue = (\n        SELECT datedue\n        FROM ebook\n        WHERE isbn LIKE '" + isbn + "') + 10\n        WHERE isbn LIKE '" + isbn + "'")];
        });
    });
}
exports.updateDateDue = updateDateDue;
function updateToReturned(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        UPDATE ebook SET \n        cno = NULL,\n        exttimes = NULL, \n        daterented = NULL, \n        datedue = NULL\n        WHERE isbn LIKE '" + isbn + "'")];
        });
    });
}
exports.updateToReturned = updateToReturned;
function createCustomer(id, pw, name, email) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("INSERT INTO Customer VALUES (" + id + ", '" + name + "', '" + pw + "', '" + email + "')")];
        });
    });
}
exports.createCustomer = createCustomer;
function createReservation(id, isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("INSERT INTO reservation VALUES (" + isbn + ", " + id + ", SYSDATE)")];
        });
    });
}
exports.createReservation = createReservation;
function createPreviousRental(isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("\n        INSERT INTO previousrental (isbn, daterented, datereturned, cno) (\n        SELECT isbn, daterented, SYSDATE, cno\n        FROM ebook\n        WHERE isbn LIKE '" + isbn + "')")];
        });
    });
}
exports.createPreviousRental = createPreviousRental;
function deleteOneReservation(id, isbn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, execQuery("DELETE FROM reservation WHERE isbn LIKE '" + isbn + "' AND cno LIKE '" + id + "'")];
        });
    });
}
exports.deleteOneReservation = deleteOneReservation;
