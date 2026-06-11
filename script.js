document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.querySelector('.btn-action');
    const textareaField = document.querySelector('.textarea-field');
    const filterSelect = document.querySelector('.select-field');
    const quantitySelect = document.querySelector('.quantity-select');
    const monitorDisplay = document.querySelector('.monitor-display');
    const shiftBtn = document.querySelector('.btn-shift');
    
    // File Input Selectors
    const fileInput = document.getElementById('fileInput');
    const uploadText = document.getElementById('uploadText');
    
    let uploadedTextContent = ""; // Stores extracted text from files

    // ==========================================
    // SHIFT MODE (THEME TOGGLE)
    // ==========================================
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (shiftBtn) {
        shiftBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ==========================================
    // FRONTEND FILE UPLOAD EXTRACTOR
    // ==========================================
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            uploadText.innerText = `LOADING: ${file.name}...`;

            const reader = new FileReader();
            
            // Handle standard text files (.txt, .md, .csv)
            reader.onload = function(evt) {
                uploadedTextContent = evt.target.result;
                uploadText.innerHTML = `✅ <span style="color: var(--accent-teal);">${file.name} Loaded!</span>`;
                
                // Optional: Automatically paste a snippet into the textarea to show the user it worked
                if (textareaField) {
                    textareaField.value = uploadedTextContent.substring(0, 500) + "\n... [Remaining text uploaded successfully from file] ...";
                }
            };

            reader.onerror = function() {
                uploadText.innerText = "❌ Error reading file.";
                alert("Could not process this file format.");
            };

            reader.readAsText(file);
        });
    }

    // ==========================================
    // CORE CRUNCH ENGINE (Connecting to n8n)
    // ==========================================
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            // Prioritize manually typed text; fallback to uploaded file text if textarea is unchanged
            let textContent = textareaField ? textareaField.value.trim() : '';
            
            if (!textContent && uploadedTextContent) {
                textContent = uploadedTextContent;
            }

            const selectedFilter = filterSelect ? filterSelect.value : 'MCQ';
            const selectedQuantity = quantitySelect ? quantitySelect.value : '10';

            // 1. Validation check
            if (!textContent || textContent.startsWith("... [Remaining text")) {
                alert("Please paste your study notes or upload a text file first!");
                return;
            }

            // 2. Loading State Animation View
            if (monitorDisplay) {
                monitorDisplay.style.justifyContent = 'center';
                monitorDisplay.innerHTML = `
                    <div class="status-alert text-teal">CRUNCHING DATA...</div>
                    <div class="status-desc">n8n workflow is routing your file content to Gemini. Building ${selectedQuantity} items. Please wait.</div>
                `;
            }

            try {
                // 3. Connect to your live n8n Webhook Endpoint
                // Replace this URL with your exact live n8n production Webhook link
                const N8N_WEBHOOK_URL = 'https://your-n8n-instance-domain.com/webhook/generate-crunch-questions';

                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: textContent,
                        filter: selectedFilter,
                        quantity: parseInt(selectedQuantity, 10)
                    })
                });

                if (!response.ok) {
                    throw new Error('The automation workflow returned a server processing fault.');
                }

                const rawData = await response.json();
                const questionsList = Array.isArray(rawData) ? rawData : rawData.questions;

                if (!questionsList || !Array.isArray(questionsList)) {
                    throw new Error('AI structuring failed to output an array format.');
                }

                // 4. Render output results inside scrolling monitor box
                renderQuestions(questionsList);

            } catch (error) {
                if (monitorDisplay) {
                    monitorDisplay.style.justifyContent = 'center';
                    monitorDisplay.innerHTML = `
                        <div class="status-alert" style="color: var(--accent-pink);">SYSTEM FAULT</div>
                        <div class="status-desc">${error.message}. Verify that your n8n canvas execution is activated.</div>
                    `;
                }
            }
        });
    }

    // ==========================================
    // UTILITY DOM RENDERING ENGINE
    // ==========================================
    function renderQuestions(questionsArray) {
        if (!monitorDisplay) return;
        
        monitorDisplay.style.justifyContent = 'flex-start';
        monitorDisplay.innerHTML = `
            <div class="status-alert text-teal" style="width: 100%; position: sticky; top: 0; background: var(--container-bg); padding-bottom: 10px; z-index: 5; border-bottom: 3px solid var(--border-color);">
                READY TO STUDY
            </div>
        `;
        
        const listContainer = document.createElement('div');
        listContainer.className = 'paragraph-text';
        listContainer.style.textAlign = 'left';
        listContainer.style.width = '100%';
        listContainer.style.marginTop = '20px';

        questionsArray.forEach((item, index) => {
            const qBlock = document.createElement('div');
            qBlock.style.marginBottom = '20px';
            qBlock.style.paddingBottom = '15px';
            qBlock.style.borderBottom = '2px dashed var(--border-color)';
            
            qBlock.innerHTML = `
                <p style="color: var(--text-color); margin-bottom: 8px;">
                    <strong>Q${index + 1}: ${item.question}</strong>
                </p>
                <div style="padding-left: 15px; font-size: 13px; line-height: 1.8; color: var(--text-color);">
                    ${item.options ? item.options.join('<br>') : ''}
                </div>
            `;
            listContainer.appendChild(qBlock);
        });

        monitorDisplay.appendChild(listContainer);
    }
});
