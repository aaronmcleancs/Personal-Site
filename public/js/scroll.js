$(document).ready(function() {
  
  const observerOptions = {
    root: null, 
    rootMargin: '0px',
    threshold: 0.1 
  };

  const cardElements = ['#card1', '#card2', '#card3', '#card4'];

  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        
        setTimeout(() => {
          $(entry.target)
            .addClass('animate__fadeInUp visible')
            .removeClass('animate__fadeOutDown');
        }, index * 50);

        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  
  cardElements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      cardObserver.observe(element);
    }
  });

  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $('#scroll')
          .addClass('animate__fadeInUp')
          .removeClass('animate__fadeOutDown');
      }
    });
  }, observerOptions);

  
  const scrollElement = document.querySelector('#scroll');
  if (scrollElement) {
    scrollObserver.observe(scrollElement);
  }
});