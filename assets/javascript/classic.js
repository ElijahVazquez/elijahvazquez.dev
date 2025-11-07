// assets/javascript/classic.js
(function() {
  // 1) Define your handler and register it
  function mouseTrailHandler(e) {
    const img = document.createElement("img");
    img.src       = "assets/cursor.png";
    img.className = "trail";
    img.style.left = `${e.pageX - 8}px`;
    img.style.top  = `${e.pageY - 8}px`;
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 600);
  }

  document.addEventListener("mousemove", mouseTrailHandler);

  // 2) Expose a teardown hook that removes the listener
  window.themeTeardown = function() {
    document.removeEventListener("mousemove", mouseTrailHandler);
    // Clean up any lingering trail images
    document.querySelectorAll('.trail').forEach(img => img.remove());
  };
})();
