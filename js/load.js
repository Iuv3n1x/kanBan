function loadBoardName() {
    let boardName = localStorage.getItem('boardName');

    if (boardName == null) {
        boardName = boardHeading.textContent;
        localStorage.setItem('boardName', boardName);
    }

    boardHeading.textContent = boardName;
}

function loadAreaNames() {
    let storedAreas = JSON.parse(localStorage.getItem('areaData'));

    if (storedAreas == null) {
        let newAreas = [];

        for (let i = 0; i < areaHeadings.length; i++) {
            newAreas.push({
                title: areaHeadings[i].textContent,
                description: areaDescriptions[i] ? areaDescriptions[i].textContent : ''
            });
        }

        localStorage.setItem('areaData', JSON.stringify(newAreas));
        storedAreas = JSON.parse(localStorage.getItem('areaData'));
    }

    for (let i = 0; i < areaHeadings.length; i++) {
        if (storedAreas[i]) {
            if (areaHeadings[i]) areaHeadings[i].textContent = storedAreas[i].title;
            if (areaDescriptions[i]) areaDescriptions[i].textContent = storedAreas[i].description;
        }
    }
}

function loadCards() {
    const areas = JSON.parse(localStorage.getItem('areaData')) || [];

    areas.forEach((area, areaIndex) => {
        const cardsField = document.getElementById(`cards_${areaIndex}`);
        if (!cardsField) return;

        // Determe the containers as a drop target
        cardsField.dataset.areaIndex = areaIndex;

        cardsField.removeEventListener('dragover', handleDragOver);
        cardsField.removeEventListener('drop', handleDrop);

        cardsField.addEventListener('dragover', handleDragOver);
        cardsField.addEventListener('drop', (e) => handleDrop(e, areaIndex));

        const cardCountField = document.getElementById(`cardCount_${areaIndex}`);
        if (!cardCountField) return;

        let cardCount = 0;
        const cards = JSON.parse(localStorage.getItem(`cards_${areaIndex}`)) || [];
        cardsField.innerHTML = '';

        cards.forEach((card, cardIndex) => {
            const description = card.description || '';
            cardCount++;

            // Build the card structure
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.draggable = true;

            taskCard.dataset.areaIndex = areaIndex;
            taskCard.dataset.cardIndex = cardIndex;

            taskCard.dataset.areaIndex = areaIndex;
            taskCard.dataset.cardIndex = cardIndex;

            taskCard.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    sourceAreaIndex: areaIndex,
                    sourceCardIndex: cardIndex
                }));
                setTimeout(() => taskCard.classList.add('dragging'), 0);
            });

            taskCard.addEventListener('dragend', () => {
                taskCard.classList.remove('dragging');
            });

            if (card.completed) {
                taskCard.classList.add('finished');
            }

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';

            const taskTitle = document.createElement('span');
            taskTitle.className = 'task-title';
            taskTitle.textContent = card.text;

            taskContent.appendChild(taskTitle);

            const taskDescription = document.createElement('span');
            taskDescription.className = 'task-description';
            taskDescription.textContent = description;

            if (description) {
                taskContent.appendChild(taskDescription);
            }

            taskCard.appendChild(taskContent);

            const cardActions = document.createElement('div');
            cardActions.className = 'card-actions';

            const tickBtn = document.createElement('button');
            tickBtn.className = 'card-action-btn tick';
            tickBtn.innerHTML = '✓';
            tickBtn.title = 'Als erledigt markieren';
            tickBtn.addEventListener('click', () => {
                let currentCards = JSON.parse(localStorage.getItem(`cards_${areaIndex}`)) || [];
                currentCards[cardIndex].completed = !currentCards[cardIndex].completed;

                localStorage.setItem(`cards_${areaIndex}`, JSON.stringify(currentCards));
                loadCards();
            });

            const penBtn = document.createElement('button');
            penBtn.className = 'card-action-btn edit';
            penBtn.innerHTML = '✎';
            penBtn.title = 'Aufgabe bearbeiten';
            penBtn.addEventListener('click', async () => {
                let currentCards = JSON.parse(localStorage.getItem(`cards_${areaIndex}`)) || [];

                const result = await renameCard(taskTitle.textContent, description);

                if (result !== null) {
                    const [newName, newDescription] = result;
                    currentCards[cardIndex].text = newName;
                    currentCards[cardIndex].description = newDescription;

                    localStorage.setItem(`cards_${areaIndex}`, JSON.stringify(currentCards));
                    loadCards();
                }
            });

            const crossBtn = document.createElement('button');
            crossBtn.className = 'card-action-btn delete-card';
            crossBtn.innerHTML = '×';
            crossBtn.title = 'Aufgabe entfernen';
            crossBtn.addEventListener('click', () => {
                let currentCards = JSON.parse(localStorage.getItem(`cards_${areaIndex}`)) || [];

                currentCards.splice(cardIndex, 1);

                localStorage.setItem(`cards_${areaIndex}`, JSON.stringify(currentCards));
                loadCards();
            });

            cardActions.appendChild(tickBtn);
            cardActions.appendChild(penBtn);
            cardActions.appendChild(crossBtn);

            taskCard.appendChild(cardActions);
            cardsField.append(taskCard);
        });

        cardCountField.textContent = cardCount;
    });
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    const cardsField = e.currentTarget;
    const draggingCard = document.querySelector('.dragging');
    if (!draggingCard) return;

    const afterElement = getDragAfterElement(cardsField, e.clientY);
    if (afterElement == null) {
        cardsField.appendChild(draggingCard);
    } else {
        cardsField.insertBefore(draggingCard, afterElement);
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleDrop(e, targetAreaIndex) {
    e.preventDefault();
    const rawData = e.dataTransfer.getData('text/plain');
    if (!rawData) return;

    const { sourceAreaIndex, sourceCardIndex } = JSON.parse(rawData);

    let sourceCards = JSON.parse(localStorage.getItem(`cards_${sourceAreaIndex}`)) || [];
    const [movedCard] = sourceCards.splice(sourceCardIndex, 1);

    let targetCards = JSON.parse(localStorage.getItem(`cards_${targetAreaIndex}`)) || [];

    const cardsField = document.getElementById(`cards_${targetAreaIndex}`);
    const cardNodes = [...cardsField.querySelectorAll('.task-card')];

    const newTargetCards = cardNodes.map(node => {
        const sArea = node.dataset.areaIndex;
        const sCard = node.dataset.cardIndex;
        if (Number(sArea) === sourceAreaIndex && Number(sCard) === sourceCardIndex) {
            return movedCard;
        }
        return JSON.parse(localStorage.getItem(`cards_${sArea}`))[sCard];
    });

    localStorage.setItem(`cards_${sourceAreaIndex}`, JSON.stringify(sourceCards));
    localStorage.setItem(`cards_${targetAreaIndex}`, JSON.stringify(newTargetCards));

    loadCards();
}
