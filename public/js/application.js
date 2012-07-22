$(document).ready(function() {
  checkResize();
  $('input[type=text]').focus();
  
  // Facebox
  $('a[rel*=facebox]').facebox();

 	// Browser resize
 	$(window).resize(function() {
 		checkResize();
 	})
})

function checkResize() {
  var h = $(window).height() - 20;
  var w = $(window).width() - 20;
  
  $('.wrapper').height(h);    
  if (w > 1200)               
    $('.wrapper').width(w);  
    
  NUM_DAYS = 3;

  // Restyle interface if more than 3 days
  if (NUM_DAYS > 3) {
    $('.time-wrapper').width('37px');
    $('.calendar-wrapper').css({ 'padding-left': '20px', 'padding-right': '20px' });
    $('.calendar-wrapper').width(NUM_DAYS * 301 + 40);  
    
    var c = $('.calendar-wrapper').width();
    var w = $('.main-wrapper').width();

    $('.wrapper').width(c + w + 90);
    $('.main-wrapper').width(w);
  }    
}
