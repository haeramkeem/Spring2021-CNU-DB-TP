import * as http from 'http';
import * as queryString from 'querystring';
import * as libraryService from "../service/libraryService";
import {Customer, SearchForm, Responsable} from '../domain/classDomain';

const baseUrl = "http://localhost:3000";

//수시로 날짜가 바뀌는걸 체크해 만료된 도서를 반납한다.
setInterval(libraryService.refreshDB, 60000);

function libraryController(request: http.IncomingMessage, response: http.ServerResponse) {
    if(request.method === "POST") {
        /**
         * 
         * POST 메소드 처리부
         * postHandler()로 요청의 query의 값을 얻어낸다.
         * 이후 query의 값의 타입을 체크해 service의 모듈을 호출하는 것으로 진행된다.
         * 응답을 얻어낸 다음에는 responseHandler()를 이용해 응답을 처리한다.
         * 
         */
        let reqUrl = request.url;
        if(reqUrl === "/signin") {
            //로그인 요청
            postHandler(request).then(handleResult => {
                let {id, pw} = handleResult;
                if(typeof id === "string" && typeof pw === "string") {
                    libraryService.doSignIn(new Customer(id, pw, "", "")).then(signInResult => {
                        responseHandler(response, signInResult);
                    });
                }
            })
        } else if(reqUrl === "/signup") {
            //회원가입 요청
            postHandler(request).then(handleResult => {
                let {id, pw, name, email} = handleResult;
                if(typeof id === "string" && typeof pw === "string" && typeof name === "string" && typeof email === "string") {
                    libraryService.doSignUp(new Customer(id, pw, name, email)).then(signUpResult => {
                        responseHandler(response, signUpResult);
                    });
                }
            });
        } else if(reqUrl === "/rent") {
            //대여요청
            postHandler(request).then(handleResult => {
                let {isbn} = handleResult;
                if(typeof isbn === "string") {
                    libraryService.doRentBook(isbn).then(rentResult => {
                        responseHandler(response, rentResult);
                    })
                }
            });
        } else if(reqUrl === "/reserve") {
            //예약요청
            postHandler(request).then(handleResult => {
                let {isbn} = handleResult;
                if(typeof isbn === "string") {
                    libraryService.doReserveBook(isbn).then(reserveResult => {
                        responseHandler(response, reserveResult);
                    })
                }
            });
        } else if(reqUrl === "/pinfo") {
            //개인정보 수정 요청
            postHandler(request).then(handleResult => {
                let {pw, email} = handleResult;
                if(typeof pw === "string" && typeof email === "string") {
                    libraryService.doModifyPinfo(pw, email).then(modifyResult => {
                        responseHandler(response, modifyResult);
                    })
                }
            });
        } else if(reqUrl === "/extend") {
            //기한 연장 요청
            postHandler(request).then(handleResult => {
                let {isbn, exttimes} = handleResult;
                if(typeof isbn === "string" && typeof exttimes === "string") {
                    libraryService.doExtendDue(isbn, exttimes).then(extendResult => {
                        responseHandler(response, extendResult);
                    })
                }
            });
        } else if(reqUrl === "/return") {
            //반납 요청
            postHandler(request).then(handleResult => {
                let {isbn, title} = handleResult;
                if(typeof isbn === "string" && typeof title === "string") {
                    libraryService.doReturnBook(isbn, title).then(returnResult => {
                        responseHandler(response, returnResult);
                    })
                }
            });
        } else if(reqUrl === "/cancel") {
            //예약 취소 요청
            postHandler(request).then(handleResult => {
                let {isbn} = handleResult;
                if(typeof isbn === "string") {
                    libraryService.doCancelReservation(isbn).then(cancelResult => {
                        responseHandler(response, cancelResult);
                    })
                }
            });
        }
    } else if(request.method === "GET") {
        /**
         * 
         * 
         * GET 메소드 처리
         * 도서 검색 결과를 조회할때를 제외하면 전부 특정 페이지의 요청에 대한 응답이다.
         * 마찬가지로 getHandler()함수를 통해 요청으로부터 path와 query를 분리하고
         * service의 모듈을 호출해 요청을 처리하는 순서로 이루어진다
         * 
         * 
         */
        let {path, query} = getHandler(request);
        if(path === "/searchbook") {
            let {type, keyword} = query; //query로부터 검색의 타입과 검색어를 추출
            if(typeof type === "string" && typeof keyword === "string") { //타입체크
                libraryService.doSearchBook(new SearchForm(type, keyword)).then(searchResult => {
                    responseHandler(response, searchResult);
                })
            }
        } else if(path === "/") {
            //로그인창 요청
            responseHandler(response, libraryService.loadSignPage());
        } else if(path === "/page/signup") {
            //개인정보수정창 요청
            responseHandler(response, libraryService.loadSignUpPage());
        } else if(path === "/page/pinfo") {
            //개인정보수정창 요청
            responseHandler(response, libraryService.loadPinfoPage());
        } else if(path === "/page/rent") {
            //도서대여 요청
            libraryService.loadRentedPage().then(page => {
                responseHandler(response, page);
            });
        } else if(path === "/page/reserve") {
            //도서예약창 요청
            libraryService.loadReservedPage().then(page => {
                responseHandler(response, page);
            });
        } else if(path === "/page/search") {
            //도서검색창 요청
            libraryService.loadSearchPage().then(page => {
                responseHandler(response, page);
            });
        } else {
            //기타 파일 요청
            responseHandler(response, libraryService.loadFile(path));
        }
    }
}

export default libraryController;

/* --------------------------------- Handlers --------------------------------- */

function responseHandler(response: http.ServerResponse, result: Responsable) {
    //응답을 전송하는 함수
    //HTTP Status를 적고
    //데이터를 보낸다
    response.writeHead(result.status);
    response.end(result.data);
}

async function postHandler(request: http.IncomingMessage) {
    //POST 메소드에서 query를 추출하는 함수
    let promise = new Promise<string>((resolve) => {
        request.on("data", (data) => {
            resolve("" + data);
        });
    });

    return queryString.parse(await promise);
}

function getHandler(request: http.IncomingMessage) {
    //GET 메소드에서 path와 query를 추출하는 함수
    let urlObject = new URL(baseUrl + request.url);
    return {
        path: urlObject.pathname,
        query: queryString.parse(urlObject.search.slice(1)),
    };
}