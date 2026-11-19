const themeStorageKey = 'microloan.theme.v1';
let selectedTheme = 'light';
let themeStorageError = false;

try {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === 'dark' || savedTheme === 'light') selectedTheme = savedTheme;
} catch (error) {
  themeStorageError = true;
}
document.documentElement.setAttribute('data-bs-theme', selectedTheme);

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('dark-theme');
  const message = document.getElementById('theme-message');
  if (!toggle) return;

  toggle.checked = selectedTheme === 'dark';
  if (themeStorageError) {
    message.textContent = 'Theme storage is unavailable. You can still switch themes for this visit.';
  }
  toggle.addEventListener('change', function () {
    selectedTheme = toggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', selectedTheme);
    try {
      localStorage.setItem(themeStorageKey, selectedTheme);
      message.textContent = selectedTheme === 'dark' ? 'Dark theme saved.' : 'Light theme saved.';
    } catch (error) {
      message.textContent = 'Theme changed for this visit, but the choice could not be saved.';
    }
  });
});
