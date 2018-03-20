$(document).ready(function() {

  var guestAmount = $('#guestNo');

  $('#cnt-up').click(function() {
    guestAmount.val(Math.min(parseInt($('#guestNo').val()) + 1, 20));
  });
  $('#cnt-down').click(function() {
    guestAmount.val(Math.max(parseInt($('#guestNo').val()) - 1, 1));
  });

  $('.btn').click(function() {

    var $btn = $('.btn');
    if(document.querySelectorAll('button')[2].classList.length==1){
          var rbtns = document.getElementsByName('loctypes');
          var rvalue = 'sightseeing';
          if(rbtns[1].checked)
            rvalue = 'shopping';
          else if(rbtns[2].checked)
            rvalue = 'eating';
          else if(rbtns[3].checked)
            rvalue = 'hiking';
          else if(rbtns[4].checked)
            rvalue = 'sleeping';

          document.getElementById('hiddeninp').value = rvalue;
          $('form').submit();
        }

    $btn.toggleClass('booked');
    $('.diamond').toggleClass('windup');
    $('form').slideToggle(300);
    $('.linkbox').toggle(200);

    if ($btn.text() === "BOOK NOW") {
      $btn.text("BOOKED!");
    } else {
      $btn.text("BOOK NOW");
    }
  });
});