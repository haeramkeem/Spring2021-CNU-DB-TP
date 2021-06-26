import * as d from '../module/dateModule';
import * as notice from '../module/alertModule'

const blankRow = `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;

function getSearchTemplate(resultRows: unknown[], today: Date, msg: string | undefined) {
    let buffer = ``;
    for(let oneRow of resultRows) {
        if(oneRow instanceof Array) {
            let [isbn, title, publisher, year, author] = oneRow;
            buffer += `<tr>
                <td>${isbn}</td>
                <td>${title}</td>
                <td>${publisher}</td>
                <td>${year}</td>
                <td>${author}</td>
                <td>
                    <form action="/rent" method="POST">
                        <input type="hidden" name="isbn" value="${isbn}">
                        <input class="small-button" type="submit" value="대여">
                    </form>
                    <form action="/reserve" method="POST">
                        <input type="hidden" name="isbn" value="${isbn}">
                        <input class="small-button" type="submit" value="예약">
                    </form>
                </td>
            </tr>`;
        }
    }
    for(let i = 0; i < 19 - resultRows.length; i++) {
        buffer += blankRow;
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
                    <a href="/page/search.html">
                        <h1>Chungnam Nat'l University Library</h1>
                    </a>
                </span>
            </header>
            <nav>
                <span class="center" id="date-box">
                    DAEJEON, ${d.week(today)}, ${d.month(today)} ${today.getDate()}, ${today.getFullYear()}
                </span>
                <span class="center" id="page-change-box">
                    <a class="ahover" href="/page/pinfo.html">My Page</a>
                </span>
            </nav>
            <main>
                <div class="main-container" id="search-container">
                    <form action="/searchbook" id="search-box" method="GET">
                        <div class="query-box" id="select-box">
                            <select class="no-appearance" name="type" id="">
                                <option value="title">TITLE</option>
                                <option value="publisher">PUBLISHER</option>
                                <option value="year">YEAR</option>
                                <option value="author">AUTHOR</option>
                                <option value="query">QUERY</option>
                            </select>
                        </div>
                        <div class="query-box" id="word-box">
                            <input class="no-appearance" type="text" name="keyword" value="">
                        </div>
                        <div class="query-box" id="submit-box">
                            <input class="no-appearance" type="submit" value="SEARCH">
                        </div>
                    </form>
                    <table class="result-box">
                        <thead>
                            <th>ISBN</th>
                            <th>TITLE</th>
                            <th>PUBLISHER</th>
                            <th>YEAR</th>
                            <th>AUTHOR</th>
                            <th>RENT & RESERVE</th>
                        </thead>
                        <tbody>
                            ${buffer}
                        </tbody>
                    </table>
                </div>
            </main>
            <footer>copyright©saltwalks2021</footer>
            ${notice.alert(msg)}
        </body>
        </html>
    `;
}

export default getSearchTemplate;