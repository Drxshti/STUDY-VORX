document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // SELECTION QUERIES
    // ==========================================
    const generateBtn = document.querySelector('.btn-action');
    const textareaField = document.querySelector('.textarea-field');
    const filterSelect = document.querySelector('.select-field');
    const monitorDisplay = document.querySelector('.monitor-display');
    const shiftBtn = document.querySelector('.btn-shift');

    // ==========================================
    // SHIFT MODE (THEME TOGGLE) INITIALIZATION
    // ==========================================
    // Check if the user has a saved preference, default to dark mode if empty
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Toggle click event handler
    if (shiftBtn) {
        shiftBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'dark';

            if (currentTheme === 'dark') {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }

            // Apply the flipped state to the top-level HTML element
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Remember the setting so it does not reset when they refresh or swap pages
            localStorage.setItem('theme', newTheme);
        });
    }

    // ==========================================
    // CORE CRUNCH API GENERATION ENGINE
    // ==========================================
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const textContent = textareaField ? textareaField.value.trim() : '';
            const selectedFilter = filterSelect ? filterSelect.value : 'MCQ';

            // 1. UI Input Validation
            if (!textContent) {
                alert("Please paste some material or upload a file first!");
                return;
            }

            // 2. Change UI to Loading State Monitor View
            if (monitorDisplay) {
                monitorDisplay.innerHTML = `
                    <div class="status-alert text-teal">GENERATING...</div>
                    <div class="status-desc">Crunching your notes into a custom study set. Please wait.</div>
                `;
            }

            try {
                // 3. Send payload data packet to your designated API Endpoint
                // Replace this placeholder link with your true live AWS Lambda router hook or production server URL
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

                // 4. Update UI Display with parsed question array content
                renderQuestions(data.questions);

            } catch (error) {
                // Safety State Fallback Catch Block
                if (monitorDisplay) {
                    monitorDisplay.innerHTML = `
                        <div class="status-alert" style="color: var(--accent-pink);">CRITICAL ERROR</div>
                        <div class="status-desc">${error.message}. Please try again.</div>
                    `;
                }
            }
        });
    }

    // ==========================================
    // UTILITY HELPER FUNCTIONS
    // ==========================================
    function renderQuestions(questionsArray) {
        if (!monitorDisplay) return;
        
        monitorDisplay.innerHTML = `<div class="status-alert text-teal">READY TO STUDY</div>`;
        
        const listContainer = document.createElement('div');
        listContainer.className = 'paragraph-text';
        listContainer.style.textAlign = 'left';
        listContainer.style.marginTop = '15px';

        if (questionsArray && Array.isArray(questionsArray)) {
            questionsArray.forEach((item, index) => {
                const qBlock = document.createElement('p');
                qBlock.style.marginBottom = '15px';
                qBlock.innerHTML = `<strong>Q${index + 1}: ${item.question}</strong><br>${item.options ? item.options.join('<br>') : ''}`;
                listContainer.appendChild(qBlock);
            });
        }

        monitorDisplay.appendChild(listContainer);
    }
});
