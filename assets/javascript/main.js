// assets/javascript/main.js

// Base theme names (matching your CSS/JS filenames)
const themes = [
  "classic",
  //  "modern",
  // "chatgpt",
  "blackout"
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
  // 1) Initial load → classic
  let current = themes[0];
  applyTheme(current);

  // 2) On button click → pick a different random theme
  btn.addEventListener("click", () => {
    const others = themes.filter(n => n !== current);
    const next   = others[Math.floor(Math.random() * others.length)];
    current      = next;
    applyTheme(next);
  });
});
