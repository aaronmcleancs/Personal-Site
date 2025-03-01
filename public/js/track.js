document.addEventListener('DOMContentLoaded', function() {
    // Define the sections to track in the same order they appear
    const sections = [
      { id: 'overview', name: 'Overview' },
      { id: 'background', name: 'Background' },
      { id: 'implementation', name: 'Implementation' },
      { id: 'performance', name: 'Performance' },
      { id: 'tech-stack', name: 'Tech Stack' },
      { id: 'gallery', name: 'Gallery' }
    ];
    
    // Create the progress tracker element
    const progressTracker = document.createElement('div');
    progressTracker.className = 'progress-tracker';
    
    // Create dots for each section
    sections.forEach(section => {
      const dot = document.createElement('div');
      dot.className = 'progress-tracker__item';
      dot.setAttribute('data-section', section.name);
      dot.setAttribute('data-target', section.id);
      
      // Add click event to scroll to section
      dot.addEventListener('click', function() {
        const targetSection = document.getElementById(this.getAttribute('data-target'));
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80, // Adjust for navbar height
            behavior: 'smooth'
          });
        }
      });
      
      progressTracker.appendChild(dot);
    });
    
    // Append the tracker to the body
    document.body.appendChild(progressTracker);
    
    // Show the tracker after a short delay
    setTimeout(() => {
      progressTracker.classList.add('visible');
    }, 1000);
    
    // Function to update active section
    function updateActiveSection() {
      // Get all section elements
      const sectionElements = sections.map(section => document.getElementById(section.id));
      // Get all dots
      const dots = progressTracker.querySelectorAll('.progress-tracker__item');
      
      // Get current scroll position
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      // Check which section is in view
      let activeIndex = -1;
      sectionElements.forEach((section, index) => {
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          activeIndex = index;
        }
      });
      
      // Update the active dot
      dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // Hide tracker when at the very top of the page
      if (window.scrollY < 100) {
        progressTracker.classList.remove('visible');
      } else {
        progressTracker.classList.add('visible');
      }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', updateActiveSection);
    
    // Initial update
    updateActiveSection();
  });