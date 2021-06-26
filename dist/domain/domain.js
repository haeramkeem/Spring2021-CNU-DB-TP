"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchForm = exports.Customer = exports.Responsable = void 0;
var Responsable = /** @class */ (function () {
    function Responsable(status, data) {
        this.status = status;
        this.data = data;
    }
    return Responsable;
}());
exports.Responsable = Responsable;
;
var Customer = /** @class */ (function () {
    function Customer(id, pw, name, email) {
        this.id = id;
        this.pw = pw;
        this.name = name;
        this.email = email;
    }
    return Customer;
}());
exports.Customer = Customer;
;
var SearchForm = /** @class */ (function () {
    function SearchForm(type, keyword) {
        this.type = type;
        this.keyword = keyword;
    }
    return SearchForm;
}());
exports.SearchForm = SearchForm;
