    
    var typed = new Typed('.auto-type', {
        strings: ['frontend', 'mobile-app', 'database', 'neural network', 'UI', 'deployment'],
        typeSpeed: 80,
        backSpeed: 40,
        loop: true
    });

    function updateHeroBackground() {
        let heroSection = document.querySelector('.hero__section');
        let scrollPercent = 400 * window.scrollY / (document.body.offsetHeight - window.innerHeight);
        if (window.innerWidth < 1300) {
            heroSection.style.backgroundSize = 'auto';
            heroSection.style.backgroundRepeat = 'no-repeat';
            heroSection.style.backgroundPosition = 'center top';
        } else {
            heroSection.style.backgroundSize = `${220 + scrollPercent}%`;
            heroSection.style.backgroundRepeat = 'no-repeat';
            heroSection.style.backgroundPosition = 'center top';
        }
    }
    document.addEventListener('DOMContentLoaded', updateHeroBackground);
    window.addEventListener('scroll', updateHeroBackground);

    document.getElementById('projects-link').addEventListener('click', function(e) {
        e.preventDefault();
        const targetElement = document.getElementById('column2__right');
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 250;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });