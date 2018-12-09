
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
  oldImgPath = btn.getAttribute("imgPath");
  // console.log('wait del id:'+btn.getAttribute("imgPath"));
  $('#catEditModel').modal('show');
  $('#catEditModelTitle').text('Edit Category: '+oldname)
  $('#catEditModelId').text('ID: '+id)
  $('#new-cat-name').val(oldname)
  $('#new-cat-img').val(oldImgPath)
  $("#imagePreview").attr("src",oldImgPath).show()
  $('#catEditModelCatId').val(id)

}


$('#catEditModelConfirm').on('click', function () {
    if($('#catEditModelTitle').text() == 'Add New Category'){
      //New
      $("#imagePreview").attr("src",'').hide()
      $.ajax({
        type: 'post',
        url: '/admin/category',
        data: JSON.stringify({
          name: $('#new-cat-name').val(),
          imgPath: $('#new-cat-img').val()
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
          imgPath: $('#new-cat-img').val(),
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
    $('#new-cat-img').val('')
  })

})

$('a[rel=popover]').popover({
  html: true,
  trigger: 'hover',
  placement: 'bottom',
  content: function(){return '<img src="'+$(this).data('img') + '" height="200" width="200"/>';}
});

$('#catImageUpload').on('change',function(e){
    //get the file name
    var fileName = $(this).val().replace('C:\\fakepath\\','');
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
    $('#btn-catImgSubmit').removeClass('disabled')
})


// $('#imgUploadForm').submit(function(e){
//   e.preventDefault();
//   console.log('submitting upload');
// })


$('#btn-catImgSubmit').on('click', function(){
  $('#catImgUploadForm').ajaxSubmit({
        url: '/upload', 
        type: 'post',
        success: function(respond){
          filePath = "/public/upload/" + respond.uploadedFile
          console.log("uploaded:" + filePath);
          $("#imagePreview").attr("src",filePath).show();
          $('#new-cat-img').val(filePath)
        },
        error: function(){
          console.log('uploaded error');
        }
      })
})