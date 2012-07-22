$(document).ready(function() {
  checkResize();

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
}