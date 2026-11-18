const boardHeading = document.getElementById('boardHeading');
const areaHeadings = [document.getElementById('areaTitle_0'), document.getElementById('areaTitle_1'), document.getElementById('areaTitle_2')];
const areaDescriptions = [document.getElementById('areaDescription_0'), document.getElementById('areaDescription_1'), document.getElementById('areaDescription_2')];

const editBoardBtn = document.getElementById('editBoardBtn');
const columnBtns = document.getElementsByClassName('editTitle')
const addCardBtns = document.getElementsByClassName('add-card-button');

document.addEventListener('DOMContentLoaded', () => {
    loadBoardName();
    loadAreaNames();
    loadCards();
});

if (editBoardBtn) {
    editBoardBtn.addEventListener('click', () => {
        renameBoard();
    });
}

Array.from(columnBtns).forEach((btn, i) => {
    btn.addEventListener('click', () => {
        renameHeader(`${i}`);
    });
});

Array.from(addCardBtns).forEach((btn, i) => {
    btn.addEventListener('click', () => {
        addCard(`cardInput_${i}`, i);
    })
});
