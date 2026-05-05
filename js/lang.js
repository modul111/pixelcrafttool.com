// js/lang.js
const translations = {
    en: {
        nav_tools: "Tools", nav_how: "How it works", nav_privacy: "Privacy", btn_support: " Support",
        hero_title: "Edit Images <span class='gradient-text'>Instantly</span> & <span class='gradient-text'>Privately</span>",
        hero_desc: "Professional image tools that work entirely in your browser. No uploads, no watermarks, no compromises.",
        tool_rename: "Smart Renamer", tool_compress: "Compress Pro", tool_convert: "Format Converter",
        privacy_badge: "Your files never leave your device",
        select_tool: "Select a tool above to get started",
        stat_client: "Client-side processing", stat_uploads: "Files uploaded to server", stat_free: "Free forever",
        footer_privacy: "Privacy Policy", footer_terms: "Terms of Service", footer_contact: "Contact",
        footer_copy: "© 2026 PixelCraft. Made with ❤️ for creators."
    },
    uk: {
        nav_tools: "Інструменти", nav_how: "Як це працює", nav_privacy: "Приватність", btn_support: "☕ Підтримати",
        hero_title: "Редагуйте зображення <span class='gradient-text'>Миттєво</span> та <span class='gradient-text'>Приватно</span>",
        hero_desc: "Професійні інструменти для роботи в браузері. Без завантажень, без водяних знаків, без компромісів.",
        tool_rename: "Розумне перейменування", tool_compress: "Стиснення Pro", tool_convert: "Конвертер форматів",
        privacy_badge: "Ваші файли залишаються на пристрої",
        select_tool: "Оберіть інструмент вище, щоб почати",
        stat_client: "Обробка на пристрої", stat_uploads: "Файлів завантажено на сервер", stat_free: "Безкоштовно назавжди",
        footer_privacy: "Політика конфіденційності", footer_terms: "Умови використання", footer_contact: "Контакти",
        footer_copy: "© 2026 PixelCraft. Створено з ❤️ для творців."
    },
    ru: {
        nav_tools: "Инструменты", nav_how: "Как это работает", nav_privacy: "Конфиденциальность", btn_support: "☕ Поддержать",
        hero_title: "Редактируйте изображения <span class='gradient-text'>Мгновенно</span> и <span class='gradient-text'>Приватно</span>",
        hero_desc: "Профессиональные инструменты, работающие прямо в браузере. Без загрузок, без водяных знаков.",
        tool_rename: "Умное переименование", tool_compress: "Сжатие Pro", tool_convert: "Конвертер форматов",
        privacy_badge: "Ваши файлы остаются на устройстве",
        select_tool: "Выберите инструмент выше, чтобы начать",
        stat_client: "Обработка на устройстве", stat_uploads: "Файлов загружено на сервер", stat_free: "Бесплатно навсегда",
        footer_privacy: "Политика конфиденциальности", footer_terms: "Условия использования", footer_contact: "Контакты",
        footer_copy: "© 2026 PixelCraft. Создано с ❤️ для творцов."
    },
    es: {
        nav_tools: "Herramientas", nav_how: "Cómo funciona", nav_privacy: "Privacidad", btn_support: "☕ Apoyar",
        hero_title: "Edita imágenes <span class='gradient-text'>Al instante</span> y <span class='gradient-text'>Privadamente</span>",
        hero_desc: "Herramientas profesionales que funcionan en tu navegador. Sin subidas, sin marcas de agua.",
        tool_rename: "Renombrador Inteligente", tool_compress: "Compresión Pro", tool_convert: "Convertidor de Formatos",
        privacy_badge: "Tus archivos nunca salen de tu dispositivo",
        select_tool: "Selecciona una herramienta para comenzar",
        stat_client: "Procesamiento local", stat_uploads: "Archivos subidos al servidor", stat_free: "Gratis para siempre",
        footer_privacy: "Política de Privacidad", footer_terms: "Términos de Servicio", footer_contact: "Contacto",
        footer_copy: "© 2026 PixelCraft. Hecho con ❤️ para creadores."
    }
};

let currentLang = localStorage.getItem('pixelcraft_lang') || 'en';

function updateLanguage(lang) {
    currentLang = lang || currentLang;
    localStorage.setItem('pixelcraft_lang', currentLang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = translations[currentLang]?.[key];
        if (text) el.innerHTML = text;
    });
    
    document.documentElement.lang = currentLang;
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = currentLang;
}

// Автозастосування при завантаженні
document.addEventListener('DOMContentLoaded', () => updateLanguage());