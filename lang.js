/* ===== Habibi Auto Trading — shared language toggle =====
   Usage: include this file, add `.ja` / `.en` classes to elements,
   and add a button with id="langBtn" calling toggleLang().
   Persists choice across pages via localStorage. */
(function () {
  function applyLang(lang) {
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.lang = lang;
    const btn = document.getElementById('langBtn');
    if (btn) btn.textContent = lang === 'ja' ? 'EN' : 'JA';
    window.currentLang = lang;
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  window.toggleLang = function () {
    const next = (window.currentLang === 'ja') ? 'en' : 'ja';
    localStorage.setItem('habibi_lang', next);
    applyLang(next);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem('habibi_lang') || 'ja';
    applyLang(saved);
  });
})();
