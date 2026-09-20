// language-switcher.js
// Dynamically handles language switching without hardcoded filenames

const errorMessages = {
    'en-US': {
        languageUnavailable: 'Language selection is currently unavailable. Please try refreshing the page.',
        languageNotSupported: 'This language is not supported.',
        switchError: 'Unable to switch languages. Please try again.'
    },
    'es-MX': {
        languageUnavailable: 'La selección de idioma no está disponible en este momento. Actualiza la página.',
        languageNotSupported: 'Este idioma no es compatible.',
        switchError: 'No se pudo cambiar el idioma. Inténtalo de nuevo.'
    }
};

function getCurrentLanguage() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    
    // Detect language from filename pattern
    if (filename.includes('_es-MX') || filename.includes('_es')) {
        return 'es-MX';
    }
    return 'en-US';
}

function getOtherLanguageFile() {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop();
    const currentLang = getCurrentLanguage();
    
    // Switch between languages by replacing language code in filename
    if (currentLang === 'en-US') {
        return filename.replace('_en-US', '_es-MX').replace('_en', '_es-MX');
    } else {
        return filename.replace('_es-MX', '_en-US').replace('_es', '_en-US');
    }
}

function changeLanguage(targetLanguage) {
    const languageSelect = document.getElementById('language-select');
    const errorContainer = document.getElementById('language-error');
    const currentLanguage = getCurrentLanguage();
    
    try {
        // Don't do anything if already on target language
        if (targetLanguage === currentLanguage) {
            return;
        }
        
        const targetFile = getOtherLanguageFile();
        
        // Announce language change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = targetLanguage === 'es-MX'
        ? 'Cambiando el idioma a español'
        : 'Changing language to English';
        document.body.appendChild(announcement);
        
        // Navigate to the other language version
        window.location.href = targetFile;
        
    } catch (error) {
        console.error('Language switching error:', error);
        
        // Display error message
        if (errorContainer) {
            errorContainer.textContent = errorMessages[currentLanguage].switchError;
            errorContainer.setAttribute('role', 'alert');
            errorContainer.style.display = 'block';
        }
        
        // Reset select to current language
        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language-select');
    const currentLanguage = getCurrentLanguage();
    
    if (!languageSelect) {
        console.error('Language select element not found');
        return;
    }

    // Set initial language based on current page
    languageSelect.value = currentLanguage;
    
    // Add ARIA labels for accessibility
    const ariaLabel = currentLanguage === 'es-MX' ? 'Seleccionar idioma' : 'Select language';
    languageSelect.setAttribute('aria-label', ariaLabel);
    
    // Update the onchange handler
    languageSelect.onchange = function() {
        changeLanguage(this.value);
    };
});
