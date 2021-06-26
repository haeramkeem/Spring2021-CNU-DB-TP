import * as d from '../module/dateModule';

const BLANK_ROW = `<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;

function getRentedTemplate(id: string, name: string, resultRows: unknown[], today: Date) {
    let buffer = ``;
    for(let oneRow of resultRows) {
        if(oneRow instanceof Array) {
            /* CLEAN - using map() */
            let [isbn, title, publisher, year, author, exttimes, dateRented, dateDue] = oneRow;
            buffer += `
                <tr>
                    <td>${isbn}</td>
                    <td>${title}</td>
                    <td>${publisher}</td>
                    <td>${year}</td>
                    <td>${author}</td>
                    <td>${d.dateToString(dateRented)}</td>
                    <td>${d.dateToString(dateDue)}</td>
                    <td>${exttimes}</td>
                    <td>
                        <form action="/extend" method="POST">
                            <input type="hidden" name="isbn" value="${oneRow[0]}">
                            <input type="hidden" name="exttimes" value="${oneRow[5]}">
                            <input class="small-button" type="submit" value="연장">
                        </form>
                        <form action="/return" method="POST">
                            <input type="hidden" name="isbn" value="${oneRow[0]}">
                            <input type="hidden" name="title" value="${oneRow[1]}">
                            <input class="small-button" type="submit" value="반납">
                        </form>
                    </td>
                </tr>`;
        }
    }
    for(let i = 0; i < 14 - resultRows.length; i++) {
        buffer += BLANK_ROW;
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
                    <a class="ahover" href="/page/search.html">Search Books</a>
                </span>
            </nav>
            <main>
                <div class="main-container" id="mypage-container">
                    <h1 id="container-title-box">SIGN IN AS : ${id} - ${name}</h1>
                    <aside id="menu-box">
                        <a class="ahover" id="info-box" href="/page/pinfo.html">Personal Information</a>
                        <a class="ahover selected" id="rent-box" href="/page/rent.html">Rented Books</a>
                        <a class="ahover" id="reserve-box" href="/page/reserve.html">Reserved Books</a>
                    </aside>
                    <article id="article-box">
                        <h2 id="article-title-box">Rented Books</h2>
                        <div id="article-content-box">
                            <table class="result-box">
                                <thead>
                                    <th>ISBN</th>
                                    <th>TITLE</th>
                                    <th>PUBLISHER</th>
                                    <th>YEAR</th>
                                    <th>AUTHOR</th>
                                    <th>DATE RENTED</th>
                                    <th>DATE DUE</th>
                                    <th>EXTEND TIMES</th>
                                    <th>EXTEND & RETURN</th>
                                </thead>
                                <tbody>${buffer}</tbody>
                            </table>
                        </div>
                    </article>
                </div>
            </main>
            <footer>copyright©saltwalks2021</footer>
        </body>
        </html>
    `;
}

export default getRentedTemplate;