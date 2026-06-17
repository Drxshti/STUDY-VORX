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
    
    // Login Selectors
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginStatus = document.getElementById('loginStatus');

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
    // TASK 1: LOGIN AUTHENTICATION SIMULATOR
    // ==========================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            // 1. Prevent the browser from refreshing the page blindly
            e.preventDefault();

            // 2. Extract the raw values the user typed
            const user = usernameInput.value.trim();
            const pass = passwordInput.value;

            // 3. Client-Side Validation (Checking for basic errors before pinging the server)
            if (pass.length < 6) {
                loginStatus.style.display = 'block';
                loginStatus.style.color = 'var(--accent-pink)';
                loginStatus.innerText = "❌ Password must be at least 6 characters.";
                return;
            }

            // 4. Simulate the API Payload Generation
            loginStatus.style.display = 'block';
            loginStatus.style.color = 'var(--accent-teal)';
            loginStatus.innerHTML = `
                ✅ PAYLOAD SECURED:<br>
                <span style="font-size: 12px; color: var(--text-color);">Routing user [${user}] to authentication server...</span>
            `;

            /* * IN A REAL APP, THIS IS WHERE THE FETCH REQUEST HAPPENS:
             * fetch('https://api.studyvorx.com/v1/login', {
             * method: 'POST',
             * body: JSON.stringify({ username: user, password: pass })
             * });
             */
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
                        clearInterval
