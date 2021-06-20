function menuController(menuIndex) {
    changeMenuColor(menuIndex);

    clearContentBox();
    makeTableFrame();
    if(menuIndex == 1) {
        setArticleTitle("Rented Books");
        setTableButtonColumn("EXTEND & RETURN");
        makeRentContentBox();
        fillEmptyRow(1);
    } else {
        setArticleTitle("Reserved Books");
        setTableButtonColumn("CANCEL RESERVATION");
        makeReserveContentBox();
        fillEmptyRow(0);
    }
}

function changeMenuColor(menuIndex) {
    let menuList = document.getElementById("menu-box").children;
    for(let menu of menuList) {
        menu.classList.remove("selected");
    }
    menuList[menuIndex].classList.add("selected");
}

function clearContentBox() {
    let contentBox = document.getElementById("article-content-box");
    while(contentBox.hasChildNodes()) {
        contentBox.removeChild(contentBox.firstChild);
    }
}

function setArticleTitle(title) {
    let articleTitle = document.getElementById("article-title-box");
    articleTitle.innerHTML = title;
}

function makeTableFrame() {
    let tableFrame = document.createElement("table");
    tableFrame.id = "result-box";

    const tableHeader = document.createElement("thead");
    tableHeader.id = "result-table-header";
    tableHeader.innerHTML = "<th>ISBN</th><th>TITLE</th><th>PUBLISHER</th><th>YEAR</th><th>AUTHOR</th>";
    tableFrame.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");
    tableBody.id = "result-table-body";
    tableFrame.appendChild(tableBody);

    const contentBox = document.getElementById("article-content-box");
    contentBox.appendChild(tableFrame);
}

function setTableButtonColumn(columnName) {
    const lastTableHeaderElement = document.createElement("th");
    lastTableHeaderElement.innerHTML = columnName;
    document.getElementById("result-table-header").firstChild.appendChild(lastTableHeaderElement);
}

function makeRentContentBox() {
    let rowObject = {
        isbn: "9788954674607",
        title: "상관없는거 아닌가?",
        publisher: "문학동네",
        year: "2020",
        author: "장기하",
    };
    const tableBody = document.getElementById("result-table-body");
    tableBody.appendChild(makeRow(rowObject, true));
}

function makeReserveContentBox() {

}

function makeRow(rowObject, isRentResult) {
    const {isbn, title, publisher, year, author} = rowObject;
    const rowFrame = document.createElement("tr");
    rowFrame.innerHTML = "<td>"+isbn+"</td><td>"+title+"</td><td>"+publisher+"</td><td>"+year+"</td><td>"+author+"</td><td></td>";

    const rowButtonForm = document.createElement("form");
    rowButtonForm.setAttribute("action", "#");

    const hiddenInput = document.createElement("input");
    hiddenInput.setAttribute("type", "hidden");
    rowButtonForm.appendChild(hiddenInput);

    const rowButtonInput = document.createElement("input");
    rowButtonInput.setAttribute("class", "small-button");
    rowButtonInput.setAttribute("type", "submit");
    
    if(isRentResult) {
        rowButtonInput.setAttribute("value", "반납");
        const extendButtonInput = document.createElement("input");
        extendButtonInput.setAttribute("class", "small-button");
        extendButtonInput.setAttribute("type", "submit");
        extendButtonInput.setAttribute("value", "연장");
        rowButtonForm.appendChild(extendButtonInput);
    } else {
        rowButtonInput.setAttribute("value", "취소");
    }

    rowButtonForm.appendChild(rowButtonInput);
    rowFrame.lastChild.appendChild(rowButtonForm);

    return rowFrame;
}

function fillEmptyRow(rowNum) {
    const tableBody = document.getElementById("result-table-body");
    let emptyRow;
    for(let i = 0; i < 16 - rowNum; i++) {
        emptyRow = document.createElement("tr");
        emptyRow.innerHTML = "<td></td><td></td><td></td><td></td><td></td><td></td>";
        tableBody.appendChild(emptyRow);
    }
}