document.addEventListener('DOMContentLoaded', function() {
  const galleryContainer = document.querySelector('.image-gallery');
  if (!galleryContainer) return;
  const galleryImages = Array.from(galleryContainer.querySelectorAll('img'));
  const viewer = document.querySelector('.fullscreen-viewer');
  if (!viewer) return;
  const fullscreenImage = viewer.querySelector('.fullscreen-image');
  const prevButton = viewer.querySelector('.fullscreen-prev');
  const nextButton = viewer.querySelector('.fullscreen-next');
  const closeButton = viewer.querySelector('.fullscreen-close');
  if (!fullscreenImage || !prevButton || !nextButton || !closeButton) return;
  
  let currentIndex = 0;

  function openViewer(index) {
    currentIndex = index;
    fullscreenImage.src = galleryImages[currentIndex].src;
    viewer.classList.add('active');
    const progressTracker = document.querySelector('.progress-tracker');
    if (progressTracker) {
      progressTracker.style.display = 'none';
    }
  }

  function closeViewer() {
    viewer.classList.remove('active');
    const progressTracker = document.querySelector('.progress-tracker');
    if (progressTracker) {
      progressTracker.style.display = 'flex';
    }
    window.dispatchEvent(new Event('scroll'));
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    fullscreenImage.src = galleryImages[currentIndex].src;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    fullscreenImage.src = galleryImages[currentIndex].src;
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      openViewer(index);
    });
  });

  prevButton.addEventListener('click', showPrev);
  nextButton.addEventListener('click', showNext);
  closeButton.addEventListener('click', closeViewer);
    document.addEventListener('keydown', function (e) {
      if (!viewer.classList.contains('active')) return;
  
      switch (e.key) {
        case 'ArrowLeft':
          showPrev();
          break;
        case 'ArrowRight':
          showNext();
          break;
        case 'Escape':
          closeViewer();
          break;
      }
    });

  viewer.addEventListener('click', function(e) {
    if (e.target === viewer) {
      closeViewer();
    }
  });
});
