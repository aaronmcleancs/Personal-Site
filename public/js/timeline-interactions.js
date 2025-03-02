document.addEventListener('DOMContentLoaded', function() {
    const timelineContents = document.querySelectorAll('.timeline-content');
    timelineContents.forEach(content => {
      const heading = content.querySelector('h3');
      let touchStartX = 0;
      let touchStartY = 0;
      let touchMoved = false;
      let touchHandled = false;
      if (heading) {
        heading.addEventListener('click', function(e) {
          if (touchHandled) {
            touchHandled = false;
            return;
          }
          if (!touchMoved) {
            content.classList.toggle('active');
          }
          e.stopPropagation();
        });
      }
      content.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchMoved = false;
      }, { passive: true });
      content.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        if (Math.abs(touch.clientX - touchStartX) > 10 || Math.abs(touch.clientY - touchStartY) > 10) {
          touchMoved = true;
        }
      }, { passive: true });
      content.addEventListener('touchend', function(e) {
        if (!touchMoved && heading && !heading.contains(e.target)) {
          content.classList.toggle('active');
          touchHandled = true;
        }
      });
    });
  });