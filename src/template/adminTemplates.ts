import * as d from '../module/dateModule';

function getAdminTemplate(today: Date, count: unknown[], rentStat: unknown[], rankStat: unknown[]) {
    let rentAcc = ``;
    for(let rentRow of rentStat) {
        if(rentRow instanceof Array) {
            /* CLEAN - using map() */
            let [id, rentCount] = rentRow;
            if(id === null) {
                rentAcc += `<tr><td>합계</td><td>${rentCount}</td></tr>`;
            } else {
                rentAcc += `<tr><td>${id}</td><td>${rentCount}</td></tr>`;
            }
        }
    }
    let rankAcc = ``;
    for(let rankRow of rankStat) {
        if(rankRow instanceof Array) {
            let [rank, cno, name, pw, email] = rankRow;
            rankAcc += `<tr><td>${rank}</td><td>${cno}</td><td>${name}</td><td>${pw}</td><td>${email}</td></tr>`
        }
    }
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/style/search.css">
            <link rel="stylesheet" href="/style/font.css">
            <title>CNU Library</title>
        </head>
        <body>
            <header>
                <span class="center" id="logo-box">
                    <h1>Chungnam Nat'l University Library</h1>
                </span>
            </header>
            <nav>
                <span class="center" id="date-box">
                    DAEJEON, ${d.week(today)}, ${d.month(today)} ${today.getDate()}, ${today.getFullYear()}
                </span>
                <span class="center" id="page-change-box">
                    <a class="ahover" href="/index.html">Log Out</a>
                </span>
            </nav>
            <main>
                <div class="main-container" id="mypage-container">
                    <h1 id="container-title-box">Library Administration</h1>
                    <aside id="menu-box">
                        <div class="selected" id="info-box">Library Stats</div>
                    </aside>
                    <article id="article-box">
                        <h2 id="article-title-box">Library Stats</h2>
                        <div id="article-content-box">
                                <div>지금까지 빌려간 책들중 집필에 참여한 한국사람의 명수 : ${count[0]}</div>
                                <div class="stat">
                                    학번별 지금까지 몇권이나 대출해갔는지에 대한 횟수와 모든 학생들에 대한 총 대출 횟수
                                    <table class="result-box">
                                        <thead>
                                            <th>학번</th>
                                            <th>대여횟수</th>
                                        </thead>
                                        <tbody>${rentAcc}</tbody>
                                    </table>
                                </div>
                                <div class="stat">
                                    대여 학생 학번별 정렬
                                    <table class="result-box">
                                        <thead>
                                            <th>순위</th>
                                            <th>학번</th>
                                            <th>이름</th>
                                            <th>PW</th>
                                            <th>EMAIL</th>
                                        </thead>
                                        <tbody>${rankAcc}</tbody>
                                    </table>
                                </div>
                        </div>
                    </article>
                </div>
            </main>
            <footer>copyright©saltwalks2021</footer>
        </body>
        </html>
    `
}

export default getAdminTemplate;