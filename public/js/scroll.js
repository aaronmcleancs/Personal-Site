$(document).ready(function() {
  $(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop();
    var viewportHeight = $(window).height();

    
    if (scrollTop > viewportHeight - 300) {
      $('#scroll').addClass('animate__fadeInUp').removeClass('animate__fadeOutDown');
    }

    
    if (scrollTop > viewportHeight - 200) {
      $('#card1').addClass('animate__fadeInUp visible');
      setTimeout(function(){
        $('#card2').addClass('animate__fadeInUp visible');
      }, 50);
      setTimeout(function(){
        $('#card3').addClass('animate__fadeInUp visible');
      }, 100);
      setTimeout(function(){
        $('#card4').addClass('animate__fadeInUp visible');
      }, 150);
    }
  });
});