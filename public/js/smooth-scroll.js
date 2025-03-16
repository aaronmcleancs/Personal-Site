document.getElementById('projects-link').addEventListener('click', function (e) {
  e.preventDefault();
  const targetElement = document.getElementById('column2__right');

  const viewportWidth = window.innerWidth;
  let offset = 250;

  if (viewportWidth <= 768) {
      offset = 150;
  }

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
  });
});

document.getElementById('experience-link').addEventListener('click', function (e) {
  e.preventDefault();
  const targetElement = document.getElementById('column2__right');

  const viewportWidth = window.innerWidth;
  let offset = -950;

  if (viewportWidth <= 768) {
      const experienceSection = document.querySelector('#experience') ||
          document.querySelector('.experience-section') ||
          document.getElementById('column2__right');

      if (experienceSection && experienceSection !== targetElement) {
          const expPosition = experienceSection.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
              top: expPosition,
              behavior: 'smooth'
          });
          return;
      }

      offset = -350;
  }

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
  });
});