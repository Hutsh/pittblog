// from assignment 2
$(function () {
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

  // 切换到注册面板
  $loginBox.find('a.colMint').on('click', function () {
    $registerBox.show()
    $loginBox.hide()
    $('#logincenterTitle').text("Register");
    $('#Login-button').hide()
    $('#Reg-button').show()
  })

  // 切换到登录面板
  $registerBox.find('a.colMint').on('click', function () {
    $loginBox.show()
    $registerBox.hide()
    $('#logincenterTitle').text("Login");
    $('#Login-button').show()
    $('#Reg-button').hide()
  })

  // 注册
  $('#Reg-button').find('button').on('click', function () {
  // $registerBox.find('button').on('click', function () {
    // 通过ajax提交请求
    $.ajax({
      type: 'post',
      url: '/api/user/register',
      data: JSON.stringify({
        username: $registerBox.find('[name="username"]').val(),
        password: $registerBox.find('[name="password"]').val(),
        repassword: $registerBox.find('[name="repassword"]').val()
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
          // 注册成功 code = 0 success
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

    //登录
    $('#Login-button').find('button').on('click', function () {
    // $loginBox.find('button').on('click', function() {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {
              if (result.code != 0){
                $('#login-alert').html(result.message).fadeIn(500).delay(1000).fadeOut(500);
              }

                if (!result.code) {
                    //登录成功
                    $('#login-success').html(result.message).fadeIn(500);
                    setTimeout(function () {
                      window.location.reload();
                    }, 1000)
                }
            }
        })
    })

  // // add category
  // $('#add-category').find('button').on('click', function () {
  //   $.ajax({
  //     type: 'post',
  //     url: '/admin/category',
  //     data: JSON.stringify({
  //       username: $loginBox.find('[name="username"]').val(),
  //       password: $loginBox.find('[name="password"]').val()
  //     }),
  //     contentType: 'application/json',
  //     dataType: 'json',
  //     success: function (result) {
  //       $loginBox.find('.colWarning').html(result.message)

  //       if (!result.code) {
  //         // 登录成功
  //         // window.location.reload()
  //       }
  //     }
  //   })
  // })

  // 退出
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