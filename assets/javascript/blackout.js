// assets/javascript/blackout.js
(function() {
  // keep a reference so we can remove it later
  function onMouseMove(e) {
    // update the CSS variables
    document.documentElement.style.setProperty('--spot-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--spot-y', e.clientY + 'px');
  }

  // start listening
  document.addEventListener('mousemove', onMouseMove);

  // expose a teardown hook for main.js
  window.themeTeardown = function() {
    document.removeEventListener('mousemove', onMouseMove);
    // restore cursor if desired
    document.body.style.cursor = '';
    // clean up CSS variables
    document.documentElement.style.removeProperty('--spot-x');
    document.documentElement.style.removeProperty('--spot-y');
  };

  // initialize spotlight at center
  onMouseMove({
    clientX: window.innerWidth - 20,
    clientY: window.innerHeight - 20
  });
})();
