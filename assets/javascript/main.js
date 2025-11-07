// assets/javascript/main.js

// Base theme names (matching your CSS/JS filenames)
const themes = [
  "modern",
  "classic",
  "blackout",
  "magazine"
];

const linkEl = document.getElementById("theme-stylesheet");
const btn    = document.getElementById("version-switcher");

// Build paths from name
const cssPath = name => `assets/styles/${name}.css`;
const jsPath  = name => `assets/javascript/${name}.js`;

// Clean up any old theme state if provided by theme JS
function teardownTheme() {
  // use a distinct global hook to avoid name collisions
  if (typeof window.themeTeardown === "function") {
    try {
      window.themeTeardown();
    } catch (err) {
      console.warn("Error in themeTeardown hook", err);
    }
  }
}

function loadScript(src) {
  const oldScript = document.getElementById("scripts");
  const newScript = document.createElement("script");
  newScript.id    = "scripts";
  newScript.src   = src;
  newScript.async = false;
  newScript.onerror = () => console.warn(`⚠️ Failed to load ${src}`);

  oldScript.parentNode.replaceChild(newScript, oldScript);
}

// Apply a given theme: swap CSS + JS
function applyTheme(name) {
  // CSS swap
  linkEl.href = cssPath(name);
  // JS teardown then swap
  teardownTheme();
  loadScript(jsPath(name));
}

document.addEventListener("DOMContentLoaded", () => {
  // Filter out blackout theme on mobile (relies on mouse hover)
  const MOBILE_BREAKPOINT = 768;

  function getAvailableThemes() {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      return themes.filter(theme => theme !== 'blackout');
    }
    return themes;
  }

  // 1) Initial load → first theme
  let availableThemes = getAvailableThemes();
  let currentIndex = 0;
  applyTheme(availableThemes[currentIndex]);

  // 2) On button click → cycle to next theme in order and scroll to top
  btn.addEventListener("click", () => {
    // Refresh available themes in case window was resized
    availableThemes = getAvailableThemes();
    currentIndex = (currentIndex + 1) % availableThemes.length;
    applyTheme(availableThemes[currentIndex]);

    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
