// assets/javascript/terminal.js - Interactive CRT Terminal
(function() {
  let currentIndex = 0;
  let isInSection = false;

  const sections = [
    { id: 'about', name: 'about', class: 'about' },
    { id: 'skills', name: 'skills', class: 'skills' },
    { id: 'experience', name: 'experience', class: 'experience' },
    { id: 'education', name: 'education', class: 'education' },
    { id: 'contact', name: 'contact', class: 'contact' },
    { id: 'resume', name: 'resume', class: 'resume' }
  ];

  function init() {
    createMenu();
    setupKeyboardNav();
    hideAllSections();
  }

  function createMenu() {
    const main = document.querySelector('main.site-content');
    if (!main) return;

    // Create menu container
    const menu = document.createElement('div');
    menu.id = 'terminal-menu';
    menu.innerHTML = `
      <div class="prompt">ls</div>
      <ul>
        ${sections.map((section, index) =>
          `<li data-index="${index + 1}" data-section="${section.id}">${section.name}</li>`
        ).join('')}
      </ul>
      <div class="instructions">Use ↑/↓ arrows or Tab to navigate, Enter to open, Esc to return</div>
    `;

    main.insertBefore(menu, main.firstChild);

    // Add click handlers for mobile only
    const menuItems = menu.querySelectorAll('li');
    menuItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Only allow clicks on mobile
        if (window.innerWidth <= 768) {
          currentIndex = index;
          updateSelection();
          openSection();
        }
      });
    });

    // Set initial selection
    updateSelection();
  }

  function hideAllSections() {
    sections.forEach(section => {
      const el = document.getElementById(section.id) ||
                 document.querySelector(`.${section.class}`);
      if (el) {
        el.classList.remove('active');
      }
    });
  }

  function updateSelection() {
    const menu = document.getElementById('terminal-menu');
    if (!menu) return;

    const items = menu.querySelectorAll('li');
    items.forEach((item, index) => {
      if (index === currentIndex) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function setupKeyboardNav() {
    document.addEventListener('keydown', handleKeyPress);
  }

  function handleKeyPress(e) {
    if (isInSection) {
      // In section view - Esc to go back, Enter on back button
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSection();
      } else if (e.key === 'Enter') {
        // Allow Enter to work on focused back button
        const backButton = document.querySelector('.back-button');
        if (document.activeElement === backButton) {
          e.preventDefault();
          closeSection();
        }
      }
    } else {
      // In menu view - Arrow keys, Tab, and Enter
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % sections.length;
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        updateSelection();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Tab = move up
          currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        } else {
          // Tab = move down
          currentIndex = (currentIndex + 1) % sections.length;
        }
        updateSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        openSection();
      }
    }
  }

  function openSection() {
    const section = sections[currentIndex];
    const sectionEl = document.getElementById(section.id) ||
                      document.querySelector(`.${section.class}`);
    if (!sectionEl) return;

    // Animate cd command in menu prompt first
    const menu = document.getElementById('terminal-menu');
    const menuPrompt = menu?.querySelector('.prompt');

    if (menuPrompt) {
      // Add new command line below 'ls'
      const cdLine = document.createElement('div');
      cdLine.style.marginTop = '1rem';
      menuPrompt.appendChild(cdLine);

      cdLine.insertAdjacentHTML('beforeend', 'user@portfolio:~$ ');

      // Create cursor
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '█';
      cdLine.appendChild(cursor);

      // Blink then type cd command
      let blinkCount = 0;
      const blinkInterval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        blinkCount++;
        if (blinkCount >= 4) {
          clearInterval(blinkInterval);
          cursor.style.opacity = '1';

          // Type cd command
          const command = `cd ${section.name}`;
          let charIndex = 0;

          function typeCommand() {
            if (charIndex < command.length) {
              cdLine.insertBefore(document.createTextNode(command.charAt(charIndex)), cursor);
              charIndex++;
              setTimeout(typeCommand, 40);
            } else {
              cursor.remove();

              // After typing completes, fade out menu and show section
              setTimeout(() => {
                continueToSection(section, sectionEl, menu);
              }, 300);
            }
          }

          typeCommand();
        }
      }, 100);
    } else {
      continueToSection(section, sectionEl, menu);
    }
  }

  function continueToSection(section, sectionEl, menu) {
    isInSection = true;

    // Fade out menu
    const footer = document.querySelector('footer');

    if (menu) {
      menu.style.opacity = '0';
      setTimeout(() => {
        menu.classList.add('hidden');
        // Reset menu prompt
        const menuPrompt = menu.querySelector('.prompt');
        if (menuPrompt) {
          menuPrompt.innerHTML = '';
          menuPrompt.insertAdjacentHTML('beforeend', 'ls');
        }
      }, 300);
    }

    if (footer) {
      footer.classList.add('hidden');
    }

    // Prepare section
    prepareSection(sectionEl, section.name);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Fade in section
    setTimeout(() => {
      sectionEl.style.opacity = ''; // Reset any inline opacity from previous close
      sectionEl.classList.add('active');
      setTimeout(() => {
        typeCatCommand(sectionEl);
      }, 100);
    }, 350);
  }

  function typeCatCommand(sectionEl) {
    const prompt = sectionEl.querySelector('.terminal-prompt');
    if (!prompt) {
      typeContent(sectionEl);
      return;
    }

    // Create cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '█';
    prompt.appendChild(cursor);

    // Blink cursor 3 times before typing
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      blinkCount++;
      if (blinkCount >= 6) {
        clearInterval(blinkInterval);
        cursor.style.opacity = '1';

        // Type cat info.txt
        const command = 'cat info.txt';
        let charIndex = 0;

        function typeChar() {
          if (charIndex < command.length) {
            prompt.insertBefore(document.createTextNode(command.charAt(charIndex)), cursor);
            charIndex++;
            setTimeout(typeChar, 40);
          } else {
            cursor.remove();

            // After typing completes, start typing content
            setTimeout(() => {
              typeContent(sectionEl);
            }, 300);
          }
        }

        typeChar();
      }
    }, 100);
  }

  function prepareSection(sectionEl, name) {
    // Store original content if not already stored
    if (!sectionEl.dataset.originalContent) {
      sectionEl.dataset.originalContent = sectionEl.innerHTML;
    }

    // Add terminal prompt (without command yet)
    const existingPrompt = sectionEl.querySelector('.terminal-prompt');
    if (!existingPrompt) {
      const prompt = document.createElement('div');
      prompt.className = 'terminal-prompt';
      prompt.textContent = `user@portfolio:~/${name}$ `;
      sectionEl.insertBefore(prompt, sectionEl.firstChild);
    }

    // Add back button
    let backBtn = sectionEl.querySelector('.back-button');
    if (!backBtn) {
      backBtn = document.createElement('button');
      backBtn.className = 'back-button';
      backBtn.textContent = 'back (or press Esc)';
      backBtn.addEventListener('click', () => {
        // Only allow clicks on mobile
        if (window.innerWidth <= 768) {
          closeSection();
        }
      });
      sectionEl.appendChild(backBtn);
    }

    // Hide content initially for typing effect (remove from layout to prevent jumps)
    const elementsToType = sectionEl.querySelectorAll('h3, h4, p, li, time');
    elementsToType.forEach(el => {
      el.style.display = 'none';
    });
  }

  function typeContent(sectionEl) {
    // Separate headlines and body content
    const headlines = [];
    const bodyContent = [];

    // Collect headlines (h3, h4) in document order
    sectionEl.querySelectorAll('h3, h4').forEach(el => {
      headlines.push(el);
    });

    // Collect body content (p, time, li) in document order
    sectionEl.querySelectorAll('p, time, li').forEach(el => {
      bodyContent.push(el);
    });

    let delay = 0;

    // Type all headlines first
    headlines.forEach((el, index) => {
      const textLength = el.textContent.length;
      const speed = 40;
      const typingDuration = textLength * speed + 700; // typing time + blink time

      setTimeout(() => {
        typeElement(el, speed);
      }, delay);

      delay += typingDuration + 300; // Add gap between headlines
    });

    // After all headlines, type body content
    bodyContent.forEach((el, index) => {
      const textLength = el.textContent.length;
      const speed = 20;
      const typingDuration = textLength * speed + 700;

      setTimeout(() => {
        typeElement(el, speed, () => {
          // Show links and emphasis within after parent is typed
          const inlineElements = el.querySelectorAll('a, em');
          inlineElements.forEach(inline => {
            inline.style.opacity = '1';
          });
        });
      }, delay);

      if (el.tagName === 'TIME') {
        delay += typingDuration + 200;
      } else {
        delay += typingDuration + 150;
      }
    });
  }

  function typeElement(element, speed, callback) {
    const text = element.textContent;
    element.textContent = '';
    element.style.display = 'block';

    // Create blinking cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '█';
    element.appendChild(cursor);

    // Blink cursor 3 times before typing (600ms)
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      blinkCount++;
      if (blinkCount >= 6) { // 3 full blinks (on-off-on-off-on-off)
        clearInterval(blinkInterval);
        cursor.style.opacity = '1';
        // Start typing after blink
        setTimeout(() => {
          typeChar();
        }, 100);
      }
    }, 100);

    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        // Insert character before cursor
        element.insertBefore(document.createTextNode(text.charAt(charIndex)), cursor);
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        // Remove cursor when done
        cursor.remove();
        if (callback) callback();
      }
    }
  }

  function closeSection() {
    const activeSection = document.querySelector('section.active');
    if (!activeSection) return;

    const sectionPrompt = activeSection.querySelector('.terminal-prompt');

    if (sectionPrompt) {
      // Append cd .. command to prompt
      const cdBackLine = document.createElement('div');
      cdBackLine.style.marginTop = '1rem';
      sectionPrompt.appendChild(cdBackLine);

      const currentPath = sectionPrompt.textContent.match(/~\/(.*?)\$/)?.[1] || '';
      cdBackLine.innerHTML = `user@portfolio:~/${currentPath}$ `;

      // Create cursor
      const cursor = document.createElement('span');
      cursor.className = 'typing-cursor';
      cursor.textContent = '█';
      cdBackLine.appendChild(cursor);

      // Blink then type cd ..
      let blinkCount = 0;
      const blinkInterval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        blinkCount++;
        if (blinkCount >= 4) {
          clearInterval(blinkInterval);
          cursor.style.opacity = '1';

          // Type cd ..
          const command = 'cd ..';
          let charIndex = 0;

          function typeCommand() {
            if (charIndex < command.length) {
              cdBackLine.insertBefore(document.createTextNode(command.charAt(charIndex)), cursor);
              charIndex++;
              setTimeout(typeCommand, 40);
            } else {
              cursor.remove();

              // After typing completes, return to menu
              setTimeout(() => {
                finishClosingSection(activeSection);
              }, 300);
            }
          }

          typeCommand();
        }
      }, 100);
    } else {
      finishClosingSection(activeSection);
    }
  }

  function finishClosingSection(activeSection) {
    isInSection = false;

    // Fade out section
    activeSection.style.opacity = '0';
    setTimeout(() => {
      activeSection.classList.remove('active');

      // Restore original content
      if (activeSection.dataset.originalContent) {
        activeSection.innerHTML = activeSection.dataset.originalContent;
      }

      // Reset inline styles
      const allContent = activeSection.querySelectorAll('h3, h4, p, ul, article, li, time');
      allContent.forEach(el => {
        el.style.display = '';
      });
    }, 300);

    // Fade in menu
    const menu = document.getElementById('terminal-menu');
    const footer = document.querySelector('footer');

    setTimeout(() => {
      if (menu) {
        menu.classList.remove('hidden');
        setTimeout(() => {
          menu.style.opacity = '1';
        }, 50);
      }
      if (footer) {
        footer.classList.remove('hidden');
      }
    }, 350);
  }

  // Initialize on load
  init();

  // Expose teardown hook for theme switching
  window.themeTeardown = function() {
    document.removeEventListener('keydown', handleKeyPress);

    // Clean up menu
    const menu = document.getElementById('terminal-menu');
    if (menu) {
      menu.remove();
    }

    // Clean up section additions
    document.querySelectorAll('.terminal-prompt, .back-button').forEach(el => {
      el.remove();
    });

    // Reset section states
    hideAllSections();
  };
})();
