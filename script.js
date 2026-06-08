// Ensure DOM properties bind perfectly after parsing content arrays
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Scan global browser configurations for saved visual states
    const activeSavedTheme = localStorage.getItem('studyvorx-theme') || 'light';
    document.documentElement.setAttribute('data-theme', activeSavedTheme);

    // Click handler interface tracking modification toggles
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentThemeState = document.documentElement.getAttribute('data-theme');
            let systemTargetMode = 'light';

            if (currentThemeState === 'light') {
                systemTargetMode = 'dark';
            }

            // Sync matrix transformations across runtime parameters
            document.documentElement.setAttribute('data-theme', systemTargetMode);
            localStorage.setItem('studyvorx-theme', systemTargetMode);
        });
    }
});