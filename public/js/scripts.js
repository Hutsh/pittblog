// from assignment 2
$(function () {

  // var homereg = new RegExp("/page/?\d?")
  // var archivereg = new RegExp("/archive/?\d?")

  // pathname = window.location.pathname;

  // if(homereg.test(pathname) || pathname=="/"){
  //   $('.indicator-item').slice(0,1).removeClass("nav-inactive")
  //   $('.indicator-item').slice(0,1).addClass("nav-active")
  // }
  // if(archivereg.test(pathname)){
  //   $('.indicator-item').slice(1,2).removeClass("nav-inactive")
  //   $('.indicator-item').slice(1,2).addClass("nav-active")
  // }

  if ( $( "#nav-indicator-track" ).length ) { //indicator exist
      console.log("top nav exist");
      active_tab = $("a.nav-active");
      track = $("#nav-indicator-track");
      init_offset = active_tab.offset();
      init_offset.top = track.offset().top;
      indicator = $("#nav-indicator");
      indicator.offset(init_offset);
      indicator.width(active_tab.width());
      $("a.indicator-item").hover(function(){
          nav_offset = $(this).offset();
          nav_offset.top = track.offset().top;

          indicator.offset(nav_offset);
          indicator.width($(this).width()-2);

          $(this).css("color","black");
      }, function(){
          ori_offset = active_tab.offset();
          ori_offset.top = track.offset().top;
          indicator.offset(ori_offset);
          indicator.width(active_tab.width()-2);
          if( $(this).hasClass("nav-inactive")){
              $(this).css("color","#b7b7b7");
          }
      });
   
  }
  else{
    console.log("top nav not exist");
  }

})




$(function () {
  var $loginBox = $('#loginBox')
  var $registerBox = $('#registerBox')
  var $userInfo = $('#userInfo')

  // switch to register
  $loginBox.find('a.colMint').on('click', function () {
    $registerBox.show()
    $loginBox.hide()
    $('#logincenterTitle').text("Register");
    $('#Login-button').hide()
    $('#Reg-button').show()
  })

  // switch to login
  $registerBox.find('a.colMint').on('click', function () {
    $loginBox.show()
    $registerBox.hide()
    $('#logincenterTitle').text("Login");
    $('#Login-button').show()
    $('#Reg-button').hide()
  })

  // regester
  $('#Reg-button').find('button').on('click', function () {

    $.ajax({
      type: 'post',
      url: '/api/user/register',
      data: JSON.stringify({
        username: $registerBox.find('[name="username"]').val(),
        password: hex_sha1($registerBox.find('[name="password"]').val()),
        repassword: hex_sha1($registerBox.find('[name="repassword"]').val())
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (result) {
        console.log(result)
        // $registerBox.find('.colWarning').html(result.message)
        if (result.code != 0){
          $('#reg-alert').html(result.message).fadeIn(500).delay(1000).fadeOut(500);
        }
        
        if (!result.code) {
          // code = 0 success
          $('#reg-success').html(result.message).fadeIn(500).delay(1000).fadeOut(500);
          $('#logincenterTitle').html('Login')
          setTimeout(function () {
            $loginBox.show()
            $registerBox.hide()
            $('#Login-button').show()
            $('#Reg-button').hide()
          }, 1000)
        }
      }
    })
  })

    //login
    $('#Login-button').find('button').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: hex_sha1($loginBox.find('[name="password"]').val())
            },
            dataType: 'json',
            success: function(result) {
              if (result.code != 0){
                $('#login-alert').html(result.message).fadeIn(500).delay(1000).fadeOut(500);
              }

                if (!result.code) {
                    $('#login-success').html(result.message).fadeIn(500);
                    setTimeout(function () {
                      window.location.reload();
                    }, 1000)
                }
            }
        })
    })

  // logout
  $('#logout, #logout-small').on('click', function () {
    console.log("Click logout");
    $.ajax({
      type: 'post',
      url: '/api/user/logout',
      success: function (result) {
        if (!result.code) {
          window.location.reload()
        }
      }
    })
  })

})



function userlogout(){
  id = btn.name;
  $.ajax({
    type: 'post',
    url: '/api/user/logout',
    success: function (result) {
      if (!result.code) {
        window.location.reload()
      }
    }
  })
  

}

$(function () {
  currentpage = $('#admin-post-nav-current').attr('current') || -1
  totalpage = $('#admin-post-nav-current').attr('total') || -2
  if(currentpage == 1){
    $('#admin-post-nav-pre').addClass('disabled')
  }
  if(currentpage === totalpage){
    $('#admin-post-nav-next').addClass('disabled')
  }
})

;(function($){
  // from:
  // https://codepen.io/patrickkahl/pen/DxmfG
  
  /**
   * jQuery function to prevent default anchor event and take the href * and the title to make a share popup
   *
   * @param  {[object]} e           [Mouse event]
   * @param  {[integer]} intWidth   [Popup width defalut 500]
   * @param  {[integer]} intHeight  [Popup height defalut 400]
   * @param  {[boolean]} blnResize  [Is popup resizeabel default true]
   */
  $.fn.customerPopup = function (e, intWidth, intHeight, blnResize) {
    
    // Prevent default anchor event
    e.preventDefault();
    
    // Set values for window
    intWidth = intWidth || '500';
    intHeight = intHeight || '400';
    strResize = (blnResize ? 'yes' : 'no');

    // Set title and open popup with focus on it
    var strTitle = ((typeof this.attr('title') !== 'undefined') ? this.attr('title') : 'Social Share'),
        strParam = 'width=' + intWidth + ',height=' + intHeight + ',resizable=' + strResize,            
        objWindow = window.open(this.attr('href'), strTitle, strParam).focus();
  }
  
  /* ================================================== */
  
  $(document).ready(function ($) {
    $('.facebook.customer.share').attr('href',"https://www.facebook.com/sharer.php?u="+ window.location.href);
    $('.customer.share').on("click", function(e) {
      $(this).customerPopup(e);
    });

  });
    
}(jQuery));