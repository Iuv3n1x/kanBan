const board = document.getElementById('board');

const boardHeading = document.getElementById('boardHeading');

const rawData = localStorage.getItem('areaData');
const areaData = rawData ? JSON.parse(rawData) : [];

let areaHeadings = [];
let areaDescriptions = [];

for (i = 0; i < areaData.length; i++) {
    areaHeadings.push(document.getElementById(`areaTitle_${0}`));
    areaDescriptions.push(document.getElementById(`areaDescription_${0}`));
}

const areaInputs = document.getElementsByClassName('areaInput');

const editBoardBtn = document.getElementById('editBoardBtn');
const columnBtns = document.getElementsByClassName('editTitle')
const addCardBtns = document.getElementsByClassName('add-card-button');

document.addEventListener('DOMContentLoaded', () => {
    loadBoardName();
    loadAreas();
    loadAreaNames();
    loadCards();
});

if (editBoardBtn) {
    editBoardBtn.addEventListener('click', () => {
        renameBoard();
    });
}
