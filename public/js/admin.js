
$(function () {
  // add category
  $('#add-category').find('button').on('click', function () {
    // 通过ajax提交请求

    $.ajax({
      type: 'post',
      url: '/admin/category',
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

    $.ajax({
      type: 'put',
      url: '/admin/category',

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



function delcat(btn){
  id = btn.name;
  

  delapiurl = "/admin/category/" + id 
  console.log(delapiurl);

  $.ajax({
    type: 'delete',
    url: delapiurl,
    contentType: 'application/json',
    dataType: 'json',
    success: function (result) {
      console.log(result);
      if(result.code){ // error
        console.log(result);
        setTimeout(function () {

        }, 1000)
      } else{ // success
        console.log(result);
        window.location.reload()
      }

      
    }
  })

}


//edit post PUT
$(function () {
  $('#post-edit-submit').on('click', function () {
    console.log("here to edit post:" + $('#post-id-input').val());


    $.ajax({
      type: 'put',
      url: '/admin/post/' + $('#post-id-input').val(),
      data: JSON.stringify({
        title: $('#title').val(),
        category: $( "#category option:selected" ).text(),
        description: $('#description').val(),
        content: $('#content').val()
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if(result.code == 0){
          console.log('success');
          $('#success-info').show()
          $('#success-info').html('Success! ')
        }else{
          if (result.message === 'Empty category'){
            $('#category-warning').show()
            $('#category-warning').html(result.message)
              setTimeout(function () {
                    $('#category-warning').hide()
            }, 1000)
          }
          if (result.message === 'Empty title'){
            $('#title-warning').show()
            $('#title-warning').html(result.message)
              setTimeout(function () {
                    $('#title-warning').hide()
            }, 1000)
          }
          if (result.message === 'Empty description'){
            $('#description-warning').show()
            $('#description-warning').html(result.message)
              setTimeout(function () {
                    $('#description-warning').hide()
            }, 1000)
          }
          if (result.message === 'Empty content'){
            $('#content-warning').show()
            $('#content-warning').html(result.message)
              setTimeout(function () {
                    $('#content-warning').hide()
            }, 1000)
          }
        }
        
      }
    })


  })
})

function delpost(btn){
  id = btn.name;
  
  delapiurl = "/admin/post/" + id 
  console.log(delapiurl);

  $.ajax({
    type: 'delete',
    url: delapiurl,
    contentType: 'application/json',
    dataType: 'json',
    success: function (result) {
      console.log(result);
      if(result.code){ // error
        console.log(result);
        setTimeout(function () {

        }, 1000)
      } else{ // success
        console.log(result);
        window.location.reload()
      }
    }
  })

}


function catEditPopup(btn){
  id = btn.name;
  oldname = btn.value;
  // console.log('wait del id:'+odlname);
  $('#catEditModel').modal('show');
  $('#catEditModelTitle').text('Edit Category: '+oldname)
  $('#catEditModelId').text('ID: '+id)
  $('#new-cat-name').val(oldname)
  $('#catEditModelCatId').val(id)

}


$('#catEditModelComfirm').on('click', function () {
    if($('#catEditModelTitle').text() == 'Add New Category'){
      //New
      $.ajax({
        type: 'post',
        url: '/admin/category',
        data: JSON.stringify({
          name: $('#new-cat-name').val(),
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
                window.location.reload()
            }, 1000)
          }
        }
      })


    }else{
      // Update
      $.ajax({
        type: 'put',
        url: '/admin/category',

        data: JSON.stringify({
          name: $('#new-cat-name').val(),
          id: $('#catEditModelCatId').val(),
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
            setTimeout(function () {
                window.location.reload()
            }, 500)
          }
        }
      })
    }


  })


$(function(){
  $('#btnAddNewCat').on('click', function () {
    $('#catEditModelTitle').text('Add New Category')
    $('#catEditModel').modal('show');
    $('#catEditModelId').text('')
    $('#new-cat-name').val('')
  })

})