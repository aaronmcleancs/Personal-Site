document.getElementById('projects-link').addEventListener('click', function(e) {
    e.preventDefault();
    const targetElement = document.getElementById('column2__right');
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 250;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
  document.getElementById('experience-link').addEventListener('click', function(e) {
    e.preventDefault();
    const targetElement = document.getElementById('column2__right');
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + 550;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });