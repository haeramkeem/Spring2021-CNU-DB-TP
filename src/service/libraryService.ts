import * as fs from 'fs';
import * as database from '../repository/database';
import * as mailer from 'nodemailer';
import {Customer, SearchForm, Responsable, DBForm} from '../domain/classDomain';
import getSearchTemplate from '../template/searchTemplate';
import getPinfoTemplate from '../template/pinfoTemplate';
import getRentedTemplate from '../template/rentedTemplate';
import getReservedTemplate from '../template/reservedTemplate';
import getAdminTemplate from '../template/adminTemplates';

const ROOTDIR = "C:\\Users\\Host\\Desktop\\Spring2021-CNU-database-termproject-main\\dist";
const MAILER_SENDER = "haeram.kim1@gmail.com";
const MAILER_PASS = "revell1998115";
const RENTABLE = 0;
const RENTED = 1;
const DBERROR = 2;
const SELECT_SOMETHING = 0;
const SELECT_NOTHING = 1;
const DB_CHANGED = 3;
const ADMIN_ID = "201702004";
const ADMIN_PW = "111111";

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
            switch (res.status) {
                case SELECT_SOMETHING :
                    //로그인 성공
                    let [id, _, name, email] = res.rows[0];
                    if(typeof id === "number" && typeof name === "string" && typeof email === "string") {
                        //현재 사용자 정보 등록
                        logInSession = new Customer(String(id), "", name, email);
                        //도서검색창 이동
                        resolve(loadSearchPage());
                    }
                    break;
                case SELECT_NOTHING :
                    //로그인 실패
                    resolve(loadFile("/index.html"));
                    break;
                default :
                    //조회 실패
                    reject(409);
            }
        });
    }).catch(err => {
        return errorHandler(err);
    });
}

export async function doSignUp(customer: Customer) {
    return new Promise<Responsable>((resolve, reject) => {
        database.selectCustomerById(customer.id).then(res => {
            //id중복 조회
            switch (res.status) {
                case SELECT_SOMETHING :
                    //중복
                    resolve(loadFile("/page/signup.html"));
                    break;
                case SELECT_NOTHING :
                    //새로운 사용자 등록
                    resolve(signUp(customer.id, customer.pw, customer.name, customer.email));
                    break;
                default :
                    //조회 실패
                    reject(409);
            }
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
                return new Responsable(200, getSearchTemplate(res.rows, today));
            case SELECT_NOTHING :
                //조회된 도서 없음
                return new Responsable(200, getSearchTemplate([], today));
            default :
                //조회 실패
                return errorHandler(409);
        }
    });
}

export async function doRentBook(isbn: string) {
    return new Promise<Responsable>((resolve, reject) => {
        checkBookRentable(isbn).then(checkResult => {
            //책이 대여중인지 확인
            if(checkResult === RENTABLE) {
                //대여중이 아님
                if(logInSession instanceof Customer) {
                    //로그인 했음
                    let signedId = logInSession.id;
                    database.selectRentedBookById(signedId).then(res => {
                        //자신이 몇권 대여했는지 확인
                        switch (res.status) {
                            case SELECT_SOMETHING :
                                //대여한 도서가 있음
                                if(res.rows.length > 2) {
                                    //대여 가능 횟수 초과
                                    resolve(loadSearchPage());
                                } else {
                                    //대여 가능 횟수 이하 - 대여 진행
                                    resolve(rentBook(signedId, isbn));
                                }
                                break;
                            case SELECT_NOTHING :
                                //대여 기록 없음 - 대여 진행
                                resolve(rentBook(signedId, isbn));
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
            } else if(checkResult === RENTED) {
                //대여중 - 대여 불가능
                resolve(loadSearchPage());
            } else {
                //확인 실패
                reject(409);
            }
        });
    }).catch(err => errorHandler(err));
}

export async function doReserveBook(isbn: string, rentedBy: string) {
    return new Promise<Responsable>((resolve, reject) => {
        checkBookRentable(isbn).then(checkResult => {
            //대여중 확인
            if(checkResult === RENTABLE) {
                //대여 가능 - 예약 불가능
                resolve(loadSearchPage());
            } else if(checkResult === RENTED) {
                //대여중
                if(logInSession instanceof Customer) {
                    //로그인 확인
                    let signedId = logInSession.id;
                    if(rentedBy === signedId) {
                        //자신이 대여했음
                        resolve(loadSearchPage());
                    } else {
                        database.selectReservedBookById(signedId).then(res => {
                            //예약 기록 확인
                            switch (res.status) {
                                case SELECT_SOMETHING :
                                    //예약 기록 존재
                                    if(res.rows.length > 2) {
                                        //예약 가능 횟수 초과
                                        resolve(loadSearchPage());
                                    } else if(checkAlreadyReserved(res.rows, isbn)) {
                                        //이미 예약한 도서
                                        resolve(loadSearchPage());
                                    } else {
                                        //예약 가능
                                        resolve(reserveBook(isbn, signedId));
                                    }
                                    break;
                                case SELECT_NOTHING :
                                    //예약 기록 없음 - 예약 가능
                                    resolve(reserveBook(isbn, signedId));
                                    break;
                                default :
                                    //예약 기록 조회 실패
                                    reject(409);
                            }
                        });
                    }
                } else {
                    //로그아웃됨
                    reject(401);
                }
            } else {
                //대여가능 확인 실패
                reject(409);
            }
        });
    }).catch(err => errorHandler(err));
}

export async function doModifyPinfo(pw: string, email: string) {
    return new Promise<Responsable>((resolve, reject) => {
        if(logInSession instanceof Customer) {
            //로그인 확인
            let [signedId, signedName] = [logInSession.id, logInSession.name];
            database.selectCustomerByEmail(email).then(res => {
                //이메일 중복 확인
                switch (res.status) {
                    case SELECT_SOMETHING :
                        //이메일 중복
                        resolve(new Responsable(200, getPinfoTemplate(signedId, signedName, today)));
                        break;
                    case SELECT_NOTHING :
                        //중복되지 않음 - 변경
                        resolve(modifyPinfo(signedId, pw, email, signedName));
                        break;
                    default :
                        //중복 확인 실패
                        reject(409);
                }
            });
        } else {
            //로그아웃됨
            reject(401);
        }
    }).catch(err => errorHandler(err));
}

export async function doExtendDue(isbn: string, exttimes: string) {
    console.log(exttimes);
    
    return new Promise<Responsable>((resolve, reject) => {
        if(logInSession instanceof Customer) {
            //로그인 확인
            if(Number(exttimes) < 2) {
                //연장횟수 조회
                database.selectReservedBookByIsbn(isbn).then(res => {
                    //해당 도서 예약 기록 조회
                    switch (res.status) {
                        case SELECT_SOMETHING :
                            //예약 기록 존재 - 연장 기각
                            console.log(1);
                            
                            resolve(loadRentedPage());
                            break;
                        case SELECT_NOTHING :
                            //예약 기록 없음
                            database.updateDateDue(isbn).then(res => {
                                //연장 진행
                                switch (res.status) {
                                    case DB_CHANGED :
                                        //연장 성공 - 반영된 결과 응답
                                        resolve(loadRentedPage());
                                        break;
                                    default :
                                        //연장 실패
                                        reject(409);
                                }
                            });
                            break;
                        default :
                            //예약 기록 확인 실패
                            reject(409);
                    }
                });
            } else {
                //연장 횟수 초과 - 기각
                console.log(2);
                resolve(loadRentedPage());
            }
        } else {
            //로그아웃됨
            reject(401);
        }
    }).catch(err => errorHandler(err));
}

export async function doReturnBook(isbn: string, title: string) {
    return new Promise<Responsable>((resolve, reject) => {
        returnBook(isbn, title).then(returnedNormally => {
            //반납 진행
            if(returnedNormally) {
                //반납 성공 - 반영된 대여도서 검색창 응답
                resolve(loadRentedPage());
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
                        resolve(loadReservedPage());
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
export function loadSignPage() {
    //로그아웃
    logInSession = null;
    return loadFile("/index.html");
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

export async function loadSearchPage() {
    return new Promise<Responsable>((resolve, reject) => {
        database.selectAllBook().then(res => {
            //모든 도서 조회
            switch (res.status) {
                case SELECT_SOMETHING :
                    //조회된 도서 반영하여 응답
                    resolve(new Responsable(200, getSearchTemplate(res.rows, today)));
                    break;
                case SELECT_NOTHING :
                    //도서 없음
                    resolve(new Responsable(200, getSearchTemplate([], today)));
                    break;
                default :
                    //조회 실패
                    reject(409);
            }
        });
    }).catch(err => errorHandler(err));
}

export function loadPinfoPage() {
    if(logInSession instanceof Customer) {
        //로그인 확인
        let [signedId, signedName] = [logInSession.id, logInSession.name];
        //고객정보 변결창 응답
        return new Responsable(200, getPinfoTemplate(signedId, signedName, today));
    } else {
        //로그아웃됨
        return new Responsable(401, "401 : Unauthorized");
    }
}

export async function loadRentedPage() {
    return new Promise<Responsable>((resolve, reject) => {
        if(logInSession instanceof Customer) {
            //로그인 확인
            let [signedId, signedName] = [logInSession.id, logInSession.name];
            database.selectRentedBookById(signedId).then(res => {
                //대여 도서 조회
                switch (res.status) {
                    case SELECT_SOMETHING :
                        //대여 도서 존재 - 반영하여 응답
                        resolve(new Responsable(200, getRentedTemplate(signedId, signedName, res.rows, today)));
                        break;
                    case SELECT_NOTHING :
                        //대여 도서 존재하지 않음 - 없음으로 반영
                        resolve(new Responsable(200, getRentedTemplate(signedId, signedName, [], today)));
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

export async function loadReservedPage() {
    return new Promise<Responsable>((resolve, reject) => {
        if(logInSession instanceof Customer) {
            //로그인 확인
            let [signedId, signedName] = [logInSession.id, logInSession.name];
            database.selectReservedBookById(signedId).then(res => {
                //예약 도서 조회
                switch (res.status) {
                    case SELECT_SOMETHING :
                        //예약 도서 존재 - 반영하여 응답
                        resolve(new Responsable(200, getReservedTemplate(signedId, signedName, res.rows, today)));
                        break;
                    case SELECT_NOTHING :
                        //존재하지 않음 - 반영하여 응답
                        resolve(new Responsable(200, getReservedTemplate(signedId, signedName, [], today)));
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
        return new Responsable(200, fs.readFileSync(ROOTDIR + filePath));
    } catch (error) {
        console.error(error);
        //파일 열기 실패
        return new Responsable(404, "404 : Not Found");
    }
}

/* ------------------------------- INITIAL FUNCTIONS ------------------------------- */

export async function refreshDB() {
    return new Promise<boolean>((resolve, reject) => {
        if(date !== today.getDate()) {
            //날짜 변경
            date = today.getDate();
            //변경된 날짜 반영
            database.selectAllExpBooks().then(res => {
                //만료된 도서 조회
                switch (res.status) {
                    case SELECT_SOMETHING :
                        //만료 도서 존재
                        for(let book of res.rows) {
                            //모두 반납
                            returnBook(String(book[0]), book[1] as string);
                        }
                        resolve(true);
                        break;
                    case SELECT_NOTHING :
                        //만료 도서 없음
                        resolve(true);
                        break;
                    default :
                        //조회 실패
                        reject(`[${today.getTime()}] : DB Refresh Failure`);
                }
            });
        } else {
            //날짜 변경되지 않음
            resolve(true);
        }
    }).catch(reason => {
        console.error(reason);
        return false;
    });
}

/* ------------------------------- LOCAL FUNCTIONS ------------------------------- */

async function signUp(id: string, pw: string, name: string, email: string) {
    return new Promise<Responsable>((resolve, reject) => {
        database.createCustomer(id, pw, name, email).then(res => {
            //db에 접속해 사용자를 생성
            switch (res.status) {
                case DB_CHANGED :
                    resolve(loadFile("/index.html")); //성공
                    break;
                default :
                    reject(409); //실패
            }
        });
    }).catch(err => errorHandler(err));
}

async function returnBook(isbn: string, title: string) {
    return new Promise<boolean>(resolve => {
        database.createPreviousRental(isbn).then(creationResult => {
            //이전 대여기록의 인스턴스 생성
            switch (creationResult.status) {
                case DB_CHANGED :
                    //생성성공
                    database.updateToReturned(isbn).then(updateResult => {
                        //책 반납
                        switch (updateResult.status) {
                            case DB_CHANGED :
                                //반납 성공
                                getNextCustomer(isbn).then(email => {
                                    //다음 순번 고객의 email 조회
                                    switch (email) {
                                        case "ERROR" :
                                            //실패
                                            resolve(false);
                                            break;
                                        case "NOTHING" :
                                            //다음순번이 없음
                                            resolve(true);
                                            break;
                                        default :
                                            //다음순번에게 email전송
                                            sendEmail(email, title).then(() => resolve(true));
                                    }
                                });
                                break;
                            default :
                                //반납 실패
                                resolve(false);
                        }
                    });
                    break;
                default :
                    //생성실패
                    resolve(false);
            }
        })
    });
}

async function modifyPinfo(id: string, pw: string, email: string, name: string) {
    return new Promise<Responsable>((resolve, reject) => {
        database.updatePinfo(id, pw, email).then(res => {
            //개인정보 수정
            switch (res.status) {
                case DB_CHANGED :
                    //수정 성공
                    resolve(new Responsable(200, getPinfoTemplate(id, name, today)));
                    break;
                default :
                    //수정 실패
                    reject(409);
            }
        });
    }).catch(err => errorHandler(err));
}

async function checkBookRentable(isbn: string) {
    return new Promise<number>(resolve => {
        database.selectBookRentalInfoByIsbn(isbn).then(res => {
            //도서 대여 정보 조회
            switch (res.status) {
                case SELECT_SOMETHING :
                    //조회 성공
                    if(res.rows[0][0] === null && res.rows[0][1] === null && res.rows[0][2] === null && res.rows[0][3] === null) {
                        //대여되지 않음
                        resolve(RENTABLE);
                    } else if(res.rows[0][0] !== null && res.rows[0][1] !== null && res.rows[0][2] !== null && res.rows[0][3] !== null) {
                        //대여됨
                        resolve(RENTED);
                    } else {
                        //DB이상
                        resolve(DBERROR);
                    }
                    break;
                default :
                    //조회 실패
                    resolve(DBERROR);
            }
        });
    });
}

function checkAlreadyReserved(bookList: unknown[][], isbn: string): boolean {
    //책 목록에서 책 하나씩 꺼내 isbn확인
    for(let book of bookList) {
        if(book[0] === isbn) {
            return true;
        }
    }
    return false;
}

async function reserveBook(isbn : string, id: string) {
    return new Promise<Responsable>((resolve, reject) => {
        database.createReservation(id, isbn).then(res => {
            //예약 기록 생성
            switch (res.status) {
                case DB_CHANGED :
                    //성공
                    resolve(loadSearchPage());
                    break;
                default :
                    //실패
                    reject(409);
            }
        })
    }).catch(err => errorHandler(err));
}

async function rentBook(id: string, isbn: string) {
    return new Promise<Responsable> ((resolve, reject) => {
        database.updateToRented(id, isbn).then(res => {
            //대여 진행
            switch (res.status) {
                case DB_CHANGED :
                    //성공
                    resolve(loadSearchPage());
                    break;
                default :
                    //실패
                    reject(409);
            }
        });
    }).catch(err => errorHandler(err));
}

async function getNextCustomer(isbn: string) {
    return new Promise<string>(resolve => {
        database.selectEmailToSendByIsbn(isbn).then(res => {
            //다음순번 이메일 조회
            switch (res.status) {
                case SELECT_SOMETHING :
                    //다음 순번 존재
                    let email = res.rows[0][0] as string;
                    resolve(email);
                    break;
                case SELECT_NOTHING :
                    //다음 순번 없음
                    resolve("NOTHING");
                    break;
                default :
                    //조회 실패
                    resolve("ERROR");
            }
        });
    })
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
            return new Responsable(401, "401 : Unauthorized");
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
                    resolve(new DBForm(DBERROR, [[]], 0));
                    break;
                case DBERROR :
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
