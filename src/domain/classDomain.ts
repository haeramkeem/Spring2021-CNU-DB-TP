export class Responsable {
    constructor(status: number, data: string | Buffer) {
        this.status = status;
        this.data = data;
    }
    status: number; //http status
    data: string | Buffer; //응답 데이터
};

export class Customer {
    constructor(id: string, pw: string, name: string, email: string) {
        this.id = id;
        this.pw = pw;
        this.name = name;
        this.email = email;
    }
    id: string; //고객 id
    pw: string; //고객 pw
    name: string; //고객 이름
    email: string; //고객 이메일
};

export class SearchForm {
    constructor(type: string, keyword: string) {
        this.type = type;
        this.keyword =keyword;
    }
    type: string; //도서 검색 종료
    keyword: string; //검색어
}

export class DBForm {
    constructor(status : number, rows: (string | number | Date)[][], affected: number) {
        this.status = status;
        this.rows = rows
        this.affected = affected;
    }
    status : number; //db접근 결과 코드 [0:결과 존재, 1:존재하지 않음, 2:db변경, 3수행 실패]
    rows: (string | number | Date)[][]; //db접근 결과
    affected: number; //db변경시 영향받은 인스턴스의 갯수
}