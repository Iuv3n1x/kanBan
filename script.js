async function renameBoard() {
    const currentName = boardHeading.textContent;

    const newName = await openCustomModal({
        title: 'Board umbenennen',
        description: 'Gib einen neuen Namen für dein Kanban-Board ein.',
        placeholder: 'Neuer Board-Name...',
        defaultValue: currentName
    });

    if (newName !== null && newName.trim() !== '') {
        boardHeading.textContent = newName.trim();

        localStorage.setItem('boardName', newName.trim());
    }
}

async function renameHeader(idName) {
    if (idName === null || idName.trim() === "") {
        return;
    }

    const headerID = `areaTitle_${idName}`;
    const descriptionID = `areaDescription_${idName}`;

    const headerElement = document.getElementById(headerID);
    const descriptionElement = document.getElementById(descriptionID);

    const currentTitle = headerElement ? headerElement.textContent : '';
    const currentDescription = descriptionElement ? descriptionElement.textContent : '';

    const modalResult = await openCustomModal({
        title: 'Sektion umbenennen',
        description: 'Gib einen neuen Namen und eine Beschreibung für die Sektion ein.',
        inputs: [
            { placeholder: 'Sektionstitel', defaultValue: currentTitle },
            { placeholder: 'Beschreibung (optional)', defaultValue: currentDescription }
        ]
    });

    if (modalResult === null) {
        return;
    }

    const [rawNewTitle, rawNewDescription] = modalResult;

    if (rawNewTitle !== null && rawNewTitle.trim() !== '') {
        const trimmedNewTitle = rawNewTitle.trim();
        const trimmedNewDescription = rawNewDescription ? rawNewDescription.trim() : '';

        if (headerElement) headerElement.textContent = trimmedNewTitle;
        if (descriptionElement) descriptionElement.textContent = trimmedNewDescription;

        let storedAreas = localStorage.getItem('areaData');
        let areas = storedAreas ? JSON.parse(storedAreas) : [];

        areas = areas.map(area => {
            if (area.title === currentTitle) {
                return { title: trimmedNewTitle, description: trimmedNewDescription };
            }
            return area;
        });

        localStorage.setItem('areaData', JSON.stringify(areas));
    }
}

function addCard(idInput, i) {
    if (idInput === null || idInput.trim() === "") {
        return;
    }

    const inputField = document.getElementById(idInput);

    if (!inputField || inputField.value.trim() === '') {
        return;
    }

    let saved = localStorage.getItem(`cards_${i}`);
    let existingCards = saved ? JSON.parse(saved) : [];

    const newCard = {
        text: inputField.value.trim(),
        description: '',
        completed: false
    };

    existingCards.push(newCard);
    inputField.value = '';

    localStorage.setItem(`cards_${i}`, JSON.stringify(existingCards));
    loadCards();
}

async function renameCard(currentTitle, currentDescription) {
    const modalResult = await openCustomModal({
        title: 'Ticket bearbeiten',
        description: 'Gib einen neuen Namen und eine Beschreibung für das Ticket ein.',
        inputs: [
            { placeholder: 'Titel des Tickets', defaultValue: currentTitle },
            { placeholder: 'Beschreibung des Tickets', defaultValue: currentDescription }
        ]
    });

    if (modalResult === null) {
        return null;
    }

    const [rawNewTitle, rawNewDescription] = modalResult;

    if (rawNewTitle !== null && rawNewTitle.trim() !== '') {
        const trimmedNewTitle = rawNewTitle.trim();
        const trimmedNewDescription = rawNewDescription ? rawNewDescription.trim() : '';

        return [trimmedNewTitle, trimmedNewDescription];
    } else {
        return null;
    }
}
