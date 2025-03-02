(function() {
    const heroSection = document.querySelector('.hero__section');
    let ticking = false;
    function getBaseScale(width) {
      const minWidth = 300, maxWidth = 1300;
      if (width <= minWidth) return 1300;
      if (width >= maxWidth) return 220;
      return 1300 - (width - minWidth) * ((1300 - 220) / (maxWidth - minWidth));
    }
    function updateBackground() {
      const scrollPercent = window.scrollY / (document.body.offsetHeight - window.innerHeight);
      const baseScale = getBaseScale(window.innerWidth);
      const dynamicScale = baseScale + scrollPercent * 800;
      heroSection.style.backgroundSize = `${dynamicScale}%`;
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateBackground);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateBackground);
    updateBackground();
  })();