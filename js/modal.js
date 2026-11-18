function openCustomModal(options) {
    return new Promise((resolve) => {
        const {
            title,
            description = '',
            placeholder = '',
            defaultValue = '',
            inputs = null // Optional
        } = options;

        const modal = document.getElementById('customModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDescription');
        const container = document.getElementById('modalInputsContainer');
        const confirmBtn = document.getElementById('modalConfirmBtn');
        const cancelBtn = document.getElementById('modalCancelBtn');

        modalTitle.textContent = title;
        modalDesc.textContent = description;
        modalDesc.style.display = description ? 'block' : 'none';

        const inputConfigs = inputs || [{ placeholder, defaultValue, type: 'text' }];

        container.innerHTML = '';
        const inputElements = inputConfigs.map((cfg) => {
            const input = document.createElement('input');
            input.type = cfg.type || 'text';
            input.placeholder = cfg.placeholder || '';
            input.value = cfg.defaultValue || '';
            container.appendChild(input);
            return input;
        });

        modal.style.display = 'grid';
        setTimeout(() => modal.classList.add('active'), 10);

        if (inputElements.length > 0) {
            inputElements[0].focus();
            inputElements[0].select();
        }

        function closeModal(result) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';

                confirmBtn.onclick = null;
                cancelBtn.onclick = null;
                modal.onclick = null;
                inputElements.forEach(input => input.onkeydown = null);

                resolve(result);
            }, 200);
        }

        const getResults = () => {
            const values = inputElements.map(input => input.value);

            return inputElements.length === 1 && !inputs ? values[0] : values;
        };

        confirmBtn.onclick = () => closeModal(getResults());
        cancelBtn.onclick = () => closeModal(null);

        inputElements.forEach((input) => {
            input.onkeydown = (e) => {
                if (e.key === 'Enter') closeModal(getResults());
                if (e.key === 'Escape') closeModal(null);
            };
        });

        modal.onclick = (e) => {
            if (e.target === modal) closeModal(null);
        };
    });
}
