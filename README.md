# StudyVorx ⚡

StudyVorx is a retro-brutalist themed web platform designed to make cramming and revision interactive, high-speed, and fun. It blends a classic, high-contrast terminal aesthetic with modern cloud functionality and AI, offering students an accelerated revision environment.

## 🚀 Key Features

* **AI Crunch Revision Engine:** Paste notes or upload raw text material, select target generation filters (MCQ, Short Answer, Very Short Answer), specify the question quantity, and generate instant simulated exam questions powered by the Gemini 1.5 Flash model.
* **Secure Cloud Data Vault:** Upload revision materials directly to AWS S3 using secure Cognito Identity Pools. View and download previously uploaded files directly within the platform.
* **Environmental Shift Mode:** A built-in dark/light theme switch that remembers user preferences.
* **Support & FAQ Node:** Includes an interactive accordion FAQ, contact feedback form, and a visual video tutorial explaining the application flow.
* **Welcome Overlay Curtain:** A clean, customized splash screen greeting users when logging in.

## 🛠️ Technology Stack

* **Front-End:** Semantic HTML5, Vanilla JavaScript (ES6+), CSS3 custom custom design properties (Brutalist theme).
* **AI Engine:** Google Gemini Developer API (Gemini 1.5 Flash).
* **Cloud Infrastructure:** AWS SDK (Cognito Identity Pools for passwordless credential validation, Amazon S3 for cloud document storage).

## 📂 Project Architecture

```text
STUDY-VORX/
├── index.html          # Core dashboard (material inputs + monitor + vault summary)
├── mydocuments.html    # Full-screen cloud document vault (lists & redirects files)
├── login.html          # Authorization login form & custom welcome curtain
├── about.html          # Project specs, hardware matrix, and core missions
├── contact.html        # Support, FAQs, and video tutorials
├── style.css           # Global brutalist typography, layout boxes, and themes
├── script.js           # Core gatekeeper, theme toggler, and content generation logic
├── README.md           # This specification guide
├── Studyvorxintrovideo.mp4 # Tutorial video for the contact page
└── [assets]            # 3dlogonew.jpg, aianalytics.png, girllaptop.png
```

## 🔧 Recent Bug Fixes & Refactoring

The codebase has undergone a complete audit and cleanup, resolving several runtime issues:

1. **JavaScript ReferenceError Fixed:** Cleaned up stray S3 upload logic that was executing outside function closures and referencing undefined variables.
2. **AI Trigger Corrected:** Resolved a button selector conflict where the Gemini generator was improperly bound to the AWS upload button.
3. **Parameters Functional:** Linked dropdown select filters (`.filter-select` and `.quantity-select`) to the HTML elements so they correctly direct AI generation formats.
4. **Duplicate Block Removed:** Cleaned up duplicate login gatekeeper declarations in `script.js` that caused fatal syntax execution errors.
5. **Unified Navigation & Vault:** Corrected broken links to `my-documents.html` (renamed to `mydocuments.html`), added missing navigation anchors to pages, and standardized the header menu globally.
6. **Improved HTML Semantics:** Moved the welcome overlay modal in `login.html` out of the `<header>` element to conform to HTML5 validation.
