// js/app.js

// 🚀 Service Worker Registration (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Для простоти, поки що без service worker
        // Можна додати пізніше для офлайн-режиму
        console.log('✅ PWA Ready');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 🌓 Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('pixelcraft_theme') || 'light';
    
    body.classList.add(`theme-${savedTheme}`);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.classList.contains('theme-dark');
            const newTheme = isDark ? 'light' : 'dark';
            body.classList.replace(`theme-${isDark ? 'dark' : 'light'}`, `theme-${newTheme}`);
            localStorage.setItem('pixelcraft_theme', newTheme);
        });
    }

    // 🌐 Language
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        const savedLang = localStorage.getItem('pixelcraft_lang') || 'en';
        langSelect.value = savedLang;
        if (typeof updateLanguage === 'function') {
            updateLanguage(savedLang);
        }
        langSelect.addEventListener('change', (e) => {
            if (typeof updateLanguage === 'function') {
                updateLanguage(e.target.value);
            }
        });
    }
    
    // 📱 Mobile Menu (якщо потрібно)
    const mobileMenuBtn = document.getElementById('mobileMenu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.nav').classList.toggle('active');
        });
    }
});

// 🛠️ Load Tool
function loadTool(toolName) {
    const container = document.getElementById('tool-container');
    
    if (!container) {
        console.error("Tool container not found!");
        return;
    }

    if (typeof tools === 'undefined' || !tools[toolName]) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">⚠️ Tool not loaded.</p>';
        console.error("Tool not found:", toolName);
        return;
    }

    const tool = tools[toolName];
    container.innerHTML = tool.render();
    
    setTimeout(() => {
        if (tool.init) {
            try {
                tool.init();
            } catch (err) {
                console.error("Init error:", err);
            }
        }
    }, 50);

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 💾 Download helper (для майбутніх інструментів)
function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Реєстрація Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
      console.log('✅ SW registered:', registration.scope);
    })
    .catch(function(error) {
      console.log('❌ SW registration failed:', error);
    });
}
