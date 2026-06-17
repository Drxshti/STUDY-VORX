document.addEventListener('DOMContentLoaded', () => {
    // Core Navigation & Generation Elements
    const generateBtn = document.querySelector('.btn-action');
    const textareaField = document.querySelector('.textarea-field');
    const filterSelect = document.querySelector('.filter-select');
    const quantitySelect = document.querySelector('.quantity-select');
    const monitorDisplay = document.querySelector('.monitor-display');
    const shiftBtn = document.querySelector('.btn-shift');
    
    // Unified File Input & Progress Selectors
    const fileInput = document.getElementById('fileInput');
    const uploadText = document.getElementById('uploadText');
    const progressWrapper = document.getElementById('uploadProgressWrapper');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const statusMessage = document.getElementById('uploadStatusMessage');
    
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
    // UNIFIED FILE UPLOAD & SIMULATED PROGRESS UI
    // ==========================================
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Trigger Progress Bar and Status UI States
            progressWrapper.style.display = 'block';
            statusMessage.style.display = 'none';
            progressBar.style.width = '0%';
            progressPercent.innerText = '0% TRANSMITTED';
            uploadText.innerText = `READING: ${file.name}...`;

            const reader = new FileReader();
            
            reader.onload = function(evt) {
                const extractedText = evt.target.result;

                // Animate progress bar incrementally to simulate server file streaming
                let progress = 0;
                const uploadSimulation = setInterval(() => {
                    progress += 20;
                    progressBar.style.width = `${progress}%`;
                    progressPercent.innerText = `${progress}% TRANSMITTED`;

                    if (progress >= 100) {
                        clearInterval(uploadSimulation);
                        
                        // Commit values to global variables on success animation resolution
                        uploadedTextContent = extractedText;
                        progressWrapper.style.display = 'none';
                        statusMessage.style.display = 'block';
                        statusMessage.style.color = 'var(--accent-teal)';
                        statusMessage.innerHTML = `✅ SUCCESS: File [${file.name}] parsed into Input Core cleanly.`;
                        uploadText.innerHTML = `✅ <span style="color: var(--accent-teal);">${file.name} Loaded!</span>`;
                        
                        // Auto-populate textarea snippet preview bounds
                        if (textareaField) {
                            textareaField.value = uploadedTextContent.substring(0, 500) + "\n... [Remaining text uploaded successfully from file] ...";
                        }
                    }
                }, 100);
            };

            reader.onerror = function() {
                progressWrapper.style.display = 'none';
                statusMessage.style.display = 'block';
                statusMessage.style.color = 'var(--accent-pink)';
                statusMessage.innerText = "❌ FAILURE: Error running raw file parser stream reader.";
                uploadText.innerText = "❌ Error reading file.";
            };

            reader.readAsText(file);
        });
    }

    // ==========================================
    // CORE CRUNCH DIRECT GEMINI GENERATION ENGINE
    // ==========================================
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            let textContent = textareaField ? textareaField.value.trim() : '';
            
            // Prioritize typed text; fallback to uploaded text if textarea is unchanged or empty
            if (!textContent || textContent.startsWith("... [Remaining text")) {
                textContent = uploadedTextContent;
            }

            const selectedFilter = filterSelect ? filterSelect.value : 'MCQ';
            const selectedQuantity = quantitySelect ? quantitySelect.value : '10 Questions';

            // 1. Validation check
            if (!textContent) {
                alert("Please paste your study notes or upload a text file first!");
                return;
            }

            // 2. Loading State View
            if (monitorDisplay) {
                monitorDisplay.style.justifyContent = 'center';
                monitorDisplay.innerHTML = `
                    <div class="status-alert text-teal">CRUNCHING DATA...</div>
                    <div class="status-desc">Connecting directly to Gemini AI. Building your custom study set. Please wait.</div>
                `;
            }

            try {
                // CRITICAL: Replace this string with your actual Google AI Studio API key
                const GEMINI_API_KEY = 'YOUR_SECRET_GOOGLE_API_KEY';
                const GEMINI_URL = `https://generatetheme.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

                // Build the system prompt rules right into the request packet
                const promptInstruction = `
                You are an elite exam generation engine. Analyze the provided study text and create a custom evaluation set.

                The user has explicitly requested this quantity of questions: ${selectedQuantity}
                (Note: Extract the exact number from that text. For example, if it says "25 Questions", generate exactly 25 items).

                The user has explicitly requested this structural format based on their selector choice: ${selectedFilter}

                Follow these structural instructions based on what matches the requested format:
                - If format is "Multiple Choice Framework (MCQ)", return standard multiple-choice questions with an "options" array containing 4 distinct choices (A, B, C, D).
                - If format is "Very Short Answer (1 marker)", generate direct, concise one-sentence core conceptual questions. Leave the "options" parameter as an empty array [].
                - If format is "Short Answer (3 marker)", generate deeper conceptual questions that require a brief paragraph explanation. Leave the "options" parameter as an empty array [].
                - If format is "Long Answer (5 marker)", generate critical thinking, multi-part exam questions that require extensive explanations. Leave the "options" parameter as an empty array [].
                - If format is "Flashcard Summary Engine", return a key term or core question as the "question", and place the single concise answer/definition inside a single option array element: ["ANSWER: Your definition here"].
                - If format is "True / False Verification Array", return fact-checking statements as the "question", followed by an options array exactly matching ["A) True", "B) False"].

                Strict Constraint: You must reply ONLY with a valid stringified JSON array. Do not include conversational text, markdown code block wraps, or backticks like \`\`\`json or \`\`\` at the start or end of your text message response.

                Output Format Example structural blueprint:
                [
                  {
                    "question": "Question text goes here?",
                    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"]
                  }
                ]

                Source Material Data to evaluate:
                ${textContent}
                `;

                // 3. Fire the payload packet to Google's servers
                const response = await fetch(GEMINI_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: promptInstruction }]
                        }]
                    })
                });

                if (!response.ok) {
                    throw new Error('Google API returned an internal connection error.');
                }

                const apiData = await response.json();
                
                // Extract the raw text output response string from Gemini's JSON body template structure
                const rawTextResponse = apiData.candidates[0].content.parts[0].text.trim();
                
                // Convert that text string back into a clean programmatic JavaScript Array
                const questionsList = JSON.parse(rawTextResponse);

                if (!questionsList || !Array.isArray(questionsList)) {
                    throw new Error('AI structuring failed to output an array format.');
                }

                // 4. Render output results inside scrolling monitor box
                renderQuestions(questionsList);

            } catch (error) {
                if (monitorDisplay) {
                    monitorDisplay.style.justifyContent = 'center';
                    monitorDisplay.innerHTML = `
                        <div class="status-alert" style="color: var(--accent-pink);">API ERROR</div>
                        <div class="status-desc">${error.message}. Make sure your Google API Key is valid!</div>
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
                    ${item.options && item.options.length > 0 ? item.options.join('<br>') : ''}
                </div>
            `;
            listContainer.appendChild(qBlock);
        });

        monitorDisplay.appendChild(listContainer);
    }
});
