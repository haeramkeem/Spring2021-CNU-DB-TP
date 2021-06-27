export function week(today: Date) {
    //Date객체로 문자열 요일 변환
    // Sunday - Saturday : 0 - 6
    switch (today.getDay()) {
        case 0 :
            return "SUNDAY";
        case 1 :
            return "MONDAY";
        case 2 :
            return "TUESDAY";
        case 3 :
            return "WEDNESDAY";
        case 4 :
            return "THURSDAY";
        case 5 :
            return "FRIDAY";
        case 6 :
            return "SATURDAY";
    }
}

export function month(today: Date) {
    //Date객체로 문자열 월 변환
    switch (today.getMonth() + 1) {
        case 1 :
            return "JANUARY";
        case 2 :
            return "FABRUARY";
        case 3 :
            return "MARCH";
        case 4 :
            return "APRIL";
        case 5 :
            return "MAY";
        case 6 :
            return "JUNE";
        case 7 :
            return "JULY";
        case 8 :
            return "AUGUST";
        case 9 :
            return "SEPTEMBER";
        case 10 :
            return "OCTOBER";
        case 11 :
            return "NOVEMBER";
        case 12 :
            return "DECEMBER";
    }
}

export function dateToString(date: Date) {
    let year = String(date.getFullYear()); //문자열 년도
    let month = date.getMonth() + 1; //월
    let day = date.getDate(); //일
    const i2s = ((num: number) => (num < 10 ? `0${num}` : `${num}`)); //월, 일 문자열 변환 함수
    return year + i2s(month) + i2s(day);
}

export function getFullDate(today: Date) {
    return `${week(today)}, ${month(today)} ${today.getDate()}, ${today.getFullYear()}`
}