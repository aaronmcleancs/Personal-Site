$(window).scroll(function() {
  if ($(this).scrollTop() > window.innerHeight - 300) {
    $('#scroll').addClass('animate__fadeInUp');
    $('#scroll').removeClass('animate__fadeOutDown');
  }
});


$(window).scroll(function() {
  if ($(this).scrollTop() > window.innerHeight - 200) {
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


