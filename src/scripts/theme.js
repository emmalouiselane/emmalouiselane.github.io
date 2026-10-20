(() => {
  let theme = 'dark';
  try {
    theme = localStorage.getItem('theme') || theme;
  } catch {
    // Theme switching also works when browser storage is unavailable.
  }
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const observer = new MutationObserver(() => {
    try {
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    } catch {
      // Storage restrictions should not prevent changing the theme.
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();
