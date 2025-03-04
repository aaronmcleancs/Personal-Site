document.addEventListener('DOMContentLoaded', function() {
  const sections = [
    { id: 'overview', name: 'Overview' },
    { id: 'gallery', name: 'Gallery' },
    { id: 'background', name: 'Background' },
    { id: 'implementation', name: 'Implementation' },
    { id: 'performance', name: 'Performance' }
  ];
  
  const progressTracker = document.createElement('div');
  progressTracker.className = 'progress-tracker';
  // Initially hide the tracker
  progressTracker.classList.add('hidden');
  
  sections.forEach(section => {
    const dot = document.createElement('div');
    dot.className = 'progress-tracker__item';
    dot.setAttribute('data-section', section.name);
    dot.setAttribute('data-target', section.id);
    
    dot.addEventListener('click', function() {
      const targetSection = document.getElementById(this.getAttribute('data-target'));
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
    
    progressTracker.appendChild(dot);
  });
  
  document.body.appendChild(progressTracker);
  
  function updateActiveSection() {
    if (document.querySelector('.fullscreen-viewer.active')) {
      progressTracker.style.display = 'none';
      return;
    } else {
      progressTracker.style.display = 'flex';
    }
    
    const sectionElements = sections.map(section => document.getElementById(section.id));
    const dots = progressTracker.querySelectorAll('.progress-tracker__item');
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    let activeIndex = -1;
    sectionElements.forEach((section, index) => {
      if (!section) return;
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeIndex = index;
      }
    });
    
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Show tracker only when scrolled past initial view
    if (window.scrollY > 100 && (window.innerHeight + window.scrollY) < document.documentElement.scrollHeight - 100) {
      progressTracker.classList.remove('hidden');
      progressTracker.classList.add('visible');
    } else {
      progressTracker.classList.remove('visible');
      progressTracker.classList.add('hidden');
    }
  }
  
  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();
});