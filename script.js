document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. GLOBAL SELECTORS & SETUP
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    const generateBtn = document.getElementById('generateBtn');
    const textareaField = document.querySelector('.textarea-field');
    const filterSelect = document.querySelector('.filter-select');
    const quantitySelect = document.querySelector('.quantity-select');
    const monitorDisplay = document.querySelector('.monitor-display');
    const shiftBtn = document.querySelector('.btn-shift');

    const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
    if (geminiApiKeyInput) {
        geminiApiKeyInput.value = localStorage.getItem('gemini_api_key') || (typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : '');
        geminiApiKeyInput.addEventListener('input', (e) => {
            localStorage.setItem('gemini_api_key', e.target.value.trim());
        });
    }
   
    
    const fileInput = document.getElementById('fileInput');
    const uploadText = document.getElementById('uploadText');
    const progressWrapper = document.getElementById('uploadProgressWrapper');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const statusMessage = document.getElementById('uploadStatusMessage');
   
    let uploadedTextContent = ""; 

    // ==========================================
    // 1. SMART ROUTING & GATEKEEPER (OPTIONAL LOGIN)
    // ==========================================
    const isAuthenticated = sessionStorage.getItem('userLoggedIn');
    const isLoginPage = loginForm !== null;

    // ❌ REMOVED: The code that forces unauthenticated users to login.html has been deleted.
    // Users can now freely click Home, About Us, Contact, and index.html without logging in.

    // ✅ KEPT: If they DO choose to log in, this prevents them from accidentally 
    // going back to the login screen while their session is active.
    if (isAuthenticated && isLoginPage) {
        window.location.replace('index.html');
    }

    // ==========================================
    // 1.5 DYNAMIC AUTH NAV & LOGOUT
    // ==========================================
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'login.html') {
            if (isAuthenticated) {
                const username = sessionStorage.getItem('username') || 'Operator';
                link.innerHTML = `LOGOUT (${username})`;
                link.href = '#';
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem('userLoggedIn');
                    sessionStorage.removeItem('username');
                    window.location.reload();
                });
            }
        }
    });

    // ==========================================
    // 2. GLOBAL FEATURES (Runs on all pages)
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
    // 3. LOGIN PAGE LOGIC & ENTRY CURTAIN
    // ==========================================
    if (isLoginPage) {
        
        // --- STEP 2: ENTRY CURTAIN LOGIC ---
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        const welcomeBtn = document.getElementById('welcomeBtn');
        const welcomeText = document.getElementById('welcomeText');

        if (welcomeOverlay && welcomeBtn && welcomeText) {
            // Check if the user has already seen the welcome screen this session
            if (sessionStorage.getItem('welcomeShown') === 'true') {
                // If they have, immediately hide the overlay and allow scrolling
                welcomeOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else {
                // Lock the screen so they can't scroll past the curtain
                document.body.style.overflow = 'hidden';

                welcomeBtn.addEventListener('click', () => {
                    // 1. Hide the button
                    welcomeBtn.style.display = 'none';
                    
                    // 2. Show the dynamic message
                    const lastUser = localStorage.getItem('lastUsername');
                    if (lastUser) {
                        welcomeText.innerHTML = `Welcome back to my website, <span style="color: var(--accent-pink);">${lastUser}</span>!`;
                    } else {
                        welcomeText.innerHTML = `Welcome to my website, Drishti!`;
                    }
                    welcomeText.style.display = 'block';
                    
                    // 3. Save to browser memory so it doesn't show again this session
                    sessionStorage.setItem('welcomeShown', 'true');
                    
                    // 4. Wait exactly 2.5 seconds for them to read it, then remove the curtain!
                    setTimeout(() => {
                        welcomeOverlay.style.display = 'none';
                        document.body.style.overflow = 'auto'; // Unlock scrolling
                    }, 2500);
                });
            }
        }

        // --- EXISTING: LOGIN FORM LOGIC ---
        if (loginForm) {
            const usernameInput = document.getElementById('usernameInput');
            const passwordInput = document.getElementById('passwordInput');
            const loginStatus = document.getElementById('loginStatus');

            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = usernameInput.value.trim();
                const pass = passwordInput.value;

                if (pass.length < 6) {
                    loginStatus.style.display = 'block';
                    loginStatus.style.color = 'var(--accent-pink)';
                    loginStatus.innerText = "❌ ERROR: Password must be at least 6 characters.";
                    return;
                }

                loginStatus.style.display = 'block';
                loginStatus.style.color = 'var(--accent-teal)';
                loginStatus.innerHTML = `✅ PAYLOAD SECURED:<br><span style="font-size: 12px; color: var(--text-color);">Authenticating [${user}]...</span>`;

                setTimeout(() => {
                    sessionStorage.setItem('userLoggedIn', 'true');
                    sessionStorage.setItem('username', user);
                    localStorage.setItem('lastUsername', user);
                    window.location.replace('index.html'); 
                }, 1000);
            });
        }
    }
    // ==========================================
    // 4. MAIN APP LOGIC — FILE UPLOAD ENGINE (BULLETPROOF)
    // ==========================================
    // --- Welcome Button Logic ---
      
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Force clear and show UI states
            if (progressWrapper) progressWrapper.style.display = 'block';
            if (statusMessage) statusMessage.style.display = 'none';
            if (progressBar) progressBar.style.width = '0%';
            if (progressPercent) progressPercent.innerText = '0% TRANSMITTED';
            if (uploadText) uploadText.innerText = `READING: ${file.name}...`;

            const reader = new FileReader();
            
            reader.onload = function(evt) {
                const extractedText = evt.target.result;
                let progress = 0;

                const uploadSimulation = setInterval(() => {
                    progress += 20;
                    if (progressBar) progressBar.style.width = `${progress}%`;
                    if (progressPercent) progressPercent.innerText = `${progress}% TRANSMITTED`;

                    if (progress >= 100) {
                        clearInterval(uploadSimulation);
                        
                        // Instantly save text to our code memory
                        uploadedTextContent = extractedText;
                        
                        if (progressWrapper) progressWrapper.style.display = 'none';
                        if (statusMessage) statusMessage.style.display = 'block';
                        
                        // Screenshot triggers for Task 2
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
                            
                            // Instantly drop the full notes into the main text container!
                            if (textareaField) {
                                textareaField.value = uploadedTextContent;
                            }
                        }
                    }
                }, 80);
            };

            reader.readAsText(file);
        });
    }

    // ==========================================
    // 5. MAIN APP LOGIC — GEMINI API ENGINE
    // ==========================================
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            let textContent = textareaField ? textareaField.value.trim() : '';
            
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
                    <div class="status-desc">Connecting directly to Gemini AI. Please wait.</div>
                `;
            }

            try {
                const GEMINI_API_KEY = localStorage.getItem('gemini_api_key') || (typeof CONFIG !== 'undefined' ? CONFIG.GEMINI_API_KEY : '');
                if (!GEMINI_API_KEY) {
                    throw new Error('No API key found. Please enter a valid Gemini API Key in the Input Core settings.');
                }
                const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

                const promptInstruction = `You are an elite exam engine. Analyze the text and create exactly ${selectedQuantity} items in ${selectedFilter} format. Return ONLY a valid JSON array.`;

                const response = await fetch(GEMINI_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptInstruction + "\nSource Material:\n" + textContent }] }]
                    })
                });

                if (!response.ok) throw new Error('API internal connection error.');

                const apiData = await response.json();
                const rawTextResponse = apiData.candidates[0].content.parts[0].text.trim();
                const questionsList = JSON.parse(rawTextResponse);

                renderQuestions(questionsList);

            } catch (error) {
                if (monitorDisplay) {
                    monitorDisplay.style.justifyContent = 'center';
                    monitorDisplay.innerHTML = `
                        <div class="status-alert" style="color: var(--accent-pink);">API ERROR</div>
                        <div class="status-desc">${error.message}</div>
                    `;
                }
            }
        });
    }

    function renderQuestions(questionsArray) {
        if (!monitorDisplay) return;
        monitorDisplay.style.justifyContent = 'flex-start';
        monitorDisplay.innerHTML = `<div class="status-alert text-teal" style="width: 100%; position: sticky; top: 0; background: var(--container-bg); padding-bottom: 10px; z-index: 5; border-bottom: 3px solid var(--border-color);">READY TO STUDY</div>`;
        
        const listContainer = document.createElement('div');
        listContainer.className = 'paragraph-text';
        listContainer.style.textAlign = 'left';
        listContainer.style.marginTop = '20px';

        questionsArray.forEach((item, index) => {
            const qBlock = document.createElement('div');
            qBlock.style.marginBottom = '20px';
            qBlock.style.paddingBottom = '15px';
            qBlock.style.borderBottom = '2px dashed var(--border-color)';
            qBlock.innerHTML = `
                <p style="margin-bottom: 8px;"><strong>Q${index + 1}: ${item.question}</strong></p>
                <div style="padding-left: 15px; font-size: 13px; line-height: 1.8;">
                    ${item.options && item.options.length > 0 ? item.options.join('<br>') : ''}
                </div>
            `;
            listContainer.appendChild(qBlock);
        });
        monitorDisplay.appendChild(listContainer);
    }
});
