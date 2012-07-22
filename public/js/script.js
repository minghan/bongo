jQuery(function () 
 {
   jQuery("#add_place").autocomplete({
    source: function (request, response) {
     jQuery.getJSON(
      "/getPlaces/"+request.term,
      function (data) {
       response(data);
      }
     );
    },
    minLength: 3,
    select: function (event, ui) {
      var value = ui.item.value;
      // value = value.substr(0, value.lastIndexOf(","));
      jQuery("#add_place").val(value);
      $('li a.ui-corner-all').removeClass('highlight');
      $(this).addClass('highlight');
      return false;
    },
    focus: function( event, ui ) {
      var label = ui.item.label;
      // label = label.substr(0, label.lastIndexOf(","));
      $("#add_place").val( label );
      $('li a.ui-corner-all').removeClass('highlight');
      $('li a.ui-corner-all').each(function(idx,val) {
        var val = $(this).text();
        if(val == label) {
          $(this).addClass('highlight');
        }
      });
      return false;
    },
    open: function (event, ui) {
      $('.ui-autocomplete').css({ 'width': '501px' });
      var query = $(this).val();
      $('li a.ui-corner-all').addClass('tk-proxima-nova').each(function(data, val) {
        var choice = $(this).text();
        // choice = choice.substr(0, choice.lastIndexOf(","));
       $(this).html(choice.replace(query, "<b>"+query+"</b>"));
      })
     jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function () {
     jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }
   });
   jQuery("#add_place").autocomplete("option", "delay", 100);
  });

