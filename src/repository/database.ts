import oracledb from 'oracledb';
import * as dbconfig from './dbconfig';
import {DBForm} from '../domain/classDomain';

/* -------------------------------- PREPROCESS -------------------------------- */
let connectedDatabase: oracledb.Connection; //연결된 db 저장
oracledb.autoCommit = dbconfig.AUTOCOMMIT; // 자동 커밋 설정
oracledb.getConnection(dbconfig.USER_INFO, (err: oracledb.DBError, conn: oracledb.Connection) => {
    if(err) {
        //연결 실패
        console.log("[Status] : Database Connection Failure");
    } else {
        //연결 성공
        connectedDatabase = conn;
        console.log("[Status] : Database Connection Success");
    }
});

/* -------------------------------- LOCAL FUNCTIONS -------------------------------- */
async function execQuery(query: string) {
    return new Promise<DBForm>((resolve, reject) => {
        if(typeof connectedDatabase === "undefined") {
            console.error("[Status] : Database Connection Lost")
        }
        connectedDatabase.execute<(string | number | Date)[]>(query, [], (err, res) => {
            //입력받은 SQL 실행
            if(err) {
                //실행 실패
                reject("[Status] : Database Query Execution Fail");
            } else if(!(res.rows instanceof Array)) {
                //db변경 SQL 일때
                if(typeof res.rowsAffected !== "number") {
                    //변경 실패
                    reject("[Status] : Database Query Execution Fail");
                } else {
                    //변경 성공
                    resolve(new DBForm(dbconfig.DB_CHANGED, [], res.rowsAffected));
                }
            } else if(res.rows.length === 0)  {
                //조회된 결과 없을 때
                resolve(new DBForm(dbconfig.SELECT_NOTHING, [], 0));
            } else {
                //조회된 결과 있을 때
                resolve(new DBForm(dbconfig.SELECT_SOMETHING, res.rows, 0));
            }
        });
    }).catch(dbErr => {
        //실행 실패 문구 + 결과 반환
        console.error(dbErr);
        return new DBForm(dbconfig.DB_ERROR, [], 0);
    });
}

/* -------------------------------- LOCAL FUNCTIONS -------------------------------- */
/* -------------------------------- SELECT -------------------------------- */
//sign process
export async function selectCustomerByIdPw(id: string, pw : string) {
    return execQuery(`
        SELECT cno, passwd, name, email
        FROM customer
        WHERE cno LIKE '${id}' AND passwd LIKE '${pw}'`);
}

export async function selectCustomerByIdEmail(id: string, email: string) {
    return execQuery(`
        SELECT * 
        FROM customer 
        WHERE cno LIKE '${id}' AND email LIKE '${email}'`);
}

//search books

export async function selectAllBook() {
    return execQuery(`
        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author)
        FROM ebook e JOIN authors a 
        ON e.isbn = a.isbn 
        GROUP BY e.isbn, e.title, e.publisher, e.year`);
}

export async function selectBookByOneColumn(column: string, value: string) {
    return execQuery(`
        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author)
        FROM ebook e JOIN authors a 
        ON e.isbn = a.isbn 
        WHERE e.${column} LIKE '${value}' 
        GROUP BY e.isbn, e.title, e.publisher, e.year`);
}

export async function selectBookByAuthor(author: string) {
    return execQuery(`
        SELECT e.isbn, e.title, e.publisher, e.year, a.author
        FROM ebook e JOIN authors a 
        ON e.isbn = a.isbn 
        WHERE a.author LIKE '${author}'`);
}

export async function selectBookByWhere(searchQuery: string) {
    return execQuery(`
        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author)
        FROM ebook e JOIN authors a 
        ON e.isbn = a.isbn 
        WHERE ${searchQuery}
        GROUP BY e.isbn, e.title, e.publisher, e.year, e.datedue`);
}

//

export async function selectRentedBookByIsbn(isbn: string) {
    return execQuery(`
        SELECT cno, exttimes, daterented, datedue
        FROM ebook 
        WHERE isbn LIKE '${isbn}'
        AND cno IS NOT NULL
        AND exttimes IS NOT NULL
        AND daterented IS NOT NULL
        AND datedue IS NOT NULL `);
}

export async function selectRentedBookById(id: string) {
    return execQuery(`
        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author), e.exttimes, e.daterented, e.datedue
        FROM ebook e JOIN authors a 
        ON e.isbn = a.isbn 
        WHERE e.cno LIKE '${id}' 
        GROUP BY e.isbn, e.title, e.publisher, e.year, e.exttimes, e.daterented, e.datedue `);
}

export async function selectReservedBookById(id: string) {
    return execQuery(`
        SELECT e.isbn, e.title, e.publisher, e.year, MAX(a.author) 
        FROM ebook e JOIN reservation r 
        ON e.isbn = r.isbn JOIN authors a ON e.isbn = a.isbn 
        WHERE r.cno LIKE '${id}' 
        GROUP BY e.isbn, e.title, e.publisher, e.year `);
}

//

export async function selectAllExpBooks() {
    return execQuery(`
        SELECT isbn, title
        FROM ebook
        WHERE TRUNC(ebook.datedue, 'dd') + 1 < SYSDATE`);
}

export async function selectNextCustomerByIsbn(isbn: string) {
    return execQuery(`
        SELECT c.email, c.cno
        FROM reservation r JOIN customer c 
        ON r.cno = c.cno 
        WHERE r.reservationtime = (
        SELECT MIN(r1.reservationtime) 
        FROM reservation r1 
        GROUP BY r1.isbn 
        HAVING r1.isbn LIKE '${isbn}') 
        AND r.isbn LIKE '${isbn}'`);
}

export async function selectCustomerByEmail(email: string) {
    return execQuery(`
        SELECT * 
        FROM customer 
        WHERE email LIKE '${email}'`);
}

export async function selectReservedBooksNotRented() {
    return execQuery(`
        SELECT p.isbn, e.title
        FROM previousrental p JOIN ebook e
        ON p.isbn = e.isbn
        WHERE e.cno IS NULL
        AND e.exttimes IS NULL
        AND e.daterented IS NULL
        AND e.datedue IS NULL
        AND (p.isbn, p.datereturned) IN (
        SELECT isbn, MAX(datereturned)
        FROM previousrental
        GROUP BY isbn
        HAVING TRUNC(MAX(datereturned), 'dd') + 1 < SYSDATE)`);
}

export async function selectStat1() {
    return execQuery(`
        SELECT COUNT(*)
        FROM PreviousRental p RIGHT OUTER JOIN Authors a
        ON p.isbn = a.isbn
        WHERE LENGTH(a.author) = 3 AND p.cno IS NOT NULL`);
}

export async function selectStat2() {
    return execQuery(`
        SELECT p.cno , COUNT(*)
        FROM PreviousRental p
        GROUP BY ROLLUP(p.cno)`);
}

export async function selectStat3() {
    return execQuery(`
        SELECT ROW_NUMBER() OVER(ORDER BY p.cno) "순번", c.*
        FROM PreviousRental p JOIN Customer c
        ON p.cno = c.cno`);
}

/* -------------------------------- UPDATE -------------------------------- */
export async function updateToRented(id: string, isbn: string) {
    return execQuery(`
        UPDATE ebook SET
        cno = ${id},
        exttimes = 0,
        daterented = SYSDATE,
        datedue = SYSDATE + 10
        WHERE isbn LIKE '${isbn}'`);
}

export async function updatePinfo(id: string, pw: string, email: string) {
    return execQuery(`
        UPDATE customer 
        SET 
        passwd = '${pw}', 
        email = '${email}' 
        WHERE cno LIKE '${id}'`);
}

export async function updateDateDue(isbn: string) {
    return execQuery(`
        UPDATE ebook SET
        exttimes = (
        SELECT exttimes
        FROM ebook
        WHERE isbn LIKE '${isbn}') + 1,
        datedue = (
        SELECT datedue
        FROM ebook
        WHERE isbn LIKE '${isbn}') + 10
        WHERE isbn LIKE '${isbn}'`);
}

export async function updateToReturned(isbn: string) {
    return execQuery(`
        UPDATE ebook SET 
        cno = NULL,
        exttimes = NULL, 
        daterented = NULL, 
        datedue = NULL
        WHERE isbn LIKE '${isbn}'`);
}

export async function createCustomer(id: string, pw: string, name: string, email: string) {
    return execQuery(`INSERT INTO Customer VALUES (${id}, '${name}', '${pw}', '${email}')`);
}

export async function createReservation(id: string, isbn: string) {
    return execQuery(`INSERT INTO reservation VALUES (${isbn}, ${id}, SYSDATE)`);
}

export async function createPreviousRental(isbn : string) {
    return execQuery(`
        INSERT INTO previousrental (isbn, daterented, datereturned, cno) (
        SELECT isbn, daterented, SYSDATE, cno
        FROM ebook
        WHERE isbn LIKE '${isbn}')`);
}

export async function deleteOneReservation(id: string, isbn: string) {
    return execQuery(`DELETE FROM reservation WHERE isbn LIKE '${isbn}' AND cno LIKE '${id}'`);
}

export async function deleteAllUnreservedBooks() {
    return execQuery(`
        DELETE FROM previousrental p JOIN ebook e
        ON p.isbn = e.isbn
        WHERE TRUNC(p.datereturned, 'dd') + 1 < SYSDATE
        AND e.cno IS NULL
        AND e.exttimes IS NULL
        AND e.daterented IS NULL
        AND e.datedue IS NULL`);
}