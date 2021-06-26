import * as fs from 'fs';
import * as database from '../repository/database';
import * as mailer from 'nodemailer';
import {Customer, SearchForm, Responsable, DBForm} from '../domain/classDomain';
import { SELECT_SOMETHING, SELECT_NOTHING, DB_CHANGED, DB_ERROR } from '../repository/dbconfig';
import getSearchTemplate from '../template/searchTemplate';
import getPinfoTemplate from '../template/pinfoTemplate';
import getRentedTemplate from '../template/rentedTemplate';
import getReservedTemplate from '../template/reservedTemplate';
import getAdminTemplate from '../template/adminTemplates';
import getSignTemplate from '../template/signTemplate';
import getSignUpTemplate from '../template/signUpTemplate';

const ROOT_DIR = __dirname.replace("\\service", "");
const MAILER_SENDER = "haeram.kim1@gmail.com";
const MAILER_PASS = "revell1998115";
const ADMIN_ID = "201702004";
const ADMIN_PW = "111111";

const RESERVABLE = 0;
const OVER_RESERVE = 1;
const USER_RESERVED = 2;

const ALL_BOOK = undefined;

/* -------------------------------------- GLOBAL VARIABLES --------------------------------------  */

let logInSession: Customer | null = null;
let date = 0;
let today = new Date();

/* -------------------------------------- GLOBAL FUNCTIONS --------------------------------------  */
/* -------------------------------------- POST --------------------------------------  */
export async function doSignIn(customer: Customer) {
    /* Sign In Progress */
    if(customer.id === ADMIN_ID && customer.pw === ADMIN_PW) {
        //관리자인지 확인
        return loadAdminPage();
    }
    return new Promise<Responsable>((resolve, reject) => {
        database.selectCustomerByIdPw(customer.id, customer.pw).then(res => {
            //id와 pw로 일치하는 고객 조회
            if(res.status === DB_ERROR || res.status === DB_CHANGED) {
                reject(409);
                return;
            } else if(res.status === SELECT_NOTHING) {
                resolve(loadSignPage("Wrong ID or PW"));
                return;
            }
            //사용자 정보 입력
            logInSession = new Customer(String(res.rows[0][0]), "", res.rows[0][2] as string, res.rows[0][3] as string);
            //도서검색창 이동
            resolve(loadSearchPage());
        });
    }).catch(err => errorHandler(err));
}

export async function doSignUp(customer: Customer) {
    return new Promise<Responsable>((resolve, reject) => {
        let {id, pw, name, email} = customer;
        if(id === "" || pw ==="" || name === "" || email === "") {
            return resolve(loadSignUpPage("Please Enter All Informations"));
        }
        database.selectCustomerByIdEmail(id, email).then(res => {
            //id, email중복 조회
            if(res.status === DB_ERROR || res.status === DB_CHANGED) {
                return reject(409);
            } else if(res.status === SELECT_SOMETHING) {
                return resolve(loadSignUpPage("ID or Email Already Exists"));
            }
            //새로운 사용자 등록
            database.createCustomer(id, pw, name, email).then(res => {
                //db에 접속해 사용자를 생성
                if(res.status === DB_CHANGED) {
                    resolve(loadSignPage("Sign Up Success"));
                } else {
                    reject(409);
                }
            });
        });
    }).catch(err => errorHandler(err));
}

export async function doSearchBook(query: SearchForm) {
    return new Promise<DBForm>(resolve => {
        if(query.type === "author") {
            //저자로 조회
            database.selectBookByAuthor(query.keyword).then(res => {
                resolve(res);
            });
        } else if(query.type === "query") {
            //퀴리로 조회
            searchBookByQuery(query.keyword).then(res => {
                resolve(res);
            })
        } else {
            //서명, 출판사, 발행년도로 조회
            database.selectBookByOneColumn(query.type, query.keyword).then(res => {
                resolve(res);
            });
        }
    }).then(res => {
        //조회 결과 처리
        switch (res.status) {
            case SELECT_SOMETHING :
                //조회 성공 - 반영해서 도서검색창 생성
                return loadSearchPage(res.rows);
            case SELECT_NOTHING :
                //조회된 도서 없음
                return loadSearchPage([]);
            default :
                //조회 실패
                return errorHandler(409);
        }
    });
}

export async function doRentBook(isbn: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(!(logInSession instanceof Customer)) {
            return reject(401);
        }
        let signedId = logInSession.id;
        database.selectRentedBookByIsbn(isbn).then(rentCheck => {
            //책이 대여중인지 확인
            if(rentCheck.status === DB_ERROR || rentCheck.status === DB_CHANGED) {
                return reject(409);
            } else if(rentCheck.status === SELECT_SOMETHING) {
                return resolve(loadSearchPage(ALL_BOOK, "Can\'t Rent : Already Rented By Someone"));
            }
            database.selectRentedBookById(signedId).then(res => {
                //자신이 몇권 대여했는지 확인
                if(res.status === DB_ERROR || res.status === DB_CHANGED) {
                    return reject(409);
                } else if(res.rows.length > 2) {
                    return resolve(loadSearchPage(ALL_BOOK, "Can\'t Rent : You Already Rented 3 Books"));
                }
                database.selectNextCustomerByIsbn(isbn).then(next => {
                    if(next.status === DB_ERROR || next.status === DB_CHANGED) {
                        return reject(409);
                    } else if(next.status === SELECT_SOMETHING) {
                        if(String(next.rows[0][1]) !== signedId) {
                            return resolve(loadSearchPage(ALL_BOOK, "Can\'t Rent : Reserved By Someone"));
                        } else {
                            database.deleteOneReservation(signedId, isbn);
                        }
                    }
                    database.updateToRented(signedId, isbn).then(res => {
                        //대여 진행
                        if(res.status === DB_CHANGED) {
                            resolve(loadSearchPage(ALL_BOOK, "Rent Success"));
                        } else {
                            reject(409);
                        }
                    });
                });
            });
        });
    }).catch(err => errorHandler(err));
}

export async function doReserveBook(isbn: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(!(logInSession instanceof Customer)) {
            reject(401);
            return;
        }
        let signedId = logInSession.id;
        database.selectRentedBookByIsbn(isbn).then(rentCheck => {
            if(rentCheck.status === DB_ERROR || rentCheck.status === DB_CHANGED) {
                reject(409);
                return;
            } else if(rentCheck.status === SELECT_NOTHING) {
                resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Can Rent"));
                return;
            } else if(String(rentCheck.rows[0][0]) === signedId) {
                resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Already Rent"));
                return;
            }
            checkUserReservable(signedId, isbn).then(userCheck => {
                if(userCheck === DB_ERROR) {
                    reject(409);
                    return;
                } else if(userCheck === OVER_RESERVE) {
                    resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Reserved 3 Books"));
                    return;
                } else if(userCheck === USER_RESERVED) {
                    resolve(loadSearchPage(ALL_BOOK, "Can\'t Reserve : You Already Reserved"));
                    return;
                }
                database.createReservation(signedId, isbn).then(res => {
                    //예약 기록 생성
                    if(res.status === DB_CHANGED) {
                        resolve(loadSearchPage(ALL_BOOK, "Reserve Success"));
                    } else {
                        reject(409);
                    }
                });
            });
        });
    }).catch(err => errorHandler(err));
}

export async function doModifyPinfo(pw: string, email: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(!(logInSession instanceof Customer)) {
            //로그인 확인
            return reject(401);
        }
        let signedId = logInSession.id;
        if(pw === "" || email === "") {
            return resolve(loadPinfoPage("Please Enter All Information"));
        }
        database.selectCustomerByEmail(email).then(res => {
            //이메일 중복 확인
            if(res.status === DB_ERROR || res.status === DB_CHANGED) {
                return reject(409);
            } else if(res.status === SELECT_SOMETHING) {
                return resolve(loadPinfoPage("Email Already Used"));
            }
            database.updatePinfo(signedId, pw, email).then(res => {
                //개인정보 수정
                if(res.status === DB_CHANGED) {
                    resolve(loadPinfoPage("Modify Personal Information Success"));
                } else {
                    reject(409);
                }
            });
        });
    }).catch(err => errorHandler(err));
}

export async function doExtendDue(isbn: string, exttimes: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(!(logInSession instanceof Customer)) {
            //로그인 확인
            return reject(401);
        } else if(Number(exttimes) >= 2) {
            //연장횟수 조회
            return resolve(loadRentedPage("Can\'t Extend : Already Extend Twice"))
        }
        database.selectNextCustomerByIsbn(isbn).then(next => {
            if(next.status === DB_ERROR || next.status === DB_CHANGED) {
                return reject(409);
            } else if(next.status === SELECT_SOMETHING) {
                return resolve(loadRentedPage("Can\' Extend : Reserved By Someone"));
            }
            database.updateDateDue(isbn).then(res => {
                //연장 진행
                if(res.status === DB_CHANGED) {
                    resolve(loadRentedPage("Extend Sucess"));
                } else {
                    reject(409);
                }
            });
        });
    }).catch(err => errorHandler(err));
}

export async function doReturnBook(isbn: string, title: string) {
    return new Promise<Responsable>((resolve, reject) => {
        returnBook(isbn, title).then(returnedNormally => {
            //반납 진행
            if(returnedNormally) {
                //반납 성공 - 반영된 대여도서 검색창 응답
                resolve(loadRentedPage("Returned Successfully"));
            } else {
                //반납 실패
                reject(409);
            }
        })
    }).catch(err => errorHandler(err));
}

export async function doCancelReservation(isbn: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(logInSession instanceof Customer) {
            //로그인 확인
            let signedId = logInSession.id;
            database.deleteOneReservation(signedId, isbn).then(res => {
                //예약 취소 진행
                switch (res.status) {
                    case DB_CHANGED :
                        //취소 완료
                        resolve(loadReservedPage("Canceling Reservation Success"));
                        break;
                    default :
                        //취소 실패
                        reject(409);
                }
            })
        } else {
            //로그아웃됨
            reject(401);
        }
    }).catch(err => errorHandler(err));
}

/* -------------------------------------- GET - load --------------------------------------  */
export function loadSignPage(msg?: string) {
    //로그아웃
    logInSession = null;
    return new Responsable(200, getSignTemplate(msg));
}

export function loadSignUpPage(msg?: string) {
    return new Responsable(200, getSignUpTemplate(msg))
}

export async function loadAdminPage() {
    return new Promise<Responsable>((resolve, reject) => {
        getStat1().then(res1 => {
            //통계 1
            getStat2().then(res2 => {
                //통계 2
                getStat3().then(res3 => {
                    //통계 3
                    if(res1 instanceof Array && res2 instanceof Array && res3 instanceof Array) {
                        //통계 결과 조회 성공
                        resolve(new Responsable(200, getAdminTemplate(today, res1, res2, res3)))
                    } else {
                        //실패
                        reject(409);
                    }
                });
            });
        });
    }).catch(err => errorHandler(err));
}

export async function loadSearchPage(books?: unknown[], msg?: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(typeof books === "undefined") {
            database.selectAllBook().then(res => {
                //모든 도서 조회
                switch (res.status) {
                    case SELECT_SOMETHING :
                    case SELECT_NOTHING :
                        //조회된 도서 반영하여 응답
                        resolve(new Responsable(200, getSearchTemplate(res.rows, today, msg)));
                        break;
                    default :
                        //조회 실패
                        reject(409);
                }
            });
        } else {
            resolve(new Responsable(200, getSearchTemplate(books, today, msg)));
        }
    }).catch(err => errorHandler(err));
}

export function loadPinfoPage(msg?: string) {
    if(logInSession instanceof Customer) {
        //로그인 확인
        let [signedId, signedName] = [logInSession.id, logInSession.name];
        //고객정보 변결창 응답
        return new Responsable(200, getPinfoTemplate(signedId, signedName, today, msg));
    } else {
        //로그아웃됨
        return new Responsable(401, "401 : Unauthorized");
    }
}

export async function loadRentedPage(msg?: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(logInSession instanceof Customer) {
            //로그인 확인
            let [signedId, signedName] = [logInSession.id, logInSession.name];
            database.selectRentedBookById(signedId).then(res => {
                //대여 도서 조회
                switch (res.status) {
                    case SELECT_SOMETHING :
                        //대여 도서 존재 - 반영하여 응답
                        resolve(new Responsable(200, getRentedTemplate(signedId, signedName, res.rows, today, msg)));
                        break;
                    case SELECT_NOTHING :
                        //대여 도서 존재하지 않음 - 없음으로 반영
                        resolve(new Responsable(200, getRentedTemplate(signedId, signedName, [], today, msg)));
                        break;
                    default :
                        //조회 실패
                        reject(409);
                }
            });
        } else {
            //로그아웃됨
            reject(401);
        }
    }).catch(err => errorHandler(err));
}

export async function loadReservedPage(msg?: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(logInSession instanceof Customer) {
            //로그인 확인
            let [signedId, signedName] = [logInSession.id, logInSession.name];
            database.selectReservedBookById(signedId).then(res => {
                //예약 도서 조회
                switch (res.status) {
                    case SELECT_SOMETHING :
                        //예약 도서 존재 - 반영하여 응답
                        resolve(new Responsable(200, getReservedTemplate(signedId, signedName, res.rows, today, msg)));
                        break;
                    case SELECT_NOTHING :
                        //존재하지 않음 - 반영하여 응답
                        resolve(new Responsable(200, getReservedTemplate(signedId, signedName, [], today, msg)));
                        break;
                    default :
                        //조회 실패
                        reject(409);
                }
            });
        } else {
            //로그아웃됨
            reject(401);
        }
    }).catch(err => errorHandler(err));
}

export function loadFile(filePath: string) {
    try {
        //파일 읽기 시도
        return new Responsable(200, fs.readFileSync(ROOT_DIR + filePath));
    } catch (error) {
        console.error(error);
        //파일 열기 실패
        return new Responsable(404, "404 : Not Found");
    }
}

/* ------------------------------- INITIAL FUNCTIONS ------------------------------- */

export async function refreshDB() {
    return new Promise<void>(() => {
        if(date !== today.getDate()) {
            //날짜 변경
            date = today.getDate();
            //변경된 날짜 반영
            returnExpiredBooks();
            cancelUnrentedReservation();
        }
    });
}

async function returnExpiredBooks() {
    return new Promise<void>(() => {
        database.selectAllExpBooks().then(res => {
            //만료된 도서 조회
            if(res.status === SELECT_SOMETHING) {
                for(let book of res.rows) {
                    //모두 반납
                    returnBook(String(book[0]), book[1] as string);
                }
            }
        });
    });
}

async function cancelUnrentedReservation() {
    return new Promise<void>(() => {
        database.selectReservedBooksNotRented().then(selectedBooks => {
            if(selectedBooks.status === SELECT_SOMETHING) {
                for(let book of selectedBooks.rows) {
                    let isbn = book[0] as string;
                    let title = book[1] as string;
                    database.selectNextCustomerByIsbn(isbn).then(selectedCustomer => {
                        if(selectedCustomer.status === SELECT_SOMETHING) {
                            let email = selectedCustomer.rows[0][0] as string;
                            let id = String(selectedCustomer.rows[0][1]);
                            database.deleteOneReservation(id, isbn);
                            sendEmail(email, title);
                        }
                    })
                }  
            }
        });
    })
}

/* ------------------------------- LOCAL FUNCTIONS ------------------------------- */

async function returnBook(isbn: string, title: string) {
    return new Promise<boolean>(resolve => {
        database.createPreviousRental(isbn).then(creationResult => {
            //이전 대여기록의 인스턴스 생성
            if(creationResult.status !== DB_CHANGED) {
                return resolve(false);
            }
            //생성성공
            database.updateToReturned(isbn).then(updateResult => {
                //책 반납
                if(updateResult.status !== DB_CHANGED) {
                    return resolve(false)
                }
                //반납 성공
                database.selectNextCustomerByIsbn(isbn).then(res => {
                    //다음순번 이메일 조회
                    if(res.status === SELECT_SOMETHING) {
                        sendEmail(res.rows[0][0] as string, title).then(() => resolve(true));
                    } else if(res.status === SELECT_NOTHING) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        })
    });
}

async function checkUserReservable(id: string, isbn: string) {
    return new Promise<number>(resolve => {
        database.selectReservedBookById(id).then(reserveCheck => {
            if(reserveCheck.status === DB_ERROR || reserveCheck.status === DB_CHANGED) {
                resolve(DB_ERROR);
            } else if(reserveCheck.status === SELECT_NOTHING) {
                resolve(RESERVABLE);
            } else if(reserveCheck.rows.length > 2) {
                resolve(OVER_RESERVE);
            } else {
                for(let book of reserveCheck.rows) {
                    if(book[0] === isbn) {
                        resolve(USER_RESERVED);
                        return;
                    }
                }
                resolve(RESERVABLE);
            }
        });
    });
}

async function sendEmail(email: string, bookTitle: string) {    
    //메세지 생성
    let mailContent = `
        안녕하세요. 충남대 도서관입니다.\n
        예약하신 도서 "${bookTitle}" 에 대해 해당 도서가 반납되어 대여 가능함을 알려드립니다.\n
        감사합니다.
    `;
    
    //보내는 함수
    async function send() {
        //송신자 설정
        let transporter = mailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
            user: MAILER_SENDER,
            pass: MAILER_PASS,
            },
        });
    
      //수신자, 제목, 내용 설정하고 송신
      let info = await transporter.sendMail({
        from: `"CNU Library" <${MAILER_SENDER}>`,
        to: email,
        subject: '[충남대 도서관] 예약 도서 대여 가능 알림',
        text: mailContent,
        html: `<b>${mailContent}</b>`,
      });

      console.log(`[${today.getTime()}] : Email Send : ${info.messageId}`);
    };
    
    send().catch(console.error);
}

function errorHandler(err: number) {
    //에러 코드 응답
    switch (err) {
        case 401 :
            return loadSignPage("Log out");
        case 409 :
            return new Responsable(409, "409 : Conflict");
        default :
            const PANIC = "f";
            console.error(PANIC);
            throw new Error(PANIC);
    }
}

async function searchBookByQuery(query: string) {
    //정규식으로 파싱
    let selectionQuery = query.replace(/=[(]/g, " like \'").replace(/[)]/g, "\'");
    return new Promise<DBForm>(resolve => {
        database.selectBookByWhere(selectionQuery).then(res => {
            //파싱된 쿼리로 조회
            switch (res.status) {
                case DB_CHANGED :
                    //조회 실패
                    resolve(new DBForm(DB_ERROR, [[]], 0));
                    break;
                case DB_ERROR :
                    //잘못된 쿼리 입력
                    resolve(new DBForm(SELECT_NOTHING, [[]], 0));
                    break;
                default :
                    //조회 성공
                    resolve(res);
            }
        });
    });
}

async function getStat1() {
    //통계 1에 대한 결과 조회
    return new Promise<unknown[] | number>(resolve => {
        database.selectStat1().then(res => {
            switch(res.status) {
                case SELECT_SOMETHING :
                    resolve(res.rows);
                    break;
                case SELECT_NOTHING :
                    resolve([]);
                    break;
                default :
                    resolve(409);
            }
        });
    });
}

async function getStat2() {
    //통계 2에 대한 결과 조회
    return new Promise<unknown[] | number>(resolve => {
        database.selectStat2().then(res => {
            switch(res.status) {
                case SELECT_SOMETHING :
                    resolve(res.rows);
                    break;
                case SELECT_NOTHING :
                    resolve([]);
                    break;
                default :
                    resolve(409);
            }
        });
    });
}

async function getStat3() {
    //통계 2에 대한 결과 조회
    return new Promise<unknown[] | number>(resolve => {
        database.selectStat3().then(res => {
            switch(res.status) {
                case SELECT_SOMETHING :
                    resolve(res.rows);
                    break;
                case SELECT_NOTHING :
                    resolve([]);
                    break;
                default :
                    resolve(409);
            }
        });
    });
}
