# StudyVorx ⚡

StudyVorx is a retro-brutalist themed web platform designed to make cramming and revision interactive, high-speed, and fun. It blends a classic, high-contrast terminal aesthetic with modern cloud functionality and AI, offering students an accelerated revision environment.

## 🚀 Key Features

* **AI Crunch Revision Engine:** Paste notes or upload raw text material, select target generation filters (MCQ, Short Answer, Very Short Answer), specify the question quantity, and generate instant simulated exam questions powered by the Gemini 1.5 Flash model.
* **Local & Secure API Key Management:** Paste your Gemini API key directly into the settings input field on the dashboard (saved in browser `localStorage`), or define it locally in a gitignored `config.js` file for out-of-the-box local usage without committing secrets.
* **Secure Cloud Data Vault:** Upload revision materials directly to AWS S3 using secure Cognito Identity Pools. View previously uploaded files and download or delete them directly within the platform interface.
* **Environmental Shift Mode:** A built-in dark/light theme switch that remembers user preferences.
* **Support & FAQ Node:** Includes an interactive accordion FAQ, contact feedback form, and a visual video tutorial explaining the application flow.
* **Welcome Overlay Curtain:** A splash screen overlay greeting users on login.

## 🛠️ Technology Stack

* **Front-End:** Semantic HTML5, Vanilla JavaScript (ES6+), CSS3 custom custom design properties (Brutalist theme).
* **AI Engine:** Google Gemini Developer API (Gemini 1.5 Flash).
* **Cloud Infrastructure:** AWS SDK (Cognito Identity Pools for passwordless credential validation, Amazon S3 for cloud document storage).

## 📂 Project Architecture

```text
STUDY-VORX/
├── index.html          # Core dashboard (material inputs + monitor + vault summary)
├── mydocuments.html    # Full-screen cloud document vault (lists, views, and deletes files)
├── login.html          # Authorization login form & custom welcome curtain
├── about.html          # Project specs, hardware matrix, and core missions
├── contact.html        # Support, FAQs, and interactive feedback loops
├── style.css           # Global brutalist typography, layout boxes, and themes
├── script.js           # Core gatekeeper, theme toggler, and content generation logic
├── config.js           # [GITIGNORED] Local credentials configuration 
├── .gitignore          # Git exclusion definitions (protects config.js secrets)
├── README.md           # This specification guide
├── Studyvorxintrovideo.mp4 # Tutorial video for the contact page
└── [assets]            # 3dlogonew.jpg, aianalytics.png, girllaptop.png
```

## ⚙️ Local Configuration (API Keys)

To run the AI Crunch generator, you need a Gemini API Key. To set it up:

1. **Option A (Browser UI):** Simply open `index.html` in your browser, enter your key in the **Gemini API Key** field, and it will be saved locally on your machine.
2. **Option B (Local config.js):** Create a file named `config.js` in the root directory:
   ```javascript
   const CONFIG = {
       GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE"
   };
   ```
   *Note: This file is included in `.gitignore` so your secrets will never be pushed to your public repository.*

## 🔧 Recent Refactoring & Features

1. **API Keys & Credentials Security:** Added `config.js` structure and `.gitignore` file to solve push protection secret leakage.
2. **AWS S3 Document Deletion:** Added a working delete button (`DEL` / `DELETE`) next to S3 documents in both `index.html` and `mydocuments.html` using `s3.deleteObject()`.
3. **Dynamic Auth Session Header:** Implemented dynamic navbar rewrites changing the "Login" menu link into `"LOGOUT ([Username])"` on load for active user sessions.
4. **Interactive Feedback Loop:** Hooked form submit handlers in `contact.html` to simulate latency and show custom success headers.
5. **Fixed HTML Semantics:** Repaired structural overlay nesting issues in `login.html`.
