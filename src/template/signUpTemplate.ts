import * as notice from "../module/alertModule";

function getSignUpTemplate(msg?: string) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CNU Library</title>
            <link rel="stylesheet" href="/style/sign.css">
            <link rel="stylesheet" href="/style/font.css">
        </head>
        <body>
            <header>
                <div class="both-hand-side">
                    <div class="center" id="logo-box">
                        <a href="/index.html">
                            <h1 class="center" id="logo-text">
                                Chungnam<br>
                                National<br>
                                University<br>
                                Library
                            </h1>
                        </a>
                    </div>
                </div>
            </header>
            <main>
                <div class="both-hand-side">
                    <div class="center" id="signup-box">
                        <form action="/signup" method="POST">
                            <label class="input-box" id="signup-id-box">
                                ID<br>
                                <input type="text" class="hover-box" name="id" value="">
                            </label>
                            <label class="input-box" id="signup-pw-box">
                                PW<br>
                                <input type="password" class="hover-box" name="pw" value="">
                            </label>
                            <label class="input-box" id="signup-name-box">
                                Name<br>
                                <input type="text" class="hover-box" name="name" value="">
                            </label>
                            <label class="input-box" id="signup-email-box">
                                Email<br>
                                <input type="email" class="hover-box" name="email" value="">
                            </label>
                            <div class="submit-box" id="signup-submit-box">
                                <input type="submit" value="Sign Up">
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <footer>copyright©saltwalks2021</div>
            ${notice.alert(msg)}
        </body>
        </html>
    `;
}

export default getSignUpTemplate;