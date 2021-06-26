"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alert = void 0;
function alert(msg) {
    if (typeof msg === "string") {
        return "<script type=\"text/javascript\">alert(\"" + msg + "\")</script>";
    }
    else {
        return "";
    }
}
exports.alert = alert;
