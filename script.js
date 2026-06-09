document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('.btn-action');
    const textareaField = document.querySelector('.textarea-field');
    const filterSelect = document.querySelector('.select-field');
    const monitorDisplay = document.querySelector('.monitor-display');

    generateBtn.addEventListener('click', async () => {
        const textContent = textareaField.value.trim();
        const selectedFilter = filterSelect.value;

        // 1. Validation
        if (!textContent) {
            alert("Please paste some material or upload a file first!");
            return;
        }

        // 2. Change UI to Loading State
        monitorDisplay.innerHTML = `
            <div class="status-alert text-teal">GENERATING...</div>
            <div class="status-desc">Crunching your notes into a custom study set. Please wait.</div>
        `;

        try {
            // 3. Send data to your API Backend
            // Replace this URL with your actual backend endpoint (e.g., AWS Lambda or Node.js server)
            const response = await fetch('https://your-api-endpoint.amazonaws.com/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: textContent,
                    filter: selectedFilter
                })
            });

            if (!response.ok) {
                throw new Error('Server error handling your request.');
            }

            const data = await response.json();

            // 4. Update UI with the resulting questions
            renderQuestions(data.questions);

        } catch (error) {
            // Error Handling UI state
            monitorDisplay.innerHTML = `
                <div class="status-alert" style="color: var(--accent-pink);">CRITICAL ERROR</div>
                <div class="status-desc">${error.message}. Please try again.</div>
            `;
        }
    });

    // Helper function to format and render questions dynamically into your custom container
    function renderQuestions(questionsArray) {
        monitorDisplay.innerHTML = `<div class="status-alert text-teal">READY TO STUDY</div>`;
        
        const listContainer = document.createElement('div');
        listContainer.className = 'paragraph-text';
        listContainer.style.textAlign = 'left';
        listContainer.style.marginTop = '15px';

        questionsArray.forEach((item, index) => {
            const qBlock = document.createElement('p');
            qBlock.style.marginBottom = '15px';
            qBlock.innerHTML = `<strong>Q${index + 1}: ${item.question}</strong><br>${item.options ? item.options.join('<br>') : ''}`;
            listContainer.appendChild(qBlock);
        });

        monitorDisplay.appendChild(listContainer);
    }
});
