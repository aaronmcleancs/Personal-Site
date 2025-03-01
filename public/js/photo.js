document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = Array.from(document.querySelectorAll('.image-gallery img'));
    const viewer = document.querySelector('.fullscreen-viewer');
    const fullscreenImage = document.querySelector('.fullscreen-image');
    const prevButton = document.querySelector('.fullscreen-prev');
    const nextButton = document.querySelector('.fullscreen-next');
    const closeButton = document.querySelector('.fullscreen-close');
    let currentIndex = 0;

    function openViewer(index) {
        currentIndex = index;
        fullscreenImage.src = galleryImages[currentIndex].src;
        viewer.style.display = 'flex';
    }

    function closeViewer() {
        viewer.style.display = 'none';
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
        img.addEventListener('click', () => openViewer(index));
    });

    prevButton.addEventListener('click', showPrev);
    nextButton.addEventListener('click', showNext);
    closeButton.addEventListener('click', closeViewer);

    // Optional: close viewer when clicking outside the fullscreen image
    viewer.addEventListener('click', function(e) {
        if (e.target === viewer) {
            closeViewer();
        }
    });
});