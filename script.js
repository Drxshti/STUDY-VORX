document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 0. GLOBAL SELECTORS & SETUP
    // ==========================================
    // Login Selectors
    const loginForm = document.getElementById('loginForm');
    
    // Main App Selectors
    const generateBtn = document.querySelector('.btn-action');
    const textareaField = document.querySelector('.textarea-field');
    const filterSelect = document.querySelector('.filter-select');
    const quantitySelect = document.querySelector('.quantity-select');
    const monitorDisplay = document.querySelector('.monitor-display');
    const shiftBtn = document.querySelector('.btn-shift');
    
    // File Input Selectors
    const fileInput = document.getElementById('fileInput');
    const uploadText = document.getElementById('uploadText');
    const progressWrapper = document.getElementById('uploadProgressWrapper');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const statusMessage = document.getElementById('uploadStatusMessage');

    let uploadedTextContent = ""; 

    // ==========================================
    // 1. SMART ROUTING & GATEKEEPER
    // ==========================================
    const isAuthenticated = sessionStorage.getItem('userLoggedIn');
    const isLoginPage = loginForm !== null; // If loginForm exists, we are on login.html

    // Rule A: If not logged in AND not on the login page -> Kick to login
    if (!isAuthenticated && !isLoginPage) {
        window.location.replace('login.html');
        return; // Stop the script here
    }

    // Rule B: If already logged in AND trying to view the login page -> Push to main app
    if (isAuthenticated && isLoginPage) {
        window.location.replace('index.html');
        return; // Stop the script here
    }


    // ==========================================
    // 2. GLOBAL FEATURES (Runs on all pages)
    // ==========================================
    // Theme Toggle (Shift Mode)
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
    // 3. LOGIN PAGE LOGIC
    // ==========================================
    if (isLoginPage) {
        const usernameInput = document.getElementById('usernameInput');
        const passwordInput = document.getElementById('passwordInput');
        const loginStatus = document.getElementById('loginStatus');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const user = usernameInput.value.trim();
            const pass = passwordInput.value;

            // Client-Side Validation
            if (pass.length < 6) {
                loginStatus.style.display = 'block';
                loginStatus.style.color = 'var(--accent-pink)';
                loginStatus.innerText = "❌ ERROR: Password must be at least 6 characters.";
                return;
            }

            // Simulate Server Auth
            loginStatus.style.display = 'block';
            loginStatus.style.color = 'var(--accent-teal)';
            loginStatus.innerHTML = `
                ✅ PAYLOAD SECURED:<br>
                <span style="font-size: 12px; color: var(--text-color);">Authenticating [${user}] with server...</span>
            `;

            // Wait 1 second, set token, and redirect to main app
            setTimeout(() => {
                sessionStorage.setItem('userLoggedIn', 'true');
                sessionStorage.setItem('username', user);
                window.location.replace('index.html'); 
            }, 1000);
        });
    }


        // ==========================================
    // 4. MAIN APP LOGIC — FILE UPLOAD ENGINE
    // ==========================================
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 1. Reset UI elements & invoke active loading metrics view layout
            if (progressWrapper) progressWrapper.style.display = 'block';
            if (statusMessage) statusMessage.style.display = 'none';
            if (progressBar) progressBar.style.width = '0%';
            if (progressPercent) progressPercent.innerText = '0% TRANSMITTED';
            if (uploadText) uploadText.innerText = `READING: ${file.name}...`;

            const reader = new FileReader();
            
            reader.onload = function(evt) {
                const extractedText = evt.target.result;
                let progress = 0;

                // 2. Clear progress timeline increments
                const uploadSimulation = setInterval(() => {
                    progress += 20;
                    if (progressBar) progressBar.style.width = `${progress}%`;
                    if (progressPercent) progressPercent.innerText = `${progress}% TRANSMITTED`;

                    if (progress >= 100) {
                        clearInterval(uploadSimulation);
                        
                        // Commit file data string directly to your global container variable
                        uploadedTextContent = extractedText;
                        
                        if (progressWrapper) progressWrapper.style.display = 'none';
                        if (statusMessage) statusMessage.style.display = 'block';
                        
                        // 3. Evaluate file parameters for test screenshot variations
                        if (file.name.toLowerCase() === 'fail.txt') {
                            if (statusMessage) {
                                statusMessage.style.color = 'var(--accent-pink)';
                                statusMessage.innerText = `❌ FAILURE: File [${file.name}] size threshold overflow or corrupted parameters.`;
                            }
                            if (uploadText) uploadText.innerText = "❌ Upload Failed.";
                        } else {
                            if (statusMessage) {
                                statusMessage.style.color = 'var(--accent-teal)';
                                statusMessage.innerHTML = `✅ SUCCESS: File [${file.name}] parsed into Input Core cleanly.`;
                            }
                            if (uploadText) uploadText.innerHTML = `✅ <span style="color: var(--accent-teal);">${file.name} Loaded!</span>`;
                            
                            // FORCE TEXT POPULATION: Ensure text drops straight into your text field container!
                            if (textareaField) {
                                textareaField.value = uploadedTextContent;
                            }
                        }
                    }
                }, 80);
            };

            reader.onerror = function() {
                if (progressWrapper) progressWrapper.style.display = 'none';
                if (statusMessage) {
                    statusMessage.style.display = 'block';
                    statusMessage.style.color = 'var(--accent-pink)';
                    statusMessage.innerText = "❌ FAILURE: Error running raw file parser stream reader.";
                }
                if (uploadText) uploadText.innerText = "❌ Error reading file.";
            };

            // This line reads the actual file data bytes from your computer
            reader.readAsText(file);
        });
    }
        // --- GEMINI API ENGINE ---
        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                let textContent = textareaField ? textareaField.value.trim() : '';
                
                // FIXED BUG B: changed startsWith to includes
                if (!textContent || textContent.includes("... [Remaining text")) {
                    textContent = uploadedTextContent;
                }

                const selectedFilter = filterSelect ? filterSelect.value : 'MCQ';
                const selectedQuantity = quantitySelect ? quantitySelect.value : '10 Questions';

                if (!textContent) {
                    alert("Please paste your study notes or upload a text file first!");
                    return;
                }

                if (monitorDisplay) {
                    monitorDisplay.style.justifyContent = 'center';
                    monitorDisplay.innerHTML = `
                        <div class="status-alert text-teal">CRUNCHING DATA...</div>
                        <div class="status-desc">Connecting directly to Gemini AI. Building your custom study set. Please wait.</div>
                    `;
                }

                try {
                    // YOUR ACTIVE API KEY
                    const GEMINI_API_KEY = 
                    
                    // FIXED BUG A: Updated endpoint url to generativelanguage
                    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

                    const promptInstruction = `
                    You are an elite exam generation engine. Analyze the provided study text and create a custom evaluation set.
                    Quantity: ${selectedQuantity}. Format: ${selectedFilter}.

                    Rules:
                    - If "Multiple Choice Framework (MCQ)", return standard questions with "options" array (A, B, C, D).
                    - If "Very Short Answer" or "Short Answer" or "Long Answer", generate questions. "options" array = [].
                    - If "Flashcard Summary Engine", return key term as "question", definition inside "options" as ["ANSWER: Your definition here"].
                    - If "True / False", return statement as "question", "options" exactly matching ["A) True", "B) False"].

                    Strict Constraint: Reply ONLY with a valid stringified JSON array. No markdown blocks.
                    Example: [{"question": "Text?", "options": ["A) Opt 1", "B) Opt 2"]}]

                    Source Text:
                    ${textContent}
                    `;

                    const response = await fetch(GEMINI_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: promptInstruction }] }]
                        })
                    });

                    if (!response.ok) throw new Error('API internal connection error.');

                    const apiData = await response.json();
                    const rawTextResponse = apiData.candidates[0].content.parts[0].text.trim();
                    const questionsList = JSON.parse(rawTextResponse);

                    if (!questionsList || !Array.isArray(questionsList)) throw new Error('AI structuring failed.');

                    renderQuestions(questionsList);

                } catch (error) {
                    if (monitorDisplay) {
                        monitorDisplay.style.justifyContent = 'center';
                        monitorDisplay.innerHTML = `
                            <div class="status-alert" style="color: var(--accent-pink);">API ERROR</div>
                            <div class="status-desc">${error.message}. Check your API Key!</div>
                        `;
                    }
                }
            });
        }

        // --- RENDER ENGINE ---
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
    }
});
