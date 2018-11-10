
$(function () {
  // add category
  $('#add-category').find('button').on('click', function () {
    // 通过ajax提交请求

    $.ajax({
      type: 'post',
      url: '/admin//category/add',
      data: JSON.stringify({
        name: $('#add-category').find('[name="name"]').val()
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (result) {
        if(result.code){ // error
          console.log(result);
          $('#submitwarning').show()
          $('#submitwarning').html(result.message)
          setTimeout(function () {
              $('#submitwarning').hide()
          }, 1000)
        } else{ // success
          $('#submitsuccess').show()
          setTimeout(function () {
              $('#submitsuccess').hide()
          }, 1000)
        }

        
      }
    })
  })


  // edit category
  $('#edit-category').find('button').on('click', function () {
    // 通过ajax提交请求

    $.ajax({
      type: 'put',
      url: '/admin/category/edit',

      data: JSON.stringify({
        name: $('#name-input').val(),
        id: $('#id-input').val(),
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if(result.code){ // error
          console.log(result);
          $('#submitwarning').show()
          $('#submitwarning').html(result.message)
          setTimeout(function () {
              $('#submitwarning').hide()
          }, 1000)
        } else{ // success
          $('#submitsuccess').show()
          window.location.reload()
        }

        
      }
    })
  })

})

