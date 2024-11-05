const imageGallery = document.querySelector('.image-gallery');
        const fullscreenViewer = document.querySelector('.fullscreen-viewer');
        const fullscreenImage = document.querySelector('.fullscreen-image');
        const prevButton = document.querySelector('.fullscreen-prev');
        const nextButton = document.querySelector('.fullscreen-next');
        const closeButton = document.querySelector('.fullscreen-close');
        let currentImageIndex = 0;
        const images = Array.from(imageGallery.querySelectorAll('img'));

        function openFullscreen(index) {
            currentImageIndex = index;
            fullscreenImage.src = images[index].src;
            fullscreenViewer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeFullscreen() {
            fullscreenViewer.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            fullscreenImage.src = images[currentImageIndex].src;
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            fullscreenImage.src = images[currentImageIndex].src;
        }

        images.forEach((img, index) => {
            img.addEventListener('click', () => openFullscreen(index));
        });

        closeButton.addEventListener('click', closeFullscreen);
        nextButton.addEventListener('click', showNextImage);
        prevButton.addEventListener('click', showPrevImage);

        fullscreenViewer.addEventListener('click', (e) => {
            if (e.target === fullscreenViewer) {
                closeFullscreen();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (fullscreenViewer.style.display === 'flex') {
                if (e.key === 'Escape') closeFullscreen();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });